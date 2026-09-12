<!--
  ═══════════════════════════════════════════════════════════
  METADATA
  name: Offer Dashboard (整页组装)
  group: 页面组装 (Page Assembly)
  order: 1
  description: >
    把前面 10 个已核实的 fragment 组件(AppHeader / Breadcrumb /
    SidebarNav / OfferTabs / SearchInput / FilterChipGroup /
    OfferTableHeader / OfferTableRow / StatusChip / OfferTypeBadge /
    Pagination)按 Figma "Offers" 主页面的真实布局拼在一起,作为整体
    效果预览,不是任务清单里要求的独立"模具"组件,而是这些组件的组装
    产物,方便先看整体效果,细节再逐个组件调整。
  path: fragments/OfferDashboard/OfferDashboard.vue
  source_of_truth: >
    版式(谁在谁旁边、大致间距)取自 Figma 主 "Offers" frame
    (6837:16086,以及重复的 7319:21453):
    - AppHeader 满宽,高 58px(6837:16087)。
    - Breadcrumb 在 header 下方,左边距对齐内容区(6837:16095,x=276)。
    - SidebarNav 固定宽 260px,贴左(6903:21933,x=0)。
    - 右侧内容区宽 1122px(6837:16129,x=275/276),从上到下依次是
      OfferTabs → 搜索框+筛选 chip → 顶部 Pagination → 表头 → 表格行
      ×3(对应 order 31 notes.md 里三条真实行数据)→ 底部
      "Viewing..." + Pagination。
    这个组件本身不引入任何新的颜色/文案数值,全部数值分别在各自的
    fragment 里核实过,这里只做布局拼装,布局间距(比如 sidebar 和
    内容区之间的分隔线)如果 Figma 没有给出明确数值,会在下面单独说明。
  status: >
    Sidebar 和内容区之间是否应该有一条竖向分隔线,Figma metadata 里没有
    看到对应的 divider 节点,组件里没有加,待确认。整页背景色(sidebar/
    内容区外的空白区域)也没有单独核实,用了白色作为最保守的选择。

    【2026-08 按你的要求新增,并对照单经销商参照帧 6837:16538 补全】
    之前这个组件没有对外暴露任何 props,现在加了 `isMultiDealer`,统一
    透传给三处:
    1. `FilterChipGroup` —— `isMultiDealer=false` 时不显示 "Dealership"
       chip(见该组件 METADATA 核实的 6837:16538 数据)。
    2. `OfferTableHeader` —— `isMultiDealer=false` 时第二列标题变成
       "Auction ID"、副标题变成 "Type"、不显示排序按钮。
    3. 每一行 `OfferTableRow`(通过下面的 `rowsWithDealerMode` 计算属性
       统一覆盖,而不是让每条 mock 各自写死)—— `isMultiDealer=false`
       时第二列主标题直接显示 Auction ID,不显示 Dealer Name,
       OfferTypeBadge 单独一行贴左。
    另外点击 "Dealership" chip 会展开 `DealershipFilterDropdown`
    (order 23),并把 `isMultiDealer` 传给它——该子组件自己的逻辑是
    `isMultiDealer=false` 时不渲染任何内容,不过既然多经销商=false 时
    "Dealership" chip 本身已经不显示,这个下拉在单经销商模式下也就没有
    入口可以打开了,双重保险。下拉浮层出现的位置(紧贴筛选行下方顺着
    往下排,不是绝对定位悬浮)没有对应的 Figma 实例核实过,待确认真实
    的弹出方式。
    另外加了一个 Reset 按钮(在 Playground 的 Controls 面板里,不是
    渲染在 dashboard 页面内部),点击会把 Dealership 下拉收起、排序状态
    清空,并让 FilterChipGroup/SearchInput/OfferTableHeader 这些子组件
    重新挂载,恢复到默认状态。

    【2026-08 新增 tile version,对照 node 7432:68669 / 7432:69394】
    加了 `viewMode`('table' | 'tile',内部 ref,默认 'table',不是外部
    prop,因为这是纯 UI 交互状态)。搜索框+筛选chip那一行(OfferTabs→
    SearchInput→FilterChipGroup)在两种视图下完全不变,只是下面的表格
    /卡片网格部分跟着切换,这个结论来自 Figma 里表格版本(6837:16129)
    和卡片版本(7432:68713)共享同一个 "Frame 630266071" 搜索筛选区
    节点,不是我猜的。
    - `viewMode==='table'` 时保留原来的顶部 Pagination + 表头 + 表格行
      + 底部 Pagination。
    - `viewMode==='tile'` 时按 node 7432:70555 核实的样子改成
      "Viewing {n} results" 文字(14px/21px 色 #212121)+ 下面直接是
      OfferCard 三列网格(node 7432:69393,列间距16px,来自两张卡片
      x坐标差值 379.33-363.33=16px),**没有**再显示底部 Pagination——
      这个 tile 版本的 Figma 帧本身就没有底部分页区域,不是我漏做。
    - 视图切换的两个图标按钮(grid.svg / large-card.svg,真实核实自
      node 7432:70565,活跃态背景 #F5F5F5、非活跃态白底+边框
      #D1D3D6)只在 tile 版本的 Figma 帧里核实到过;为了让用户能从表格
      切回卡片(以及反过来),这里把同一组按钮也放进了表格视图的顶部
      工具条——这一步是为了交互闭环做的合理推断,**没有**单独核实过
      表格视图顶部是否本来就带这个切换控件,待确认。
    - `rowsAsCards` 计算属性把已核实的表格行 mock 数据(`dealerName` /
      `auctionId` / `offerType` / `vehicleTitle` / `mileage` / `vin`)
      原样映射进 OfferCard,`timeLeft` 用 `row.timeRemaining + ' Left'`
      拼出来(比如 "20h 45m Left"),`primaryMessage`/`secondaryMessage`
      不传(现有行 mock 里没有这两个字段的真实数据,不编造),这样也顺便
      验证了 OfferCard 组件缺省这两个字段时能正常显示。

    【2026-08 你给了 10 张新真实车辆照片,把 rows 从 3 行扩充到 12 行】
    你明确要求"把 Dashboard 扩充成更大的列表",所以 `rows` 现在是
    `OfferTableRow/mock.js` 里全部 12 个行 mock(前 3 个是已核实的真实
    行数据,后 9 个是配了新照片的自编 mockup 演示数据,细节见该文件
    notes.md)。行数变了之后,以下三处不再是之前 Figma 截图核实过的
    静态数字,改成了从 `rows` 动态算出来(`computed`),始终和实际行数
    对得上,这是你在扩充行数时明确认可的取舍:
    - `sidebar.offersCount`:等于 `rows.length`(原来是核实过的 5)。
    - `tabs.buyingCount`:等于 `rows.length`(原来是核实过的 3);
      `sellingCount` 和这批行数据无关,没有改动,仍然是原来核实过的 2。
    - `filters` 的 negotiationCount/makeOfferCount/newCount/
      receivedCount/sentCount:分别是统计 `rows` 里对应字段算出来的
      (declinedCount 目前没有对应字段可统计,固定给 0)。

    【2026-09-01 行数从 12 变成 10】按 "Offer States Logic for CC.md" 的
    Number rules 整批重新生成 OfferTableRow/mock.js 的金额时,删掉了两行
    不存在的状态组合(rowWithMakeOffer/rowFiat500,原因见该文件自己的
    notes.md),`rows` 数组和下面 buyingRows/sellingRows 的切分点已经同步
    改成 10 行、5+5,`buyingVehicleCount`/`sellingVehicleCount` 这两个
    prop 的范围/默认值也跟着从 1~6/默认6 改成 1~5/默认5。这条注释只记录
    这一次的数量变化,上面 2026-08 那几条"12行"相关的描述本身已经是历史
    记录,不再回去改。

    【2026-08 按你的要求:点 filter chip / Dealership 下拉要真的过滤
    table/tile 内容】之前 FilterChipGroup 的 chip 只会自己变色,不影响
    实际显示哪些行。现在:
    - `FilterChipGroup` 新增 `filter-change` 事件,把它内部
      negotiationSelectedLocal/makeOfferSelectedLocal/singleSelected
      三个状态整体 emit 出来,这边存进 `chipFilter` ref。
    - `DealershipFilterDropdown` 的 "Apply Filter" 把选中的经销商数组
      emit 给 `handleApplyDealerFilter`,存进 `dealerFilter` ref(它的
      "Reset" 按钮现在也会 emit 一次空数组,同步清空这边的筛选);重新
      打开下拉时用 `:pre-selected="dealerFilter.join(',')"` 把当前筛选
      状态带回去,不会打开后又是空的。
    - `matchesFilters(row)` 把 `dealerFilter`(经销商名单,AND 逻辑)和
      `chipFilter`(in-negotiation/make-offer 是 OR 逻辑——两者可以同时
      选中,选中的 offerType 命中任一个就算匹配;New/Received/Sent 对应
      行上的 statusNew/statusReceived/sentAmount 字段;Declined 目前没
      有任何行数据能匹配,选中后必然是空列表,这是正确结果不是 bug)
      合并判断,`visibleRows` 在原来 vehicleCount 截取的基础上再套一层
      这个过滤。
    - 特意没有让 `filters` 里 chip 自己的数量(negotiationCount 等)跟着
      chipFilter/dealerFilter 联动——chip 上的数字是"选了会筛出多少条"
      的提示,不应该因为你正在筛选而自己也变,这是有意的设计选择,不是
      漏做。
      【2026-09-09 更正,分层联动】你反馈这条规则对 New/Received/Sent/
      Declined 这四个来说不合理——重新讨论后确认:In negotiation/Make
      Offer 和 New/Received/Sent/Declined 不是平级的关系,前者是父级
      (type),后者是子级(status)。父级的数字维持原样,永远不联动;
      子级的数字改成永远跟着"当前父级选中的范围"重新算(不管子级自己
      有没有被选中都用这条规则,不是"选中了就冻结"),细节和为什么不能
      做成"子级选中后自己也联动"见 `filters` computed 旁边的注释。
    - `sidebar.offersCount`/`tabs.buyingCount` 同理,仍然只跟 vehicleCount
      有关,不跟当前筛选结果联动——这两个不受上面那条"分层联动"更正影响,
      它们本来就不是 chip,没有父子级关系。
    - 筛选结果为空时,table/tile 下面会显示一行 "No vehicles match the
      current filters." 的提示,不是空白一片。

    【2026-08 按你的要求,参照真实原型重做 Dealership 弹层 + 交互】
    你给了本地原型 `My-ACV--Dealer-filter-main`,明确说只参照它的
    V1 web 版本 dealership filter 部分。这次的改动集中在"怎么把浮层
    真正悬浮起来"这一层交互逻辑,`DealershipFilterDropdown` 组件本身的
    外观改动记录在它自己的 METADATA/notes.md 里,这里只记录 OfferDashboard
    新增的部分:
    - `filterChipGroupRef`:挂在 `<FilterChipGroup ref="...">` 上,用来
      拿到它内部暴露出来的 `dealershipBtnRef`(按钮真实 DOM 节点)。
    - `dealerPopoverStyle`:根据按钮的 `getBoundingClientRect()` 算出来
      的 `{ position:'fixed', top, left, zIndex }`,绑在包着
      `<DealershipFilterDropdown>` 的 `.offer-dashboard__dealer-popover-
      anchor` 包裹层上——定位逻辑照抄原型的 `positionUnder()`,只是把
      对齐方向从原型的"右对齐"改成了"左对齐"(因为我们的按钮在筛选行
      最左边,右对齐会超出视口,细节见 DealershipFilterDropdown 的
      notes.md)。
    - 点击浮层外部(`handleOutsideClick`,用 `mousedown` 而不是
      `click`,避免和按钮自己的 `click` 切换事件抢跑)、按 Escape
      (`handleEscapeKey`)都会关闭浮层;滚动或窗口 resize 时如果浮层还
      开着会重新定位(`handleRepositionOnScroll`)——这三个全局监听照抄
      原型的 `document click` / `keydown` / `window scroll` 逻辑,在
      `onMounted`/`onBeforeUnmount` 里挂载/卸载。
    - 【2026-08 按你的要求调整】应用后的摘要**顶替 "Dealership" 按钮本来
      的位置**,不是在筛选行下面另起一行显示——之前的版本是在筛选行下面
      单独多一个 `.offer-dashboard__dealer-chip` 元素,你指出截图里那个
      摘要 chip 应该直接顶替 Dealership 按钮的位置,已经改成把
      `dealerChipText` 通过 `dealer-chip-label` prop 传给
      `FilterChipGroup`,由它自己在同一个按钮内部切换"默认态(Dealership+
      箭头)"和"已选态(摘要文字+关闭×)"两种内容——参照的是原型 V2 版本
      "chip default ↔ active states toggled by JS" 的做法(之前只
      参照了 V1 的"另起一行"做法,这次按你的反馈换成了 V2 的"原地顶替"
      做法)。点击按钮本身(摘要文字部分)仍然会打开/关闭浮层,方便直接
      改选;点击关闭×会 `@click.stop` 阻止冒泡,只清空经销商筛选
      (`clear-dealer` 事件),不会同时把浮层弹出来,也不会牵连
      In negotiation/Make Offer 等其他 filter chip。

    【2026-08 Pagination 组件的下拉/箭头换成了 Claude Design 项目里的
    ACV Pagination(见该组件自己的 METADATA/notes.md),但 "Viewing X
    out of Y results" 文案+样式按你的要求原样保留,`showViewingText`/
    `viewingCount`/`totalCount` 这几个 prop 名字都没有变。

    【2026-08 按你的要求新增 "Private Lane" 标签】参照真实原型
    (`My-ACV--Dealer-filter-main`)表格顶部 meta 行的 "🔑 Private Lane"
    标签,加在顶部分页栏左侧(原来空的 spacer 里)。这不是 Figma 核实
    数据,是这份参照原型给的内容,只在 `viewMode==='table'` 时显示(和
    原型里"只在表格顶部 meta 行出现一次,底部/tile 视图都没有"一致)。
    钥匙图标是标准 Material Icons "vpn_key" 字形(开源、公开的通用图标,
    不是项目专属资源),内嵌成 SVG,没有引入 Material Icons 字体依赖。

    【2026-08 按你的要求:去掉筛选chip下面的横线 + 重新核实整页垂直间距】
    对照你给的新节点 7448:9826(hidden=false,含 App Bar 一直到表格的
    完整一页)重新量了从上到下每一段的真实间距,发现好几处和之前实现的
    不一样:
    - App Bar 底边(y=58)→ Breadcrumb 顶部(y=82):**24px**(之前
      breadcrumb-row 用的是对称 12px/12px,现在改成上24/下14)。
    - Breadcrumb 底部 → Tabs 顶部(y=120):**14px**。
    - Tabs 底部 → 搜索框顶部:节点 7448:9870 的 flex `gap-[24px]`,
      **24px**(之前 toolbar 用的是 `padding:16px 0`,只有16px)。
    - 搜索框视觉底部 → 筛选chip行顶部:SearchInput 组件本身是72px高的
      Figma 节点里,可见的搜索框只占56px,底部留了16px内建空白,换算下来
      是**16px**(之前 toolbar 的 `gap:12px` 只有12px)。
    - 筛选chip行底部 → Private Lane/Pagination 行顶部:节点 7448:9899
      的 flex `gap-[20px]`,**20px 纯留白,完全没有分割线**——你说要去掉
      的那条横线,就是之前 `.offer-dashboard__table-card` 上加的
      `border-top: 1px solid #DCDFE8`,这条线在 Figma 里根本不存在,
      已经删掉,改成同样效果的 `margin-top: 20px`。
    - Private Lane/Pagination 行底部 → 表头顶部:节点 7448:9916
      "Table" 的 flex `gap-[16px]`,**16px**(之前 table-top 用的是对称
      8px/8px)。表头区域自己的浅灰背景(#FAFAFA)在视觉上会形成一条
      "边界感",但那是表头背景色本身的对比效果,不是一条独立画出来的
      分割线,不需要额外加 border。

    【2026-08 已废弃】之前这里给 `<OfferCard>` 写死了 `button-version=
    "v1"` `:button-count="1"`,让所有卡片固定用同一个按钮效果。这次按
    "Offer card — content & interaction spec" 重写后,`OfferCard` 不再有
    `buttonVersion`/`buttonCount` 这两个 prop 了——按钮的个数/文案完全由
    `viewerRole`+`offerType`+`dealState` 决定(见 OfferCard 自己的
    METADATA),所以这里也不再写死任何按钮相关的值,`rowsAsCards` 现在
    会给每张卡片传真正对应的 `viewerRole`/`dealState` 等字段,不同卡片的
    hover 按钮组会跟着这些字段真的变化,不再是固定统一的效果。

    【2026-08 对照节点 7432:69595 核实的三处改动】
    1. **"My ACV" 旁边的 New 红点**:AppHeader 新增 `hasNewOffers` prop,
       这里传的是 `hasAnyNewDeal`(= buyingNewCount + sellingNewCount
       > 0,复用已经核实过的这两个 New 数量,没有重新定义逻辑)。红点
       本身的像素数值(直径/间距)是照截图估的,不是像素级核实,细节
       和待确认记录在 AppHeader 自己的 METADATA 里。
    2. **tile/table 切换 UI 改版**:两端改成全圆角 pill 形(之前是 4px
       小圆角方形),且左右顺序换成"先 grid(tile 视图)后 list/agenda
       (table 视图)",对照这个新节点里 active 态(浅灰背景)在左边
       grid 图标上、当前显示内容就是卡片视图,颜色/边框数值本身没有变。
    3. **卡片区和上方"Viewing X results + 切换按钮"间距改成 16px**:
       排查发现之前 `.offer-dashboard__card-grid` 自己有
       `padding:16px 0`,顶部这份 16px 会跟 `.offer-dashboard__table-top`
       本来就有的 `padding-bottom:16px` 叠加,实际渲染出来是 32px 不是
       16px。已经删掉卡片网格顶部这份重复的 padding,只留底部,间距交给
       `table-top` 的 `padding-bottom` 单独负责,和这个新节点 "Table"
       容器 `gap-[16px]`(只有一份)对上。
  ═══════════════════════════════════════════════════════════
-->
<template>
  <div class="offer-dashboard">
    <AppHeader v-bind="header" :has-new-offers="hasAnyNewDeal" />

    <div class="offer-dashboard__breadcrumb-row">
      <Breadcrumb crumbs="My ACV,Offers" />
    </div>

    <div class="offer-dashboard__body">
      <SidebarNav v-bind="sidebar" />

      <main class="offer-dashboard__content">
        <OfferTabs v-bind="tabs" @select="handleTabSelect" />

        <div class="offer-dashboard__toolbar">
          <SearchInput v-model="searchInputValue" @search="searchValue = $event" />
          <!-- 2026-09-02 按你的要求:Selling tab 不应该有 Declined 这个
               筛选项,Buying 保持不变。FilterChipGroup 新增的
               showDeclined prop 按当前 tab 算,不是常量,细节见
               FilterChipGroup/notes.md -->
          <FilterChipGroup
            ref="filterChipGroupRef"
            v-bind="filters"
            class="offer-dashboard__filters"
            :is-multi-dealer="effectiveMultiDealer"
            :dealership-open="dealershipDropdownOpen"
            :dealer-chip-label="dealerFilter.length ? dealerChipText : ''"
            :show-declined="activeMainTab !== 'selling'"
            @toggle-dealership="toggleDealershipDropdown"
            @clear="handleClearFilters"
            @filter-change="chipFilter = $event; currentTablePage = 1"
            @clear-dealer="dealerFilter = []; currentTablePage = 1"
          />
        </div>

        <!-- 参照真实原型做成真正悬浮在 Dealership 按钮下方的浮层,不是
             在文档流里顶开布局,定位逻辑见 METADATA -->
        <div
          v-if="dealershipDropdownOpen"
          ref="dealerPopoverWrapRef"
          class="offer-dashboard__dealer-popover-anchor"
          :style="dealerPopoverStyle"
        >
          <DealershipFilterDropdown
            :is-multi-dealer="effectiveMultiDealer"
            :pre-selected="dealerFilter.join(',')"
            @apply="handleApplyDealerFilter"
          />
        </div>

        <div class="offer-dashboard__table-card">
          <ResultsToolbar
            v-model:view-mode="viewMode"
            :results-count="visibleRows.length"
          />

          <template v-if="viewMode === 'table'">
            <!-- 2026-09-08(第三次)按你的要求:表头+所有数据行现在共享
                 同一个 CSS Grid 的列宽定义(见下面 tableGridColumns +
                 .offer-dashboard__table-scroll 的 CSS),不再是表头和
                 每一行各自独立算一次 flex 宽度——之前那样在宽屏下会各自
                 算出细微不同的浮点像素值,反复出现对不齐。OfferTableHeader/
                 OfferTableRow 通过 grid-layout 这个 prop 切换成
                 display:contents,把它们的 8 个 cell 直接交给这个 grid
                 摆放,细节见 fragments/OfferDashboard/notes.md 同名条目。
                 窄屏(容器比表格自然宽度窄)时这个容器横向滚动;宽屏时
                 每一列按 grid-template-columns 里的 fr 比例一起变宽,不
                 影响上面的 ResultsToolbar/下面的底部 Pagination。 -->
            <div ref="tableScrollRef" class="offer-dashboard__table-scroll" :style="{ gridTemplateColumns: tableGridColumns }" @scroll="handleTableScroll">
              <OfferTableHeader grid-layout :is-multi-dealer="effectiveMultiDealer" :sort-column="sortColumn" :viewer-role="viewerRoleValue" @sort="sortColumn = $event" />

              <OfferTableRow
                v-for="(row, i) in rowsWithDealerMode"
                v-show="isRowOnCurrentTablePage(i)"
                grid-layout
                :key="i"
                v-bind="row"
                :ref="(el) => setTableRowRef(el, i)"
                :has-prev-deal="i > 0"
                :has-next-deal="i < rowsWithDealerMode.length - 1"
                @prev-deal="handleTablePrev(i)"
                @next-deal="handleTableNext(i)"
                @remove-from-list="handleRemoveFromList(row.auctionId)"
                @viewed="markSeen(row.auctionId)"
              />
            </div>
            <p v-if="visibleRows.length === 0" class="offer-dashboard__empty">
              No vehicles match the current filters.
            </p>

            <!-- 2026-09-10 按你的要求新增:"影子"横向滚动条,sticky 定位,
                 跟底部 Pagination 用同一套逻辑——不用等整页滚到底、露出
                 table-scroll 自己盒子最下面那条原生滚动条才能横向滚动,
                 这条影子滚动条只要表格区域还在视野里就一直可见、随时能
                 拖。原理:这个 div 自己也是 overflow-x:auto,里面塞一个
                 宽度跟 table-scroll 的 scrollWidth 一样的空 spacer,自己
                 长出一条原生横向滚动条(拖拽/点击跳转这些原生交互都是
                 免费拿到的,不用自己写一套拖拽逻辑);用 handleTableScroll/
                 handleShadowScroll 把它和真实 table-scroll 的 scrollLeft
                 双向同步。只在真的有横向溢出时才显示(showHScrollShadow),
                 sticky 的 bottom 值动态绑定成 Pagination 实际渲染高度,
                 让它贴在 Pagination 正上方,两者作为一组一起贴底。 -->
            <div
              v-if="showHScrollShadow"
              ref="hScrollShadowRef"
              class="offer-dashboard__table-hscroll-shadow"
              :style="{ bottom: paginationHeight + 'px' }"
              @scroll="handleShadowScroll"
            >
              <div class="offer-dashboard__table-hscroll-spacer" :style="{ width: tableScrollWidth + 'px' }" />
            </div>

            <div ref="tableBottomRef" class="offer-dashboard__table-bottom">
              <Pagination
                show-viewing-text
                :viewing-count="tableViewingCount"
                :total-count="rowsWithDealerMode.length"
                :rows-per-page="rowsPerPage"
                :has-prev-page="hasPrevTablePage"
                :has-next-page="hasNextTablePage"
                @update:rows-per-page="handleTableRowsPerPageChange"
                @prev="handlePrevTablePage"
                @next="handleNextTablePage"
              />
            </div>
          </template>

          <template v-else>
            <div class="offer-dashboard__card-grid" :style="cardGridStyle">
              <OfferCard
                v-for="(card, i) in rowsAsCards"
                :key="i"
                v-bind="card"
                :ref="(el) => setCardRef(el, i)"
                :has-prev-deal="i > 0"
                :has-next-deal="i < rowsAsCards.length - 1"
                  @prev-deal="handleCardPrev(i)"
                @next-deal="handleCardNext(i)"
                @remove-from-list="handleRemoveFromList(card.auctionId)"
                @viewed="markSeen(card.auctionId)"
              />
            </div>
            <p v-if="visibleRows.length === 0" class="offer-dashboard__empty">
              No vehicles match the current filters.
            </p>
          </template>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import AppHeader from '../AppHeader/AppHeader.vue'
import Breadcrumb from '../Breadcrumb/Breadcrumb.vue'
import SidebarNav from '../SidebarNav/SidebarNav.vue'
import OfferTabs from '../OfferTabs/OfferTabs.vue'
import SearchInput from '../SearchInput/SearchInput.vue'
import FilterChipGroup from '../FilterChipGroup/FilterChipGroup.vue'
import OfferTableHeader from '../OfferTableHeader/OfferTableHeader.vue'
import OfferTableRow from '../OfferTableRow/OfferTableRow.vue'
import Pagination from '../Pagination/Pagination.vue'
import DealershipFilterDropdown from '../DealershipFilterDropdown/DealershipFilterDropdown.vue'
import OfferCard from '../OfferCard/OfferCard.vue'
import ResultsToolbar from '../ResultsToolbar/ResultsToolbar.vue'
import rowMocks from '../OfferTableRow/mock.js'

const props = defineProps({
  // 账号下挂多个经销商时才显示 Dealership 下拉内容,见
  // DealershipFilterDropdown 自己的逻辑
  isMultiDealer: { type: Boolean, default: true },
  // 2026-08 按你的要求:Buying/Selling 分开两个独立的数量控制,不再共用
  // 一个 vehicleCount——切 tab 时各自记住自己的数量,不会因为切换 tab
  // 就互相覆盖。各自范围 1~5(2026-09-01 删掉两行 mock 之后,Buying/
  // Selling 现在各自只有 5 条数据,原来是 6),用于演示"车辆数量变化时
  // 页面长什么样",不是真实分页,细节见下面 rowsLimited 的注释
  // 2026-09-03 按你的要求默认值从 5 改成 15,配合下面 rows 扩到 30 条
  // (15 Buying + 15 Selling)
  buyingVehicleCount: { type: Number, default: 15 },
  sellingVehicleCount: { type: Number, default: 15 }
})

const dealershipDropdownOpen = ref(false)
const viewMode = ref('table')

// 2026-08 按你的要求,参照真实原型(My-ACV--Dealer-filter-main)把
// DealershipFilterDropdown 改成真正悬浮在 "Dealership" 按钮下方的
// position:fixed 浮层,不再是紧贴筛选行往下顶开布局的静态面板。
// filterChipGroupRef 用来拿到 FilterChipGroup 内部暴露出来的按钮 DOM
// 节点(见该组件 notes.md),dealerPopoverWrapRef 是浮层自己的包裹层,
// 用来判断"点击是否在浮层外部"。
const filterChipGroupRef = ref(null)
const dealerPopoverWrapRef = ref(null)
const dealerPopoverStyle = ref({})

function updateDealerPopoverPosition() {
  const btn = filterChipGroupRef.value?.dealershipBtnRef
  if (!btn) return
  const rect = btn.getBoundingClientRect()
  // 原型里这个浮层是对齐触发按钮的右边缘展开(align:'right'),但我们的
  // "Dealership" 按钮是筛选行最靠左的第一个,右对齐大概率会超出视口
  // 左边界,所以改成对齐左边缘展开,见 notes.md 的调整说明
  dealerPopoverStyle.value = {
    position: 'fixed',
    top: `${rect.bottom + 6}px`,
    left: `${rect.left}px`,
    zIndex: 10000
  }
}

function toggleDealershipDropdown() {
  dealershipDropdownOpen.value = !dealershipDropdownOpen.value
  if (dealershipDropdownOpen.value) {
    nextTick(updateDealerPopoverPosition)
  }
}

// 点浮层外部 / 按 Escape 关闭,滚动时跟着重新定位——都是照抄原型里
// document click / keydown / window scroll 这三个全局监听的行为
function handleOutsideClick(event) {
  if (!dealershipDropdownOpen.value) return
  const btn = filterChipGroupRef.value?.dealershipBtnRef
  const insidePopover = dealerPopoverWrapRef.value?.contains(event.target)
  const insideBtn = btn?.contains(event.target)
  if (!insidePopover && !insideBtn) {
    dealershipDropdownOpen.value = false
  }
}

function handleEscapeKey(event) {
  if (event.key === 'Escape') {
    dealershipDropdownOpen.value = false
  }
}

function handleRepositionOnScroll() {
  if (dealershipDropdownOpen.value) {
    updateDealerPopoverPosition()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleOutsideClick)
  document.addEventListener('keydown', handleEscapeKey)
  window.addEventListener('scroll', handleRepositionOnScroll, { passive: true, capture: true })
  window.addEventListener('resize', handleRepositionOnScroll)

  // 影子横向滚动条要用到的尺寸(表格实际内容宽度/是否溢出/Pagination
  // 高度)都会随窗口尺寸、列宽变化,用 ResizeObserver 统一盯着这两个
  // 元素自己的盒子尺寸变化,不用每处改动列宽的地方都手动调一次。
  window.addEventListener('resize', updateHScrollMeasurements)
  hScrollResizeObserver = new ResizeObserver(updateHScrollMeasurements)
  if (tableScrollRef.value) hScrollResizeObserver.observe(tableScrollRef.value)
  if (tableBottomRef.value) hScrollResizeObserver.observe(tableBottomRef.value)
  nextTick(updateHScrollMeasurements)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleOutsideClick)
  document.removeEventListener('keydown', handleEscapeKey)
  window.removeEventListener('scroll', handleRepositionOnScroll, { capture: true })
  window.removeEventListener('resize', handleRepositionOnScroll)
  window.removeEventListener('resize', updateHScrollMeasurements)
  if (hScrollResizeObserver) hScrollResizeObserver.disconnect()
})

