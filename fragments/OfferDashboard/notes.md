# OfferDashboard — Notes

## 2026-09-03(第三次)Buying/Selling 各扩到15行,补齐全部状态组合
你要求"Vehicles shown on Buying/Selling 各增加到15个",并且要求新增的
mockup 数据要把所有状态都用上。问你新车图怎么处理(assets/vehicle-
photos/ 只剩2张没用过,补满30行还差18张左右)后,你选了"复用现有12张
真实照片"——这次新增的20行(10 Buying + 10 Selling)车图全部复用这12张
已有真实照片,每张最多复用3次(换年份/里程/VIN/dealer,当作"同款车的
另一台"),12张照片在30行里全部至少用过一次。

具体新增了哪20行、每行的 Number rules 合规细节,写在
[OfferTableRow/mock.js](../OfferTableRow/mock.js) 文件头 2026-09-03 那段
注释里,这里只记这一层(OfferDashboard)改了什么:
- `rows` 数组从 10 条扩到 30 条——前 5 条(原 Buying)+ 新增 10 条 Buying
  = 前 15 条;接着原 5 条(原 Selling)+ 新增 10 条 Selling = 后 15 条。
  原有 10 行的相对顺序/位置完全不变,新增的都接在各自那一半的后面。
- `buyingRows = rows.slice(0, 15)`、`sellingRows = rows.slice(15, 30)`
  (原来是 `slice(0,5)`/`slice(5,10)`)。
- `buyingVehicleCount`/`sellingVehicleCount` 两个 prop 的默认值从 5 改成
  15,Controls 面板对应的 number 输入框 `max` 从 5 改成 15——不改这个
  上限的话,即使 `rows` 数据本身扩到 30 条,Controls 面板也没法真的把
  截取数量拖到 15,新增的行会一直被截掉看不到。

状态覆盖(Update 列实际会显示的三种 dealState:received/sent/
declined——表格没有 expired 这个概念,只在 OfferCard 演示过):
- **Buying(买家视角)15行**:In Negotiation 的 received/sent/declined
  三种都有(且 received/declined 各有 New 开/关的例子),Make Offer 的
  sent/declined 两种都有(买家在 Make Offer 上永远不会 received,因为
  卖家在 Make Offer 上不会 counter)。
- **Selling(卖家视角)15行**:In Negotiation 的 received/sent/declined
  三种都有,Make Offer 的 received/declined 两种都有(卖家在 Make
  Offer 上永远不会 sent,同理)。之前 Selling 侧一行 declined 都没有
  ——这次补上了,不影响 [FilterChipGroup](../FilterChipGroup/notes.md)
  "Selling tab 不显示 Declined 筛选 chip"这条你更早给的规则(那条规则
  只是不给筛选入口,不代表 Update 列不该显示 Declined 这个真实会发生
  的结局)。

## 2026-09-03(第二次)Sent/Received/New 三个 filter chip 也是同一类 bug
你截图指出:Selling tab 同时选中 "Make Offer (2)" + "Sent (3)",结果却是
"No vehicles match the current filters"——"显示 sent 3 个，具体 filter
的内容是空的"，要求"仔细检查 buying and selling filter chip 的显示和
对应的 filter 内容有没有逻辑上的问题"。

逐行核对 `OfferTableRow/mock.js` 之后,发现不只是 Sent+Make Offer 这一个
组合凑巧显示空,是 Sent/Received/New 三个 chip 的计数和匹配逻辑本身各自
都有和上一条 Declined 同一类的 bug——都是"用了一个看起来相关、但实际上
和 Update 列真正显示的状态脱节的原始字段/启发式判断":

- **Sent**:之前判断 `sentAmount 存在(非'--')`,不是真正驱动 Update 列
  显示的 `statusSent` 字段。Selling 的 `rowToyotaMatrix` 就是反例:
  `sentAmount:'$5,200'`(有数字)但 `statusSent:false`,Update 列显示的
  其实是 "Received"。这也是截图里那个诡异现象的根: "Sent (3)" 本身就
  多算了(把这行也算进去了),叠加 "Make Offer" 一起选,真正同时满足
  "make-offer 类型 且 dealState 真的是 sent" 的行数是 0——两个问题叠在
  一起,看起来比单独一个问题更离奇。
- **Received**:之前判断 `row.statusReceived` 这个字段,但 Update 列的
  `dealState`(`rowToDealState()`,和 `OfferTableRow.vue` 自己的
  `dealState` computed 同一套优先级)根本不看这个字段——没有
  declined/sent 时默认就是 'received',不管 `statusReceived` 写的是
  true 还是 false。`rowWithNoStatusChip`/`rowDodgeCharger` 的
  `statusReceived` 都是 `false`,但 Update 列因为 statusDeclined/
  statusSent 都是 false,显示的正是 "Received"——之前的写法会把这些行
  排除在 "Received" 筛选结果外,尽管它们在 Update 列上明明显示着
  Received。
- **New**:之前只判断原始 `row.statusNew`,漏了两层规则:(1) New 从不
  和 `dealState==='sent'` 一起出现(`rowChevyMalibu`/`rowFordEscapeSE`
  都是 `statusNew:true` 但 dealState 是 'sent',Update 列根本不会渲染
  New,这条规则 `OfferCard`/`OfferTableRow` 自己的 `showNewChip`
  computed 里一直都有,这里没跟着用);(2) 有没有被"看过"
  (`isRowNew()`,和 sidebar/Buying-Selling 数字用的是同一个函数)——之前
  看过的行,sidebar 数字会跟着减少,这个 filter chip 却继续把它算进
  New、筛选也筛得出来。

改法:在 `isRowNew` 旁边新增两个共享 helper——
`rowToDealState(row)`(declined 优先、再 sent、默认 received,原来只在
`rowsAsCards` 那边单独定义,这次挪到更靠前的位置,给 `filters`/
`matchesFilters` 也用,不再各自维护一份判断)和
`rowShowsNew(row)`(= `isRowNew(row) && dealState 是 received 或
declined`)。`filters` computed 的四个 count 和 `matchesFilters` 的四个
single 分支(New/Received/Sent/Declined)统一改成调用这两个函数,保证
"chip 上写的数字"和"点开筛出来的内容"永远用同一套判断算出来,不会再有
数字和内容对不上的情况。

## 2026-09-03 修了一个真实 bug:Declined filter chip 一直是 disabled
你反馈:"table and tile view 里有这个 declined 2022 lexus car,但是你
filter 的 declined 显示 inactive。只有没有对应的 deal 才应该显示
inactive filter chip"。

根因:`filters` computed 里 `declinedCount` 之前是硬编码的 `0`(见
METADATA 里 2026-08 那条"declinedCount 目前没有对应字段可统计,固定给
0"的历史记录——当时这条记录本身就是错的,`row.statusDeclined` 这个字段
其实从一开始就存在,`rowToDealState()` 一直在用它判断 declined 状态,
table/card 也确实会显示 Declined 的行,只是这里的筛选/计数逻辑没跟着用
这个已有字段)。`matchesFilters(row)` 里 `single === 'declined'` 分支也
写死 `return false`,选中这个 chip 必然筛出空列表。
[FilterChipGroup](../FilterChipGroup/notes.md) 的 Declined chip 本身是
"`declinedCount === 0` 就 disabled"的逻辑,`declinedCount` 永远是 0,
chip 也就永远灰掉,和实际有没有 declined 的行完全没关系。

改法:
- `declinedCount` 改成 `dealerFilteredRows.value.filter((r) =>
  r.statusDeclined).length`,和 newCount/receivedCount/sentCount 是同一
  个套路。
- `matchesFilters` 里 `if (single === 'declined') return false` 改成
  `if (single === 'declined' && !row.statusDeclined) return false`,和
  new/received/sent 三个 single 筛选保持一致的写法。

## 2026-09-02(第四次)新增 Dialog 两侧 Previous/Next 的跨行导航
对照 Figma node 7597:112866,[InformationDialog](../InformationDialog/notes.md)
新增了两侧的 Previous/Next 按钮 + `hasPrev`/`hasNext`/`prev`/`next` 这套
接口,[OfferCard](../OfferCard/notes.md)/[OfferTableRow](../OfferTableRow/notes.md)
把这套接口原样转发成自己的 `hasPrevDeal`/`hasNextDeal`/`prev-deal`/
`next-deal`。真正"这是列表里第几个""点了切到哪一条"的逻辑只能在这里
算——这是唯一同时知道"当前可见列表"(`rowsWithDealerMode`/`rowsAsCards`)
和"每一行/张卡自己的 dialog 开关"的地方。

- "根据是否有其他 deal 决定要不要显示"拆成两个独立方向:
  `hasPrevDeal="i > 0"`、`hasNextDeal="i < 列表长度 - 1"`——排第一个时
  没有 Previous、排最后一个时没有 Next,不是"有列表就两个都显示、没
  列表就都不显示"。这是我按 UX best practice 做的判断,不是 Figma
  或你直接给的规则,常见 lightbox/邮件详情页的上一条下一条都是这么做的。
- `OfferTableRow.vue`/`OfferCard.vue` 用 `defineExpose({ openDialog,
  closeDialog })` 露出两个方法(它们自己的 `dialogOpen` ref 本身没有
  暴露给外面)。这边用 v-for 里的函数式 ref(`:ref="(el) =>
  setTableRowRef(el, i)"`)把每个实例按当前渲染下标存进
  `tableRowRefs`/`cardRefs` 两个数组——用函数式而不是普通字符串 ref,
  是因为这两个列表长度会随筛选/搜索变化,函数式写法能在每次重新渲染时
  把数组内容跟着刷新,不会留着筛选前的旧实例。
- 点 Previous/Next 的处理是"关掉当前这一行的对话框 → `nextTick` →
  打开相邻那一行的对话框"(`handleTablePrev`/`handleTableNext`/
  `handleCardPrev`/`handleCardNext`),不是"同一个对话框直接换内容"——
  后者需要把 `dialogOpen` 这个状态整个提到这一层,牵动面更大;"关了再开"
  这个方案改动范围只在这三个文件内,效果上使用者感觉不到明显差异(两次
  开关动画几乎连续播放)。

## 2026-09-02(第三次)新增 cardBadgeStyle,透传 In Negotiation 徽标样式
PM 反馈 In Negotiation 徽标不够明显,在 Playground 里出过两个概念稿后你
选定了"Ring"(深色底+白色描边+投影),已经加进
[OfferCard](../OfferCard/notes.md) 的真实 `badgeStyle` prop。这里新增
`cardBadgeStyle` prop(默认 `'default'`),和 `cardVersion` 一样只透传给
`rowsAsCards` 里每一张 tile 视图的 `OfferCard`,Controls 面板新增了对应
的 "In Negotiation badge style" 分段控件。table 视图(`OfferTableRow`)
没有改动。

## 2026-09-02(第二次)把工具条抽成独立组件 ResultsToolbar
你给了 tile 视图("Viewing 5 results" + 切换按钮)和 table 视图
("🔑 Private Lane" + Pagination + 切换按钮)两张截图,指出这条工具条
应该做成"同一个组件的两个 view",不是分开各写一次。新建了
[ResultsToolbar](../ResultsToolbar/notes.md)(名字是按你的要求自己起的,
"你看叫什么合适"),纯粹搬迁原来 `.offer-dashboard__table-top` 那整块
markup/CSS,没有改动任何数值/行为:
- `viewMode` 从"组件内部按钮直接改的本地 ref"变成标准的
  `v-model:view-mode` 双向绑定——`OfferDashboard.vue` 这边的 `viewMode`
  ref 完全没变,只是现在通过 `<ResultsToolbar v-model:view-mode=
  "viewMode" .../>` 接,组件内部点按钮改成 `emit('update:viewMode', ...)`。
