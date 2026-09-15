# Playground (Harness) — Notes

这个文件记录 **Component Playground 工具本身**（`index.html` 里的 `Harness`
组件）的功能变更。它跟 `fragments/*/notes.md` 不是一回事——那些文件记录的是
"某个业务组件"的实现细节，而 Harness 是浏览这些组件用的开发工具外壳
（侧边栏导航 / Controls 面板 / 预览舞台），没有对应的 `fragments/*.vue`
源文件，所以不适合写进任何一个组件的 notes.md，单独放在这里。

## 2026-09-15(第八次)Stage 和 Controls 面板之间补 60px 间距(只针对非全屏)

你反馈非全屏页面下 Controls 面板和左边的 Stage 内容完全贴在一起,零间距,
要求补一个60px的间距,并明确只要非全屏页面这样,全屏页面不要。

根因:Controls 把手改成 `position:fixed`(第三次)之后,它不再是
`.pg-workspace` 这一行里的正常 flex 子项——原来 Stage 和 Controls 之间
那点间距,其实是靠把手自己的宽度(36px)+左右 margin 顺手撑出来的"副产品",
不是专门设计的间距,把手飞出正常流之后,这个副产品也跟着消失了,两者变成
零间距贴在一起。

改法:给 `.pg-workspace` 直接加 `gap: 60px`——`gap` 只对还在正常流里的
flex 子项(Stage、Controls)生效,`position:fixed` 的把手不参与这个
计算,所以这就是 Stage 和 Controls 面板之间纯粹、专门设计的间距,不会
被把手"占用"掉一部分。全屏模式(`.pg-shell--fullscreen .pg-workspace`)
单独覆盖成 `gap: 0`——全屏是为了看"真实产品应该长什么样",不需要这条
只有非全屏开发工具场景才需要的舒适间距。

## 2026-09-15(第七次)非全屏模式下滚动页面,把手和 Controls 面板"排列不对"

你反馈:full page(全屏)模式下 Controls 什么都没问题,但截图里那个非
全屏的状态,把手和面板的排列感觉不太对、没有之前好。排查确认是真的
bug——`.pg-main` 自己 `overflow:auto`,是真正在滚动的容器;非全屏模式
下 Controls 面板(`.pg-controls`)是跟着 `.pg-main` 一起滚动的普通元素
(全屏模式下它反而是 `align-items:stretch` 撑满整列高度、不会跟着滚动,
这就是为什么你说 full page 下没问题——那种布局下这个 bug 根本不会发生)。
把手用 `position:fixed`(相对真实浏览器视口),只在 resize/开合面板时
才重新量一次位置,滚动过程中完全不会跟着动——你一滚动页面,面板早就移到
别的屏幕位置去了,把手还钉在原来那个位置,两者就"看起来不对"了。

改法:垂直方向(`top`)也交给 JS 现场量,量的是 `.pg-controls` 自己当前
在屏幕上的真实位置(`top`+`height`,取正中间)——这两个值不受面板展开/
收起那条 `width` 过渡影响,不会重新踩中第六次那次"量的时机/对象选错"的
坑。同时监听 `.pg-main` 的 `scroll` 事件,滚动的每一刻都跟着重新算一次,
让把手始终贴在面板垂直方向的正中间,不再固定不动。收起时面板本身是空的、
没什么可贴的,退回贴视口垂直正中间(浮动按钮的效果,方便随时找到、
重新展开),这条逻辑没有变。

踩过一个小坑:一开始直接在 template 字符串里给 `<main>` 加了
`@scroll="updateControlsHandlePosition"`,原生 scroll 事件确实会触发
(单独验证过),但没有调用到这个函数——没深挖是不是这套
`defineComponent({ template: '...' })` 的 runtime 编译路径对 `scroll`
这个事件名有什么特殊处理,直接换成和 `window resize` 完全同一套、已经
验证过在用的写法(模板上留一个 ref,`onMounted` 里手动
`addEventListener`),不再依赖模板里的 `@scroll` 语法。

## 2026-09-15(第六次)Full page 里开合面板,把手的移动动画很 glitchy

你反馈 full page 里点开/关闭 Controls 面板时,把手的移动动画感觉很
glitchy/buggy。排查确认是真的 bug,不是错觉——根因是"展开"这个分支
(第五次那版)量的是 `.pg-controls` 自己的 `getBoundingClientRect().left`,
但这个元素的宽度正好是 CSS transition(`width .22s ease`)在动画的对象,
而这段测量代码跑在 Vue 的 `watch` 回调里,常常抢在 DOM 真的应用新 class
之前执行(量到的还是收起前的旧宽度)——于是把手先跳到一个错误的中间
位置,等 0.22s 动画播完、260ms 那次补量才把它纠正到真正的目标位置,肉眼
看就是"先抽一下、停顿、再滑一段"这种两段式的动画,不是哪里写错了逻辑,
是测量的对象和时机都选错了。