const header = {
  initialSelectedIndex: 1, // My ACV
  companyName: 'Magnacar Auto Corp',
  userName: 'Emily Huang',
  avatarLetter: 'A'
}

// [2026-08 按你的要求更正,2026-09-08 反过来又改回联动] Buying/Selling
// tab 旁边红点里的数字、以及 sidebar "Offers" 旁边的 badge,统计的是
// "这个tab里有几条 New(未处理)的",用来提醒用户还有几个新 deal 没
// 处理。sidebar 的 Offers badge = Buying 的 New 数 + Selling 的 New 数
// (两个tab红点数字加起来)。
// 2026-09-02 按你的要求改成 isRowNew(r)(= statusNew 且没被标记"看过"),
// 不再直接读 r.statusNew——看过的 deal 不该继续算在这两个数字里。
// 【2026-09-08 第二次更正】上一版故意统计 buyingRows/sellingRows 全部
// 15条,不受 buyingVehicleCount/sellingVehicleCount 演示用的截取数量
// 影响(理由是"现实里提醒不该因为调小演示行数就变少")——你反馈调小
// "Vehicles shown"之后这两个数字和 filter chip 的数字不一致,"显示
// 不对",要求改成和 filter chip 一样跟着"Vehicles shown"滑块联动。
// 改成基于下面新增的 buyingRowsLimited/sellingRowsLimited(按各自的
// buyingVehicleCount/sellingVehicleCount 截取,不看当前是在 Buying 还是
// Selling tab——sidebar/两个tab的红点要同时反映两侧各自的数字,不能像
// rowsLimited 那样只算"当前激活的那个tab")。
const buyingNewCount = computed(() => buyingRowsLimited.value.filter(isRowNew).length)
const sellingNewCount = computed(() => sellingRowsLimited.value.filter(isRowNew).length)

