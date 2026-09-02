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