改法:展开时不再量会动的 `.pg-controls`,改成量 `.pg-workspace` 自己的
右边缘——这个容器的宽度只由 `.pg-main` 的可用空间决定,跟 Controls 面板
自己是300px还是0px无关(Stage 用 `flex:1` 吸收差值),所以不管面板处于
动画的哪一帧,workspace 右边缘都是同一个稳定值。这意味着可以在动画开始
的第一时间就算出面板"展开完成后"最终会落在哪、把手该贴哪,不用等动画
播完再纠正一次——把手和面板会在同一个 0.22s 区间里同步开始、同步结束,
不会再有那种两段式的抽动感。收起时的逻辑(直接写死 `right:10px`,不测量)
没有变,那部分本来就不依赖任何会动的元素。

## 2026-09-15(第五次)Controls 面板收起时,把手没有真正贴在视口最右边

你截图反馈:面板收起状态下,把手离视口最右边还空了一截,不是贴边的。
根因是第四次那套"现场量 `.pg-controls` 真实位置"的算法——面板收起时它
本身是空的(width:0),测量到的位置只是被 `.pg-main` 那圈 `24px 32px`
装饰性 padding 顶出来的,不代表"视口最右边"字面上在哪。

改法:收起时不测量,直接写死 `right:10px`——`position:fixed` 本来就是
相对真实浏览器视口定位,不是相对 `.pg-main` 的 padding,直接写 `10px`
贴的就是视口字面意义上的最右边。只有展开时才继续用第四次那套"现场量面板
真实边缘"的逻辑(这个场景下面板是真的有内容占着地方,不测量会盖住面板
里的东西,这部分逻辑没有变,浏览器验证过 gap 依然精确是10px)。

## 2026-09-15(第四次)Controls 把手改成真正的 position:fixed 浮层 + Exit full page 收起时只留图标

你反馈第二次改完的把手(深色圆角竖条)还是很乱——因为那次改完它其实还是
`.pg-workspace` flex 行里的一个普通子项,只是外观换了样子,原有的两个
问题都没解决:1) 仍然挤占 Stage 的可用宽度,Stage 不可能真正撑满整屏;
2) 垂直位置仍然靠 `align-self:center` 相对"整个可滚动内容的高度"算,
内容一多把手照样被顶到很远、卡进原生滚动条里。你要求把手真的"浮在正常
页面上",这样 full page 预览才能更接近真实产品的样子。

**真正的修法**:把手改成 `position:fixed`,完全脱离 `.pg-workspace` 的
flex 布局——不再挤占 Stage 宽度,垂直方向也改成固定贴视口正中间
(`top:50%`),不再跟着内容高度走。

水平方向(`right`)不能写死一个像素常量——非全屏模式下 `.pg-main` 自己有
`padding:24px 32px`(还可能带一条纵向滚动条),全屏模式 padding 直接是0,
两种模式下"Controls 面板左边缘到视口右边缘"的距离完全不一样。改成用
`controlsPanelRef`(绑在 `.pg-controls` 上)现场量
`getBoundingClientRect().left`,拿视口宽度减掉它、再加10px间距,算出把手
真实该贴的位置——不管哪种模式、面板开着还是收起缩到多窄,都是照真实量出
来的位置贴,不是猜一个常量。触发重新量的时机:`controlsOpen` 变化时(手动
点把手,或者进/出全屏时代码自动收起/恢复面板)、`toggleFullscreen` 本身
(padding 变化,即使 controlsOpen 的值刚好没变也要重新量)、窗口 resize
时(复用了原来就有的 `handleWindowResize`,没有再加一个新的 resize
监听器)。每次都是"立即量一次 + 260ms 后再量一次"(等 `.pg-controls`
那条 `width .22s ease` 的 CSS transition 播完,量到最终宽度,和
`syncScreenWidthToStage` 用的是同一个260ms 惯例,不是我新定的数字)。

**"Exit full page" 收起时只显示图标**:全屏模式下,Controls 面板收起时
这个按钮只显示 `✕` 图标(不带"Exit full page"文字),面板展开时还是原来
"✕ Exit full page"的样子——用 `:title` 属性保留可访问性文本。非全屏模式
(按钮显示"⛶ Expand to full page")不受影响,这条只影响已经在全屏、且
面板收起的那一种状态。

浏览器实测过:非全屏模式面板开/收起、进全屏(面板自动收起,按钮变
纯图标)、全屏内手动展开面板(按钮变回文字,把手跟着挪到面板左边缘)、
退出全屏——每一步把手和面板左边缘之间的间距都精确是10px,没有重叠/穿模,
无 console 报错。

## 2026-09-15 "Exit full page" 按钮挪到真正的最右上角