// 2026-08 按你的要求新增,对照节点 7432:69595 核实:"My ACV" nav tab 旁
// 边的红点,只要 Buying/Selling 任意一边有 New 状态的 deal 就显示,复用
// 上面这两个已经核实过的 New 数量,不重新定义逻辑
const hasAnyNewDeal = computed(() => buyingNewCount.value + sellingNewCount.value > 0)

const sidebar = computed(() => ({
  activeItem: 'offers',
  offersCount: buyingNewCount.value + sellingNewCount.value
}))

// 2026-08 按你的要求:Buying/Selling 要真的可以点、点了要换数据,不再是
// 摆设。总共 12 条 mock 行按顺序切成前 6 条(Buying)/ 后 6 条
// (Selling)——这个"前6后6"纯粹是为了满足"总共12个,buying 6个 selling
// 6个"这个数量要求做的分组,不对应任何 Figma 数据或真实业务规则(没有
// 哪个字段真的标记"这行是在卖还是在买"),细节见 OfferTabs/notes.md。
const activeMainTab = ref('buying')
function handleTabSelect(tab) {
  activeMainTab.value = tab
  currentTablePage.value = 1
}
const activeTabRows = computed(() =>
  activeMainTab.value === 'selling' ? sellingRows : buyingRows
)

const tabs = computed(() => ({
  activeTab: activeMainTab.value,
  buyingCount: buyingNewCount.value,
  sellingCount: sellingNewCount.value
}))

