# FilterChipGroup — Notes

## 2026-08 按你的要求:所有 0 个的 chip 都要 disable + 去掉"(0)"
之前 In negotiation/Make Offer 没有 disabled 逻辑,只有 New/Received/
Sent/Declined 四个有。现在六个 chip 统一:数量为0时 `:disabled` +
不显示"(0)"(只有数量>0才显示"(N)")。同时加了一层防御:某个 chip
已经选中,后来因为外部筛选(比如选了经销商)导致它的数量变成0,会自动
清掉这个选中态,避免"灰色disabled但其实还是选中"的矛盾状态。
这些数量本身是 [OfferDashboard](../OfferDashboard/notes.md) 算好传进来
的,你指出的"选了dealership后数量该跟着筛选结果变"这个问题的实际修复
在那边,这个组件只负责"数量是0时怎么显示"。

## 2026-08 按你的反馈调整:应用的经销商摘要要顶替按钮本身
上一版把"已应用的经销商筛选摘要"做成了 `OfferDashboard` 里单独一个
chip 元素,显示在筛选行下面另起一行。你看了截图后指出应该顶替
"Dealership" 按钮本来的位置,不是另起一行。所以改成新增 `dealerChipLabel`
prop——非空时,"Dealership" 按钮内部切换成显示这个摘要文字 + 一个关闭
×(class `filter-chip--dealer-active`,复用之前那个独立chip的配色:
浅蓝底 `#E6F6FC` 描边/文字 `#00558C`),为空时还是原来的 "Dealership" +
下拉箭头。这是照抄真实原型(`My-ACV--Dealer-filter-main`)V2 版本
"chip default ↔ active states toggled by JS" 的做法——同一个按钮元素,
内部用两个 `<template>` 切换显示哪一块,而不是 V1 版本"按钮不变+另外
再显示一个独立 chip"的做法。点击按钮本身(摘要文字部分)还是会触发
`toggle-dealership`(打开/关闭浮层,方便直接改选);关闭×单独绑了
`@click.stop`,阻止事件冒泡到按钮的点击上,只 emit `clear-dealer`,不会
同时把浮层也弹出来。

## 2026-08 新增:暴露 Dealership 按钮的 DOM 节点
按你的要求参照真实原型(`My-ACV--Dealer-filter-main`)重做
`DealershipFilterDropdown` 之后,那个浮层需要真正悬浮在 "Dealership"
按钮下方(`position:fixed` 定位),但按钮本身在这个组件内部,浮层却是
`OfferDashboard` 渲染的兄弟节点,两者拿不到彼此。所以给按钮加了
`ref="dealershipBtnRef"` 并 `defineExpose({ dealershipBtnRef })`,让
`OfferDashboard` 能通过 `filterChipGroupRef.value.dealershipBtnRef`
拿到这个按钮的真实 DOM 节点去算浮层的定位坐标。这个组件本身的外观/
交互没有变化,只是多暴露了一个内部引用。

## 已核实(hidden=false,节点 6847:49392)
| 元素 | Figma node id | 数值 |
|---|---|---|
| 启用态 chip | 6847:49394-49396, 49399-49400 | 白底,边框/文字 #212121,14px/21,letter-spacing .25px,圆角 8,高 32 |
| disabled(数量 0)态 | 6847:49401(Sent) / 49402(Declined) | 边框/文字 #8D9199,背景仍白色 |
| Dealership 下拉箭头 | I6847:49394;6847:49127 | 18×18,真实 SVG |
| chip 间竖分隔线 | 6847:49397 | 高 28,色 #0E0E0F |
| "Clear" 按钮文字色 | 6847:49406(Code Connect → acv-shared-vuejs Button.vue) | #004E7D(节点唯一返回的链接色 token,与截图蓝色一致) |

## Figma 原生设计标注(直接来自节点的 data-interaction-annotations,不是我编的)
1. **多选**:Dealership、In Negotiation、Make Offer。
2. **单选(互斥)**:New、Received、Sent、Declined。
3. **默认态**:什么都不选时显示 ALL。

## 2026-08 按你的要求:chip 要真的过滤 table/tile,不只是自己变色
新增 `filter-change` 事件,内部三个选中状态(negotiationSelectedLocal/
makeOfferSelectedLocal/singleSelected)任何一个变化都会 emit 一次
`{ negotiation, makeOffer, single }`,由 `OfferDashboard` 接住去过滤真正
的行数据(这个组件本身不认识 row 长什么样)。点 "Clear" 现在除了 emit
`clear` 之外,也会把这三个内部状态自己重置,保证 chip 的高亮外观和外面
的过滤结果同步清空。

## 待你确认
1. chip 被选中/按下后的视觉样式(背景是否变色、文字是否变色)没有找到
   对应的可见 Figma 实例,组件里暂时只用"边框加粗"做区分,占位,待确认
   真实的选中态设计。
