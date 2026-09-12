# StatusChip — Notes

## 2026-08 按你给的 "Offer card — content & interaction spec" 新增 Expired 状态
你的文档明确"States 一共有5个,不能自己发明其他状态":New/Received/Sent/
Declined/**Expired**(超时关闭,没有人 decline)。之前组件只有前4个,补上
了 `status="expired"`(灰底 #E0E0E0,深灰字 #55575C,圆角4px)。这个配色
**不是 Figma 核实数值**——Figma 里没有找到 Expired 对应的 chip 实例,是
照你规范里"grey fill, dark grey text"的文字描述,参考已有的灰色系
(Sent 的 #E0E0E0/#212121)估的一个更浅的深灰,待你确认真实设计稿数值。
文档里同时说明 Declined 和 Expired 互斥(同一时间只显示一个),New 只能
和 Received/Declined 搭配,不会和 Sent 一起出现——这些规则在
`fragments/OfferCard` 里通过 `dealState`/`isNew` 两个 prop 的组合方式
强制保证,不会出现非法组合,细节见 OfferCard 自己的 notes.md。

## 这个组件是什么,不是什么
- **是**:表格 **Update 列**的更新事件徽标(比如同一行同时显示 New +
  Received)。
- **不是**:筛选行的 `FilterChipGroup`(还没做,是另一个独立组件)。两者
  视觉上都是"chip 样式",容易搞混,但出现位置、数据来源、业务含义都不同,
  不要合并成一个组件。

## 一次重要的更正(2026-08)
早期版本里我把 "Counter Received"(node `6837:16250`)和 "Counter Sent"
(node `6837:16251`)也列为已核实状态,依据是"能在 Figma 里查到真实颜色
数值"。**这个判断标准不完整** —— 这两个 node 在 Figma 元数据里都标记为
`hidden="true"`,意味着它们是这个组件插槽里当前**不渲染显示**的变体,
通常代表设计师保留的旧版本或未启用的状态,不能等同于"当前有效的设计"。

结论:**只有 `hidden="false"`(实际渲染可见)的实例才算已核实**,哪怕
`hidden="true"` 的实例也能查到具体颜色数值。

## 已核实(hidden=false,实际可见)
| 状态 | Figma node id | 背景 | 文字 | 圆角 | 有无 icon |
|---|---|---|---|---|---|
| New | 7487:41460(原 6837:16247) | #F4FFF6 | #006C4C | 4px | 有 |
| Received | 7487:41462(原 6837:16249) | #F0F8FF | #0061A5 | 4px | 无 |
| Sent | 7487:62990 | #E0E0E0 | #212121 | **3px** | 无 |
| Declined | 7487:62983 | #FFEFBF | #402D00 | 4px | 无 |
| 溢出徽标 "+N" | 6837:16248 | #E0E0E0 | #212121 | 3px | 无 |

## 2026-08 新增 Sent / Declined,并更正 New/Received 的圆角
你给了 Frame 630266091(node `7487:62998`,hidden=false)里 New/Received/
Sent/Declined 四个 chip 的完整实例,对应筛选行 New/Received/Sent/
Declined 四个 filter chip 的状态。核实结果:
- **Sent**(7487:62990)背景 #E0E0E0、文字 #212121,和"溢出徽标"颜色
  一样,但这是**巧合**,不是同一个状态——Sent 是这次新核实的独立状态,
  不要因为颜色一样就合并成同一个 class。
- **Declined**(7487:62983)背景 #FFEFBF、文字 #402D00,之前一直没有
  找到实例,现在已确认。
- 顺带发现 New/Received 这两个 chip 的圆角实际是 **4px**,不是组件里
  之前统一用的 3px(和"溢出徽标"共用的那个值)——已经改成 New/Received/
  Declined 都是 4px,只有 Sent 单独是 3px(Figma 里这几个 chip 圆角本身
  就没统一,不是我写错),溢出徽标继续保持 3px 不变(它来自另一个单独
  核实过的 node 6837:16248,这次没有新数据说要改它)。

## 已移除 / 降级为未确认
- **Counter Received**(6837:16250)、**Counter Sent**(6837:16251)——
  之前误列为已确认,现移除。是否是当前设计里真实存在的 Update 列状态,
  需要你确认。
- **In Negotiation**(6837:16255 / 6837:16309)——这个之前被我当作
  Update 列的一个状态,但根据你上传的"最终样子"截图,"In Negotiation"
  实际出现在 Auction ID 列下方(即 `OfferTypeBadge` 组件的范畴),不属于
  这个组件。这里也一并移除,避免和 `OfferTypeBadge` 里的定义重复冲突。
- **Outbid** —— 依旧没有找到任何实例(hidden 或 visible 都没有),继续
  保持未确认。

## 待你确认
1. Update 列除了 New / Received,还有没有其他真实会出现的状态?如果
   "Counter Received" / "Counter Sent" 确实是 Update 列会用到的状态,
   需要你指出 Figma 里 hidden=false 的对应实例,或者截图确认。
2. 新增的 Sent / Declined 这两个状态,目前只在这个独立的 Chips/Status
   组件(order 32)里核实过颜色,还没有实际用到 Update 列的表格行数据
   (OfferTableRow 的 mock 目前只有 statusNew/statusReceived 两个字段),
   如果你想让某些行的 Update 列也显示 Sent/Declined,需要告诉我。

## 2026-09-11 Playground 页面改成"所有状态同时展示"

跟 Image Badge 这次改的做法一样,你要求把 Status Chip 也做成"所有状态
同时展示,上方标名称"的页面,不要再靠 Controls 面板一个个切换 status 才
能看到。新增 `StatusChipGallery.vue`(照抄 `ImageBadgeGallery`/
`OfferCardGallery` 已经用过的"摆放+打标签"模式),把 6 个单独状态
(New/Received/Sent/Declined/Expired/+N 溢出徽标)一次性铺出来,数值原样
抄之前 Playground 页面的 6 个 Mock examples,没有重新编。

额外加了一个"Stacked (table cell example)"——New + Received 叠加显示
在同一个格子里的场景,抄自 `mock.js` 里原本就有的 `stackedExample`(对应
真实表格 Update 列会同时出现两个 chip 的情况)。这个示例之前只存在
`mock.js` 文件里,从来没有在 Playground 页面上展示过,这次一起加进来。
叠加时的间距(`gap:4px`)照抄 `OfferTableRow.vue` 里
`.offer-table-row__status-pills` 已经用的同一个数值,不是新定的。

`controls.js`/`mock.js` 两个文件不再对应实际展示逻辑,已删除(内容并入
上面这条记录和新组件里)。`StatusChip.vue` 组件本身、以及
`OfferTableRow`/`OfferCard` 等真实用到它的地方都没有改动,这次改动只
影响 Playground 展示层。

浏览器实测:Status Chip 页面 Controls 面板不再有 status/label/showIcon
三个控件,Mock examples 按钮行也消失了;舞台里 6 个单独状态 + 1 个叠加
示例同时显示,每个上方都有对应名称;无 console 报错。

## 2026-09-11（第二次）更正:New 不该带星星图标

上面新加的 Gallery 里 "New" 那个单独示例照抄了旧 Mock examples 的
`showIcon: true`,结果星星图标又出现了——你指出这个问题"说了很多遍了"。

查了一下:`showIcon` 是 `StatusChip.vue` 自己 prop 的默认值(`default:
true`),但**整个项目里真实用到 New 这个状态的地方,没有一处用过这个
默认值**——`OfferTableRow.vue`(表格 Update 列)和 `OfferCard.vue`
(卡片视图)全部都是显式传 `show-icon="false"`,这条约定已经在
[OfferTableRow/notes.md](../OfferTableRow/notes.md)("2026-08 你指出:
Update 列的 New chip 不应该有星星图标")和
[OfferCard/notes.md](../OfferCard/notes.md) 里记录过。这次新建 Gallery
时只是照抄了旧 Mock examples 的数值,没有对照这条已经反复确认过的真实
约定,属于我的疏漏,不是你的要求变了。

已把 Gallery 里 New 的 `showIcon` 改成 `false`,和项目里所有真实用法保持
一致。**以后任何地方渲染 New 状态的 StatusChip,都不要用组件自己的
`showIcon` 默认值,必须显式传 `false`**——这条规则已经出现过不止一次,
记在这里避免再错。