// 2026-09-02 按你的要求新增:Dealership 筛选/Dealer Name 显示只在
// "Selling tab + 账号本身是多经销商"这个组合下才有意义——Buying tab
// 不管账号是不是多经销商都不显示(你的原话"buying 没有dealership
// filter for both single and multi dealer"),对照 Figma node
// 6837:16635/16636 核实:这个节点(表头 Auction ID/Type,行内容直接显示
// Auction ID,没有 Dealer Name/Dealership 相关任何内容)和现有的
// isMultiDealer=false 实现是同一个视觉效果,不是需要另外单独实现的新
// 样式——所以这里不是新增一套"buying 专属"的展示逻辑,是让 Buying tab
// 复用已经核实过的 isMultiDealer=false 这套渲染。真正的 isMultiDealer
// 这个 prop(账号本身是不是多经销商)保留原样不变,新增
// effectiveMultiDealer 这一个派生值,统一替换掉下面 FilterChipGroup/
// DealershipFilterDropdown/OfferTableHeader/每一行/每张卡原来直接读
// isMultiDealer 的地方。
const effectiveMultiDealer = computed(() => props.isMultiDealer && activeMainTab.value === 'selling')

// 2026-09-08(第三次)按你的要求新增:table view 表头+所有数据行共享的
// grid 列宽定义,细节和为什么要改成 CSS Grid 见下面
// `.offer-dashboard__table-scroll` CSS 注释和 notes.md 同名条目。每一列
// `minmax(Npx, Nfr)`——Npx 是每一列真正的最小宽度(内容宽度+左右各16px
// 留白,永远不会缩得更窄,不够宽时靠这个容器横向滚动),Nfr 让宽屏时
// 每一列按同一个比例一起变宽(这个数值和 px 部分保持一样,效果等价于
// 原来 flex-grow:N 的比例缩放,只是现在是整个 grid 只算一次,不会再和
// 数据行分别算出不同的浮点像素值)。Dealer/Auction ID 这一列的宽度按
// `effectiveMultiDealer` 在 140px(只有Auction ID+Type徽标)和200px
// (可能是长经销商名)之间切换,和 OfferTableHeader.vue/OfferTableRow.vue
// 里 isMultiDealer 版本的 --dealer--wide 修饰类是同一个判断条件、同一
// 组数值。
// 2026-09-08(第五次)按你的要求:触发横向滚动之前,先把每一列自己的
// 左右留白统一压缩到16px,尽量多撑一会儿再滚动——Vehicle 列原来右
// padding是35px(核实自Figma,不是常见的16px),内容宽度146px不变,
// 压完宽度从195px收窄到146+14+16=176px;Update 列原来左padding是24px
// (2026-09-02定的既有值),内容区宽度185px不变,压完宽度从225px收窄到
// 185+16+16=217px。其余列本来就已经是左右各16px,不用再压。两处压缩
// 后的具体CSS改动见 OfferTableHeader.vue/OfferTableRow.vue 各自同一处
// 注释。
// 2026-09-08(第六次,已撤销)你指出你说的"间距太大"根本不是宽屏场景,
// 是屏幕过小、快要触发横向滚动条的场景——上面那次改动(除 Update 外全部
// 固定像素、不跟着宽屏变宽)解决的是一个你没有在问的问题,已经撤回,
// 恢复成每列都用 minmax(Npx, Nfr) 的写法。
// 2026-09-08(第七次)真正的根因:Reserve 这一列的 123px 是从
// "ACV Estimate"(11个字符)这个旧标题核实来的历史数值——后来标题先改成
// "Reserve Price"、这次又缩短成"Reserve"(7个字符),但列宽从来没有跟着
// 缩短过,一直沿用123px。用浏览器实测过:"Reserve"标题+这一列实际数据
// (比如"$27,000")需要的真实宽度只要约85px(53px文字+16+16padding),
// 123px里有约38px是纯历史遗留的多余空白——这多出来的38px正好会让
// "Time Remaining→Reserve"和"Reserve→Sent"两段视觉间距都显得特别大,
// 这就是你反馈"reserve/sent/time remaining间距太大"的真正来源(Time/
// Sent 两列自己实测已经很紧凑,不需要再压)。改法:把这一列的宽度从
// 123px收窄到90px(85px最小需求+5px余量,不是压到刚好卡边的85px)。
// 2026-09-08(第八次)按你的要求:除 Vehicle/Update 外,其余列(Dealer/
// Time/Reserve/Sent/Received)的左右padding都从16px压缩到4px——不是
// 直接把列宽减32px(那样会砍进内容区,裁切金额/标题,实测过 Reserve/
// Sent/Received 三列本来就已经接近内容最小宽度,直接减32px肯定裁切,
// 细节见 fragments/OfferDashboard/notes.md 同名条目),只压缩纯留白,
// 内容区宽度不变,每列跟着减少24px(12+12)。
// 2026-09-08(第十次,已撤销)你反馈宽屏下 Reserve/Sent/Received 间距
// 比其它列小、显得不均衡,当时把除 Update 外全部改成固定像素——你指出
// 这次改动"全错了",已经撤销,恢复成每列都用 `minmax(Npx, Nfr)`。
// 2026-09-08(第十一次)按你的要求:Reserve/Sent/Received 三列的最小
// 列宽各增加12px(78/73/81,原来是66/61/69),跟 OfferTableHeader.vue/
// OfferTableRow.vue 的改动同步。
// 2026-09-08(第十二次)按你的要求再加12px(90/85/93)。
// 2026-09-08(第十三次)按你的要求再加12px(102/97/105)。
const tableGridColumns = computed(() => {
  const dealerWidth = effectiveMultiDealer.value ? 176 : 116
  return [
    'minmax(80px,80fr)',
    `minmax(${dealerWidth}px,${dealerWidth}fr)`,
    'minmax(176px,176fr)',
    'minmax(100px,100fr)',
    'minmax(102px,102fr)',
    'minmax(97px,97fr)',
    'minmax(105px,105fr)',
    'minmax(217px,217fr)'
  ].join(' ')
})

// [2026-08 按你的要求更正] 之前这几个数字故意不跟着 dealerFilter/
// chipFilter 联动,一直显示 rowsLimited(当前 tab 全部6条)算出来的
// 总数——你指出选了 dealership 之后,筛选结果明明只剩1条,chip 旁边的
// 数字却还是没筛选时的总数,对不上。现在改成基于 dealerFilteredRows
// (见下面,只按 dealerFilter narrow 过,不按 chipFilter 本身 narrow)
// 算数量——这样每个 chip 显示的是"在当前经销商筛选下,点这个chip会筛出
// 多少条",不包含其它 chip 的选中状态。
// 【2026-09-09 更正】"不包含其它chip的选中状态"这句现在只对
// negotiation/makeOffer(父级)还成立——New/Received/Sent/Declined 这四个
// 子级 chip 已经改成会跟着父级(negotiation/makeOffer)的选中状态联动,
// 细节见下面 `typeFilteredRows`/`filters` 那段注释,这里的
// `dealerFilteredRows` 本身没有变(还是只按 dealerFilter narrow),只是
// 它现在不是子级计数唯一的数据源了。
// 2026-09-08 修复真实bug:你反馈点 "Remove From List" 把 deal 移除之后,
// Declined 这个 chip 上的数字没有跟着减少,导致 chip 写着还有4条、点开
// 却是空的("No vehicles match the current filters.")。原因是这里只按
// dealerFilter narrow,没有把 removedAuctionIds 过滤掉的行也排除——下面
// matchesFilters()(决定实际筛出哪些行)一直有这条判断
// (`if (removedAuctionIds.value.includes(row.auctionId)) return false`),
// 但算 chip 数字的 dealerFilteredRows 没有跟着排除,两边用的"当前还剩下
// 哪些行"这个基准数据本身就不一致,不是 filters computed 自己的算法错了。
const dealerFilteredRows = computed(() =>
  rowsLimited.value.filter(
    (r) => !dealerFilter.value.length || dealerFilter.value.includes(r.dealerName)
  ).filter((r) => !removedAuctionIds.value.includes(r.auctionId))
)

// 2026-09-03 四个 single 筛选(New/Received/Sent/Declined)的计数全部改成
// 用 rowToDealState()/rowShowsNew()(定义见上面 isRowNew 旁边)算,不再
// 各自直接读 statusReceived/sentAmount 这些和 Update 列实际显示脱节的
// 原始字段——细节和发现的 bug 见下面 matchesFilters 旁边的注释,这里的
// 计数和那边的匹配逻辑必须用同一套判断,否则又会出现"chip 上写着有几条,
// 点开却是空/或者混进了 chip 上没写的行"这种数字和内容对不上的问题。
// 2026-09-09 按你的要求改成"分层联动":In negotiation/Make Offer 是父级
// (type),New/Received/Sent/Declined 是子级(status),两者不是平级的
// "谁选了都互相影响"关系:
// - 父级(negotiationCount/makeOfferCount)永远只按 dealerFilteredRows
//   算,不受任何 status chip 选中状态影响——不管 New/Received/Sent/
//   Declined 选了哪个,父级的数字都不变。
// - 子级(newCount 等四个)改成基于 typeFilteredRows(见下面,在
//   dealerFilteredRows 基础上再套一层当前 negotiation/makeOffer 的选中
//   范围)算,不再直接用 dealerFilteredRows——这样选中 Make Offer 之后,
//   Sent 这类子级chip的数字会跟着收窄成"Make Offer 范围内有多少条
//   Sent",不管 Sent 自己有没有被选中都用这条规则算,不存在"选中了就
//   冻结数字"这回事(讨论过为什么不能是"选中的chip自己也联动变成和总数
//   一样"——那样算出来的数字永远等于当前可见行数,没有传递新信息,细节见
//   聊天记录,这里不重复)。
const typeFilteredRows = computed(() => {
  const { negotiation, makeOffer } = chipFilter.value
  if (!negotiation && !makeOffer) return dealerFilteredRows.value
  return dealerFilteredRows.value.filter(
    (r) => (negotiation && r.offerType === 'in-negotiation') || (makeOffer && r.offerType === 'make-offer')
  )
})
const filters = computed(() => ({
  negotiationCount: dealerFilteredRows.value.filter((r) => r.offerType === 'in-negotiation').length,
  makeOfferCount: dealerFilteredRows.value.filter((r) => r.offerType === 'make-offer').length,
  newCount: typeFilteredRows.value.filter(rowShowsNew).length,
  receivedCount: typeFilteredRows.value.filter((r) => rowToDealState(r) === 'received').length,
  sentCount: typeFilteredRows.value.filter((r) => rowToDealState(r) === 'sent').length,
  declinedCount: typeFilteredRows.value.filter((r) => rowToDealState(r) === 'declined').length
}))

// 2026-09-11(第二次)按你的要求:搜索不再是输入过程中实时触发,只有按
// Enter/点清空按钮才真的执行。searchInputValue 是输入框显示的文字(纯
// v-model,每次按键都变),searchValue 是真正参与 matchesFilters 过滤的
// "已提交"查询词,只在收到 SearchInput 的 search 事件时才更新,细节见
// SearchInput/notes.md。
const searchInputValue = ref('')
const searchValue = ref('')
const sortColumn = ref(null)

// 2026-08 按你的要求新增:点 filter chip / 应用 Dealership 下拉之后,
// table/tile 要真的只显示匹配的行,不再只是 chip 自己变色。
// dealerFilter:选中的经销商名单(来自 DealershipFilterDropdown 的
// apply/reset),空数组 = 不筛选,显示全部经销商。
const dealerFilter = ref([])
// chipFilter:FilterChipGroup 当前的选中状态,结构和它 emit 的
// filter-change 事件一致,null = 不筛选。
const chipFilter = ref({ negotiation: false, makeOffer: false, single: null })