你反馈全屏模式下这个按钮(原来 `top:66px; right:16px`,专门躲开
AppHeader 右侧的铃铛/头像/菜单图标)会被 Controls 面板盖住/压在
"Reset dashboard"这类按钮上面——Controls 面板展开时会占满屏幕最右边
从 y:0 开始的一整条,跟按钮所在的 x 范围重叠。

单纯改按钮自己的 top/right 数值治不好这个问题:不管挪到哪个像素,只要
Controls 面板还是从 y:0 开始占满整条,按钮就必然落在面板的某个内容上面
(标题文字/Reset按钮/其它控件)。真正的修法是给 `.pg-workspace`(Stage+
Controls 两栏)整体让出一条 44px 高的空白(`margin-top:44px` +
`height:calc(100% - 44px)`),按钮摆在这条空白区域的最右上角
(`top:8px; right:12px`)——这样不管 Controls 面板开不开、AppHeader
自己长什么样,这条空白都是专门留给按钮的,不会跟任何真实内容重叠。

## 2026-09-15(第二次)打开/收起 Controls 面板的把手改成深色圆角竖条

你给了张参考截图(深色圆角矩形,图标+竖排文字"DEV"),要求打开 Controls
面板的方式改成这样的 handle,图标和文案交给我判断合适的——原来这里只是
一条 14px 宽、`‹`/`›` 两个字符的细窄条(`.pg-rail-toggle--controls`)。

改成 36×92 的深色圆角竖条(`background:#1C1D1F`,`border-radius:14px`),
里面是图标(sliders,三条横杠+旋钮圆点,对应"这里是一组可调整的控制项"
这个语义,比参考截图里的代码图标更贴合"Controls 面板"本身,不是抄参考
截图字面上的图标)+ 竖排文字(`writing-mode:vertical-rl`),文案沿用
面板自己标题栏已经在用的"CONTROLS"这个词,没有另造一个新词。点击行为/
`toggleControls`/`controlsOpen` 状态完全没变,只是外观从细条换成了这个
把手。

hover 状态特意没有改背景色——图标那几个"旋钮圆点"用 `fill:#1C1D1F`
写死去遮住穿过它们的横杠(仿滑块旋钮的常见画法),背景色一变这几个圆点
就会露出不匹配的深色斑点,改成用阴影变深表达 hover。

## 2026-09-15 Spec 面板:关闭按钮左边加复制CSS图标,去掉底部的 Copy CSS 按钮