2. "Clear" 按钮的颜色是从节点返回的 token 列表里唯一的链接色推断来的
   (#004E7D),不是直接标注在这个按钮节点上的 hex,建议你确认一下。
3. 之前误把 hidden=true 的 "Counter Sent"(6847:49403)、"Declined"
   (6847:49404 hidden 版本)当成候选数据——现已确认它们是这两个可见 chip
   的旧版本,没有采用。

## 2026-09-02 新增 showDeclined prop:Selling tab 不显示 Declined 筛选项
按你的要求"selling 没有declined filter, buying 保持不变"新增
showDeclined(默认 true,不影响任何已有用法)。之前 Declined chip 一直
渲染,只是靠 declinedCount===0 变成灰色 disabled 态(见上面几条记录)——
这次是"整个不显示",不是"禁用",所以在 Declined 按钮外层加了
v-if="showDeclined"，不是复用 disabled 逻辑。OfferDashboard 按
activeMainTab !== 'selling' 算这个值传进来，细节见
[OfferDashboard/notes.md](../OfferDashboard/notes.md)。顺带补了一条
watch：showDeclined 变 false 时如果 Declined 当时还是选中态（比如在
Buying tab 选了 Declined 再切到 Selling），一起清掉选中态，跟已有的
declinedCount===0 那条 watch 是同一个防御逻辑。

## 2026-09-11 新增 mobile prop,配合 Offer Dashboard 的 mobile 版设计

看了你给的 Figma mobile 页面(node 7765:16893)里的 Filters 区
(7765:16923),这个节点自己带了设计标注:"Hide the 'In Negotiation'
and 'Make Offer' filters on mobile view"——跟你之前直接告诉我的要求
一致,不是我自己推断的。

新增 `mobile` prop(默认 false,不影响任何已有用法),为真时:
1. In negotiation / Make Offer 两个 chip 整个不渲染(`v-if="!mobile"`
   包一层,不是禁用/隐藏——按钮之间原来那条竖分隔线位置不变,还是紧跟
   在 Dealership 后面,Figma 里 mobile 版本也是这个顺序:Dealership →
   分隔线 → New → Received → Sent → Declined)。
2. chip 自己的横向 padding 从 16px 压缩成 8px、内部 icon/文字的 gap
   从 8px 压缩成 4px——这两个是核实过的 Figma 数值(mobile 节点用的是
   `px-[8px]`/`gap-[4px]`,桌面版是 `padding:6px 16px`/`gap:8px`),
   不是随手估的。
3. 整行允许横向滚动(`overflow-x:auto`)——mobile 节点的 Filters 容器
   实测宽度 479px,在 375px 视口里放不下,Figma 本身就是横向溢出、靠
   滑动查看剩下的 chip,不是换行或者把 chip 缩得更小硬塞进一行。

`.filter-chip:disabled`(数量为0变灰)、选中态配色、Dealership 下拉
交互逻辑等完全没有改动,mobile 只是外观上更紧凑 + 少两个 chip,业务
逻辑和桌面版是同一份代码。

## 2026-09-12 两处修复(按你给的新 Figma 节点 7773:45581)

**1. 隐藏横向滚动条的外观**

你反馈 mobile 上不应该看到那种带左右箭头+灰色滚动条的横向滚动条——
那是桌面浏览器渲染 `overflow-x:auto` 时的默认外观,真实手机上原生
触屏滚动("手动拖拽 filter group")根本不会长这样。给
`.filter-chip-group--mobile` 加了 `scrollbar-width:none` +
`::-webkit-scrollbar{display:none}`,只隐藏滚动条的外观,横向滚动本身
(拖拽/触屏滑动)不受影响——跟之前桌面版表格"影子滚动条"那次同一个
处理思路(只藏外观,不砍功能)。

**2. "Clear" 只在真的选了筛选项时才显示**

Figma 这个新节点显示:选中 "New (1)" 之后,"Clear" 才出现在筛选行
最右边;没有选任何筛选项时,不显示 "Clear"。桌面版一直是"Clear 永远
显示",这次只改 mobile——新增 `hasAnyFilterSelected` 计算属性(检查
negotiation/makeOffer/单选状态,以及 `dealerChipLabel` 是否非空——
Dealership 已应用筛选也算"有筛选项"),`mobile` 为真时 "Clear" 按钮
用 `v-if="!mobile || hasAnyFilterSelected"` 控制显示,桌面版
(`mobile` 为 false)这条判断永远走 `!mobile` 那半边,行为完全不变。

浏览器实测:mobile 布局下,不选任何筛选项时看不到 "Clear",也没有
可见的横向滚动条,但滑动筛选行仍然能看到被裁切的 "Sent"/"Declined"；
点一个 chip(比如 New)后 "Clear" 立刻出现,再点一次取消选中后
"Clear" 又消失；桌面版 "Clear" 始终可见,不受影响；无 console 报错。

