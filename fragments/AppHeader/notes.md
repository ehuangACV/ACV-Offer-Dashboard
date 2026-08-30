# AppHeader — Notes

## 2026-08 替换记录
这个组件已经从 Figma 版本整体替换成 Claude Design 项目
"ACV Auctions Design System"(projectId
`1294432b-f5f9-488f-9691-d01499283248`)里的
`components/08-app-bar-navigation-web.card.html`,通过 DesignSync 工具
的 `get_file` 直接读取真实源码(不是 Figma `get_design_context`),logo
也换成了该项目 `assets/logo.svg` 的原始内容。这是用户直接指定的替换,
不是我自己选的数据源。

替换前的旧版本(Figma 节点 6837:16087)用的是"浅橙背景 pill + 圆点"表示
选中态,这个新版本用的是"文字变橙 + 底部 2px 实色下划线",两者是不同
设计,不是同一版本的两次核实结果。

## 已核实(直接来自源文件的 CSS/HTML/JS,不是我猜的)
| 元素 | 数值 |
|---|---|
| 容器 | 高 58px,白底,底部描边 1px #D1D3D6 |
| nav tab 默认 / hover / 按下 | 色 #55575C / 背景 #FAFAFA / 背景 #F1F1F1 |
| nav tab 选中态 | 色 #F26522 + 底部 2px 实色下划线 |
| "New" 徽标 | 背景 #FF5449,文字 #F7F7F8,10px/14px,圆角 60px |
| More 溢出菜单 | 白底,圆角4px,三层阴影,菜单项高48px,字号16/24 色#545454,hover #FAFAFA,按下 #F1F1F1 |
| Rewards 展开态 | 描边/文字 #F26522,圆角60px,hover rgba(242,101,34,.06),按下 rgba(242,101,34,.14) |
| Rewards 收缩态 | 36×36 圆形,描边 #D44D0C,hover 弹出深色 tooltip(#1C1D1F 底 / #F7F7F8 字) |
| 通知/汉堡图标按钮 | 40×40 圆形,hover #F5F5F5,按下 #E0E0E0,focus-visible 描边 2px #7B61FF |
| 用户头像 | 32×32 圆形,背景 #F26522,白字 |
| 用户信息展开态 | 姓名14px + 公司12px,均色 #55575C |

## 响应式收缩逻辑(直接照搬源文件 `layout()` 算法)
量导航区右边缘和右侧区左边缘的间距,≤15px 时依次:
1. Rewards pill 收缩成图标
2. 用户姓名+公司收起,只剩头像
3. 至少 2 个 nav 项挪进 "More"
4. 继续逐个把最后一个 nav 项挪进 "More",直到间距 > 15px 或只剩 1 个
   nav 项
容器宽度 < 980px 时额外应用 "md" 断点(logo 左边距 24→16,nav gap
24→16)。

组件本身用 `resize: horizontal` 让你在 Playground 里直接拖右下角改变
容器宽度来测试收缩顺序,不需要额外的宽度控制器。

## 按你的要求做的改动
- **删除了 "Nav 6" / "Nav 7"**——源文件原本有 7 个 nav 占位项,按你的
  要求只保留前 5 个真实命名的项(Marketplace / My ACV / Market Report /
  ACV Capital / ACV Transport)。
- 源文件明确写了"no focus treatment is defined"给 nav item,所以没有
  为 tab 加 focus-visible 样式,这是源文件本来就没做的,不是我漏做;
  通知/汉堡/Rewards 收缩态这几个按钮源文件是给了 focus-visible 的,
  已经照做。

## 2026-08 按你的要求:logo 尺寸改成 82×41
之前是 `height:26px;width:auto`(换算下来是 52×26),你直接给了准确数值
82×41(和原来的 100:50 viewBox 比例完全一致,2:1,纯粹是整体放大,不是
改形状),已经改成 `width:82px;height:41px` 写死两个值,不再用
`width:auto` 换算。

## 2026-08 按你的要求:nav tab 字号从 14px 改成 16px
之前 nav tab 字号(14px/20px)是直接从 Design System 源文件卡片核实过来
的真实值,不是占位——这一点我当时特意跟你确认过是否要覆盖掉这个已核实
数值。因为你想让 AppHeader 的导航文字和 SidebarNav 的 16px 视觉上一致
(全屏对比真实截图时看着偏小),而这次没能通过 DesignSync 重新拉到那张
卡片核实(这个环境里 `/design-login` 需要交互式终端,拉不到),所以这
16px 是你直接拍板要的数值,不是重新核实 Design System 源文件得到的——
如果之后能重新核对那张卡片,请再确认一下这个改动有没有偏离源文件。

## 2026-08 按你的要求新增:"My ACV" 旁边的 New 红点
对照 Figma 节点 `7432:69595` 的截图,"My ACV" tab 右上角有一个纯色小红点
(不带文字),和 "ACV Transport" 那个写着 "New" 字样的文字徽标
(`.app-header__tab-badge`)是两种不同的东西,没有复用同一个 class,新增
了 `.app-header__tab-dot`。get_design_context 返回的这颗点对应的 Code
Connect 属性名被截断/乱码了(`="107:37970"`,看不出真实属性名),没能
拿到精确的直径/间距数值,现在的 6px 圆点、4px 左边距是照截图肉眼估的,
**不是像素级核实**,待你确认。是否显示由外层传入的 `hasNewOffers` prop
决定,这个组件本身不知道 deal 数据从哪来。

## 待你确认
1. Rewards pill 展开态本身内部的 trophy 图标颜色继承文字色 `currentColor`
   为 #F26522,收缩态图标按钮同理,这个没有额外的图标专属色号,已经
   按源文件 CSS 实现。
2. "More" 菜单目前只有在真的发生溢出(容器足够窄)时才会出现,默认宽度
   下 5 个 nav 项通常都能显示,如果你想直接看到 "More" 菜单的样子,把
   组件容器拖到比较窄(比如 500px 左右)就能触发。