// 已应用的经销商筛选摘要文字,照抄原型 dealerChipText() 的规则:按字母
// 排序后取第一个,超过1个就加 ", +N"
const dealerChipText = computed(() => {
  const sorted = [...dealerFilter.value].sort((a, b) => a.localeCompare(b))
  return sorted.length > 1 ? `${sorted[0]}, +${sorted.length - 1}` : sorted[0]
})

function handleApplyDealerFilter(selectedDealers) {
  dealerFilter.value = selectedDealers
  dealershipDropdownOpen.value = false
  currentTablePage.value = 1
}

function handleClearFilters() {
  dealershipDropdownOpen.value = false
  dealerFilter.value = []
  chipFilter.value = { negotiation: false, makeOffer: false, single: null }
  currentTablePage.value = 1
}

// 2026-09-02 新增,配合 OfferCard/OfferTableRow 的 "Remove From List" 二次
// 确认框(点 "Yes, Remove" 才会走到这里)——按 auctionId(每一行唯一)记住
// 被移除的行,在 matchesFilters 里过滤掉,不需要真的从 rows/mock 数据里
// 删除元素。用数组 + 整体替换(不是 Set.add 原地修改)是为了让 ref 的
// 变化能被 Vue 侵测到,细节见 fragments/RemoveFromListDialog/notes.md。
const removedAuctionIds = ref([])
function handleRemoveFromList(auctionId) {
  removedAuctionIds.value = [...removedAuctionIds.value, auctionId]
}

// 2026-09-02 新增,按你的要求:点 VDP 图片链接、或打开 InformationDialog
// (hover 按钮/Previous/Next 切到相邻那一行都算),都算"看过这笔 deal"
// 了——New 标记应该消失,Buying/Selling tab 和 sidebar Offers 旁边的数字
// 也要跟着减少。同 removedAuctionIds 一样,只是 session 内的本地状态
// (按 auctionId 记,数组+整体替换让 ref 变化能被侵测到),不是真的改了
// mock 数据里的 statusNew 字段——isRowNew() 是所有需要判断"这一行现在
// 还算不算 New"的地方唯一的入口,不要绕开它直接读 row.statusNew。
const seenAuctionIds = ref([])
function markSeen(auctionId) {
  if (!seenAuctionIds.value.includes(auctionId)) {
    seenAuctionIds.value = [...seenAuctionIds.value, auctionId]
  }
}
// 2026-09-08 补上同一个 bug 的另一半:被 "Remove From List" 移除的行不该
// 再算 New——之前这里没检查 removedAuctionIds,导致 Buying/Selling tab
// 旁边的红点数字、sidebar "Offers" 的 badge(两者都是靠这个函数算的)在
// 移除一条 New 状态的 deal 之后不会跟着减少,和下面 dealerFilteredRows
// 那处 chip 计数是同一类问题(算"现在还剩下哪些行"时漏掉了
// removedAuctionIds 这个过滤条件)。
function isRowNew(row) {
  return row.statusNew && !seenAuctionIds.value.includes(row.auctionId) && !removedAuctionIds.value.includes(row.auctionId)
}
// 2026-09-03 挪到这里(原来定义在下面 rowsAsCards 旁边,靠函数声明的
// hoisting 在这之前也能用,这次为了讲清楚"filter chip 的计数/匹配和
// Update 列显示用的是同一套优先级判断"这件事,把它挪到调用者(filters/
// matchesFilters)前面,不是逻辑本身有变化)——declined 优先、再 sent、
// 默认 received,和 OfferTableRow.vue 自己的 dealState computed 是同一套
// 判断,table/card 的 Update 列/状态chip 显示的就是这个值,不是分别再看
// statusReceived 这个字段。
function rowToDealState(row) {
  if (row.statusDeclined) return 'declined'
  if (row.statusSent) return 'sent'
  return 'received'
}
// 2026-09-03 新增:New chip 到底应不应该显示,规则和 OfferCard/
// OfferTableRow 的 showNewChip computed 完全一样——New 只能和
// received/declined 搭配,从不和 sent 一起出现,而且要叠加上面的
// isRowNew()(看过之后就不再算 New)。filter chip 的 New 计数/匹配如果
// 只看 row.statusNew 这一个原始字段,会把"实际上 Update 列不会显示 New"
// 的行也算进去(比如 statusNew+statusSent 都是 true 的行,dealState 是
// sent,New 从来不会真的渲染出来)。
function rowShowsNew(row) {
  const state = rowToDealState(row)
  return isRowNew(row) && (state === 'received' || state === 'declined')
}

// In negotiation / Make Offer 是可以同时选中的(见 FilterChipGroup 的
// Figma 标注:两者多选),选中任一个就要求 offerType 匹配其中之一;
// New/Received/Sent/Declined 互斥单选。
// 【2026-09-03 修正,你反馈"buying and selling filter chip 的显示和
// 对应的 filter 内容"有逻辑问题】这四个 single 分支之前各自直接读一个
// "看起来相关"但其实和 Update 列实际显示脱节的原始字段,逐条核对
// mock.js 发现四个全部有问题(不只是你截图指出的 Sent+Make Offer 组合):
// - **Declined**(上一轮已修):之前写死 `return false`,永远选不出
//   任何结果——已经改成判断 `row.statusDeclined`,这次改成
//   `rowToDealState(row) === 'declined'`,和其它三个分支统一用同一个
//   来源(结果等价,统一是为了避免以后 statusDeclined/statusSent 同时
//   为 true 这种"理论上不该出现但没人校验"的组合让 declined 分支的
//   判断标准和 Update 列脱节)。
// - **Sent**:之前判断 `sentAmount 存在(非'--')`,不是 `statusSent`
//   这个真正驱动 Update 列显示的字段——Selling tab 的 rowToyotaMatrix
//   就是个例子:`sentAmount: '$5,200'`(有数字)但 `statusSent: false`,
//   Update 列实际显示的是 "Received"。之前的写法会把这一行也算进
//   "Sent",导致 chip 上写 "Sent (3)" 但其中一条其实是 Received、
//   点开筛选也会把它列进来——这正是你截图指出"Sent 写 3 个,筛出来的
//   内容却是空"这个诡异现象背后更深一层的原因(Sent 本身计数就多算了,
//   叠加 Make Offer 一起选之后,真正符合"Make Offer 且真的是 Sent"的
//   行数是 0,两个 bug 叠在一起看起来更离奇)。
// - **Received**:之前判断 `row.statusReceived` 这个字段,但 Update 列
//   的 dealState 判断根本不看这个字段(`rowToDealState()`/
//   `OfferTableRow.vue` 的 dealState computed 都只看 statusDeclined/
//   statusSent,没有 sent/declined 时默认落到 'received')——比如
//   rowWithNoStatusChip/rowDodgeCharger 的 `statusReceived` 都是
//   `false`,但 Update 列因为 statusDeclined/statusSent 都是 false,
//   实际显示的正是 "Received"。之前的写法会把这些行排除在 "Received"
//   筛选结果之外,尽管它们在 Update 列上明明显示着 Received。
// - **New**:之前只判断原始的 `row.statusNew`,漏了两层已经在
//   showNewChip/rowShowsNew 里实现过的规则:(1) New 从不和
//   dealState==='sent' 一起出现(比如 rowChevyMalibu/rowFordEscapeSE
//   都是 `statusNew:true` 但 dealState 是 'sent',Update 列根本不会
//   渲染 New);(2) 这一行是不是已经被看过(`isRowNew()`,决定 sidebar/
//   Buying-Selling 数字的同一个函数)——之前选中"看过"的行,sidebar 数字
//   会跟着减少,但这个 filter chip 还是会继续把它算进 New、筛选也筛得出
//   来,和其它地方的"看过就不算 New"这条规则不一致。
// 统一改成调用 `rowToDealState(row)`/`rowShowsNew(row)`(定义见上面
// isRowNew 旁边)——和上面 `filters` computed 用的是同一套函数,保证
// "chip 上写的数字"和"点开筛出来的内容"永远是同一个判断标准算出来的,
// 不会再出现两者对不上的情况。
function matchesFilters(row) {
  if (removedAuctionIds.value.includes(row.auctionId)) return false
  // 2026-09-11 按你的要求:搜索框之前只是接了 v-model,没有真的接上筛选
  // 逻辑。搜索框占位文案写的是 "Search by year, make, model, VIN",所以
  // 只匹配 vehicleTitle(年份+品牌+型号拼在一起的字段)和 vin 这两个
  // 字段,不含 Auction ID/Dealer Name;大小写不敏感、trim 掉两端空格,
  // 和其它筛选条件一样是 AND 组合、实时生效,细节见 SearchInput/notes.md。
  const searchQuery = searchValue.value.trim().toLowerCase()
  if (searchQuery) {
    const haystack = (row.vehicleTitle + ' ' + row.vin).toLowerCase()
    if (!haystack.includes(searchQuery)) return false
  }
  if (dealerFilter.value.length && !dealerFilter.value.includes(row.dealerName)) {
    return false
  }
  const { negotiation, makeOffer, single } = chipFilter.value
  if (negotiation || makeOffer) {
    const matchesOfferType =
      (negotiation && row.offerType === 'in-negotiation') ||
      (makeOffer && row.offerType === 'make-offer')
    if (!matchesOfferType) return false
  }
  if (single === 'new' && !rowShowsNew(row)) return false
  if (single === 'received' && rowToDealState(row) !== 'received') return false
  if (single === 'sent' && rowToDealState(row) !== 'sent') return false
  if (single === 'declined' && rowToDealState(row) !== 'declined') return false
  return true
}

// 2026-08:扩充成 12 行 —— 前 2 行(rowWithNewAndReceived/rowWithNoStatusChip)
// 是已核实的真实行数据,其余是你给了 10 张新真实照片后新增的自编 mockup
// 演示数据,两者性质不同,细节见 OfferTableRow/notes.md。
// 2026-09-01:按 "Offer States Logic for CC.md" 的 Number rules 整批重新
// 生成金额时,删掉了两行不存在的状态组合——rowWithMakeOffer(买家+Make
// Offer+Received,这个组合本身不存在)和 rowFiat500(offerType:'none',
// 每笔 deal 必须是 In Negotiation 或 Make Offer 之一,没有第三种合法
// 类型)。行数因此从 12 变成 10,细节见 OfferTableRow/mock.js 文件头注释。
// 2026-09-03:按你的要求 Buying/Selling 各扩到 15 行,前10行原样不动
// (已经核实/演示过的原有数据),后面各自新增10行——新增的20行全部是
// 自编 mockup 数据,补齐了之前缺的状态组合(尤其是 Selling 侧原来一行
// declined 都没有),细节和状态覆盖表见 OfferTableRow/mock.js 文件头
// 2026-09-03 那段注释。
const rows = [
  rowMocks.rowWithNewAndReceived,
  rowMocks.rowWithNoStatusChip,
  rowMocks.rowLexusES,
  rowMocks.rowHyundaiKona,
  rowMocks.rowJeepWrangler,
  rowMocks.rowToyotaMatrixSent,
  rowMocks.rowMalibuSent,
  rowMocks.rowEscapeTitaniumDeclined,
  rowMocks.rowEscapeSEDeclined,
  rowMocks.rowChargerSentBuyer,
  rowMocks.rowBmwX5DeclinedBuyer,
  rowMocks.rowKonaReceived2,
  rowMocks.rowRx300Sent,
  rowMocks.rowFiat500SentBuyer,
  rowMocks.rowMalibuReceived2,
  rowMocks.rowToyotaMatrix,
  rowMocks.rowFordEscapeTitanium,
  rowMocks.rowChevyMalibu,
  rowMocks.rowDodgeCharger,
  rowMocks.rowFordEscapeSE,
  rowMocks.rowFocusRsReceivedSeller,
  rowMocks.rowRx300SentSeller,
  rowMocks.rowFiat500SentSeller,
  rowMocks.rowKonaDeclinedSeller,
  rowMocks.rowWranglerDeclinedSeller,
  rowMocks.rowLexusEsReceivedSeller,
  rowMocks.rowEscapeSeReceivedSeller,
  rowMocks.rowBmwX5DeclinedSeller,
  rowMocks.rowEscapeTitaniumDeclinedSeller,
  rowMocks.rowChargerSentSeller
]