## 2026-09-12（第二次）两处遗漏:鼠标拖拽 + "Clear" 应该盖住右侧 chip

你反馈两点:1)mobile 上这一行没法用鼠标左右拖拽;2)选中筛选项之后
"Clear" 只是老老实实排在最后面,没有像你截图那样贴着右边缘、盖住当时
在那个位置的 chip。

**1. 鼠标拖拽滚动**:上一版只隐藏了原生滚动条的外观,但没意识到"隐藏
滚动条"和"能不能滚动"是两件事——真机上触屏划动本来就能让
`overflow-x:auto` 滚动,不需要可见的滚动条;但桌面浏览器里鼠标在这行
上点住拖拽并不会触发滚动(这是浏览器原生行为,不是因为隐藏了滚动条
才失效的)。补了一个简单的鼠标拖拽实现(`handleChipsMouseDown`/
`handleChipsMouseMove`/`handleChipsMouseUp`,只在 `mobile=true` 时
生效):按下时记录起点和当前 `scrollLeft`,拖动时用鼠标位移直接改
`scrollLeft`,松开时清掉状态。加了一个 3px 的容错阈值——正常点击一个
chip 手指/鼠标不可能完全不抖动,没有这个阈值会把"点击"误判成"拖拽"。
真的发生拖拽后,用 `click.capture` 把紧跟着这次拖拽产生的 click 事件
吞掉(`e.stopPropagation()`),不然拖一下经常会同时触发一次
click,导致 chip 被意外选中/取消选中。

**2. "Clear" 贴右边缘 + 盖住底下的 chip**:你截图里 "Clear" 盖住了
"Received" 的一部分,说明它不是跟着别的 chip 一起被滚动区带走的普通
flex 项,是贴在可视区域右边缘的。mobile 变体给 `.filter-chip-group__
clear` 加了 `position:sticky;right:0`——没滚到底时,它会被"钉"在可视
区域右边缘,视觉上盖住当时刚好在那个位置的 chip(所以补了不透明白色
背景 + `z-index:2`,不然会透出底下 chip 的文字,叠在一起看不清);
一旦滚动到底,它自己在文档流里的位置正好也到了右边缘,自然就不再盖
住任何东西,这不是额外写的特例,是 `position:sticky` 本来的行为。

浏览器实测:mobile 布局下,鼠标在筛选行上点住左右拖动,内容跟着移动
(能看到被裁切的 Sent/Declined 逐渐露出来);选中 "New" 后 "Clear"
贴着右边缘出现,盖住了当时在那个位置的 "Received" 一部分文字,和你
截图的效果一致；拖拽之后松手,松手前经过的 chip 没有被意外选中/取消
选中；桌面版(`mobile=false`)完全不受影响,鼠标拖拽/sticky 这些改动
都只在 mobile 分支生效；无 console 报错。

## 2026-09-12（第三次）两处细节修复

**1. Buying tab(没有 Dealership chip)时,不该显示那条竖分隔线**

你截图指出:Buying tab 下 "New" 前面还有一条竖线,但这个 tab 根本没有
Dealership chip(业务规则:Dealership 只在 Selling+多经销商时出现,
细节见 OfferDashboard/notes.md 的 `effectiveMultiDealer`)——竖线前面
什么都没有,不该画。

这条竖线本来的用途是分隔"多选组"(Dealership/In negotiation/Make
Offer)和"单选组"(New/Received/Sent/Declined),不是专门为 Dealership
一个 chip 画的。桌面版 In negotiation/Make Offer 永远会渲染,多选组
不会是空的,所以桌面版这条线应该恒定显示,不能简单改成
`v-if="isMultiDealer"`(那样会连桌面版单经销商账号时也一起错误隐藏)。
改成 `v-if="isMultiDealer || !mobile"`——桌面版这个条件永远为真(不受
影响),mobile 版只有 Dealership chip 真的显示时才为真。

**2. "Clear" 盖住底下 chip 时,chip 的圆角边框会从上下露出一点**

你要求"clear 底部可以有个白色过渡遮盖,这样就看不到 clear 底下 chip
filter 的上下线条"。排查发现:被盖住的 chip 是 32px 高,但 `Clear`
自己的高度只是靠 `padding:6px` + 行高撑出来的 26px,矮了6px,所以
chip 圆角边框的上下边缘各露出一点(截图里 "Clear" 左边那个 "[" 形状
的缺口)。改成显式 `height:32px` + `display:inline-flex;align-items:
center`,让 `Clear` 的白色背景刚好盖满整个 chip 的高度,不多不少。

浏览器实测:Buying tab 下 "New" 前面不再有多余的竖线,Selling tab
下(有 Dealership chip)这条线正常显示;桌面版(不管 Buying/Selling)
竖线一直都在,不受影响;选中筛选项后 "Clear" 完整盖住底下 chip,再也
看不到圆角边框上下露出的痕迹;无 console 报错。