- `resultsCount`/`hasPrevPage`/`hasNextPage` 对应 tile 的 "Viewing N
  results" 数字和 table 顶部 Pagination 的两个箭头状态,直接从
  `visibleRows.length`/`topPagination` 传过去,和抽出来之前的数值来源
  完全一样。
- 原来这一块的 CSS 注释(76px 固定行高的推导过程、Figma 核实记录)整段
  搬到了 `ResultsToolbar.vue` 自己的样式注释里,这个文件只留一句指向性
  说明,不重复贴一遍。

## 2026-09-02 新增 viewerRole 传给 OfferTableRow(配合它新增的 hover CTA)
`OfferTableRow` 这次按 Figma node 1:21166 新增了 hover CTA + 自己的
`InformationDialog`(细节见 [OfferTableRow/notes.md](../OfferTableRow/notes.md)),
和 `rowsAsCards`(tile 视图用)一样需要知道当前是 Buying 还是 Selling
tab(按钮组的内容 buyer/seller 不一样)。把原来写在 `rowsAsCards` 内部的
`const role = activeMainTab.value === 'selling' ? 'seller' : 'buyer'`
提到外面变成共享的 `viewerRoleValue` computed,`rowsWithDealerMode`(喂给
`<OfferTableRow>` 的那份)和 `rowsAsCards` 现在用的是同一个值——table 和
tile 是同一笔 deal 的两种展示方式,不能各算各的 viewerRole。

## 2026-09-01(第三次)修复真实bug:全屏状态下点 Reset 不会真正回到自动贴合宽度
你截图指出全屏时 Controls 面板还在盖住右侧卡片内容(卷动条+卡片被裁切),
并重申了之前说过的规则:面板出现时应该自动贴合宽度,除非手动拖过
screenWidth 滑块;拖过之后可以出现盖住的情况;但点 "Reset dashboard" 之后
screenWidth 也要跟着回到自动贴合、不再盖住内容。