// 2026-09-03:15+15 切分——前15条归Buying、后15条归Selling,原有10行
// (5 Buying + 5 Selling)保持在各自这一半的最前面,不打乱它们的位置。
const buyingRows = rows.slice(0, 15)
const sellingRows = rows.slice(15, 30)

// 2026-08 按你的要求:Buying/Selling 各自用自己的 vehicleCount(不再共用
// 一个),按当前选中的 tab 挑对应那一个,夹在 [1, activeTabRows.length]
// 之间(2026-09-03 起每个 tab 最多 15 条),避免传入 0 或超过总数时表格/
// 卡片网格直接空掉或越界。这一步只是"截取演示用的车辆数量",filter chip
// 的数字(见上面 filters)也是照着这份数据算的,不受下面 chipFilter/
// dealerFilter 影响。
const activeVehicleCount = computed(() =>
  activeMainTab.value === 'selling' ? props.sellingVehicleCount : props.buyingVehicleCount
)
const rowsLimited = computed(() =>
  activeTabRows.value.slice(0, Math.max(1, Math.min(activeTabRows.value.length, activeVehicleCount.value)))
)

// 2026-09-08(第二次)新增,给上面 buyingNewCount/sellingNewCount 用——
// 和 rowsLimited 用的是同一套夹在 [1, 总行数] 之间的截取逻辑,区别是
// rowsLimited 只算"当前激活的那个tab",这两个是"不管现在在哪个tab,
// Buying/Selling 各自按自己的 vehicleCount 截取"，因为 sidebar/两个
// tab 的红点需要同时反映两侧的数字,不能只有当前tab那一侧是对的。
const buyingRowsLimited = computed(() =>
  buyingRows.slice(0, Math.max(1, Math.min(buyingRows.length, props.buyingVehicleCount)))
)
const sellingRowsLimited = computed(() =>
  sellingRows.slice(0, Math.max(1, Math.min(sellingRows.length, props.sellingVehicleCount)))
)

// 真正渲染到 table/tile 的行:在 rowsLimited 基础上再按当前选中的
// filter chip / dealership 筛一遍,筛完为空就是空(不会强行凑数）。
const visibleRows = computed(() => rowsLimited.value.filter(matchesFilters))

// 每一行的 isMultiDealer 都跟着 dashboard 这个开关走,而不是各自 mock
// 里写死的值,这样切换 control 才能真的看到表格跟着变。
// 2026-09 新增 viewerRole:table view 的 hover CTA(见 OfferTableRow 自己
// 的改动)和 tile view 的 OfferCard 用的是同一套 viewerRole+dealState
// 判断逻辑——table/tile 本来就是同一笔 deal 的两种展示方式,按你的要求
// "对应的 data 和 interaction 都是一样的",两边必须拿到同一个 viewerRole
// (按当前 Buying/Selling tab 决定),不能各算各的。
const viewerRoleValue = computed(() => (activeMainTab.value === 'selling' ? 'seller' : 'buyer'))
// 2026-09-02 按你的要求,statusNew 这里跟着 isRowNew() 覆盖一次——点开过
// 这一行(VDP/InformationDialog/Previous/Next)之后,表格 Update 列的
// New chip 应该跟着消失,不能继续用 mock 数据里原始的 statusNew
const rowsWithDealerMode = computed(() =>
  visibleRows.value.map((row) => ({
    ...row,
    isMultiDealer: effectiveMultiDealer.value,
    viewerRole: viewerRoleValue.value,
    statusNew: isRowNew(row)
  }))
)

// 2026-09-08 修复真实bug:你反馈 table view 的顶部/底部 Pagination(Rows
// per page 下拉 + 上一页/下一页箭头)点击后完全没反应,表格永远一页显示
// 全部——之前这两处 Pagination 从来没有真的接上任何状态,顶部靠一个写死
// 的 `topPagination = { hasPrevPage:false, hasNextPage:true }` 常量,
// 底部 `:viewing-count`/`:total-count` 两个都传的是同一个
// `visibleRows.length`(所以永远显示"Viewing N out of N"),`rows-per-
// page`/`prev`/`next` 这三个事件完全没有监听。这次补上真正的分页状态。
// tile view(rowsAsCards,直接用 visibleRows,没有引入下面这套分页)按你
// 的要求不动,只影响 table view。
// 用 v-show(不是把 v-for 的数据源换成分页后的切片)是为了不动
// InformationDialog 的 Previous/Next 这套已有逻辑——handleTablePrev/
// handleTableNext 是按 rowsWithDealerMode 的"绝对下标"算相邻行的,如果
// v-for 换成分页切片,`i` 就变成"页内下标",这两个函数会算错相邻行。
// Dialog 本身走 Teleport 渲染到 body,不受它所在的行是否 v-show 隐藏
// 影响,所以"当前页只显示这一页的行,但 Prev/Next 仍可以跨页切到相邻
// deal"这两件事互不冲突,不需要额外处理跨页的情况。
const rowsPerPage = ref(10)
const currentTablePage = ref(1)
const totalTablePages = computed(() => Math.max(1, Math.ceil(rowsWithDealerMode.value.length / rowsPerPage.value)))
// 页数变少后(筛选变严格/移除了deal)如果 currentTablePage 还停在一个
// 已经不存在的页码,自动夹回最后一页,不需要在每个可能改变筛选结果的
// 地方都记得手动把 currentTablePage 重置回 1(下面几个 handleXxx 里
// 显式重置到第1页,是为了"换了筛选条件就该从第一页看起"这个更好的
// 使用体验,不是为了避免越界——越界这里已经保底了)。
const clampedTablePage = computed(() => Math.min(currentTablePage.value, totalTablePages.value))
const hasPrevTablePage = computed(() => clampedTablePage.value > 1)
const hasNextTablePage = computed(() => clampedTablePage.value < totalTablePages.value)
const tableViewingCount = computed(() => {
  const start = (clampedTablePage.value - 1) * rowsPerPage.value
  return Math.max(0, Math.min(rowsPerPage.value, rowsWithDealerMode.value.length - start))
})
function isRowOnCurrentTablePage(i) {
  const start = (clampedTablePage.value - 1) * rowsPerPage.value
  return i >= start && i < start + rowsPerPage.value
}
function handlePrevTablePage() {
  if (hasPrevTablePage.value) currentTablePage.value = clampedTablePage.value - 1
}
function handleNextTablePage() {
  if (hasNextTablePage.value) currentTablePage.value = clampedTablePage.value + 1
}
function handleTableRowsPerPageChange(value) {
  rowsPerPage.value = Number(value)
  currentTablePage.value = 1
}

// 2026-09-02 按 Figma node 7597:112866 新增:InformationDialog 两侧的
// Previous/Next。每个 OfferTableRow/OfferCard 只认识自己这一行/张,不知道
// "列表"这件事,所以 hasPrevDeal/hasNextDeal(排在第几个)和真正的
// "切到上一条/下一条"这个动作都要在这里算——这是唯一同时知道"当前可见
// 列表"和"每一行自己的 dialog 开关"的地方。
// `openDialog`/`closeDialog` 是 OfferTableRow.vue/OfferCard.vue 用
// defineExpose 露出来的两个方法(它们自己内部的 dialogOpen 这个 ref 本身
// 没有暴露给外面,只能通过这两个方法间接控制),这里用 v-for 里的函数式
// ref(`:ref="(el) => setXxxRef(el, i)"`)把每个实例按当前渲染的下标存进
// 这两个数组——用函数式 ref 而不是普通字符串 ref,是因为 v-for 列表长度
// 会随筛选/搜索变化,函数式写法能在每次重新渲染时把数组内容跟着刷新对齐,
// 不会留着筛选前的旧实例。
const tableRowRefs = ref([])
const cardRefs = ref([])
function setTableRowRef(el, i) {
  if (el) tableRowRefs.value[i] = el
}
function setCardRef(el, i) {
  if (el) cardRefs.value[i] = el
}

// 2026-09-10 新增:横向"影子"滚动条,细节和为什么这么做见模板里这段
// 注释旁边的 HTML 注释,这里只放实现。tableScrollWidth/showHScrollShadow
// 由 updateHScrollMeasurements() 统一算,paginationHeight 跟着底部
// Pagination 实际渲染的高度走(不写死数值,Pagination 自己以后改高度
// 不用回来同步这里)。isSyncingHScroll 这个标志是防止"我同步对方 →
// 对方触发 scroll 事件 → 又同步回我自己"这种双向监听常见的死循环。
const tableScrollRef = ref(null)
const hScrollShadowRef = ref(null)
const tableBottomRef = ref(null)
const tableScrollWidth = ref(0)
const showHScrollShadow = ref(false)
const paginationHeight = ref(0)
let isSyncingHScroll = false

