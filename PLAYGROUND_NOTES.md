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