你要求 dev 不用滚到面板最下面找"Copy CSS"按钮——改成在关闭按钮左边加一个
复制图标按钮,原来 `.pg-spec-panel__foot` 那整块(底部单独一行的 "Copy
CSS" 按钮)删掉。图标本身、以及 hover 时的提示("Copy CSS")/点击后的
"Copied" 反馈(1.5秒后自动消失),都是照抄 `fragments/OfferCard/OfferCard.vue`
里 VIN 复制按钮那套已核实样式(`.offer-card__copy-btn`/
`.offer-card__vin-tooltip`),没有重新设计一套新的视觉/交互。新增
`specCssCopied` 这个 ref,`copySpecCss()` 点击时除了原来就有的
`navigator.clipboard.writeText`,现在还会把它设成 true、1.5秒后自动
setTimeout 变回 false——这部分逻辑也是照抄 OfferCard.vue 的
`copyVin()`,不是重新写的。

## 2026-09-11 新增 Spec Mode(点击元素看 CSS 规格，方便交付给 dev）

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

## 2026-09-12 预览舞台改成"灰色画布 + 居中的白色卡片"

你反馈两个问题(并给了同事做的一个 VDP mobile 预览工具截图作参照,那个
工具是深色灰背景 + 手机宽度的内容居中浮在中间,像一张卡片):

1. 点 Offer Dashboard 的 "Mobile view" 之后,舞台还是原来那么宽,内容
   被挤在很宽的容器最左边,两边留白也看不出边界——因为 `.pg-stage`
   (舞台背景)和里面渲染出来的组件(比如 Offer Dashboard 自己就是
   白底)颜色完全一样,"白底套白底",分不清组件的实际渲染范围在哪。
2. 希望点 mobile view 时内容是居中的,不是贴左。

改法(纯 Harness 样式,不涉及任何 fragment 组件):
- `.pg-stage` 背景从纯白 `#FFFFFF` 改成浅灰 `#F0F1F3`,变成一块"画布"。
- `.pg-stage__resize-frame`(实际决定组件渲染宽度的那个容器)加了
  `background:#FFFFFF`(自己是一张白色卡片,不管里面的组件本身是不是
  白底,舞台和卡片的边界都看得清)、`box-shadow`(浅浅的投影,视觉上
  更像"浮在画布上的卡片",不是紧贴着画布)、`margin:0 auto`(比舞台窄
  的时候——比如 mobile 375px——自动水平居中;比舞台宽的时候
  margin:auto 自动变成0,不影响原来"拖到很宽时横向滚动查看"的行为,
  两种情况都覆盖到)。

这个改动是全局的(所有组件页面都套用同一个灰色画布 + 白色卡片的展示
方式),不是只在 mobile view 时才生效——之前每个组件预览都是"舞台和
组件同色,分不清边界"这个问题,不只 mobile view 才有,顺带一起解决,
对之前已经验证过的桌面版页面视觉效果没有负面影响(卖场景已实测:App
Header 这种小组件、Offer Dashboard 桌面宽版、Offer Dashboard mobile
窄版,三种情况舞台画布+居中卡片的效果都符合预期)。

浏览器实测:mobile view(375px)下卡片左右两侧各留白约67px(舞台
padding 24px + 剩余空间对半分),精确居中;拖到桌面宽度(1422px)时
卡片铺满大部分舞台宽度,右侧留白很少,超出舞台宽度时正常横向滚动;
无 console 报错。

## 2026-09-12（第二次）Mobile view 尺寸改成 390×844,并且高度也真的固定了

你要求把 mobile view 的尺寸改成 390×844px——不只是宽度从 375 改成
390,连高度也要固定成 844(接近真机 iPhone 的 viewport),不能再像
之前那样"宽度固定、高度跟内容一直往下长"。

新增 `stageFrameHeight`(默认 `null` = 不限制高度,桌面/Auto 模式的
原有行为不变)。点 "Mobile view" 时,连带把它设成 `844`,
`stageFrameStyle` 计算属性里补了 `height:844px` +
`overflow-y:auto`——预览框本身变成一个固定尺寸、内部能自己滚动的
"手机屏幕",不再是外层舞台跟着内容一起变高。点 "Web view" 时这个值
重置回 `null`(高度交还给内容撑起来),点 "Auto" 同样重置为 `null`
(拖 Screen width 滑块测试响应式断点时,不应该被一个固定高度框住)。

`MobileTopBar`/`MobileBottomNav` 的 `position:sticky` 现在是相对这个
固定高度的框自己滚动(不是相对外层舞台或整个浏览器窗口),这样贴顶/
贴底的效果才是真的模拟"手机屏幕内容滚动,系统状态栏/底部导航条不动"
的样子,不是巧合碰上的。

浏览器实测:点 "Mobile view" 后,预览框宽 390px、高精确 844px、
`overflow-y:auto`;往下滚动框内内容,顶部 "Offers" 条和底部导航条都
保持贴在框的上/下边缘不动;点 "Web view" 后高度变回跟随内容(不再
限制、不出现内部滚动条);无 console 报错。

## 2026-09-12（第三次）Screen width 滑块范围要跟着 Device view 收紧 + 顺序调整 + 两个真实 bug

你反馈:1)选了 Mobile view 之后,Screen width 滑块还是能拖到很宽
(截图里显示 1888px),超过了 breakpoint,自相矛盾;2)"Device view"
应该排在 "Screen width" 上面。

**1. 控件顺序**:REGISTRY 里 `OfferDashboard.controls` 对象字面量里
`deviceView` 挪到了 `screenWidth` 前面——Controls 面板是按这个对象的
属性顺序遍历渲染的(`otherControls` 只是过滤掉 `reset`,不改变顺序),
不用改模板,单纯调整定义的先后就生效。

**2. 滑块范围跟着 Device view 收紧**:`type:'range'` 的 `:min`/`:max`
改成按 `key==='screenWidth'` 特判的三元表达式(直接写在模板属性里,
不是拆成方法调用——拆过一次,发现 Vue 在这个属性绑定的位置解析
"rangeMin(key, def)" 这种方法调用语法会报 "not a function",原因
没查清楚,直接写表达式反而没问题,保留这个写法,细节见代码注释):
Mobile view 时 max 收紧到 768(不能拖出比 breakpoint 还宽);Web view
时 min 收紧到 768(不能拖出比 breakpoint 还窄);Auto 不收紧,保持
320–2560(Auto 本来就是要能拖过 breakpoint 测试自动切换的)。

