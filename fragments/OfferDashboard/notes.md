# OfferDashboard — Notes

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

## 布局本身待你确认
1. Sidebar 和右侧内容区之间要不要一条竖向分隔线——Figma metadata 里
   没有看到对应的 divider 节点,组装页面里没有加。
2. 整页空白区域的背景色没有单独核实过,用了白色。
3. 每个子组件各自的"待确认"项没有在这里重复列出,请分别看各自的
   notes.md。
