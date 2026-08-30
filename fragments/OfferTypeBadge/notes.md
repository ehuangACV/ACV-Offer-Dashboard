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