**3. 真 bug 一:全屏时 Mobile view 会被"铺满整屏"逻辑覆盖回宽屏尺寸**
——这就是你截图里 1888px 的真正原因。`toggleFullscreen()` 进全屏时有
一段专门的逻辑,会现场量 `pg-stage` 真实可用宽度、把 `screenWidth`
拨过去(这段逻辑是很早以前专门为"全屏应该铺满屏幕、不该停在滑块默认
1422px"这个需求加的,本身没有问题)。但这段逻辑之前没有考虑到
"deviceView 是不是被强制指定成了 mobile/web"这种情况,只要进全屏就
无条件覆盖——加了一个判断:只有 `deviceView` 是 `'auto'`(或者这个
组件根本没有 deviceView 这个控件)时才继续走"进全屏即铺满"这条已有
逻辑,选了 Mobile view/Web view 时这段覆盖逻辑不再触发。

**4. 真 bug 二:切换 Device view 时,滑块新值有时会被浏览器夹成旧的
max**——排查发现:改 `deviceView`(从而让 `:max` 绑定表达式重新计算)
和设置新的 `screenWidth` 值是在同一个 JS 同步 tick 里做的,但原生
`<input type=range>` 元素会用"当前 DOM 属性上的 max"去夹住你设的
value——如果浏览器实际打 patch 的顺序刚好是"先套用旧 max,后套用新
value",值会被夹成旧 max(比如从 mobile 切到 web 时,新宽度 1422 被
夹成了 768,而且因为标签上显示的文字读的是响应式变量本身没被夹,
表面上看起来"文字对、滑块拖动条底层状态却是错的",很容易被忽略)。
改成用 `nextTick` 把设置新 `screenWidth` 拆到下一轮——先让 min/max
的 patch 完全生效,再设新宽度,新宽度落进的就是已经生效的新区间,
不会被夹住。

浏览器实测:Mobile view 下滑块 min/max 精确是 320/768,值 390,拖不
到超过768;Web view 下滑块 min/max 精确是 768/2560,值落在 1422 附近
(1418,10px 的 step 导致的正常取整,不是bug);Auto 下滑块还是完整
的 320–2560;进全屏后 Mobile view 的宽高(390×844)不再被覆盖成铺满
屏幕的尺寸;来回切换 Mobile view ⇄ Web view ⇄ Auto 多次,每次滑块的
真实 DOM 值(不只是显示的文字)都用 JS 直接读取核对过,和预期一致;
无 console 报错。

## 2026-09-13 修正"贴边的方框"——大部分组件预览卡片改成贴合内容大小并居中

你反馈 Filter Chip Group 这类页面"看着有个方框,贴这边"——排查后
确认:大部分组件(除了 Offer Dashboard/Offer Card/mobile view 这几个
真的需要固定宽度的)自己没有 screenWidth 控件,stageFrameStyle 就不会
给预览框设置任何行内 width,框按 block 元素默认行为"贴满舞台整个
宽度"——组件内容(比如一行 chip、一条 breadcrumb)本身没那么宽,结果
就是一个贴着左右两边、比内容宽很多的白色方框(带阴影),视觉上像
"贴边的一个方框",不是浮在灰色画布上贴合内容大小的卡片。

第一次尝试直接在 .pg-stage__resize-frame 上加 width:fit-content,
结果整个预览(框+组件)直接消失、宽度塌缩成0——排查发现这个元素同时
还带着 container-type:inline-size(给 Offer Dashboard 的 cqw 响应式
布局用的,不能去掉),这两个 CSS 属性一起用在同一个元素上会冲突:
声明了 inline-size containment 之后,浏览器算这个元素自己的
"intrinsic 宽度"(fit-content 就是靠这个算的)时会当成"里面没有内容"
处理,直接算成0。

改法是拆一层:.pg-stage__resize-frame 保留 container-type,不再管
外观;新增里面这一层 .pg-stage__card 专门负责"贴合内容大小、居中、
白底、阴影"这个视觉效果(它自己没有 container-type,不会有这个
冲突)。有 stageFrameStyle 强制指定宽度的场景(Offer Dashboard/Offer
Card/mobile view),这层卡片加 --fixed 修饰类改成 width:100%,填满
外面已经是目标宽度的框,跟改动前表现完全一致。Spec Mode 的
findSpecTarget 里原来"往上找到 .pg-stage__resize-frame 就停"的
ceiling 判断也同步挪到了 .pg-stage__card(现在是真正预览组件的直接
父节点)。

浏览器实测:Breadcrumb 这种没有固定宽度的组件,卡片宽度精确贴合
"My ACV › Offers" 文字内容(137.6px),左右留白对称(44px/44.2px),
明显居中,不再贴边;Offer Dashboard 的 mobile view(390×844)、Web
view(1422px 宽)都跟改动前表现一致,没有受影响;Spec Mode 点击
Breadcrumb 文字正确识别成 span.breadcrumb__item,不会误选到新加的
.pg-stage__card 这层包装;无 console 报错。

【2026-09-13(第二次,撤销)你反馈上面这个白底+阴影+居中的卡片效果
看着"更乱了"】已撤销:删掉 .pg-stage__card/.pg-stage__card--fixed
这两条 CSS 和模板里对应的包裹 div,.pg-stage__resize-frame 恢复成
改动前只有 container-type、不管外观的样子;Spec Mode 的
findSpecTarget ceiling 也改回 .pg-stage__resize-frame。现在
Filter Chip Group 这类没有 screenWidth 控件的组件又是"贴满舞台宽度
的一条白底"(没有阴影、没有居中),浏览器实测确认改回去了,无 console
报错——"贴边的方框"这个原始问题还没有新的解法,后续如果要再处理,
需要先跟你确认清楚具体想要的效果,不要再直接猜。