function handleTableScroll() {
  if (isSyncingHScroll || !tableScrollRef.value || !hScrollShadowRef.value) return
  isSyncingHScroll = true
  hScrollShadowRef.value.scrollLeft = tableScrollRef.value.scrollLeft
  isSyncingHScroll = false
}
function handleShadowScroll() {
  if (isSyncingHScroll || !tableScrollRef.value || !hScrollShadowRef.value) return
  isSyncingHScroll = true
  tableScrollRef.value.scrollLeft = hScrollShadowRef.value.scrollLeft
  isSyncingHScroll = false
}
function updateHScrollMeasurements() {
  if (!tableScrollRef.value) return
  tableScrollWidth.value = tableScrollRef.value.scrollWidth
  showHScrollShadow.value = tableScrollRef.value.scrollWidth > tableScrollRef.value.clientWidth
  if (tableBottomRef.value) paginationHeight.value = tableBottomRef.value.offsetHeight
}
let hScrollResizeObserver = null
// viewMode 在 table/tile 之间切换时,v-if 会把 table-scroll/table-bottom
// 整个销毁重建,tableScrollRef/tableBottomRef 指向的是全新的元素,
// ResizeObserver 之前观察的旧元素已经不存在了,需要重新 observe 一次
// 新元素,不然切回 table 视图之后这条影子滚动条会停在上一次的尺寸不动。
watch(viewMode, () => {
  nextTick(() => {
    if (!tableScrollRef.value) return
    if (hScrollResizeObserver) {
      hScrollResizeObserver.disconnect()
      hScrollResizeObserver.observe(tableScrollRef.value)
      if (tableBottomRef.value) hScrollResizeObserver.observe(tableBottomRef.value)
    }
    updateHScrollMeasurements()
  })
})
// tableGridColumns 变化(比如 multi-dealer 开关切换列宽)只会改变
// table-scroll 内部内容的 scrollWidth,不一定会改变它自己盒子本身的
// 尺寸——ResizeObserver 观察的是盒子尺寸变化,不保证这种"盒子大小不变、
// 内容溢出量变了"的情况也会触发,所以单独再 watch 一次这个值,保证
// 列宽变化后影子滚动条的宽度一定会跟着重新算。
watch(tableGridColumns, () => nextTick(updateHScrollMeasurements))
// 切换逻辑统一是"关掉当前这一行的对话框 → 等一个 tick(让关闭的过渡/状态
// 先落定,避免同一时间两个对话框的 v-model 互相打架)→ 打开相邻那一行的
// 对话框"。没有做成"直接把内容换成相邻数据、同一个对话框不关闭"的方案——
// 那样需要把 dialogOpen 这个状态整个提到 OfferDashboard 层,牵动面更大,
// 现在这个"关了再开"的方案改动范围只在这三个文件内,效果上使用者感觉不到
// 明显差异(两次动画几乎连续播放)。
// 2026-09-02 按你的要求,切到相邻这一行/张也算"看过"了,补一句
// markSeen(用 rowsWithDealerMode/rowsAsCards 里对应下标的 auctionId,
// 跟点击 hover 按钮打开 dialog 是同一个"看过"概念,不是分开的规则)
function handleTablePrev(i) {
  tableRowRefs.value[i]?.closeDialog()
  markSeen(rowsWithDealerMode.value[i - 1]?.auctionId)
  nextTick(() => tableRowRefs.value[i - 1]?.openDialog())
}
function handleTableNext(i) {
  tableRowRefs.value[i]?.closeDialog()
  markSeen(rowsWithDealerMode.value[i + 1]?.auctionId)
  nextTick(() => tableRowRefs.value[i + 1]?.openDialog())
}
function handleCardPrev(i) {
  cardRefs.value[i]?.closeDialog()
  markSeen(rowsAsCards.value[i - 1]?.auctionId)
  nextTick(() => cardRefs.value[i - 1]?.openDialog())
}
function handleCardNext(i) {
  cardRefs.value[i]?.closeDialog()
  markSeen(rowsAsCards.value[i + 1]?.auctionId)
  nextTick(() => cardRefs.value[i + 1]?.openDialog())
}

// Tile 视图卡片:直接复用已核实的表格行数据,字段名能对上的原样映射,
// timeLeft 用 timeRemaining 拼出来。
// [2026-08 按你的要求(对照节点 7485:41392 核实:Figma 里每张卡片底部都
// 有一条 message)恢复] 之前这里显式传了 primaryMessage/secondaryMessage
// 为空字符串,把 OfferCard 组件自己的默认文案覆盖掉了,导致 tile 视图
// 12 张卡片一条 message 都不显示,和 Figma(每张卡片都有)不一致。现有
// 12 行 mock 数据里没有真实的"卖家还价多少/买家出价多少/几点几分"这种
// 逐行不同的数据,不编造这些,所以这里改成直接不传这两个字段,让每张
// 卡片都走 OfferCard 组件自己核实过的默认文案("Seller countered
// $4,500"/"You offered $3,800 · Today, 08:45 AM",来自这同一个 Figma
// 节点),而不是留空——这样才能满足"每个 card 都有 message"这个要求,
// 12 张卡片文案会完全一样,这是刻意的取舍,不是漏做。
// 2026-08 按 "Offer card — content & interaction spec" 重写:OfferCard
// 不再吃 statusNew/statusReceived/statusSent/statusDeclined 4个布尔值,
// 改成 dealState(单值)+ isNew,这里把表格行原有的4个布尔值折算成一个
// dealState(declined优先,再sent,再received,默认received)。viewerRole
// 按当前 Buying/Selling tab 决定(Buying=buyer 视角,Selling=seller 视角)。
// counterpartyAmount/ownAmount 拿表格行已有的 receivedAmount/sentAmount
// 对应过去(对方给的钱=receivedAmount,你自己出的钱=sentAmount),'--'
// 占位值时退回 acvEstimate 兜底——这是尽力而为的映射,不是逐行按规范核实
// 过的真实业务数据,ownTimestamp 也只是借用了 updateDate 这个粗粒度字段,
// 不是真实的精确时间戳。
function rowTimeLeftUrgent(timeRemaining) {
  return !!timeRemaining && !/[hd]/.test(timeRemaining) && /m/.test(timeRemaining)
}
// rowToDealState() 挪到上面 isRowNew 旁边了(filters/matchesFilters 也
// 要用它),这里不再重复定义,靠函数声明的 hoisting 在这里一样能用。
const rowsAsCards = computed(() => {
  const role = viewerRoleValue.value
  return visibleRows.value.map((row) => {
    const counterparty = row.receivedAmount && row.receivedAmount !== '--' ? row.receivedAmount : row.acvEstimate
    const own = row.sentAmount && row.sentAmount !== '--' ? row.sentAmount : row.acvEstimate
    return {
      photoUrl: row.photoUrl,
      dealerName: row.dealerName,
      // 2026-09-02 按你的要求新增,细节见 OfferCard.vue 的 isMultiDealer
      // prop 注释和上面 effectiveMultiDealer 的注释
      isMultiDealer: effectiveMultiDealer.value,
      offerType: row.offerType,
      vehicleTitle: row.vehicleTitle,
      mileage: row.mileage,
      vin: row.vin,
      auctionId: row.auctionId,
      timeLeft: row.timeRemaining ? `${row.timeRemaining} Left` : '',
      timeLeftUrgent: rowTimeLeftUrgent(row.timeRemaining),
      viewerRole: role,
      dealState: rowToDealState(row),
      // 2026-09-02 按你的要求改成 isRowNew(row),同 rowsWithDealerMode
      // 的道理——点开过这张卡之后 New 徽标应该消失
      isNew: isRowNew(row),
      counterpartyAmount: counterparty,
      ownAmount: own,
      ownTimestamp: row.updateDate,
      // counterpartyTimestamp 是对方最近一次动作的时间,表格行数据里没有
      // 单独区分"我方/对方各自的时间戳"这么细,只有一个笼统的
      // updateDate——和 ownTimestamp 借用的是同一个字段,不是逐行核实过
      // 的真实业务数据,待你确认。
      counterpartyTimestamp: row.updateDate,
      // 2026-09 修复真实bug:之前这里完全没有把这三个字段传给
      // OfferCard(=没有传给它内部的 InformationDialog),导致从
      // Dashboard 真实数据点开的对话框金额区/历史区一直落到 OfferCard
      // 组件自己的默认占位值,和这一行真实的车辆/金额完全对不上——你
      // 发截图指出的"info dialog上没有显示对应card上的内容"就是这个
      // 原因。这三个字段现在直接来自 OfferTableRow/mock.js 里逐行补的
      // 同名字段,细节和"这些字段本身是否满足'Offer States Logic for
      // CC.md'的number rules"的核对记录见 OfferTableRow/notes.md。
      reservePrice: row.reservePrice,
      acvEstimate: row.acvEstimate,
      reportUrl: row.reportUrl,
      history: row.history
    }
  })
})

// 2026-08 按你的要求:卡片数量不多时(≤2 张)不需要撑满整行宽度,固定
// 最多 370px 就好,右边留白是刻意的,不是没铺满的 bug——这和全屏时"卡片
// 多的话要按比例一起变宽、不留空白"那条要求不矛盾,区别只在于卡片够不
// 够多。auto-fit+minmax(320px,1fr) 本身没法区分"有没有留白是不是刻意
// 的",所以这里数量少的时候单独换一套 minmax(320px,370px)(不用 1fr,
// 让轨道停在370px不再撑大),数量足够多时还是走原来的 1fr 不设上限。
// 2 这个阈值是按你截图给的"1、2个"这个例子定的,不是从 Figma 核实来的。
const cardGridStyle = computed(() =>
  rowsAsCards.value.length <= 2
    ? { gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 370px))' }
    : null
)
</script>

<style scoped>
.offer-dashboard {
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;
}

/* 2026-08 核实自节点 7448:9826(hidden=false):App Bar 底边(y=58)到
   breadcrumb 顶部(y=82)= 24px,breadcrumb 底部(约y=106)到 Tabs 顶部
   (y=120)= 14px,不再是之前对称的 12px/12px。
   【2026-08 按你的要求覆盖:App Bar → breadcrumb 改成 32px】你在截图上
   用红色标出了这段间距,明确要求改成 32px——这是你直接给的数值,不是
   重新核实 Figma 得到的,覆盖掉了上面这条已经核实过的 24px。SidebarNav
   的 -54px 偏移(见下面 .sidebar-nav 规则)是相对 `.offer-dashboard__
   body` 自身顶边算的相对值,这里改了 padding-top 之后 body 整体跟着
   下移,SidebarNav 和 breadcrumb 文字的对齐关系还是一起同步下移,不需要
   连带改 -54px 那个数。
   【2026-08 补充:sidebar 新增左边距16px后同步调整】276px(=sidebar宽
   260+原间距16)改成 292px(=新增左边距16+260+16),保持这行文字和主
   内容区起始位置对齐,不是重新核实的 Figma 数值,是跟着 sidebar 左边距
   改动联动算出来的。 */
/* 【2026-08 按你的要求新增:右侧留 100px 空白】"My ACV > Offers" 这一行
   和下面 .offer-dashboard__content(Buying/Selling tab + 搜索/筛选 +
   表格整块)要在视口右边缘留出 100px 空隙。这两块在 DOM 里是分开的
   sibling(不是共享一个外层容器),所以分别在这两条规则上加了同一个
   margin-right:100px,视觉效果等同于给它们套一个共同外层容器再加
   margin——不改动这两块内部任何已有的 padding/gap,也没有动 SidebarNav
   的宽度或位置。 */
/* 2026-09-08(第九次)发现这个 .vue 文件之前记的是"16px 左边距 + 16px
   内容区左padding"这套静态数值,但实际跑起来的 index.html 早就不是
   这套了(右边这段 sidebar→内容区的间距被改成了
   `clamp(48px, ..., 100px)` 这种随容器宽度变化的响应式公式,和这里
   记的历史注释完全不一致,应该是之前某次会话直接改了 index.html 没有
   同步回这个文件)。第一次尝试把这段响应式间距改成固定24px,你指出
   "不要fixed,我要responsive,不过最小间距改为24-100px"——保留响应式,
   只是把原来的最小值48px改成24px,最大值100px不变。284px = 24
   (margin-left,这一段你没要求改成响应式,保持固定)+260(sidebar宽度),
   后面 clamp(24px,...,100px) 是响应式的那一段,和下面
   .offer-dashboard__content 的 padding-left 用的是同一个表达式。 */
.offer-dashboard__breadcrumb-row {
  padding: 32px 0 14px 0;
  padding-left: calc(284px + clamp(24px, calc(24px + (100cqw - 1422px) * 0.159), 100px));
  margin-right: 100px;
}

.offer-dashboard__body {
  display: flex;
  flex: 1;
}