根因:`syncScreenWidthToStage()`(Harness 里负责"重新量 .pg-stage 真实
可用宽度、把 screenWidth 滑块拨过去"的函数)的判断条件里,一直有一句
`if (fullscreenOpen.value || ...) return;`——只要还处于全屏状态(不只是
刚点击全屏按钮那一瞬间),这个函数就直接什么都不做。这导致在全屏状态下
点 Reset dashboard、拖动侧边栏/Controls 面板开合、缩放窗口,都不会真的
重新贴合宽度——Reset 之后 screenWidth 只会回到写死的 default 值
(1422px),如果这个默认值比全屏视口实际可用宽度还宽,面板依然会盖住
内容,只是盖住的程度比手动拖到更大数值时轻一点,看起来像"没重置干净"。

`fullscreenOpen` 这个guard的本意应该是避免和 `toggleFullscreen()` 自己
那段"刚进/刚出全屏那一瞬间"的宽度测量互相打架(那段逻辑是独立的
setTimeout,不经过这个函数),但错误地把这个条件写成了"只要还在全屏状态
就永久跳过",不只挡住了进出全屏的那一瞬间。已经去掉 `fullscreenOpen.value
||` 这半个条件,只保留 `!screenWidthAuto.value`(你手动拖过滑块)这个
判断——现在全屏状态下 Reset/侧边栏开合/Controls开合/窗口resize 都会正确
重新贴合当前真实可用宽度。用浏览器实测过:全屏→手动拖滑块到1873px(制造
盖住)→点Reset→screenWidth正确回落到当前stage的真实宽度(不再盖住,
`.pg-stage` 的 `scrollWidth`/`clientWidth` 相等,没有横向滚动)。

## 2026-09-01 行数从 12 变成 10(Buying/Selling 从 6+6 变成 5+5)
`OfferTableRow/mock.js` 那次整批重新生成金额时删掉了两行不存在的状态
组合(`rowWithMakeOffer`/`rowFiat500`,原因见该文件自己的
[notes.md](../OfferTableRow/notes.md)),`rows` 数组和 `buyingRows`/
`sellingRows` 的切分点已经同步从 `slice(0,6)`/`slice(6,12)` 改成
`slice(0,5)`/`slice(5,10)`——被删的两行正好一个原本在 Buying、一个原本
在 Selling,所以两边还是各少一个,仍然是干净的 5+5,不需要重新决定哪些
行归哪个 tab。`buyingVehicleCount`/`sellingVehicleCount` 这两个 prop 的
默认值和范围也跟着从 6/1~6 改成 5/1~5。下面几条 2026-08 的历史记录里提到
"12行"/"6+6" 的地方保留原样,当历史记录看,不代表现在还是这个数字。

## 2026-09 修复真实bug:Dashboard 卡片打开的 Dialog 内容对不上
你发截图指出"info dialog上没有显示对应card上的内容,只有pending
offer"。根因:`rowsAsCards` 从一开始就没有把 `reservePrice`/
`acvEstimate`/`reportUrl`/`history` 这四个字段传给 `<OfferCard>`——
`OfferCard` 内部又把它们原样转发给点击 CTA 打开的 `InformationDialog`,
没传等于全部落到 `OfferCard.vue`/`InformationDialog.vue` 自己的默认
占位值(`Highest Bid $20,000` 之类和这一行真实数据毫无关系的数字),
`history` 默认空数组,所以弹窗永远显示"Pending Offer"、没有任何气泡。
现在这四个字段直接从 `row.reservePrice`/`row.acvEstimate`/
`row.reportUrl`/`row.history`(逐行数据,见
[OfferTableRow/notes.md](../OfferTableRow/notes.md))里取,不再是
OfferCard 自己的默认值。

同一批还修了 `InformationDialog.vue` 自己的一个bug(金额区"Highest
Bid"用错了字段,详见 [InformationDialog/notes.md](../InformationDialog/notes.md)),
两个bug加在一起才是"卡片和对话框数字完全对不上"这个现象的完整原因。

## 2026-09 Controls 面板开合应该改变 dashboard 尺寸,不是"盖住"
你截图指出:Controls 面板一直是打开的,dashboard 内容在表格右侧(Update
列)被直接裁掉/挡住,不是整个页面跟着变窄重新排布。

根因:这不是 OfferDashboard 组件本身的问题,是 Playground 外壳
(component-playground.html 里的 Harness)的问题——`screenWidth` 滑块
(模拟屏幕宽度用的)有一个默认值(1422px),Harness 一直照这个数值给
`.pg-stage__resize-frame` 定宽,不管 `.pg-stage` 自己因为 Controls
面板/侧边栏开合实际能用的空间是多少。`.pg-stage` 本身是
`overflow:auto`,宽度不够时只会在内部横向滚动——看起来就是"内容被挡住
了一块",不是"dashboard 自己变窄重排"。

修法(在 Harness 里,不是 OfferDashboard 组件本身的改动):新增一个
"自动贴合宽度"模式(`screenWidthAuto`,默认 true)。只要你没有手动拖过
这个滑块,Controls 面板开合、侧边栏开合、浏览器窗口 resize、切换到这个
组件页面时,都会重新量一下 `.pg-stage` 真实可用宽度,把滑块也跟着拨到
那个值,让 dashboard 用它自己的响应式布局重新排布填满这块空间。一旦你
自己拖过这个滑块(想固定模拟某个屏幕宽度做响应式测试),就不再自动跟着
变了,直到你点"Reset dashboard"或者切换组件页面再切回来。

如果表格本身(很多列)比量到的可用宽度还宽,`.pg-stage` 仍然会出现横向
滚动条——这是预期内的("表格太宽,滚动查看"),和"面板挡住内容"是两种
不同的事,没有要求把表格列本身也做得更紧凑,那是另一个问题。

## 2026-09 tile 视图卡片默认用 v2 内容规则,Dashboard 自己也能切换
按你的要求,`rowsAsCards` 给每张卡片都传 `card-version`,取自新增的
`cardVersion` prop(默认 `'v2'`)——不再像上一版那样把 `'v2'` 直接写死,
现在 Playground 的 Controls 面板里也有一个"Tile view card version"
下拉可以切回 v1 看效果(OfferCard 组件本身默认还是 'v1',不传就不受
影响,只有这个 Dashboard 页面组装默认选了 v2)。v2 是什么、改了什么见
[OfferCard/notes.md](../OfferCard/notes.md),这里不重复。新增的
`counterpartyTimestamp` 字段借用了和 `ownTimestamp` 同一个
`row.updateDate`,是尽力而为的映射,不是逐行核实过的真实业务数据。

这是整页的组装,不是任务清单里 order 10-34 要求的独立"模具"组件,是把
下面这些已经核实过的 fragment 拼在一起,方便先看整体效果:

- [AppHeader](../AppHeader/notes.md)(order 10)
- [Breadcrumb](../Breadcrumb/notes.md)(order 11)
- [SidebarNav](../SidebarNav/notes.md)(order 12)
- [OfferTabs](../OfferTabs/notes.md)(order 20)
- [SearchInput](../SearchInput/notes.md)(order 21)
- [FilterChipGroup](../FilterChipGroup/notes.md)(order 22)
- [OfferTableHeader](../OfferTableHeader/notes.md)(order 30)
- [OfferTableRow](../OfferTableRow/notes.md)(order 31,内部又复用了
  [StatusChip](../StatusChip/notes.md) order 32 和
  [OfferTypeBadge](../OfferTypeBadge/notes.md) order 33)
- [Pagination](../Pagination/notes.md)(order 34)

`DealershipFilterDropdown`(order 23)因为是"点击 Dealership chip 后弹出
的浮层",不在整页的常驻布局里,没有拼进这个组装页面,需要单独在
Playground 里看效果。

## 2026-08 按你的要求新增 controls
之前这个组件没有任何 props/controls。现在加了:
1. **Reset dashboard**(按钮型控件,在 Controls 面板最上方):点击会让
   这个组件重新挂载一次,回到默认状态——Dealership 下拉收起、排序清空,
   子组件(SearchInput 里打的字、FilterChipGroup 的选中态)也一起重置,
   因为它们的状态是各自组件内部维护的,重新挂载就是最干净的"全部重置"。
2. **isMultiDealer**(布尔开关):对照你给的单经销商参照帧
   (`6837:16538`)核实后,这个开关现在统一透传给三处——
   `FilterChipGroup`(不显示 "Dealership" chip)、`OfferTableHeader`
   (第二列标题变 "Auction ID"、无排序)、每一行 `OfferTableRow`(第二列
   主标题直接显示 Auction ID,不显示 Dealer Name)。点击 "Dealership"
   chip 还是会展开 `DealershipFilterDropdown`,但单经销商模式下这颗
   chip 本身已经不显示,相当于双重保险。

[2026-08 已解决,见下方新增章节] DealershipFilterDropdown 展开后的布局
之前是"紧贴筛选行下方往下排",现在已经改成参照真实原型做的真正悬浮
浮层,不再是待确认项。

## 2026-08 新增 tile version(见 `OfferCard` order 40)
`viewMode`('table'/'tile')在表格和卡片网格之间切换,搜索筛选那一行不变。
细节(数据映射、待确认项)记录在组件顶部 METADATA 里,这里不重复。

## 2026-08 12 行 mockup 数据(你给了 10 张新真实车辆照片后)
`rows` 从 3 行扩充到 12 行(前 3 个是已核实的真实行数据,后 9 个是自编
mockup 演示数据,细节见 [OfferTableRow/notes.md](../OfferTableRow/notes.md)
的"2026-08 第二批照片"章节)。这之后 `sidebar.offersCount` /
`tabs.buyingCount` / `filters` 的 5 个数量字段全部改成从 `rows` 动态
`computed` 算出来,不再是之前 Figma 截图核实过的静态数字——这是你在
扩充行数时明确认可的取舍。`tabs.sellingCount` 和这批行数据无关,没有
改动。

## 2026-08 按你的要求:filter chip / Dealership 下拉要真的过滤 table/tile
之前点 chip 只是自己变色,不影响 OfferTableRow/OfferCard 实际显示哪些
数据。现在:
- `FilterChipGroup` 新增 `filter-change` 事件(见其 notes.md),这边用
  `chipFilter` ref 接住。
- `DealershipFilterDropdown` 的 Apply/Reset 都会 emit `apply`(Reset
  emit 空数组),这边用 `dealerFilter` ref 接住,重新打开下拉时通过
  `pre-selected` 把当前状态带回去。
- `visibleRows`(实际渲染到 table/tile 的行)在 vehicleCount 截取之上
  再加一层 `matchesFilters` 过滤:Dealership 是 AND(经销商必须在选中
  名单里);In negotiation/Make Offer 是 OR(两个都能选,命中任一个
  offerType 就算数,这是 Figma 标注里"多选"的自然结果);New/Received/
  Sent 互斥单选,对应行上的字段;Declined 目前没有任何行数据能匹配,
  选中后必然是空列表(是正确结果,不是漏做)。
- [2026-08 已按你的要求更正,下面这条不再成立] FilterChipGroup 上 chip
  自己的数量之前故意没有跟着当前筛选结果联动,一直显示 vehicleCount
  范围内的总数。你指出选了 dealership 之后数量应该跟着筛选结果变,不能
  还是全量数字——已经改成基于 `dealerFilteredRows`(只按 dealerFilter
  narrow,不按 chipFilter 自己 narrow,避免"选中某个chip后其它chip数字
  全变0"的死循环)重新算数量,细节见 `filters` 计算属性旁边的注释。
- 筛选结果为空时,table/tile 下面会显示 "No vehicles match the current
  filters." 提示文字,不是空白一片。

## 2026-08 按你的要求:参照真实原型重做 Dealership 弹层 + 悬浮交互
你给了本地原型 `C:\Users\Einphix\Desktop\My-ACV--Dealer-filter-main\
index.html`,明确说只参照它的 V1 web 版本 dealership filter 部分,其他
大部分(V2/V3/mobile/搜索 chip lane 等)不用管。`DealershipFilterDropdown`
自己的外观改动记录在它的 notes.md 里,这里记录 OfferDashboard 新增的
悬浮/开合交互:
- `FilterChipGroup` 现在 `ref="filterChipGroupRef"`,它内部把
  "Dealership" 按钮的 DOM 节点通过 `defineExpose` 暴露出来
  (`dealershipBtnRef`),这边用 `getBoundingClientRect()` 算出
  `dealerPopoverStyle`(`position:fixed` + `top`/`left`),让浮层真正
  悬浮在按钮下方,不再是紧贴筛选行往下顶开布局的静态面板。
- 点击浮层外部 / 按 Escape 会关闭浮层,滚动或 resize 时如果还开着会
  跟着重新定位——这三个全局监听(`mousedown`/`keydown`/`scroll`+
  `resize`)照抄原型的对应逻辑,在 `onMounted`/`onBeforeUnmount` 里
  挂载/卸载,避免内存泄漏。
- [2026-08 按你的反馈调整] 应用后的摘要**顶替 "Dealership" 按钮本来的
  位置**,不再是筛选行下面另起一行的独立 chip。`dealerChipText` 现在
  通过 `dealer-chip-label` prop 传给 `FilterChipGroup`,由它自己在
  同一个按钮内部切换"默认态/已选态"两种内容(照抄原型 V2 版本
  "chip default ↔ active states" 的做法),细节见
  [FilterChipGroup/notes.md](../FilterChipGroup/notes.md)。点击关闭×
  emit `clear-dealer`,这边直接把 `dealerFilter` 清空,**只清空经销商
  筛选**,不牵连其他 filter chip——这是刻意收窄过原型"全部清空"逻辑的
  范围,因为我们项目没有等价的"搜索框过滤"概念绑在这颗 chip 上。
- 浮层对齐方向从原型的"右对齐"改成了"左对齐"(我们的按钮在筛选行最
  左边,右对齐会超出视口左边界),这是因为布局位置不同做的合理调整。

## 2026-08 按你的要求恢复/新增:"Viewing X out of Y results" + "Private Lane"
把 Pagination 换成 ACV Pagination 时,我一开始把底部的 "Viewing X out
of Y results" 文案换成了 Design System 卡片的 "{start}-{end} of
{total}" 格式,你指出这个文案"还是需要的",已经在 Pagination 组件里
改回原文案+原样式(细节见 [Pagination/notes.md](../Pagination/notes.md))
——这边只是把 `showRange`/`totalCount` 单独传参改回
`show-viewing-text`/`viewing-count`/`total-count` 三个 prop。

同时按你的要求,参照真实原型(`My-ACV--Dealer-filter-main`)表格顶部
meta 行的 "🔑 Private Lane" 标签,加在了顶部分页栏左侧(原来的空
spacer 里),只在 `viewMode==='table'` 时显示。这不是 Figma 核实数据,
钥匙图标是标准 Material Icons "vpn_key" 字形内嵌成的 SVG。

## 2026-08 按你的要求:去掉筛选chip下面的横线 + 重新核实整页垂直间距
对照新节点 `7448:9826`(hidden=false,App Bar 到表格的完整一页)重新量
了从上到下每一段的真实间距,和之前实现的对比:

| 位置 | 之前 | 现在(Figma 核实) |
|---|---|---|
| App Bar → Breadcrumb | 12px | **24px** |
| Breadcrumb → Tabs | 12px | **14px** |
| Tabs → 搜索框 | 16px | **24px** |
| 搜索框视觉底部 → 筛选chip行 | 12px | **16px** |
| 筛选chip行 → Private Lane/Pagination 行 | 16px + 一条 `border-top` 分割线 | **20px 纯留白,没有分割线** |
| Private Lane/Pagination 行 → 表头 | 8px | **16px** |

你说要去掉的那条横线,就是 `.offer-dashboard__table-card` 上加的
`border-top: 1px solid #DCDFE8`——这条线在 Figma 里根本不存在,已删掉,
改成同样效果的 `margin-top: 20px`(纯间距,不画线)。表头区域本身的浅灰
背景(#FAFAFA)会在视觉上形成一条"边界感",但那是背景色对比效果,不是
额外画的分割线。

【2026-08 更正:App Bar → Breadcrumb 从 24px 改成 32px】上表里
"App Bar → Breadcrumb"的 24px 是当时对照 Figma 节点 `7448:9826` 核实
到的真实数值。你后来发截图,用红色标出这段间距,直接要求改成
**32px**——这是你直接给的数值,**不是重新核实 Figma 得到的**,覆盖掉了
上面表里的 24px。`.offer-dashboard__breadcrumb-row` 的 padding-top 已
改成 32px。

## 2026-08 按你的要求:全屏时卡片视图(tile)也要响应式
之前 `.offer-dashboard__card-grid` 是写死的 `repeat(3, 1fr)`。现在改成
`repeat(auto-fit, minmax(320px, 1fr))`(2026-08 最小宽度从 280 改成
320)——间距永远固定 16px 不参与缩放;容器正好 1122px(默认非全屏)时
自己算出来还是 3 列,和之前效果一样;全屏变宽到能塞下 4 个≥320px 列时
(1328px 起)自动变成 4 列,没有写死的断点。没有单独设"最大宽度"上限,
auto-fit 本身是自限的:卡片一旦能再挤出一列 320px+ 就会自动多开一列,
不会无限变宽也不会两端留空白。

## 2026-08 按你的要求:Controls 面板加了 screensize 滑块(只在 Dashboard 出现)
Playground 的 Controls 面板里新增了一个 `screenWidth` 滑块(768~2560px,
默认 1422px),可以直接拖动模拟任意屏幕宽度看响应式效果,不用真的去改
浏览器窗口大小。这个不是传给 OfferDashboard 组件的真实 prop——组件本身
没有、也不需要有这个 prop,纯粹是 Playground 外壳自己的功能,已经在
Harness 里做了处理,不会污染组件的 DOM(没有变成一个奇怪的 attribute)。

点 "Expand to full page" 全屏时,滑块会自动先跳到当前屏幕实际可用宽度
(不是停在默认1422px不动),保持"一点全屏就铺满屏幕"这个之前就有的效果;
进全屏之后你还是可以继续手动拖滑块模拟更窄的屏幕。退出全屏会把滑块还原
回你进全屏前设的值,不影响你平时编辑用的宽度。

这个功能连带用了 CSS Container Query(`container-type:inline-size` 加
`cqw` 单位),不是之前 `vw`(相对浏览器视口)——因为滑块可以在"没有全屏"
的情况下把预览宽度改得比浏览器窗口窄很多,这时用 `vw` 换算出来的响应式
间距会算错(参照物是整个浏览器视口,不是滑块设的宽度),换成 `cqw`
(相对这个滑块控制的容器自己的宽度)之后不管有没有全屏都能正确换算。

【2026-08 按你的要求:sidebar 和右侧内容区之间的间距上限从 60px 调整为
200px】这个响应式间距(`.offer-dashboard__breadcrumb-row`/
`.offer-dashboard__content` 的 `padding-left`,公式见上面)原来封顶在
60px,现在改成 200px,只改了 `clamp()` 里的上限数值,响应式增长的斜率
(0.03)和默认 1422px 时精确对齐原值(16px/276px)这两点都没变。**这个
功能目前只存在于 Playground 自己的 CSS 里,不是真的 OfferDashboard
组件属性**(见上面那条说明,组件本身没有、也不需要有这个响应式行为,
纯粹是 Playground 外壳拿 `screenWidth` 滑块做的可视化演示),所以这次
改动也只改了 `component-playground.html`,`fragments/OfferDashboard/
OfferDashboard.vue` 本身的 `.offer-dashboard__content` 一直是写死的
`padding-left:16px`,不受这次调整影响,没有需要同步修改的地方。

【2026-08 补充:斜率改成屏宽 1900px 时刚好封顶到 200px】上面把封顶值
从 60px 改成 200px 之后,斜率还是原来的 0.03,导致要宽到 7555px 才能
真的摸到 200px 封顶(Playground 的 screenWidth 滑块最大只有 2560px,
根本拖不到),200px 这个封顶在滑块能模拟的范围内实际上看不出来。你要求
"屏宽到 1900px 时正好长到 200px",按这个目标反推斜率:
`(200-16)/(1900-1422) = 184/478 ≈ 0.385`,已经把 `.offer-dashboard__
breadcrumb-row` 和 `.offer-dashboard__content` 两处公式里的斜率从
0.03 改成 0.385,默认 1422px 时的基准值(16px/276px)不变,现在屏宽
1900px 时精确长到 200px(超过 1900px 之后 `clamp()` 继续封顶在
200px,不会再往上长)。同样只改了 `component-playground.html`,真实
组件文件不受影响,原因同上。

【2026-08 再次调整:你说 200px 太宽,改成 110px】封顶值从 200px 改成
110px,"屏宽到 1900px 正好封顶"这个目标不变,按同样方法反推新斜率:
`(110-16)/(1900-1422) = 94/478 ≈ 0.197`,已经把两处公式的斜率从
0.385 改成 0.197,默认 1422px 时的基准值(16px/276px)不变。同样只改了
`component-playground.html`。

【2026-08 第三次调整:你说 110px 还是宽,改成 100px】封顶值从 110px
改成 100px,同样方法反推新斜率:`(100-16)/(1900-1422) = 84/478 ≈
0.1757`,斜率从 0.197 改成 0.1757。同一轮你还要求 sidebar 离左边增加
16px(见下面新的一条),连带把这里的基准值从 276px 改成了 292px,一起
更新。

## 2026-08 按你的要求:sidebar 增加左边距16px
之前 `SidebarNav` 是紧贴 `.offer-dashboard__body` 左边缘的(等于紧贴
整个页面最左边,页面本身没有左侧留白)。已经在
`.offer-dashboard__body :deep(.sidebar-nav)` 这条规则(和上面
`margin-top:-54px` 那条同一处,只是页面组装层的覆盖,不是改
`SidebarNav` 组件本身)上新增 `margin-left:16px`。这个改动连带影响了
两处需要保持对齐的数值:
- `.offer-dashboard__breadcrumb-row` 的 `padding-left` 基准值,从
  276px(=sidebar宽260+间距16)改成 292px(=新增左边距16+260+16),
  否则"My ACV › Offers" breadcrumb 文字的起始 x 坐标会和右移后的主内容
  区错位。
- 上面那条 sidebar↔内容区响应式间距公式里的基准值同样从 276 改成
  292(见上一条)。
两处都是跟着这个新左边距联动算出来的,不是独立核实的数值。

## 2026-08 按你的要求:右侧(不含 sidebar)整体和视口右边缘留 100px
"My ACV › Offers" breadcrumb + Buying/Selling tab + 搜索/筛选 + 表格这
一整块,你要求右侧和视口边缘之间留出 100px 空隙,不改动这一块内部任何
已有的 padding/gap,也不改动 SidebarNav 的宽度或位置。这一整块在 DOM
里实际是**两个分开的 sibling**——`.offer-dashboard__breadcrumb-row`(装
breadcrumb)和 `.offer-dashboard__content`(装 tab/搜索/筛选/表格),
不是共享同一个外层容器,所以给这两条规则分别加了同一个
`margin-right:100px`,视觉效果等同于给它们套一个共同的外层容器再加
margin。两条规则原有的 padding 数值都没有动,`margin-right` 是新增的
独立声明。SidebarNav 完全没有被这次改动涉及。已经在浏览器里量过:两块
各自距离容器右边缘都精确是 100px,且彼此右边缘仍然对齐(没有因为分开
加而错位)。

【2026-08 补充:sidebar↔主内容区最小间距从16px改成48px】上面的响应式
间距公式(`.offer-dashboard__breadcrumb-row`/`.offer-dashboard__content`
的 `padding-left`)之前默认(1422px)是16px,你要求最小值改成48px。已经
把 `clamp()` 的下限和公式里的基准常数一起从16改成48,新斜率
`(100-48)/(1900-1422)=52/478≈0.1088`,"屏宽到1900px正好封顶到100px"
这个规则不变。默认宽度下的间距从16px直接变成48px,不是只在极端宽屏才
生效——这是这次改动和之前几次"调整封顶值"的区别。同样只改了
`component-playground.html`,原因同上(这个响应式行为本来就只存在于
Playground demo 里)。

## 2026-08 按你的要求:Buying/Selling tab 要真的可以点、真的换数据
之前 `OfferTabs` 是纯展示组件,点 Selling 没有任何反应,`tabs.activeTab`
一直写死 'buying'、`sellingCount` 也是写死的 2,和实际行数据完全没关系。
现在:
- `OfferTabs` 新增点击 emit(见其 notes.md),这边用 `activeMainTab` ref
  接住,`handleTabSelect` 切换它。
- 12 条 mock 行按顺序切成 `buyingRows`(前6)/`sellingRows`(后6)——纯粹
  是为了满足"总共12个,buying 6个 selling 6个"这个数量要求做的分组,
  不对应任何 Figma 数据或真实业务规则(没有字段真的标记"这行是在卖还是
  在买")。
- `rowsLimited`(进而 `visibleRows`/`filters`)现在都是基于
  `activeTabRows`(当前选中 tab 对应的那 6 条),不再是原来共享的 12
  条池子。切换 tab 会真的把表格/卡片换成另外 6 条数据。
- [2026-08 已按你的要求进一步拆分] `vehicleCount` 这个 Playground 演示
  用的 control,先是从范围 1~12/默认12 改成 1~6/默认6(因为现在每个 tab
  最多只有 6 条),现在又拆成两个独立的 `buyingVehicleCount`/
  `sellingVehicleCount`,各自范围仍是 1~6——切 tab 时各自记住自己的
  数量,不会因为切换 tab 就互相覆盖对方设的值。

## 2026-08 按你的要求更正:Buying/Selling 红点 + sidebar Offers badge 的含义
之前 `tabs.buyingCount`/`tabs.sellingCount`(tab 旁边的红点数字)和
`sidebar.offersCount`(sidebar "Offers" 旁边的 badge)都是"这个 tab/
当前筛选范围总共有几条"。你指出这些数字应该是"提醒用户还有几个 New
(未处理)的 deal",不是总数。已经改成:
- `tabs.buyingCount` = `buyingRows` 里 `statusNew` 为真的条数。
- `tabs.sellingCount` = `sellingRows` 里 `statusNew` 为真的条数。
- `sidebar.offersCount` = 上面两个加起来(Buying 的 New 数 + Selling 的
  New 数)。
这三个数字统计的是 `buyingRows`/`sellingRows` **全部 6 条**(不受
`buyingVehicleCount`/`sellingVehicleCount` 这两个演示用的截取数量控制
影响)——因为"还有几个新的没处理"这个提醒,不应该因为你在 Playground
里把演示行数调小了就跟着变少,这两件事是独立的。
- 切 tab 不会重置你已经选的 filter chip / dealership 筛选 / 搜索框内容,
  这些筛选条件是独立状态,继续按原样作用在新 tab 的 6 条数据上。

## 2026-08 按你的要求:卡片数量不多时(≤2张)不要撑满整行
之前的 `repeat(auto-fit, minmax(320px, 1fr))` 只有1个1fr单位时会把仅剩
的那一列拉伸铺满整行(见截图,单张卡片撑到了和表格一样宽)。你说数量
不多(比如1、2个)就固定370px宽就好,右边留白是刻意的。已加
`cardGridStyle`:卡片数量≤2时换成 `minmax(320px, 370px)`(不用1fr,
轨道不会被拉伸撑大),数量足够多时还是走原来的1fr不设上限逻辑(全屏时
按比例一起变宽,见上面"全屏时卡片视图也要跟着响应式"那条)。"2"这个
阈值是按你给的截图例子定的,不是Figma核实数据。

## 2026-08 对照节点 7432:69595 核实的三处改动
1. **"My ACV" 旁边的 New 红点**:传给 AppHeader `hasNewOffers` prop 的是
   这里算出来的 `hasAnyNewDeal`(=buyingNewCount+sellingNewCount>0),
   复用已核实的这两个 New 数量。红点
   本身像素数值是照截图估的,不是核实到的精确值,细节见
   [AppHeader/notes.md](../AppHeader/notes.md)。
2. **tile/table 切换 UI**:改成两端全圆角 pill(之前 4px 小圆角方形),
   顺序换成"先 grid(tile)后 list/agenda(table)",对照这个节点里
   active 态在左边 grid 图标上(当前显示的就是卡片视图)。颜色/边框数值
   没变。
3. **卡片区和上方 toolbar 间距改成 16px**:之前 `.offer-dashboard__
   card-grid` 自己的 `padding:16px 0` 顶部部分会和
   `.offer-dashboard__table-top` 的 `padding-bottom:16px` 叠加成 32px。
   删掉了卡片网格顶部这份重复 padding,只留底部,间距变回单一的 16px,
   对上这个节点 "Table" 容器只有一份 `gap-[16px]` 的结构。

## 2026-08 你指出:切换 table/tile 视图时切换按钮位置会跳(第一版修复)
排查发现 `.offer-dashboard__table-top` 是 `align-items:center`——table
视图这一行除了按钮还有 `Pagination` 组件(比按钮本身高),tile 视图这一
行只有一行"Viewing X results"文字(比按钮矮)。两种模式下这一行的实际
高度不一样(实测 table 76px / tile 48px),居中对齐的切换按钮就跟着行高
一起上下移动,看起来像按钮自己在跳。当时的修复是给
`.offer-dashboard__view-toggle` 单独加 `align-self:flex-start`,让按钮
不再跟着行高居中,贴着顶部——**这个方案后来被下面这条要求推翻了**。

## 2026-08 你指出:Private Lane/Pagination/切换按钮三个应该一行横向居中对齐(最终方案)
上面那个 `align-self:flex-start` 修复虽然解决了"按钮跳动",但代价是在
table 视图里,按钮不再和 Private Lane 文字、Pagination 保持同一条居中
基准线了(按钮贴顶,另外两个还是居中,三者错位)。真正的问题不是"要不要
居中",是"这一行的高度本身不该随 table/tile 切换而变化"。已撤回
`align-self:flex-start`,改成直接给 `.offer-dashboard__table-top` 钉死
`min-height:76px` + `box-sizing:border-box`(76px = Pagination 组件
实际高度60px + padding-bottom16px,不是 Figma 核实数值,如果以后
Pagination 组件本身改高度需要回来同步这个值)。这样两种视图模式下这一行
的高度永远一样高(76px),`align-items:center` 可以放心统一对 Private
Lane/Pagination/切换按钮三者生效——横向排成一行、纵向居中对齐,行高不再
随模式切换变化,按钮位置也不会再跳,一次性满足两条要求。

## 2026-08 按 "Offer card — content & interaction spec" 同步调整 rowsAsCards
`OfferCard` 组件按你给的这份规范整体重写了内容模型(详见
[OfferCard/notes.md](../OfferCard/notes.md)),不再吃
statusNew/statusReceived/statusSent/statusDeclined/primaryMessage/
secondaryMessage/buttonVersion/buttonCount 这些 prop。`rowsAsCards`
跟着改成:`viewerRole` 按当前 Buying/Selling tab 决定(Buying=buyer,
Selling=seller),`dealState` 由表格行原有的4个布尔值折算,
`counterpartyAmount`/`ownAmount` 借用已有的
`receivedAmount`/`sentAmount` 字段。**这是尽力而为的字段映射,不是逐行
按这份新规范重新核实过的真实业务数据**——12 行 mock 本来就是自编的
演示数据,这次只是让它们能正确喂给 OfferCard 新的 prop 模型,内容本身
的业务真实性没有变化。已经在 Playground 里实测切换 Buying/Selling tab,
卡片的措辞("Seller countered.../Buyer countered...")和按钮
("Manage Offer"/"Accept $X"等)确实跟着 viewerRole 正确变化。

## 布局本身待你确认
1. Sidebar 和右侧内容区之间要不要一条竖向分隔线——Figma metadata 里
   没有看到对应的 divider 节点,组装页面里没有加。
2. 整页空白区域的背景色没有单独核实过,用了白色。
3. 每个子组件各自的"待确认"项没有在这里重复列出,请分别看各自的
   notes.md。

## 2026-09-02 追加:新增 dialogVersion Controls 切换
按你的要求新增 InformationDialog 的 v1/v2 切换 control(Controls 面板
"Information Dialog version"),同时传给 table 视图(OfferTableRow)和
tile 视图(OfferCard)里各自嵌的 InformationDialog,两种视图切出来的
弹窗版本保持一致。细节(v2 具体改了什么)见
[InformationDialog/notes.md](../InformationDialog/notes.md)。

## 2026-09-02 追加：Selling tab 隐藏 Declined 筛选 chip
按你的要求给 FilterChipGroup 新增了 showDeclined prop，传
`activeMainTab !== 'selling'`——Buying tab 不变（还是原来的行为，包括
declinedCount 目前固定是 0 这个已知限制），Selling tab 不再显示这个
chip。细节见 [FilterChipGroup/notes.md](../FilterChipGroup/notes.md)。

## 2026-09-02 Controls panel cleanup: concise labels, blue switches, reordered Multi-dealer
Per your request, simplified every control label across the whole Playground by dropping the trailing "(propName, ComponentName)" annotations (e.g. "Tile view card version (cardVersion, OfferCard)" -> "Tile view card version") - this only affects component-playground.html's own REGISTRY/GROUPS UI text, not any real component prop names. Boolean toggle switches changed from orange (#F26522) to blue (#2F5BFF, matching the segmented-button active color already used in this Harness). Boolean fields now render label and switch on the same row (label left, switch right) via a new pg-control-field--switch modifier class, applied automatically whenever a control's type is 'boolean' - not just Multi-dealer. On this page specifically, isMultiDealer was moved to right after the reset button (was previously near the bottom of the list) and its label shortened from "Multi-dealer account" to just "Multi-dealer". The .pg-controls__title ("Controls" heading) was left untouched per your instruction; every other control label's font-weight went from 600 to 400 and font-size from 14px to 12px.

## 2026-09-02 新增：Remove From List 二次确认 + 真正的移除逻辑
按你的要求把 Figma 节点 1:31040 做成独立组件 RemoveFromListDialog，接线
到 OfferCard/OfferTableRow 的 "Remove From List" 按钮上（只在
Declined/Expired 状态出现，之前这个按钮和其它 hover 按钮一样统一打开
InformationDialog，现在单独拆出来）。点 "Yes, Remove" 才真的
@remove-from-list 到这一层，按 auctionId（每行唯一）记进新增的
removedAuctionIds 数组，matchesFilters 里过滤掉——不是真的从
rows/mock.js 删数据，是显示层面的过滤，和 dealerFilter/chipFilter 走的
是同一套机制。"Reset dashboard" 按钮本来就是让整个组件重新挂载，
removedAuctionIds 这个本地 ref 会跟着自动清空，不需要单独处理。细节见
[RemoveFromListDialog/notes.md](../RemoveFromListDialog/notes.md)。

## 2026-09-02 追加：table Update 列的状态改成和 card 一致
你发现 table 的 Update 列显示的状态和 card 上不符——原因是 Update 列
之前直接把 statusNew/statusReceived/statusSent/statusDeclined 四个布尔
值各自渲染成一个 StatusChip（同一行数据如果多个布尔值同时为 true，会
同时冒出好几个chip），而 OfferCard 只认 dealState 这一个值（同一时间
只显示一个状态chip）+ isNew。以 card 为准，改成和 OfferCard.vue 完全
一样的 showNewChip/stateChipLabel 计算方式，都是从已有的 dealState
（declined优先，再sent，再默认received）派生，不再让四个布尔值各自
独立展示。细节见 [OfferTableRow.vue](../OfferTableRow/OfferTableRow.vue)
对应 computed 旁边的注释。

## 2026-09-02 新增：看过的deal，New 标记消失
按你的要求：点 VDP 图片链接、或者打开 InformationDialog（hover 按钮，
或用 Previous/Next 切到相邻一行/张），都算"看过"了，New 标记应该
消失，Buying/Selling tab 和 sidebar "Offers" 旁边的数字也要跟着减少。
新增 seenAuctionIds（session 内本地状态，按 auctionId 记，"Reset
dashboard" 会跟着清空，逻辑和 removedAuctionIds 是同一套）+
isRowNew(row) 这个唯一入口（= statusNew 且没被标记"看过"）。
buyingNewCount/sellingNewCount、rowsWithDealerMode 的 statusNew、
rowsAsCards 的 isNew 都改成读 isRowNew()，不再直接读 mock 数据里原始的
statusNew。**没有改**FilterChipGroup 筛选行 New chip 旁边的数字
（newCount）——你只提到 Buying/Selling 和 Offers tab 这两处，筛选行的
数字如果也需要一起联动，请告诉我。

## 2026-09-02 新增：effectiveMultiDealer——Dealership 只在 Selling+多经销商时出现
你反馈：Dealership 筛选 chip 只应该在 Selling tab 且账号是多经销商时
出现，Buying tab 不管账号是单/多经销商都不应该有这个筛选；对应地，
card 上的 dealer/lane 徽标、table 第一列的 Dealer Name 显示也要跟着
调整——Buying 一律不显示 dealer 相关内容。

用你给的 Figma node 6837:16635/16636 核实过：这个"不显示dealership"
的参照帧，表头是"Auction ID"/"Type"、行内容直接显示 Auction ID，和
项目里已经实现的 isMultiDealer=false 那一套视觉完全一样——所以
Buying tab 不是需要单独设计的新样式，是直接复用这套已核实的渲染。

新增 effectiveMultiDealer = isMultiDealer && activeMainTab==='selling'
这个派生值，统一替换掉原来直接传 isMultiDealer 的四个地方：
FilterChipGroup、DealershipFilterDropdown、OfferTableHeader、
rowsWithDealerMode 里每一行的 isMultiDealer 字段。真正的 isMultiDealer
prop（账号本身是不是多经销商）本身没有变，只是这几处消费方不再直接读
它。

rowsAsCards 新增了一个 isMultiDealer 字段（之前没有，OfferCard 本身也
没有这个 prop）——细节见 OfferCard/notes.md。

## 2026-09-08 删掉 cardVersion prop——tile view 只需要 v2

你确认 OfferCard 的 v1（mileage 行版本）已经完全不需要，OfferCard.vue
里的 `cardVersion` prop 被整个删掉了（不再是"版本"这个维度需要
Dashboard 往下透传，细节见 OfferCard/notes.md）。相应地：
- 删掉了 OfferDashboard 自己的 `cardVersion` prop（原来默认 `'v2'`，
  给页面自己也提供一个能切 v1/v2 的 control，现在没有 v1 了，这个
  prop 没有意义了）。
- 删掉了 `rowsAsCards` 里每张卡片对象上的 `cardVersion: props.cardVersion`
  字段（OfferCard 已经不认识这个 prop 了）。
- 删掉了 Playground 里 OfferDashboard 控件面板上的"Tile view card
  version" segmented 控件。
`cardBadgeStyle`（In Negotiation 徽标 ring 样式）是完全独立的一个
prop，这次没有动。

## 2026-09-08 删掉 cardBadgeStyle prop——tile view 徽标只留 Current

你确认 OfferCard 的 In Negotiation 徽标不需要 ring 样式了，只留
default（Current）。OfferCard.vue 里的 `badgeStyle` prop 被整个删掉了
（细节见 OfferCard/notes.md）。相应地：
- 删掉了 OfferDashboard 自己的 `cardBadgeStyle` prop（原来默认
  `'default'`，给页面自己提供一个能切 Current/Ring 的 control，现在
  OfferCard 没有 ring 了，这个 prop 没有意义了）。
- 删掉了 `rowsAsCards` 里每张卡片对象上的 `badgeStyle: props.cardBadgeStyle`
  字段（OfferCard 已经不认识这个 prop 了）。
- 删掉了 Playground 里 OfferDashboard 控件面板上的"In Negotiation badge
  style" segmented 控件,以及 `fragments/OfferDashboard/controls.js`
  里同名的定义。

## 2026-09-08 修复真实bug：Remove From List 之后 filter chip 数字/New 徽标没跟着减少

你反馈:点某个 Declined 的 deal 的 "Remove From List"、确认移除之后,
筛选栏上 "Declined (4)" 这个数字没有变,再点这个 chip 反而变成
"No vehicles match the current filters."——数字和实际内容对不上。

根因:`matchesFilters()`(决定表格/卡片实际显示哪些行)一直有
`if (removedAuctionIds.value.includes(row.auctionId)) return false` 这条
判断,但算 chip 数字的 `dealerFilteredRows` 只按 `dealerFilter` narrow,
没有把已经移除的行也排除掉——两处判断"现在还剩下哪些行"用的基准数据
不一致,不是 `filters` computed 本身的算法写错了。

同一类问题还存在于 `isRowNew()`(Buying/Selling tab 旁边的红点数字、
sidebar "Offers" 的 badge 都靠它算)——移除一条还是 New 状态的 deal 之后
这两处数字也不会跟着减少,一起修了。

改法:
- `dealerFilteredRows` 追加一层 `.filter((r) =>
  !removedAuctionIds.value.includes(r.auctionId))`,让
  negotiationCount/makeOfferCount/newCount/receivedCount/sentCount/
  declinedCount 这六个 chip 数字全部自动跟着同步(它们都是从
  `dealerFilteredRows` 算出来的,改一处全修好,不用逐个改)。
- `isRowNew()` 追加 `&& !removedAuctionIds.value.includes(row.auctionId)`,
  `buyingNewCount`/`sellingNewCount`/`hasAnyNewDeal`/sidebar
  `offersCount` 都靠这个函数算,同样一处改全修好。

## 2026-09-08 修复真实bug：table view 的 Pagination 完全没接上真实翻页

你反馈 table view 上下的 Pagination(Rows per page 下拉 + 上一页/下一页
箭头)点击后没有反应,内容显示和选择也不对应——一页永远显示全部,不管
选 10/20/50/100 哪个。

根因:这两处 Pagination 之前从来没有真的接上任何状态。顶部靠一个写死
的 `topPagination = { hasPrevPage:false, hasNextPage:true }` 常量(点了
也没用,这个对象不会变);底部 `:viewing-count`/`:total-count` 两个都
传 `visibleRows.length`(所以文案永远是"Viewing N out of N",不是真的
"当前页/总数");`rows-per-page`/`prev`/`next` 这三个事件从头到尾都没
被监听过。`ResultsToolbar`(顶部这份 Pagination 的包装层)也只透传了
`hasPrevPage`/`hasNextPage`,没有透传 `rows-per-page`,细节见
`fragments/ResultsToolbar/notes.md` 同名条目。

改法:
- 新增 `rowsPerPage`(默认10)+ `currentTablePage`(默认1)两个 ref。
- `totalTablePages`/`clampedTablePage` 两个 computed——`clampedTablePage`
  在筛选结果变少、`currentTablePage` 还停在一个已经不存在的页码时自动
  夹回最后一页,不需要在每个可能改变筛选结果的地方都手动重置页码
  (下面几处显式重置到第1页,是"换了筛选条件应该从第一页看起"这个更好
  的体验,不是为了防止越界——越界已经靠这个 computed 保底了)。
- `hasPrevTablePage`/`hasNextTablePage`/`tableViewingCount` 三个
  computed,分别喂给两处 Pagination 的箭头禁用状态和"Viewing X out of
  Y"文案(X 现在是"这一页实际显示了几条",Y 是"筛选后总共几条",不再
  是同一个数字)。
- **没有把 `<OfferTableRow v-for="... in rowsWithDealerMode">` 的数据源
  换成分页切片**,而是加了 `v-show="isRowOnCurrentTablePage(i)"` 只隐藏
  不在当前页的行——换数据源会让 `handleTablePrev`/`handleTableNext`
  (InformationDialog 的 Previous/Next,按 `rowsWithDealerMode` 的绝对
  下标算相邻行)算错相邻行,`v-show` 保留了原来的绝对下标,不需要改这
  两个函数。InformationDialog 走 `Teleport` 渲染到 body,不受它所在的
  行是否被 `v-show` 隐藏影响,所以"当前页只显示这一页,但 Previous/
  Next 仍可以跨页切到相邻 deal"这两件事互不冲突。
- 换 tab(`handleTabSelect`)、应用/清空 Dealership 筛选
  (`handleApplyDealerFilter`/`@clear-dealer`)、点筛选 chip
  (`@filter-change`)、点 "Clear"(`handleClearFilters`)这几个会改变
  筛选结果的地方,都加了 `currentTablePage.value = 1`。
- **tile view 没有动**——`rowsAsCards` 还是直接用 `visibleRows`,不受
  上面这套分页影响,按你的要求只改 table view。

## 2026-09-08 修复真实bug：窄屏下 table view 内容乱掉、表头和数据行左对齐不上

你反馈窄屏（截图给的例子是屏幕宽1235px）下 table view 内容全乱了，
而且强调"表头文字要和数据行内容左对齐"这一点很重要，现在完全没对上。

根因（完整分析见 `fragments/OfferTableHeader/notes.md` 同名条目）：
`OfferTableHeader`/`OfferTableRow` 是两个各自独立的 flex 容器，之前每
一列都是 `flex: N 1 Npx`（允许收缩），窄屏时各自按自己内容的最小宽度
收缩——表头的图片格是空 `<div>`，数据行的图片格里有真实64px图片，两边
收缩幅度不一样，越窄越对不上；里程・VIN 这类没做限制的文字被挤到换行，
撑破写死的80px行高，看起来"整个乱了"。另外表头和数据行本来就有几处
历史遗留的像素级数值不一致（图片78px vs 80px，Vehicle 197px vs
195px，Vehicle/Update 两列的左padding也不一致），这些在不收缩时刚好被
其它数值抵消掉，一收缩就暴露出来。

改法：
- `OfferTableHeader.vue`/`OfferTableRow.vue` 每一列的 flex-shrink 全部
  改成0，不再靠挤宽度"适应"窄屏容器，永远保持 Figma 核实过的宽度；
  同时修正了图片/Vehicle 两列的宽度不一致（改成和数据行一样的80px/
  195px）和 Vehicle/Update 两列的左padding不一致（分别补上14px/24px，
  和数据行对齐）。
- 新增 `.offer-dashboard__table-scroll` 容器，只包住表头+数据行这一块
  （不包括上面的 `ResultsToolbar` 和下面的底部 Pagination——这两个本来
  就能正常适应任意宽度，不需要跟着一起滚动），设 `overflow-x:auto`。
  容器比表格的自然宽度（1122px）窄的时候，这一块自己横向滚动，不会再
  把列越挤越小、越挤越错位。
- 用浏览器实测：把 Playground 的"Screen width"滑块调到1238px，逐列用
  `getBoundingClientRect()` 核对表头文字和数据行内容的左边缘，现在7列
  （Dealer/Vehicle/Time/Reserve Price/Sent/Received/Update）全部像素
  级对齐；横向滚动之后所有列依然保持对齐；tile view 不受影响。

## 2026-09-08（第二次）宽屏下又对不齐 + Auction ID 列太宽

上一条修完之后，你反馈把屏幕调宽（比如全屏预览，截图给的是1518px）
之后对齐又出问题了，而且 Auction ID 列的宽度明显太宽（"264578" +
Type 徽标旁边空出一大块）。

根因：上一条只把每一列的 `flex-shrink` 从1改成0，**没有改
`flex-grow`**——grow 还是原来那套"按比例一起变宽"的数值（比如
dealer列grow=200,update列grow=225）。容器比表格自然宽度（1122px）更
宽的时候（宽屏/全屏预览），每一列还是会按各自的grow比例被拉宽,这带来
两个问题：(1) `OfferTableHeader`/`OfferTableRow`是两个独立的flex容器,
拉宽时的浮点比例分配在两边未必能算出完全一致的像素值,列越多、拉得
越宽,误差越容易被看见,又变成"没对齐";(2) 拉宽本身会让本来不需要
200px的Auction-ID-only模式(只有"264578"+Type徽标,最宽的"In
Negotiation"徽标实测92px)显得空得很不自然。

改法：
- 所有列的 `flex-grow` 也改成0(现在是 `flex: 0 0 Npx`,shrink/grow都
  是0)——每一列永远精确等于自己的 basis 像素值,不会再有比例分配和
  浮点误差,天然保证和数据行像素级对齐;宽屏时多出来的空间就留白在
  表格右边,不再拉伸列宽。
- Dealer/Auction ID 这一列的宽度改成按 `isMultiDealer` 切换:
  `isMultiDealer=true`(Dealer Name模式,经销商名可能很长)保持200px
  不变;`isMultiDealer=false`(Auction ID模式,只有ID数字+Type徽标)
  收窄到140px(92px徽标+左右各16px padding=124px,留一点余量)。
  `OfferTableHeader.vue`/`OfferTableRow.vue` 都新增了一个
  `--dealer--wide` 修饰类,`isMultiDealer` 为真时才叠加上去覆盖回
  200px,两个组件的判断条件完全一致(同一个prop),不会出现表头收窄了
  但数据行没收窄的情况。
- 用浏览器实测：Buying tab(isMultiDealer实际生效为false)下8列
  （连photo一起）表头和数据行的left/width现在完全相等；切到Selling+
  Multi-dealer开启后Dealer列正确变回200px、依然对齐；把屏幕宽度从
  800px（触发横向滚动）到1518px（比自然宽度更宽）来回测试，两种情况
  下对齐都成立。

## 2026-09-08（第三次）宽屏下"表格应该自动变宽"这个功能被误删了

上一条为了修对齐,把 grow 也归零了,代价是宽屏下表格不再跟着变宽——但
这其实是你之前明确要过的功能("Dashboard 全屏 presentation 时表格要
跟着变宽",2026-08 就有的既有要求)。你反馈截图（全屏预览，2558px）
下表格没有变宽，退回到固定1122px不动。

真正的根因（这次才想清楚）：`OfferTableHeader`/`OfferTableRow` 是两个
各自独立的 flex 容器，即使两边的 flex-grow/basis 数值完全一样，"该
变宽多少"这个比例分配计算也是各自独立算一次——多数情况下算出来的
浮点像素值凑巧一致，但某些宽度下两边可能会有1px级别的差异，这才是
"改了又改还是偶尔对不齐"的真正原因，不是某个数值没改对。

真正稳妥的解法：把表头+所有数据行改成同一个 CSS Grid 共享列宽——宽度
只由外层 grid 算一次，所有参与这个 grid 的行天然拿到完全一致的列宽，
不可能出现"两边分别算出不同结果"这类问题（这是灵活性和稳定性上比
flex 更适合"多个独立组件需要对齐成表格"这个场景的地方）。

改法：
- 新增 `tableGridColumns` computed，产出 `grid-template-columns` 的值，
  每列写成 `minmax(Npx, Nfr)`——Npx 是 Figma 核实过的自然宽度（窄屏时
  的下限，不够宽靠 `.offer-dashboard__table-scroll` 的 overflow-x:auto
  横向滚动），Nfr 让宽屏时每列按同一个比例一起变宽（还原"全屏铺满"
  这个效果，等价于之前 flex-grow:N 想做的事，只是现在整个 grid 只算
  一次）。Dealer/Auction ID 列的宽度还是按 `effectiveMultiDealer` 在
  140px/200px 之间切换，逻辑不变。
- `.offer-dashboard__table-scroll` 改成 `display:grid`，列宽绑定这个
  computed 算出来的值（`:style="{ gridTemplateColumns: tableGridColumns }"`）。
- `OfferTableHeader.vue`/`OfferTableRow.vue` 各自新增 `gridLayout` prop
  （默认 false，不影响它们各自独立的 Playground 预览页，那边还是原来
  的 flex 布局）——为 true 时把组件自己的根元素改成 `display:contents`
  （细节和为什么这样安全见两个组件各自的 CSS 注释），把它们的 8 个
  `__cell` 直接"交给"外层这个 grid 摆放，不再是各自的 flex 子项。
  `OfferDashboard.vue` 在 table view 给两个组件都传了这个 prop。
- `display:contents` 会让元素自己不再生成盒子，`OfferTableRow.vue` 原来
  画在"整行"这个盒子上的背景色（默认白底+hover变蓝）不会再生效，改成
  同时画在每个 `__cell` 上（细节见该文件 notes.md 同名条目）——用浏览器
  实测确认过 `:hover` 状态本身不依赖盒子，hover 变色/CTA按钮切换这两个
  依赖 `.offer-table-row:hover` 的效果在 grid 模式下都正常工作。
- 用浏览器实测：屏幕宽度调到2558px（超过自然宽度），表格整体跟着变宽
  到2058px，8列（含photo）表头和数据行的 left/width 用
  `getBoundingClientRect()` 核对完全相等；调到800px（触发横向滚动）
  依然完全对齐；Selling+Multi-dealer开启后Dealer列正确变宽到200px且
  对齐；hover 一行确认背景变色、CTA按钮组切换、`:hover` 状态匹配都
  正常；两个组件各自独立的 Playground 预览页（order 30/31，flex 模式）
  渲染不受影响。

## 2026-09-08（第四次）列与列之间要保证至少16px的可见间距

你截图用红色标出了"上一列内容结束"到"下一列内容开始"之间的空白，指出
这段空白应该有一个最小值——宽屏时可以更大（本来就会，因为宽屏下每列
按 fr 比例变宽，文字两侧多出来的留白本来就会跟着变大），但不能比这个
最小值更小。

改法（第一次尝试，已撤销）：给 `.offer-dashboard__table-scroll` 加了
`column-gap: 16px`。这个数值本身（列边界间距16px）量出来是对的，但你
反馈"完全错误，中间不应该有间隔"——column-gap 是 CSS Grid 自带的"列
轨道之间"的真空隙，这段空隙不属于任何一个 cell，表头的灰底
（`#FAFAFA`）、数据行的白底/hover蓝底 都是画在各自 cell 自己身上的，
盖不到 column-gap 这段空隙上，结果就是表头/整行背景被硬生生切成一段
一段、中间露出白缝——这是背景/边框层面的真实缝隙，不是"文字内容之间
看起来更松"，两者是完全不同的效果，用 column-gap 从根上就是选错了
机制，已经撤销（删掉这一行）。

正确方向（你确认为"选项1"）：不引入任何结构性缝隙，而是在真正触发
横向滚动之前，先让每一列自己的左右留白（padding）压缩到16px，尽量
多撑一会儿再滚动。

## 2026-09-08（第五次）实施"选项1"：压缩 Vehicle/Update 两列的留白到16px

梳理清楚之后确认：8列里只有 Vehicle（右padding 35px）和 Update（左
padding 24px）两列的留白比16px更大，其余列本来就已经是左右各16px，
不需要动。跟你确认过"这两处专门加大过的留白要不要跟着压"，你选了
"全部统一压到16px"。

改法（不改变任一列的"内容区宽度",只压缩留白本身，所以不影响文字/
按钮是否能放下）：
- Vehicle 列：右padding 35px→16px，内容区宽度（195-14-35=146px）不变，
  列宽跟着从195px收窄到 146+14(左padding不变)+16=176px。
- Update 列：左padding 24px→16px，内容区宽度（225-24-16=185px）不变，
  列宽跟着从225px收窄到 185+16+16=217px。`OfferTableHeader.vue` 原来
  为了对齐单独覆盖的 `padding-left:24px` 也删掉了——现在和这个组件
  默认的16px左padding一致，不需要再单独覆盖。
- `tableGridColumns` 里这两列的 `minmax()` 数值同步从195/225改成
  176/217，触发横向滚动的临界总宽度从1122px降到1035px（Auction ID
  模式,dealer=140px）——这才是真正让"能多撑一会儿再滚动"生效的地方,
  只改CSS padding不改这个数值的话,滚动临界点是不会变的。
- 用浏览器实测：Vehicle/Update 两列在1400px/2000px两个宽度下表头和
  数据行的 left/width 依然完全相等；"2018 Ford Focus RS" 车辆标题
  `scrollWidth`(146px)等于`clientWidth`(146px),没有被压出裁切;hover
  一行后 Update 列的 CTA 按钮组`scrollWidth`(185px)等于`clientWidth`
  (185px),没有溢出；850px 宽度下横向滚动正常触发,`scrollWidth`量出来
  正好是1035px,和改动前的1062px相比确实收窄了27px。

## 2026-09-08（第六次，诊断错误，已撤销）误判成宽屏场景

你反馈"reserve 和 sent 还有 time remaining 直接间距还是太大"。第一次
诊断猜成"宽屏下每列按比例变宽导致短内容列显得空"，把除 Update 外的7
列全部改成固定像素、只让 Update 用 `minmax(217px, 1fr)` 吸收多余空间。
你指出这个诊断完全错了——你给的截图根本不是宽屏场景，讨论的一直是
屏幕过小、快要触发横向滚动条的场景。已经撤销，`tableGridColumns` 恢复
成每列都用 `minmax(Npx, Nfr)` 的写法。

## 2026-09-08（第七次）真正根因：Reserve 列宽是"ACV Estimate"的历史遗留值

重新核对之后找到真正的根因：Reserve 这一列的 123px 宽度,是这一列
还叫"ACV Estimate"(11个字符)时核实来的历史数值——这个标题后来先改成
"Reserve Price",这次(第四次改动)又缩短成"Reserve"(7个字符),但列宽
从来没有跟着缩短过,一直沿用123px。用浏览器实测过:"Reserve"标题本身
+这一列最长的真实数据(比如"$34,000")需要的宽度只要约85px(53px文字
+16+16padding),123px里有约38px是纯历史遗留的多余空白——这正是
"Time Remaining→Reserve"和"Reserve→Sent"两段视觉间距显得特别大的
真正来源(Time/Sent 两列自己实测已经很紧凑,内容宽度和floor几乎完全
贴合,不需要再压)。

改法：把 Reserve/estimate 列的宽度从123px收窄到90px(85px最小需求+5px
余量)，`tableGridColumns`/`OfferTableHeader.vue`/`OfferTableRow.vue`
三处同步改。用浏览器实测：850px屏幕宽度（触发横向滚动）下，Reserve
列头/数据行的 left/width 完全相等，宽度精确等于90px；"Reserve"标题
和所有金额数据的 `scrollWidth` 都没有超过 `clientWidth`（没有裁切）；
表格自然最小总宽度从1035px降到1002px。

## 2026-09-08（第八次）除 Vehicle/Update 外，其余列再收窄——压缩 padding 而不是砍列宽

你要求"除了vehicle和update这列，所有列宽减少32px"。动手前先用浏览器
量了一遍每列内容实际需要的最小宽度，发现如果真的直接把列宽砍32px，
Reserve/Sent/Received 三列会硬裁切金额和标题（不是留白变少，是文字/
数字真的显示不全，比如"Received"标题会被切掉3个字母）——因为这三列
上一轮（第七次）已经收窄过一次，本来就已经很接近内容最小宽度，再砍
32px必然砍进内容区。

跟你确认后，改成"压缩 padding 而不是砍列宽"：除 Photo（图片格，
64px固定图片，砍了会裁切图片）外，Dealer/Time/Reserve/Sent/Received
这5列的左右 padding 从16px压缩到4px（各减12px，合计24px），列宽跟着
同步减少24px——内容区宽度完全不变，只是压缩纯留白，所以不会裁切任何
文字/数字。Vehicle/Update 两列按你的要求没有动。

具体宽度变化：
- Dealer：Auction ID模式 140→116px，Dealer Name模式 200→176px。
- Time Remaining：124→100px。
- Reserve：90→66px。
- Sent：85→61px。
- Received：90→66px——**用浏览器实测发现这个值会裁切"Received"这个
  标题**（比"Reserve"/"Sent"长3px，`scrollWidth`量出来正好差3px），
  补回3px改成69px，其余4列都没有这个问题。

用浏览器实测：850px屏幕宽度下，8列（含Photo/Vehicle/Update）表头和
数据行的 left/width 全部相等；Dealer/Time/Reserve/Sent/Received 五列
的表头文字、数据行金额/徽标全部检查过 `scrollWidth <= clientWidth`，
没有裁切；切到 Selling+Multi-dealer 模式测了"Asbury Automotive
Group"这个长经销商名——确认这个截断（省略号）不是这次改动引入的
新问题，因为这次是"内容区宽度不变，只压padding"，Dealer Name模式的
内容区从200-16-16=168px 变成176-4-4=168px，完全一样,这个名字本来
在旧版本里也是刚好卡在截断边缘。

## 2026-09-08（第二次改动，非表格宽度相关）Buying/Selling红点、Offers数字改回跟 Vehicles shown 联动

你反馈：把"Vehicles shown on Buying/Selling"改小之后，filter chip的
数字（比如"New (2)"）和 Buying/Selling tab 红点、sidebar Offers 数字
不一致（红点/Offers 还是按全部15行算，chip 已经按截取后的行数算）。

这其实是之前（见更早的"2026-08 按你的要求更正"那条注释）故意做的
设计——tab红点/Offers 数字统计的是全部15行里 New 的数量，不受
Vehicles shown 演示用截取滑块影响，理由是"现实里'还有几个新的没处理'
这个提醒不应该因为在Playground调小演示行数就跟着变少"。你确认现在想
反过来，改成和 filter chip 一致，跟着 Vehicles shown 联动。

改法：新增 `buyingRowsLimited`/`sellingRowsLimited` 两个computed——和
已有的 `rowsLimited` 用的是同一套 `[1, 总行数]` 夹逼截取逻辑，区别是
`rowsLimited` 只算"当前激活的那个tab"，这两个新的是"不管现在在哪个
tab，Buying/Selling 各自按自己的 vehicleCount 截取"（因为 sidebar
Offers 数字 = 两个tab的红点加起来，需要同时知道两侧各自的数字，不能
只知道当前激活的一侧）。`buyingNewCount`/`sellingNewCount` 从原来
`buyingRows.filter(isRowNew)`（全部15行）改成
`buyingRowsLimited.value.filter(isRowNew)`（按滑块截取后的行）。

用浏览器实测：把 Buying 滑块调到3，"New (2)" chip 和 Buying tab 红点
都变成2（之前红点是7，不联动）；把 Selling 滑块也调到2后，sidebar
Offers 显示3（=Buying的2+Selling的1），两个滑块互相独立、各自只影响
自己那一侧的数字。

## 2026-09-08（第九次）Sidebar 左边距 + Sidebar→内容区间距统一改成24px，并发现两处历史遗留的 .vue/index.html 不同步

你截图用红色标出了 sidebar 左边的留白、和 sidebar 右边到主内容区之间
的留白，要求都改成24px。动手前用浏览器量了实际渲染出来的间距,发现:
- 左边距(sidebar 到视口左边缘):16px。
- 右边这段(sidebar 右边缘到"My ACV"文字/表格卡片左边缘):**48px**，
  不是我以为的16px。

往下查才发现:这个文件(`OfferDashboard.vue`)自己记的是"16px 固定
padding-left"这套旧数值,但实际在跑的 `index.html` 早就不是这个了——
右边这段间距在 index.html 里被改成了
`clamp(48px, calc(48px + (100cqw - 1422px) * 0.1088), 100px)`,一个
随容器宽度变化、48px到100px之间浮动的响应式公式,这个改动应该是更早
之前某次会话直接改了 index.html、没有同步回这个 `.vue` 源文件,导致
两个文件长期不一致（这个文件里的注释和真实行为脱节，一直没被发现）。

改法（第一次尝试，已撤销固定值）：不保留这套响应式 clamp,统一改成
固定24px(不随容器宽度变化)——`.offer-dashboard__body
:deep(.sidebar-nav)` 的 `margin-left` 从16px改成24px；
`.offer-dashboard__content` 的 `padding-left` 统一改成固定24px；
`.offer-dashboard__breadcrumb-row` 的 `padding-left` 跟着重新算成
260+24+24=308px。

你反馈"你又搞错了。我不要fixed。我要的是responsive.不过最小间距改为
24-100px"——sidebar→内容区这段本来就该保留响应式,你要的只是把原来的
最小值48px改成24px,最大值100px不变,不是整段改成固定值。改法（第二次
修正）：
- `.offer-dashboard__content` 的 `padding-left` 恢复成
  `clamp(24px, calc(24px + (100cqw - 1422px) * 0.159), 100px)`——
  数值范围从"48-100"改成"24-100",斜率(0.1088→0.159)跟着重新算过,
  保持和原来一样的响应区间(容器宽度1422px到约1900px之间线性变化,
  1422px以下卡在24px下限,1900px以上卡在100px上限)。
- `.offer-dashboard__breadcrumb-row` 的 `padding-left` 跟着改成
  `calc(284px + clamp(24px, calc(24px + (100cqw - 1422px) * 0.159), 100px))`
  ——284=24(margin-left,这一段你没要求改响应式,保持固定)+260
  (sidebar宽度),后面这段响应式 clamp 和 content 的完全一样。
- `.offer-dashboard__body :deep(.sidebar-nav)` 的 `margin-left`
  保持这次(第一次尝试)已经改好的固定24px不变——你反馈的"要
  responsive"只针对 sidebar→内容区这一段间距,不包括 sidebar 自己
  离视口左边的这段距离。

用浏览器实测：容器宽度≤1422px 时,sidebar→内容区间距精确等于24px下限
(之前是48px);调到2500px 时涨到100px上限,和改动前的响应区间一致；
sidebar 左边距任何宽度下都保持固定24px；"My ACV"文字和表格卡片左
边缘在两种宽度下都依然保持左对齐。

## 2026-09-08（第十次，已撤销）宽屏下 Reserve/Sent/Received 间距比其它列小，显得不均衡

你反馈:全屏、屏幕够宽的时候,Reserve/Sent/Received 之间的间距和其它
地方的间距比起来不均衡、显得偏少;小屏幕时没问题。

根因:这几列(以及 Photo/Dealer/Vehicle/Time)之前都是
`minmax(Npx,Nfr)`,宽屏时会按各自的 fr 数值比例一起变宽——但 fr 数值
本身差很多(Reserve/Sent/Received 只有61-69,Vehicle/Update 有
176/217),同样多出来的一份空间,分到 Reserve/Sent/Received 头上的
份额天然比分到 Vehicle/Update 头上的少得多,肉眼看就是"这几列的间距
比别的地方小"——这是"每列都按比例分配"这个机制本身必然造成的效果,
不是数值算错了。

（这个现象和"第六次"改动很像，但不是同一次误判——第六次撤销的原因是
那次你反馈的截图根本不是宽屏场景，这次是真的宽屏、真的存在的问题。）

改法：除 Update 外的7列（Photo/Dealer/Vehicle/Time/Reserve/Sent/
Received）全部改成固定像素宽度（不再用 `fr`），宽屏时不再跟着变宽；
只有 Update 用 `minmax(217px, 1fr)` 独自吸收多出来的空间——这样7列
宽屏/窄屏下宽度完全一样，不会再出现"某几列比别的列多长一点"这种比例
不均衡的视觉效果。

用浏览器实测：屏幕宽度2000px下，7个非Update列宽度精确等于自己的
固定值（80/116/176/100/66/61/69px，一点没变宽），Update涨到898px；
850px窄屏下 `scrollWidth` 精确等于885px（=7列固定宽度之和217+其余
7列，和改动前的自然最小宽度完全一致），横向滚动行为不受影响；表头和
数据行8列的 left/width 全部相等。

**2026-09-08 追加：你反馈这次改动"全错了"，已撤销。** `tableGridColumns`
恢复成每列都用 `minmax(Npx, Nfr)`——8列（含Update）宽屏时重新一起
按比例变宽。这条记录保留下来只是为了留痕（当时的诊断/改法/验证过程），
不代表现在的实际状态，现在的状态见本文件更晚的条目。

## 2026-09-08（第十一次）Reserve/Sent/Received 三列最小列宽各加12px

按你的要求，`tableGridColumns` 里这三列的 `minmax()` 数值分别从
66/61/69 改成 78/73/81（各+12px），跟 `OfferTableHeader.vue`/
`OfferTableRow.vue` 的同名列宽同步改了。用浏览器实测：三列表头和
数据行的宽度精确等于78/73/81px，且 `left`/`width` 依然完全对齐。

## 2026-09-08（第十二次）Reserve/Sent/Received 三列最小列宽再加12px

按你的要求再加一次12px，三列变成90/85/93（78/73/81 + 12），
`OfferTableHeader.vue`/`OfferTableRow.vue` 同步改了。用浏览器实测：
三列表头和数据行的宽度精确等于90/85/93px，`left`/`width` 依然完全
对齐。

## 2026-09-08（第十三次）Reserve/Sent/Received 三列最小列宽再加12px

按你的要求再加一次12px，三列变成102/97/105（90/85/93 + 12），
`OfferTableHeader.vue`/`OfferTableRow.vue` 同步改了。用浏览器实测：
三列表头和数据行的宽度精确等于102/97/105px，`left`/`width` 依然完全
对齐，无 console 报错。

## 2026-09-09 顶部去掉 Pagination，底部改成 sticky

你反馈顶部 Rows per page + 上一页/下一页和底部的 Pagination 完全重复，
只留底部一套；顶部改成两种视图都显示 "Viewing N results"，table 视图
再在旁边加上 🔑 Private Lane（原来 Private Lane 只在有顶部 Pagination
的 table 视图出现，"Viewing N results" 只在没有 Pagination 的 tile
视图出现，两者互斥,现在改成两个东西可以同时出现）。接口/CSS 层面的改动
细节都记在 [ResultsToolbar/notes.md](../ResultsToolbar/notes.md)，这里
只记这个文件自己的两处改动：

1. `<ResultsToolbar>` 的调用去掉了 `:rows-per-page`/`:has-prev-page`/
   `:has-next-page`/`@update:rows-per-page`/`@prev`/`@next` 这六个绑定
   （对应的 prop/emit 已经从 `ResultsToolbar.vue` 里删掉了，不是只是不传
   而已）——`handleTableRowsPerPageChange`/`hasPrevTablePage`/
   `hasNextTablePage`/`handlePrevTablePage`/`handleNextTablePage` 这几个
   状态/方法本身没有删，底部 `<Pagination>` 还在用同一套。
2. 你提到的顾虑——顶部翻页去掉之后，表格行数一多，翻页按钮要滚到最底
   才能点到——改法是给 `.offer-dashboard__table-bottom`（包着底部
   `<Pagination>` 的那个 div）加 `position:sticky; bottom:0; z-index:1`。
   选 `sticky` 不选 `fixed` 是因为 `sticky` 不脱离文档流，不用像 `fixed`
   那样额外算左侧 sidebar 的宽度/偏移量才能对齐；`<Pagination>` 组件
   自己已经有白底（见其 notes.md），滚动时不会露出底下滚过去的表格行。
   浏览器里实测过（"Expand to full page" 真实页面，不是 Playground 窄
   frame）：往下滚动表格行时，这条 Pagination 一直贴在视口底部不动，
   没有滚到最底才出现的问题；切回 tile 视图/切换回 table 视图都正常，
   无 console 报错。

## 2026-09-09（第二次）sticky Pagination 上边缘加一条浅灰色分隔线

你反馈这条 sticky 的底部 Pagination 滚动时浮在表格行上面，想要上边缘
加一条浅灰色的线把它和上面滚过去的内容分开。给
`.offer-dashboard__table-bottom` 加了 `border-top: 1px solid #DCDFE8`
——颜色沿用 `OfferTableHeader` 底部描边同一个 `#DCDFE8`，不是另外挑的
新颜色。浏览器实测过，往下滚动时这条线跟着 sticky 容器一起贴在视口
底部，无 console 报错。

## 2026-09-09（第三次）filter chip 数字改成"分层联动"

你反馈同时选中 Make Offer(5)+Sent(6)后表格只剩3条，但 Sent 的徽标还是
显示6，数字和实际筛选结果对不上。这不是新bug，是之前明确讨论过的设计
（"chip上的数字是选了会筛出多少条的提示，不跟其它chip联动"，见本文件
2026-08"按你的要求:点filter chip"那条记录），但聊天里重新讨论后你指出
这条规则不合理，最后确认了新规则——**In negotiation/Make Offer 和
New/Received/Sent/Declined 不是平级关系，是父子级**：

- 父级（negotiationCount/makeOfferCount）永远只按 dealerFilteredRows
  算，不受任何 status chip 选中状态影响，两个父级chip之间也互不影响。
- 子级（newCount/receivedCount/sentCount/declinedCount）改成基于新增的
  `typeFilteredRows`（在 dealerFilteredRows 基础上再按当前
  negotiation/makeOffer 的选中范围筛一遍）算——不管子级chip自己有没有
  被选中，都用这条规则重新算。讨论过为什么不能是"子级选中后自己也跟着
  联动变成和可见行数一样"——那样算出来的数字永远等于当前表格行数，没有
  传递新信息，所以子级之间（比如New和Received）还是互相独立，只受父级
  影响。

浏览器实测：只选 Make Offer 时，New/Received/Sent/Declined 分别变成
1/0(禁用)/3/2（Make Offer本身还是5，没变）；再加选 Sent 后表格剩3条，
Make Offer 还是5、Sent 还是3，都不再和之前一样对不上；清空后单独选
In negotiation，子级数字（4/5/3/2）也正确收窄到 In negotiation 范围内，
Make Offer 全程没被子级或另一个父级影响过，无 console 报错。

## 2026-09-09（第四次）Card 视图卡片宽度范围改成330-420px

你要求卡片宽度"最小330，最宽420，理想尺寸在360-370左右"——`minmax()`
本身没法指定"理想值"这个中间目标，只能控制上下限，330-420这个区间已经
覆盖了360-370这个理想范围。`.offer-dashboard__card-grid` 的
`grid-template-columns` 从 `repeat(auto-fit, minmax(320px, 1fr))`（下限
320px、上限不封顶跟着屏幕一起变宽）改成
`repeat(auto-fit, minmax(330px, 420px))`（下限330px、上限封顶420px，
不再无限跟着屏幕变宽）。

问你卡片数量≤2张时单独封顶370px的特例（`cardGridStyle` computed，见
2026-08"卡片数量不多时"那条记录）要不要也套用这次的330-420，你确认
保持370px不变，这次没有改那部分。

浏览器实测：卡片数>2张时，宽屏下卡片精确等于420px（封顶）；卡片数=2
张时，同样宽屏下卡片精确等于370px（既有特例不受影响）；窄屏下两种
场景分别落到各自的下限（330px/320px）。无 console 报错。

## 2026-09-09（第五次）修复真实bug：minmax固定max导致大块空白

上一条改完之后你反馈截图：屏幕宽1575px时，卡片区只开了2列（每列
420px），右边留出一大块空白，不是想要的效果——这正是上面2026-08那条
注释早就警告过的坑："不会像 minmax 给固定最大值那样在两端留出多余
空白"，我把第二个参数从 `1fr` 换成固定的 `420px` 之后，恰好踩中了
这个坑：`auto-fit` 决定"能塞几列"时会优先让每列尽量接近固定的
max值，而不是尽量多开列，容器宽度不是420px整数倍时，多出来的空间不会
拿去多开一列，直接变成空白。

改法：`.offer-dashboard__card-grid` 的 `grid-template-columns` 换回
`repeat(auto-fit, minmax(330px, 1fr))`（第二参数是 `1fr` 不是固定
420px），恢复"能多塞一列就多塞一列，不留大块空白"这个 auto-fit 自限
机制；"最宽420px"这个要求改成加在卡片自己身上——
[OfferCard.vue](../OfferCard/notes.md) 的 `.offer-card` 新增
`max-width:420px` + `justify-self:center`，列宽本身仍然可以比420px
更宽（分不匀的时候），但卡片内容本身封顶420px、在格子里居中，多出来的
空间变成卡片两侧对称的留白，不是整块空白。

浏览器实测（跟你截图同一个1575px宽度）：卡片区现在开了3列，每列
≈363px（正好落在你说的"理想尺寸360-370"区间），没有空白；把容器收窄
到只能塞1列的宽度（466px）时，卡片精确封顶420px、左右各留出等宽空白，
不再无限撑宽；收到330px下限附近时卡片跟着收窄，没有再变窄。无
console 报错。

## 2026-09-10 排查横向滚动条"被藏起来"——先后两次修法，第一次撤销重做

你反馈屏幕小到一定程度，table view 的横向滚动条会被藏起来。第一次
诊断（已撤销）：以为是原生横向滚动条（画在 `.offer-dashboard__
table-scroll` 自己盒子最下面）被 sticky 的底部 Pagination 盖住，加了
`margin-bottom:24px` 当缓冲区。你反馈"完全不对还是老样子"，用 `git
checkout` rewind 掉了。

重新排查（用浏览器把 `.pg-stage` 这个滚动容器的 `scrollTop` 从0调到
最大，每一步量 `getBoundingClientRect()`）才发现真正的问题：只要
Pagination 后面没有更多内容、且页面比可视区域高，Pagination 几乎从
一开始（还没滚动）就已经贴底悬浮，并且在几乎整个滚动过程中都固定在
同一个屏幕位置不动；而每一行数据（80px高）在下面正常随着滚动滑动，
滚动过程中总会有某一行正好卡在这条线上被压掉一截——不只是滚动条，
连内容本身都会被压，只有滚到最顶或最底两个极端才短暂避开。24px 缓冲
区只能解决"滚到最底"这一个点，解决不了滚动过程中持续出现的这个问题，
所以第一次的修法完全没用。

进一步跟你确认后，发现你要的其实不是"修复被盖住"，而是**横向滚动条的
出现时机不对**——你希望不管纵向滚动到哪，横向滚动条都应该像底部
sticky 的 Pagination 一样随时可见、随时能用，不需要先滚到底。这次改法
细节见下面新的一条记录。

## 2026-09-10（第二次）新增"影子"横向滚动条（sticky，随时可见）

跟你讨论了两个方向，你选了方案A：
- **方案A（采用）**：额外做一条"影子"横向滚动条——一个高17px、
  `overflow-x:auto` 的 div，里面塞一个宽度等于真实表格 `scrollWidth`
  的空 spacer，自己会长出一条原生横向滚动条（拖拽/点击跳转这些原生
  交互全部免费拿到，不用自己写拖拽逻辑）；这个 div 用
  `position:sticky`，`bottom` 动态绑定成 Pagination 实际渲染高度，贴在
  Pagination 正上方，两者作为一组一起贴底；用一小段 JS 把它的
  `scrollLeft` 和真实 `table-scroll` 的 `scrollLeft` 双向同步。
- 方案B（备选，未采用）：把表格包进一个固定高度的容器，内部自己滚
  （零JS，纯CSS），但会把"整页跟着内容一起滚"这个现有体验整个改掉，
  改动范围更大。

实现细节：
- 新增 `tableScrollRef`/`hScrollShadowRef`/`tableBottomRef` 三个模板
  ref，`tableScrollWidth`/`showHScrollShadow`/`paginationHeight` 三个
  状态由 `updateHScrollMeasurements()` 统一算。
- `isSyncingHScroll` 这个标志防止"同步对方→对方触发scroll事件→又同步
  回自己"的双向监听死循环。
- 用 `ResizeObserver` 盯 `table-scroll`/`table-bottom` 两个元素的盒子
  尺寸变化；另外单独 `watch(tableGridColumns, ...)`——因为列宽变化
  (比如切换 multi-dealer)有可能只改变内容的 `scrollWidth`、不改变
  容器自己盒子的尺寸，`ResizeObserver` 不一定会因此触发，补一个专门
  的 watch 保证列宽变化后一定会重新量一次。
- `watch(viewMode, ...)`：table/tile 切换时 `v-if` 会把
  `table-scroll`/`table-bottom` 整个销毁重建，`ResizeObserver` 原来
  观察的旧元素已经不存在，需要重新 `observe` 一次新元素。
- 只在真的有横向溢出(`scrollWidth > clientWidth`)时才渲染这条影子
  滚动条，宽屏下（不需要横向滚动）不会多出这个元素。

浏览器实测：988px窄屏下，**没有滚动纵向**（页面停在最顶部，之前这个
状态完全看不到任何滚动条）时，影子滚动条已经清晰可见；拖动/设置影子的
`scrollLeft` 会同步到真实表格（表格内容跟着横向滚动，截图确认列真的
换了），反过来设置真实表格的 `scrollLeft` 也会同步回影子；切到卡片
视图时这个元素直接不存在（`v-if` 生效），切回表格视图后宽度/存在状态
都正确恢复；1575px宽屏下（不需要横向滚动）这个元素完全不渲染。全程无
console 报错。