## 2026-09-13(第三次)Mobile view 加"手机的感觉"——只影响 Mobile view 这一个场景

你反馈 Mobile view(390×844)"高度并不是844,我想要手机的感觉"。实测
排查:stageFrameStyle 给 .pg-stage__resize-frame 设置的高度本身没有
bug,普通视图和全屏视图下都精确是844px、内部 overflow-y:auto 也确实
生效(超出844的内容裁切、靠内部滚动)。问题是纯视觉上的:这个框贴着
舞台左上角(全屏模式下更明显,整个铺满屏幕的空白区域里框只贴在左上角
一小块),没有居中、没有描边/圆角/阴影,还会露出一条原生桌面滚动条,
看起来就是一块普通的裁切区域,不像"举着一个手机屏幕"。

新增 .pg-stage__resize-frame--device 这个修饰类,只在 Mobile view
(Harness 的 stageFrameHeight 有值)时通过 :class 绑定生效——margin:0
auto 居中、圆角24px、阴影、隐藏原生滚动条(scrollbar-width:none +
::-webkit-scrollbar{display:none})。特意没有复用/改动上面被你说
"更乱"的 .pg-stage__card(那个是加在所有组件通用的包装层上,这次只在
Mobile view 这一个具体场景生效,互不影响)。

浏览器实测:普通视图和 "Expand to full page" 全屏视图下,Mobile view
都渲染成一个圆角、带阴影、水平居中悬浮在灰色画布上的"手机屏幕"(全屏
模式下之前完全贴左上角、没有居中,现在也居中了);原生滚动条已经
隐藏,内容超出844高度时只能靠手机屏幕内部滚动(实测 scrollHeight
7243 / clientHeight 844,滚动行为本身没变,只是不再露出一条突兀的
桌面滚动条);Web view(1422px)、Auto 模式、Filter Chip Group 等没有
stageFrameHeight 的组件都实测确认没有变化(没有 --device 这个类,
没有圆角/阴影/居中);无 console 报错。

## 2026-09-13(第四次)Mobile view 的 Dealership 弹层("Select Dealerships"
bottom sheet)铺满了整个桌面窗口,不是贴着手机屏幕底部

你给了参照截图:mobile 版点 "Dealership" 弹出的 bottom sheet 应该
贴合手机屏幕底部(盖住 MobileBottomNav 上面那一段),但实际渲染出来
铺满了整个桌面浏览器窗口的宽度,完全不在手机框范围内。排查确认这不是
DealershipFilterDropdown/OfferDashboard 组件本身的 bug——它的 mobile
弹层用 `position:fixed` + `left:0/right:0/bottom:56px`(见
OfferDashboard.vue `updateDealerPopoverPosition` 的 mobile 分支),这个
写法在真实手机浏览器里完全正确(fixed 天然相对整个屏幕,屏幕本身就是
"viewport"),但在这个 Playground 里,"手机屏幕"只是桌面浏览器窗口里
一个 390×844 的小方框,不是真的 viewport——`position:fixed` 天生只认
真实浏览器 viewport,会直接穿透这个小方框,铺满整个桌面窗口。用 JS
直接量过:改之前 fixed 弹层的 `left:0`、`width` 等于整个 944px 视口
宽度,不是 390px 的手机框宽度。

修法:给 `.pg-stage__resize-frame--device`(上面第三次改动新加的
Mobile view 专属修饰类)加 `contain: layout`——按 CSS Containment
规范,声明了 layout containment 的元素会变成它内部所有
position:fixed/absolute 后代的 containing block,这样 fixed 定位就会
相对这个 390×844 的框计算,不再相对整个浏览器窗口,等效于把这个框
模拟成一个真的手机屏幕。这个类只在 Mobile view 生效,不会碰到 Web
view 下同样用 position:fixed 定位的桌面经销商浮层(那边理应继续相对
真实浏览器视口算)。

浏览器实测:改之前 popover 的 `left:0/width:944`(等于整个视口);
改之后 `left:200/width:390`(精确等于手机框的位置和宽度),`bottom`
落在手机框底边往上 56px 处(正好贴着 MobileBottomNav 上边缘,和参照
截图一致);切到 Selling tab 打开弹层、勾选经销商、点 Apply Filter,
弹层正常关闭、chip 摘要正确显示选中的经销商;切到 Web view 重新打开
桌面版弹层,`left:639/width:374`,还是相对真实按钮位置定位的悬浮小
面板,没有被这次改动误伤;无 console 报错。

## 2026-09-13(第五次)Mobile 版 MobileBottomNav 没有贴在屏幕最底部