/* 2026-08 按你的要求(截图上用红线标出目标位置):SidebarNav 第一项
   "My Inventory" 的文字要和 My ACV breadcrumb 文字顶部对齐,不是和
   OfferTabs 顶部对齐。只上移 SidebarNav 自己,不动 .offer-dashboard__body
   本身(会连带把 main/OfferTabs 也顶上去,改变已经核实过的 Tabs 相关
   间距)。
   -38px 只是让 SidebarNav 的容器顶边和 breadcrumb 容器顶边齐平,但
   SidebarNav 每一项是 56px 高、文字用 flex align-items:center 居中,
   而 breadcrumb 是紧贴文字的 24px 高容器,两者文字基线实际还差 16px
   (56px 项的文字视觉顶部比容器顶边低 (56-24)/2=16px)——这 16px 是用
   getBoundingClientRect() 量文字中心点实测出来的,不是纯算出来的。所以
   还要再上移 16px,一共 -54px,量完两者文字纵向中心点完全一致(都是
   228px)才定下这个数。
   【2026-08 按你的要求新增:sidebar 离左边增加16px】新增
   `margin-left:16px`,让 SidebarNav 不再贴着页面最左边——breadcrumb-row
   的 `padding-left` 用来对齐主内容区起始位置的数值(下面那条规则)也跟着
   从 276px(=sidebar宽260+间距16)改成 292px(=16新增左边距+260+16),
   保持文字对齐关系不变。 */
/* 2026-09-08 按你的要求从16px改成24px,细节见上面
   .offer-dashboard__breadcrumb-row 同一处注释。 */
.offer-dashboard__body :deep(.sidebar-nav) {
  margin-top: -54px;
  margin-left: 24px;
}

/* 2026-09-08(第九次)恢复响应式,最小值从48px改成24px,最大值100px
   不变——frame宽度到1422px(cqw)时精确等于24px,之后跟着变宽,到约
   1900px(cqw)封顶在100px,细节见上面 .offer-dashboard__breadcrumb-row
   同一处注释。 */
.offer-dashboard__content {
  flex: 1;
  min-width: 0;
  padding: 0 24px 24px 0;
  padding-left: clamp(24px, calc(24px + (100cqw - 1422px) * 0.159), 100px);
  margin-right: 100px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* 2026-08 核实自节点 7448:9826:Tabs 底部到搜索框顶部的 flex gap 是
   24px(不是之前的16px);SearchInput 组件自己是56px高的可见部分,Figma
   节点本身72px高、底部留了16px内建空白,所以搜索框视觉底部到筛选chip行
   顶部的间距是16px(不是之前的12px) */
.offer-dashboard__toolbar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 0 0;
}

.offer-dashboard__filters {
  flex-wrap: wrap;
}

/* 2026-08:已应用的经销商筛选摘要现在顶替 FilterChipGroup 里 Dealership
   按钮本来的位置(见该组件的 filter-chip--dealer-active 样式),不再是
   这里单独的一个 chip 元素 */

.offer-dashboard__dealer-popover-anchor {
  /* 定位坐标由 dealerPopoverStyle 计算填入(position:fixed + top/left) */
}

/* 2026-08 按你的要求去掉了这条横线——对照节点 7448:9826 核实,筛选chip
   行和下面的 Private Lane/Pagination 行之间在 Figma 里根本没有分割线,
   只是 20px 的纯留白(节点 7448:9899 的 flex gap-[20px]),之前的
   border-top 是我自己加的、没有 Figma 依据,已经删掉,改成同样是纯间距
   的 margin-top */
.offer-dashboard__table-card {
  margin-top: 20px;
}

/* 2026-09-08(第三次)table view 表头+所有数据行现在是同一个 CSS Grid
   (display:grid),列宽由 `grid-template-columns`(内联样式,值来自上面
   `tableGridColumns` computed)统一定义——之前两次尝试都还是让
   OfferTableHeader/OfferTableRow 各自用 flex 独立算一次宽度(先是
   shrink 不一致、然后是 grow 在两个独立容器里可能算出不同的浮点像素
   值),宽屏或换算条件一变就又对不齐。现在整个 grid 的列宽只算一次,
   表头和每一行的 8 个 cell 都是这同一个 grid 的直接子项(靠
   OfferTableHeader.vue/OfferTableRow.vue 的 grid-layout prop 切换成
   display:contents 把自己"拆开"),不可能再出现"两边分别算出不同结果"
   这类问题。`minmax(Npx, Nfr)` 让每列窄屏时不缩过 Figma 核实的自然
   宽度(不够宽靠这个容器 overflow-x:auto 横向滚动)、宽屏时按同一个
   比例一起变宽(还原你之前明确要过的"Dashboard 全屏 presentation 时
   表格要跟着变宽"这个效果)。完整根因分析见
   fragments/OfferDashboard/notes.md 同名条目。 */
/* 2026-09-08(第四次,已撤销 column-gap 方案)按你的要求 undo——
   column-gap 会在 grid 的列轨道之间留出真正的空白缝,这段缝不属于
   任何一个 cell,cell 自己的背景色(表头灰底 #FAFAFA / 数据行白底+
   hover蓝)盖不到这段空白上,导致表头/整行背景被切成一段一段、中间
   露出缝,这是不对的——不应该在背景/边框上开缝,只是想要"列内容之间
   看起来更松一点"。改法待重新确认,细节见 fragments/OfferDashboard/
   notes.md 同名条目。 */
/* 2026-09-10 按你的要求:有了下面那条 sticky 的"影子"横向滚动条之后,
   这个容器自己原生的横向滚动条就是多余的了(滚到刚好能同时露出两条的
   位置时,两条会叠在一起显得重复)。只隐藏原生滚动条的外观
   (scrollbar-width:none 给 Firefox,::-webkit-scrollbar{display:none}
   给 Chrome/Safari/Edge),横向滚动本身的功能(scrollLeft/wheel)不受
   影响——影子滚动条本来就是靠同步 scrollLeft 实现的,不依赖这条原生
   滚动条的视觉表现。 */
.offer-dashboard__table-scroll {
  display: grid;
  overflow-x: auto;
  scrollbar-width: none;
}
.offer-dashboard__table-scroll::-webkit-scrollbar {
  display: none;
}

/* 2026-09-09 按你的要求:去掉顶部 Pagination 之后,翻页只能靠这条底部
   Pagination,行数一多就要滚到最底才能点下一页——改成 sticky 贴底,滚动
   时始终留在可视区底部,不用滚到底。position:sticky 不脱离文档流(跟
   position:fixed 不一样,不用另外算 sidebar 偏移量),没滚到这条本来的
   位置之前就是正常跟着走,滚过去之后才贴住。<Pagination> 组件自己已经有
   白底(见 fragments/Pagination/notes.md),不会露出底下滚过的表格行;
   这里加 z-index 只是保证它盖在表格行上面,不被滚动内容压到下面。
   顶部补了一条浅灰色 border-top(#DCDFE8,跟 OfferTableHeader 底部描边
   同一个颜色),贴底浮起来的时候能和上面滚过去的表格行分出一条边界,
   不是紧贴着content的裸露白块。 */
.offer-dashboard__table-bottom {
  position: sticky;
  bottom: 0;
  border-top: 1px solid #DCDFE8;
  z-index: 1;
}

/* 2026-09-10 按你的要求新增:"影子"横向滚动条,跟上面 table-bottom
   用同一套 sticky 逻辑,细节见模板里那段 HTML 注释。bottom 的值由
   JS 动态绑定成 paginationHeight(table-bottom 实际渲染高度),让它
   贴在 Pagination 正上方,两者作为一组一起贴底,不是写死的像素值。
   高度只留 17px(比常见的原生横向滚动条高度略宽一点点),这个 div
   自己也是 overflow-x:auto,滚动条本身还是浏览器原生渲染的。
   overflow-y:hidden 是防止内部 spacer 意外撑出纵向滚动。 */
.offer-dashboard__table-hscroll-shadow {
  position: sticky;
  z-index: 1;
  overflow-x: auto;
  overflow-y: hidden;
  height: 17px;
}

.offer-dashboard__table-hscroll-spacer {
  height: 1px;
}

/* Private Lane/Pagination 行本身贴着上面 20px 留白,下面到表头之间是
   16px(节点 7448:9916 "Table" 的 flex gap-[16px]),不是之前对称的
   8px/8px */
/* 2026-09-02:这一条工具条(Viewing N results / Private Lane+Pagination
   + table/tile 切换按钮)已经抽成独立组件 ResultsToolbar,不再是这个
   文件自己的 markup/CSS——你指出 table view 和 card view 的这条工具条
   应该是同一个组件的两个 view,不是分开各写一次。原来这里"三个元素
   固定76px行高保持居中对齐"的推导过程等 CSS 相关说明,原样搬到了
   fragments/ResultsToolbar/ResultsToolbar.vue 自己的 CSS 注释里,不在
   这里重复。 */

/* 2026-08 按你的要求(Dashboard 全屏时卡片视图也要跟着响应式):卡片间距
   永远固定 16px,不参与任何比例缩放;卡片宽度本身用 auto-fit+minmax
   自适应可用宽度,最小 320px(2026-08 从 280 改成 320)——容器正好是
   1122px(默认非全屏状态)时,auto-fit 自己算出来正好是 3 列(每列
   (1122-32)/3≈363px,仍然 ≥320px),和之前写死 repeat(3,1fr) 效果完全
   一样;容器变宽到能塞下 4 个≥320px 列时(4×320+3×16=1328px 起),自动
   变成 4 列,不需要写死断点。没有单独设一个"最大宽度"上限——auto-fit
   本身就是自限的:卡片一旦宽到能再塞进一列 320px+ 的卡,就会自动多开
   一列,不会无限变宽,也不会像 minmax 给固定最大值那样在两端留出多余
   空白。 */
/* 2026-08 你指出卡片区和上方"Viewing X results + 切换按钮"那一行间距
   不对:这里原来的 padding:16px 0 会在顶部再加一次 16px,叠加上
   .offer-dashboard__table-top 本来就有的 padding-bottom:16px,变成
   32px,不是 16px。对照节点 7432:69595 的 "Table" 容器(gap-[16px],
   只有一份 16px,不是两份叠加),删掉顶部这份重复的 padding,只留
   底部,间距交给 table-top 的 padding-bottom 单独负责,不再重复计一次 */
/* 2026-09-09 按你的要求:卡片宽度下限从320px改成330px,上限封顶
   420px。第一次改的时候直接把 minmax 第二个参数从 1fr 换成了固定的
   420px(minmax(330px,420px))——这正好踩中上面那条2026-08注释早就
   警告过的坑:"不会像 minmax 给固定最大值那样在两端留出多余空白"。
   固定 max 之后 auto-fit 计算"能塞几列"时会优先让每列尽量接近
   420px、而不是尽量多开列,容器宽度不是420px的整数倍时,多出来的空间
   不会拿去多开一列,而是变成右边一大块空白(你截图看到的问题)。
   改法:`grid-template-columns` 的 minmax 第二个参数换回 `1fr`
   (`minmax(330px, 1fr)`),恢复"能多塞一列就多塞一列,不留大块空白"
   这个 auto-fit 自限机制;"最宽420px"这个要求改成加在卡片自己身上——
   `OfferCard.vue` 的 `.offer-card` 新增 `max-width:420px`,列宽本身
   仍然可以撑到比420px更宽(比如容器刚好只能塞2列,平分下来每列比
   420px宽),但卡片内容本身封顶420px、在列内居中,不会无限变宽,也不会
   再出现大块空白。 */
.offer-dashboard__card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
  gap: 16px;
  padding-bottom: 16px;
}

.offer-dashboard__empty {
  padding: 40px 16px;
  text-align: center;
  color: #757575;
  font-size: 14px;
}
</style>
