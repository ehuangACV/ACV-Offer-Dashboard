# OfferTypeBadge — Notes

## 和 StatusChip 的区别
- **StatusChip**(见 `fragments/StatusChip/`):出现在表格 **Update 列**,表示
  这条 offer 收到的"更新事件"(New / Received / ...),同一格可以叠加多个。
- **OfferTypeBadge**(本组件):出现在 **Dealer Name / Auction ID 列**下方,
  表示这条 offer 当前所处的**阶段/类型**,每行只有一个,不叠加。

两者视觉上都用了 Figma 的 `Chips / Status` 组件家族,但业务含义和出现位置
不同,所以拆成两个独立组件,避免 controls 面板混在一起搞不清楚该选哪个。

## 已核实(均为 hidden=false,实际渲染可见)
| 状态 | Figma node id | 背景 | 文字 | 边框 |
|---|---|---|---|---|
| In Negotiation | 6837:16255 / 6837:16309 | #1C1D1F | #FFFFFF | 白色 1px |
| Make Offer | 芯片 6837:16275,边框来自包裹框 6837:16269 | #FFFFFF | #0E0E0F | #8D9199 1px(见下方更正记录) |

## 更正记录一(2026-08)
早期版本里 "Make Offer" 是我根据截图目测猜的占位样式(白底+虚线边框+
`#212121` 文字),不是从 Figma 真实实例核实的数据。之后用 hidden=false
的实例 `6837:16275` 替换为真实数值。

同时复核了 "In Negotiation" 的两个来源节点(6837:16255、6837:16309)—
两者都是 `hidden="false"`,且位置都落在 Auction ID 列范围内,不是 Update
列的 status pills 插槽,确认放在这个组件里是对的,不需要挪到 StatusChip。

## 复核记录(2026-08,你提出圆角/居中问题后)
你给了新参照节点 6837:16706(另一个 "In Negotiation" chip 实例),说圆角
不对、需要居中。重新核实了 6837:16706 和 6837:16269/6837:16275
(Make Offer),两处圆角都返回 `rounded-[3px]`,和代码里已有的
`border-radius: 3px` 一致,没有需要改的圆角数值——但 6837:16706 的类名
里确实有 `justify-center`,之前漏了,已经补上 `justify-content: center`
(以及 `box-sizing: border-box`)。如果这样之后圆角看起来还是不对,数据
层面两次独立核实都是 3px,需要你发一张实际渲染出来的截图才能继续排查。

## 2026-08 你直接指定覆盖:圆角改成 4px
你发了截图说圆角看不出来,直接要求"圆角 4"。3px 在这个尺寸的 chip 上确实
非常微妙,肉眼很容易看成直角。这不是 Figma 数据的问题(两次独立核实都是
3px),是你直接给的数值覆盖,已经改成 `border-radius: 4px`,不再是
Figma 核实的 3px——这是你的明确指示,不是我又查到了新的 Figma 数值。
StatusChip(order 32)用的是同一套 "Chips / Status" 组件家族,目前还是
Figma 核实的 3px,没有跟着改,如果你想两者保持一致也改成 4px,请告诉我。

## 更正记录二(2026-08,做 OfferTableRow 时发现)
上一次更正只单独查询了 `6837:16275` 这一个节点,当时得出"没有边框"的
结论。做 OfferTableRow(order 31)时,连着完整表格行一起核实第二行数据,
发现 `6837:16275` 在真实使用场景里(表格第二行 Dealer 列,node
6837:16264)被包在父节点 `6837:16269`("status pills" 包裹框,同样
hidden=false)里,这个包裹框本身带边框:1px 色
`var(--border/strong,#8d9199)`,圆角 3px。也就是说"没有边框"这个结论
是错的——单独查询子节点会漏掉父节点上加的边框,现已更正为**边框
#8D9199**。这也提醒了一个通用教训:核实一个 chip/badge 的样式时,不能
只看它自己的节点,还要看它在真实使用场景里的父节点有没有额外叠加样式。

## 2026-09-09 按你的要求去掉 Make Offer 的边框

上面"更正记录二"核实出来的 `#8D9199` 边框虽然是真实核实过的 Figma 数值,
但你现在明确要求"去掉stroke for make offer badge"——这是你直接给的新
指示,推翻了之前核实过的数值,不是我又发现了新的 Figma 数据或者之前
核实错了。

`.offer-type-badge--make-offer` 删掉 `border` 那一行,`padding` 从共用
基础样式的 `4px 6px` 改成单独覆盖的 `5px 6px`(上下各加1px,补偿去掉的
1px边框,总高度还是 22px,不会因为去掉边框比 In Negotiation 矮2px)。
In Negotiation 的白色边框没有动,你只提到 Make Offer。

同一条边框在卡片视图的 `ImageBadge.vue`(`.image-badge--make-offer`)
里也一起去掉了,因为两处数值本来就是特意保持一致的("和表格版本完全
一致",见 `OfferCard.vue` 的 source_of_truth),细节见
[ImageBadge/notes.md](../ImageBadge/notes.md)。

## 2026-09-09（第二次）改动范围搞错了，边框加回来

你反馈上一条理解错了——你原来只是想去掉**Card**上 Make Offer 徽标的
边框，表格（这个组件）应该保留原来核实过的边框，跟之前一样。

`.offer-type-badge--make-offer` 的 `border: 1px solid #8D9199` 加回来
了，`padding` 改回共用基础样式的 `4px 6px`（不再需要单独覆盖成
`5px 6px` 补偿边框，因为边框本身就补回来了）。

Card 那边（`ImageBadge.vue`）这次没有跟着改回去——两个组件不再假设
"数值特意保持一致"，卡片继续保持无边框，是你明确要的两种不同效果，
细节和为什么两处现在可以不一样（`ImageBadge` 新增了
`strokeMakeOffer` prop 来区分)见
[ImageBadge/notes.md](../ImageBadge/notes.md)。

浏览器实测：表格 Dealer 列的 Make Offer 徽标边框 `#8D9199`、
padding `4px 6px`，无 console 报错。

## 2026-09-11 Playground 页面改成"所有变体同时展示"

跟 Image Badge/Status Chip 这次改的做法一样，你要求把 Offer Type Badge
也做成"所有变体同时展示，上方标名称"的页面，不要再靠 Controls 面板切换
type 才能看到。新增 `OfferTypeBadgeGallery.vue`（照抄
`ImageBadgeGallery`/`StatusChipGallery` 已经用过的"摆放+打标签"模式），
把 In Negotiation / Make Offer 两个变体一次性铺出来，数值原样抄之前
Playground 页面的 2 个 Mock examples，没有重新编。

`controls.js`/`mock.js` 两个文件不再对应实际展示逻辑，已删除。
`OfferTypeBadge.vue` 本身、以及 `OfferTableRow`/`OfferTableHeader`/
`InformationDialog`（Type guide 说明弹层里的插图）等真实用到它的地方都
没有改动，这次改动只影响 Playground 展示层。

浏览器实测：Offer Type Badge 页面 Controls 面板不再有 type/label 两个
控件，Mock examples 按钮行也消失了；舞台里 2 个变体同时显示，每个上方
都有对应名称；无 console 报错。