你反馈筛选完只剩1条结果时,MobileBottomNav 下面留了一截空白,没有
贴底。排查发现真正原因是镜像遗漏,不是新 bug:OfferDashboard.vue 源
文件的 `.offer-dashboard` 本来就有 `min-height:100vh`,但 2026-08 把
这条规则改成 `width:100%`(为了配合 Playground 的 screenWidth 滑块)
的时候,不小心把 `min-height:100vh` 一起删掉了,index.html 这边一直
没有这条规则——用 JS 直接量过:改之前 `.offer-dashboard` 的 computed
min-height 是 `0px`,高度完全由内容撑开(725px),`.offer-dashboard__
mobile-body` 虽然设了 flex:1,但因为容器本身没有比内容更高的高度可以
分配,flex:1 分不到任何多余空间,MobileBottomNav 只能贴着短内容之后
的位置,不会被推到容器底部。

先把 `min-height:100vh` 按源文件原样补回 index.html(修复镜像遗漏)。
但这条规则单独放回去还不够——在这个 Playground 里,"手机屏幕"是
`.pg-stage__resize-frame--device` 这个 844px 高的模拟框,不是真的
浏览器 viewport,`100vh` 只认真实浏览器窗口高度,跟 844px 完全是
两回事(真实浏览器窗口通常比844高)。所以额外加了一条只在 Playground
里生效的覆盖规则 `.pg-stage__resize-frame--device .offer-dashboard {
min-height: 100%; }`——由于模拟手机框自身有明确的844px行内高度,
百分比能正确解析成844px,让 flex:1 的 mobile-body 正确吃掉多余空间、
把 MobileBottomNav 顶到手机框真正的底边。这条覆盖规则只写在 index.html
的 Harness 部分,不属于 OfferDashboard.vue 本身,不会镜像回 fragment
源文件(真机上 100vh 本来就是对的,不需要这个 Playground 专属的
补丁)。

浏览器实测:把 "Vehicles shown on Selling" 调到1(只剩1张卡片)、切到
Selling tab,MobileBottomNav 的 `bottom`(975)和手机框的 `bottom`
(975)现在完全对齐,中间多出来的732px空间被 mobile-body 正确吃掉;
调回15条,内容变高(scrollHeight 7243 > clientHeight 844),照常靠
手机框内部滚动查看,顶部/底部两条 sticky 栏行为没有变化;切到 Web
view,`.offer-dashboard` 的 min-height 正确解析成真实浏览器视口高度
(640px,不是844),确认桌面场景没有被这次改动误伤;无 console 报错。

## 2026-09-13(第六~七次,已整体撤销/rewind)"让 mobile 弹层贴合模拟手机框"这个尝试最终导致整个 Playground 失灵,回退

背景:给 InformationDialog 加了 mobile 版之后,你反馈从 OfferDashboard
Mobile view 里点卡片按钮打开这个弹层,会铺满整个 Playground 浏览器
窗口宽度,不会被约束在模拟的390px手机框(`.pg-stage__resize-frame--
device`)里。为了解决这个纯视觉问题,先后做了两轮尝试:

- **第六次**:用 provide/inject 给这个弹层一个可覆盖的 teleport 目标,
  只在 Mobile view 时把 teleport 目标从 `body` 换成模拟手机框的选择器。
- **第七次**:第六次上线后你反馈"mobile view 下点 Manage Offer 没
  反应"——排查发现是把 `contain:layout`(让这个框当 fixed 元素的
  containing block)和 `overflow-y:auto`(卡片列表内部滚动)加在了
  同一个元素上,这两个职责互相干扰,导致 fixed 定位的弹层会被这个元素
  自己的滚动量顶偏,滚动越多、弹层被顶得越远,越容易顶出可视区域看
  不见。第七次把"滚动"和"当 containing block"拆成两个不同的元素来解决
  这个偏移问题。

**第七次上线后,你反馈"问题更严重了"**——不只是 Manage Offer 还是没
反应,连 Web view 切换、Screen width 滑块都跟着失灵,整个 Playground
的交互都卡死了。排查确认:第六/七次这两轮改动会触发 Vue 内部一个
Teleport 相关的报错(`Cannot read properties of null (reading
'nextSibling')`),这个报错一旦抛出会打断 Vue 整个应用的响应式渲染
循环——不是某个按钮的问题,是整个页面的交互都被这一个报错卡死了。之前
我自己测试时也见过同样的报错,但错误地判断成"是我测试时手动同时开了
两个弹层这种测试脏状态导致的偶发情况",没当成这两轮改动真正引入的
bug 去处理,这个判断是错的。

**决定并执行:把第六次和第七次这两轮"贴合模拟手机框"的改动整体撤销
(rewind)**,回到更早(第三次,只有圆角/阴影/居中/隐藏滚动条这几条
纯视觉样式,不带 `contain:layout`)、已经验证过稳定的状态:
- 删掉 Harness 里的 `provide('mobileDialogTeleportTarget', ...)`,以及
  为它专门解构的 `provide`/`inject`。
