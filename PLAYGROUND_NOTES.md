# Playground (Harness) — Notes

这个文件记录 **Component Playground 工具本身**（`index.html` 里的 `Harness`
组件）的功能变更。它跟 `fragments/*/notes.md` 不是一回事——那些文件记录的是
"某个业务组件"的实现细节，而 Harness 是浏览这些组件用的开发工具外壳
（侧边栏导航 / Controls 面板 / 预览舞台），没有对应的 `fragments/*.vue`
源文件，所以不适合写进任何一个组件的 notes.md，单独放在这里。

## 2026-09-11 新增 Spec Mode（点击元素看 CSS 规格，方便交付给 dev）

你给我看了一个参考的 devtool（点击元素后弹出 Size/Padding/Margin/Spacing/
Font/Color/Background/Border + Copy CSS 按钮），要求做一个类似功能：在
Playground 里点击任意元素，不触发它原本的交互（比如切 tab、选筛选项），
而是弹出这个元素的实时 CSS 规格,方便直接甩给 dev 实现。

### 交互设计（讨论后确认的三个决定）

1. **入口位置**：每个组件的 Controls 面板最顶部都要有 Spec Mode 开关。
   Offer Dashboard 比较特殊——它本来就有一个"Reset dashboard"按钮排在
   Controls 第一位，按你的要求 Spec Mode 开关排在 Reset 下面，不是最上面。
   其余没有 Reset 的组件，Spec Mode 就是 Controls 里第一个控件。
2. **点击选中哪个元素**：不是选中你鼠标指到的最内层节点（比如一段文字或
   一个图标),而是往上找最近的一个"看起来像组件根节点"的元素（有实际的
   项目 class 名，不是空 class）,这样选出来的是有意义的 UI 单元
   （比如 `button.filter-chip`),不是无意义的 span/svg。
3. **数值展示**：不显示 CSS 变量名（比如 `var(--acv-space-075)`），因为
   这个项目的组件本身就没有用 design token 变量,只用写死的 px/hex 数值,
   显示一个不存在的变量名反而是编造信息。所以面板只显示浏览器实测的原始
   computed 数值。

### 实现方式

纯 Harness 内部功能,写在 `index.html` 的 `Harness` 组件 `setup()` 里,
没有对应的 fragment 可以镜像:

- 打开 Spec Mode 后,鼠标移到预览舞台里的元素上,出现蓝色描边框+尺寸标签
  的实时预览(`specHover`)。
- 点击时用 `e.preventDefault() + e.stopPropagation()`(在 capture 阶段)
  拦截掉元素原本的点击行为,同时弹出一个浮层面板(`specPanel`),按分组
  展示 Size / Spacing(到下一个元素的间距、父元素 flex/grid gap、到父元素
  四边的间距)/ Typography / Fill & Border,底部有"Copy CSS"按钮直接复制
  一段可以贴给 dev 的 CSS 声明。
- 关掉 Spec Mode 开关会自动清空当前打开的悬浮框/面板。

### 浏览器实测(2026-09-11)

- AppHeader(无 Reset 控件)→ Spec Mode 正确排在 Controls 第一位。
- Offer Dashboard(有 Reset 控件)→ Reset dashboard 排第一,Spec Mode 紧
  跟在下面,符合你的要求。
- Hover 预览框、点击面板(测试过 `button.offer-tabs__tab`、
  `button.filter-chip`、`div.app-header__logo` 三种不同元素)、Copy CSS、
  面板关闭按钮、关闭开关自动清空面板——全部行为正确,点击时原本的真实
  交互(切 tab / 选筛选 chip)被正确拦截,没有误触发。
- 全程 `read_console_messages` 检查无报错。

### 已知的小细节(不算 bug)

浮层面板是 `position:fixed`,如果在窄的分栏预览模式下点击的元素离右侧
Controls 面板很近,面板可能会盖住 Controls 区域,需要先关掉面板才能继续
调整右侧控件——这跟你截图里参考的那个工具的行为一致,是这类"悬浮检查
面板"的正常特性,不是这次实现引入的问题。