- `InformationDialog.vue`(fragment 源文件 + index.html 镜像)的
  `<Teleport>` 改回原来无条件的 `to="body"`,删掉 `inject` 那段。
- `.pg-stage__resize-frame--device` 删掉 `contain:layout` +
  `overflow:hidden`,删掉新增的内层 `.pg-stage__resize-frame__scroll`
  包装 div 和它对应的 `stageFrameScrollStyle` computed,`overflow-y:
  auto` 挪回外框自己身上(回到第三次的原样,单层结构)。

回退后的状态:Manage Offer/Dealership 下拉这些用 `position:fixed` 的
弹层,在真实手机上完全正常(逻辑从来没有问题);在这个 Playground 里
预览时会铺满整个桌面浏览器窗口宽度,不会贴合那个 390px 的模拟手机框——
这只是预览工具本身的纯视觉瑕疵,不影响任何真实逻辑,也不会导致任何
交互失灵。以后如果还想解决这个视觉瑕疵,需要先确认清楚不会影响主应用
的响应式稳定性,不能再这样直接改、边改边测。

浏览器实测(用干净的新标签页):Mobile view 下点 "Manage Offer" 正确
打开对话框;切到 Web view,frame 宽度正确变成1422px;拖动 Screen width
滑块,frame 宽度正确跟着变;Selling tab 打开 Dealership 下拉正常;无
console 报错。

## 2026-09-13(第九次)换一套不碰 Teleport 的思路,重新解决"贴合模拟手机框"

回退之后你确认 Manage Offer 恢复正常,但老问题还在:mobile 版对话框
在 Playground 里还是铺满整个桌面窗口,不贴合那个390px的模拟手机框。
你要求继续修,同时要保证可以 rewind——当时确认工作区是干净的,HEAD
(`e7d0ac8 dialog -mobile problem`)本身就是一个可靠的回退点。

这次换了一套完全不碰 Teleport 目标的思路,避开前两次真正的问题根源
(动态改 `<Teleport :to>` 触发 Vue 内部报错、拖垮整个应用的响应式):

- `<Teleport>` 永远 `to="body"`,这次完全不改它的目标。
- Harness 新增 `resizeFrameRef`(挂在 `.pg-stage__resize-frame` 这个
  DOM 节点上)+ `provide('mobileDeviceFrameEl', computed(function () {
  return stageFrameHeight.value ? resizeFrameRef.value : null; }))`——
  只在真的在渲染 Mobile view 模拟框时才把这个真实 DOM 节点交出去,
  否则给 null。
- `InformationDialog.vue` inject 这个值(默认 null,生产环境不受
  影响),用普通的 `getBoundingClientRect()` 量出模拟框在屏幕上的
  实际像素位置,换算成 `top/left/width/height` 当 inline style 绑定
  给这个弹层(不再用 `inset:0`)——这是最基础的 Vue style 响应式绑定,
  不涉及 Teleport 内部那套容易出问题的机制。对话框打开时(`modelValue`
  变 true 的 watch 里)`nextTick` 之后量一次,窗口 resize 时也会重新量
  一次(`onMounted`/`onBeforeUnmount` 里加了 `window.addEventListener
  ('resize', updateMobileOverlayRect)`)。inline 模式(独立 Playground
  页)不受影响,直接跳过这套逻辑。

顺带发现并修了一个"退化"的旧问题:Dealership 下拉浮层(mobile 版
bottom sheet)之前是靠 `contain:layout` 贴合模拟框的,回退时那条
`contain:layout` 也被删了,这个浮层跟着"退化"回铺满真实视口宽度。
既然验证过 inject 这套 DOM 节点 + `getBoundingClientRect()` 的做法是
安全的,`OfferDashboard.vue` 的 `updateDealerPopoverPosition()` 也改成
同一套做法(这个浮层本来就不是 Teleport,一直是普通的
`position:fixed`,风险比 InformationDialog 那边更低)。

浏览器实测(每一步之间都单独查了一次 console,不是全部操作完再统一
查):Mobile view 点 "Manage Offer",`getBoundingClientRect()` 量出来
弹层和模拟框完全重合(宽390/高844);把模拟框 scrollTop 设到650(复现
最早那个"滚动后点开看不到"的场景)再开对话框,弹层位置依然精确重合,
没有被顶偏;"Expand to full page" 全屏模式下同样精确重合;连续
Mobile view ⇄ Web view ⇄ Mobile view 切换 + 重新打开对话框、Web view
下打开桌面版对话框(确认还是 teleport 到真正的 body)、拖动 Screen
width 滑块、Selling tab 打开 Dealership 下拉(现在也贴合模拟框了)——
每一步都单独确认无 console 报错,没有再出现之前那个 Teleport 内部
报错。
