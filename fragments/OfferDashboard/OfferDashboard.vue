<!--
  ═══════════════════════════════════════════════════════════
  METADATA
  name: Offer Dashboard (整页组装)
  group: 页面组装 (Page Assembly)
  order: 90
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
    - `sidebar.offersCount`/`tabs.buyingCount` 同理,仍然只跟 vehicleCount
      有关,不跟当前筛选结果联动。
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
          <SearchInput v-model="searchValue" />
          <FilterChipGroup
            ref="filterChipGroupRef"
            v-bind="filters"
            class="offer-dashboard__filters"
            :is-multi-dealer="isMultiDealer"
            :dealership-open="dealershipDropdownOpen"
            :dealer-chip-label="dealerFilter.length ? dealerChipText : ''"
            @toggle-dealership="toggleDealershipDropdown"
            @clear="handleClearFilters"
            @filter-change="chipFilter = $event"
            @clear-dealer="dealerFilter = []"
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
            :is-multi-dealer="isMultiDealer"
            :pre-selected="dealerFilter.join(',')"
            @apply="handleApplyDealerFilter"
          />
        </div>

        <div class="offer-dashboard__table-card">
          <div class="offer-dashboard__table-top">
            <div v-if="viewMode === 'tile'" class="offer-dashboard__viewing-text">
              Viewing {{ visibleRows.length }} results
            </div>
            <template v-else>
              <div class="offer-dashboard__table-top-spacer">
                <span class="offer-dashboard__private-lane">
                  <svg class="offer-dashboard__private-lane-icon" width="16" height="16" viewBox="0 0 24 24" fill="#545454">
                    <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                  </svg>
                  Private Lane
                </span>
              </div>
              <Pagination v-bind="topPagination" />
            </template>

            <!-- 2026-08 按你的要求,对照节点 7432:69595 核实:切换 UI 改成
                 两端全圆角的 pill 形("segmented button",不是之前 4px
                 小圆角的方形),且顺序是先 grid(tile 视图)后
                 list/agenda(table 视图)——这个新节点里当前显示的就是卡片
                 视图,active 态(浅灰背景 #F5F5F5)在左边的 grid 图标上,
                 不是之前实现里 list 在前。颜色/边框数值(#D1D3D6 描边、
                 #F5F5F5 active 背景)和之前核实的一致,没有变,只是形状
                 和顺序变了。 -->
            <div class="offer-dashboard__view-toggle">
              <button
                type="button"
                class="offer-dashboard__view-toggle-btn"
                :class="{ 'offer-dashboard__view-toggle-btn--active': viewMode === 'tile' }"
                aria-label="Grid view"
                @click="viewMode = 'tile'"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.5 9.83301C7.41667 9.83301 8.16699 10.5833 8.16699 11.5V14.833C8.16699 15.7497 7.41667 16.5 6.5 16.5H3.16699C2.25033 16.5 1.5 15.7497 1.5 14.833V11.5C1.5 10.5833 2.25033 9.83301 3.16699 9.83301H6.5ZM14.834 9.83301C15.7504 9.83327 16.5 10.5835 16.5 11.5V14.833C16.5 15.7495 15.7504 16.4997 14.834 16.5H11.5C10.5834 16.4999 9.83398 15.7496 9.83398 14.833V11.5C9.83398 10.5834 10.5834 9.8331 11.5 9.83301H14.834ZM6.5 1.5C7.41667 1.5 8.16699 2.25033 8.16699 3.16699V6.5C8.16699 7.41667 7.41667 8.16699 6.5 8.16699H3.16699C2.25033 8.16699 1.5 7.41667 1.5 6.5V3.16699C1.5 2.25033 2.25033 1.5 3.16699 1.5H6.5ZM14.834 1.5C15.7504 1.50027 16.5 2.25049 16.5 3.16699V6.5C16.5 7.4165 15.7504 8.16673 14.834 8.16699H11.5C10.5834 8.1669 9.83398 7.41661 9.83398 6.5V3.16699C9.83398 2.25038 10.5834 1.50009 11.5 1.5H14.834Z" fill="#1C1D1F"/>
                </svg>
              </button>
              <button
                type="button"
                class="offer-dashboard__view-toggle-btn"
                :class="{ 'offer-dashboard__view-toggle-btn--active': viewMode === 'table' }"
                aria-label="List view"
                @click="viewMode = 'table'"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.7105 9.75H2.28947C1.85526 9.75 1.5 10.0875 1.5 10.5V15C1.5 15.4125 1.85526 15.75 2.28947 15.75H15.7105C16.1447 15.75 16.5 15.4125 16.5 15V10.5C16.5 10.0875 16.1447 9.75 15.7105 9.75ZM15.7105 2.25H2.28947C1.85526 2.25 1.5 2.5875 1.5 3V7.5C1.5 7.9125 1.85526 8.25 2.28947 8.25H15.7105C16.1447 8.25 16.5 7.9125 16.5 7.5V3C16.5 2.5875 16.1447 2.25 15.7105 2.25Z" fill="#1C1D1F"/>
                </svg>
              </button>
            </div>
          </div>

          <template v-if="viewMode === 'table'">
            <OfferTableHeader :is-multi-dealer="isMultiDealer" :sort-column="sortColumn" @sort="sortColumn = $event" />

            <OfferTableRow v-for="(row, i) in rowsWithDealerMode" :key="i" v-bind="row" />
            <p v-if="visibleRows.length === 0" class="offer-dashboard__empty">
              No vehicles match the current filters.
            </p>

            <div class="offer-dashboard__table-bottom">
              <Pagination show-viewing-text :viewing-count="visibleRows.length" :total-count="visibleRows.length" />
            </div>
          </template>

          <template v-else>
            <div class="offer-dashboard__card-grid" :style="cardGridStyle">
              <OfferCard v-for="(card, i) in rowsAsCards" :key="i" v-bind="card" />
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
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
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
import rowMocks from '../OfferTableRow/mock.js'

const props = defineProps({
  // 账号下挂多个经销商时才显示 Dealership 下拉内容,见
  // DealershipFilterDropdown 自己的逻辑
  isMultiDealer: { type: Boolean, default: true },
  // 2026-08 按你的要求:Buying/Selling 分开两个独立的数量控制,不再共用
  // 一个 vehicleCount——切 tab 时各自记住自己的数量,不会因为切换 tab
  // 就互相覆盖。各自范围 1~6(Buying/Selling 现在各自只有 6 条数据),
  // 用于演示"车辆数量变化时页面长什么样",不是真实分页,细节见下面
  // rowsLimited 的注释
  buyingVehicleCount: { type: Number, default: 6 },
  sellingVehicleCount: { type: Number, default: 6 }
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
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleOutsideClick)
  document.removeEventListener('keydown', handleEscapeKey)
  window.removeEventListener('scroll', handleRepositionOnScroll, { capture: true })
  window.removeEventListener('resize', handleRepositionOnScroll)
})

const header = {
  initialSelectedIndex: 1, // My ACV
  companyName: 'Magnacar Auto Corp',
  userName: 'Emily Huang',
  avatarLetter: 'A'
}

// [2026-08 按你的要求更正] Buying/Selling tab 旁边红点里的数字、以及
// sidebar "Offers" 旁边的 badge,不是"这个tab总共有几条"(之前是
// buyingRows.length/sellingRows.length,固定6/6),而是"这个tab里有几条
// New(未处理)的",用来提醒用户还有几个新 deal 没处理。sidebar 的
// Offers badge = Buying 的 New 数 + Selling 的 New 数(两个tab红点数字
// 加起来)。这个数字统计的是 buyingRows/sellingRows 全部6条(不受下面
// buyingVehicleCount/sellingVehicleCount 演示用的截取数量影响),因为
// 现实里"还有几个新的没处理"这个提醒不应该因为你在Playground里调小了
// 演示行数就跟着变少。
const buyingNewCount = computed(() => buyingRows.filter((r) => r.statusNew).length)
const sellingNewCount = computed(() => sellingRows.filter((r) => r.statusNew).length)

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
}
const activeTabRows = computed(() =>
  activeMainTab.value === 'selling' ? sellingRows : buyingRows
)

const tabs = computed(() => ({
  activeTab: activeMainTab.value,
  buyingCount: buyingNewCount.value,
  sellingCount: sellingNewCount.value
}))

// [2026-08 按你的要求更正] 之前这几个数字故意不跟着 dealerFilter/
// chipFilter 联动,一直显示 rowsLimited(当前 tab 全部6条)算出来的
// 总数——你指出选了 dealership 之后,筛选结果明明只剩1条,chip 旁边的
// 数字却还是没筛选时的总数,对不上。现在改成基于 dealerFilteredRows
// (见下面,只按 dealerFilter narrow 过,不按 chipFilter 本身 narrow)
// 算数量——这样每个 chip 显示的是"在当前经销商筛选下,点这个chip会筛出
// 多少条",不包含其它 chip(New/Received/Sent/Declined 之间、以及和
// negotiation/makeOffer 之间)的选中状态,避免选中某个 chip 后其它 chip
// 的数字全变成 0 这种"数了自己选的东西,把自己也算没了"的死循环。
const dealerFilteredRows = computed(() =>
  rowsLimited.value.filter(
    (r) => !dealerFilter.value.length || dealerFilter.value.includes(r.dealerName)
  )
)

const filters = computed(() => ({
  negotiationCount: dealerFilteredRows.value.filter((r) => r.offerType === 'in-negotiation').length,
  makeOfferCount: dealerFilteredRows.value.filter((r) => r.offerType === 'make-offer').length,
  newCount: dealerFilteredRows.value.filter((r) => r.statusNew).length,
  receivedCount: dealerFilteredRows.value.filter((r) => r.statusReceived).length,
  sentCount: dealerFilteredRows.value.filter((r) => r.sentAmount && r.sentAmount !== '--').length,
  declinedCount: 0
}))

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
}

function handleClearFilters() {
  dealershipDropdownOpen.value = false
  dealerFilter.value = []
  chipFilter.value = { negotiation: false, makeOffer: false, single: null }
}

// In negotiation / Make Offer 是可以同时选中的(见 FilterChipGroup 的
// Figma 标注:两者多选),选中任一个就要求 offerType 匹配其中之一;
// New/Received/Sent 互斥单选,直接对应行上的字段;Declined 这几行 mock
// 数据里没有对应字段,选中后必然没有匹配行(空列表是正确结果,不是bug)。
function matchesFilters(row) {
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
  if (single === 'new' && !row.statusNew) return false
  if (single === 'received' && !row.statusReceived) return false
  if (single === 'sent' && !(row.sentAmount && row.sentAmount !== '--')) return false
  if (single === 'declined') return false
  return true
}

const topPagination = { showViewingText: false, hasPrevPage: false, hasNextPage: true }

// 2026-08:扩充成 12 行 —— 前 3 行(rowWithNewAndReceived/rowWithMakeOffer/
// rowWithNoStatusChip)是已核实的真实行数据,后 9 行是你给了 10 张新真实
// 照片后新增的自编 mockup 演示数据,两者性质不同,细节见
// OfferTableRow/notes.md 的"2026-08 第二批照片"章节
const rows = [
  rowMocks.rowWithNewAndReceived,
  rowMocks.rowWithMakeOffer,
  rowMocks.rowWithNoStatusChip,
  rowMocks.rowLexusES,
  rowMocks.rowHyundaiKona,
  rowMocks.rowJeepWrangler,
  rowMocks.rowFiat500,
  rowMocks.rowToyotaMatrix,
  rowMocks.rowFordEscapeTitanium,
  rowMocks.rowChevyMalibu,
  rowMocks.rowDodgeCharger,
  rowMocks.rowFordEscapeSE
]

// 2026-08 按你的要求"总共12个vehicle,buying默认显示6个selling6个":
// 前 6 条归 Buying,后 6 条归 Selling,纯粹是数量上的对半切分,不对应
// 任何 Figma 数据或真实业务规则。
const buyingRows = rows.slice(0, 6)
const sellingRows = rows.slice(6, 12)

// 2026-08 按你的要求:Buying/Selling 各自用自己的 vehicleCount(不再共用
// 一个),按当前选中的 tab 挑对应那一个,夹在 [1, activeTabRows.length]
// 之间(现在每个 tab 最多 6 条),避免传入 0 或超过总数时表格/卡片网格
// 直接空掉或越界。这一步只是"截取演示用的车辆数量",filter chip 的数字
// (见上面 filters)也是照着这份数据算的,不受下面 chipFilter/dealerFilter
// 影响。
const activeVehicleCount = computed(() =>
  activeMainTab.value === 'selling' ? props.sellingVehicleCount : props.buyingVehicleCount
)
const rowsLimited = computed(() =>
  activeTabRows.value.slice(0, Math.max(1, Math.min(activeTabRows.value.length, activeVehicleCount.value)))
)

// 真正渲染到 table/tile 的行:在 rowsLimited 基础上再按当前选中的
// filter chip / dealership 筛一遍,筛完为空就是空(不会强行凑数）。
const visibleRows = computed(() => rowsLimited.value.filter(matchesFilters))

// 每一行的 isMultiDealer 都跟着 dashboard 这个开关走,而不是各自 mock
// 里写死的值,这样切换 control 才能真的看到表格跟着变
const rowsWithDealerMode = computed(() =>
  visibleRows.value.map((row) => ({ ...row, isMultiDealer: props.isMultiDealer }))
)

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
function rowToDealState(row) {
  if (row.statusDeclined) return 'declined'
  if (row.statusSent) return 'sent'
  return 'received'
}
const rowsAsCards = computed(() => {
  const role = activeMainTab.value === 'selling' ? 'seller' : 'buyer'
  return visibleRows.value.map((row) => {
    const counterparty = row.receivedAmount && row.receivedAmount !== '--' ? row.receivedAmount : row.acvEstimate
    const own = row.sentAmount && row.sentAmount !== '--' ? row.sentAmount : row.acvEstimate
    return {
      photoUrl: row.photoUrl,
      dealerName: row.dealerName,
      offerType: row.offerType,
      vehicleTitle: row.vehicleTitle,
      mileage: row.mileage,
      vin: row.vin,
      auctionId: row.auctionId,
      timeLeft: row.timeRemaining ? `${row.timeRemaining} Left` : '',
      timeLeftUrgent: rowTimeLeftUrgent(row.timeRemaining),
      viewerRole: role,
      dealState: rowToDealState(row),
      isNew: row.statusNew,
      counterpartyAmount: counterparty,
      ownAmount: own,
      ownTimestamp: row.updateDate
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
.offer-dashboard__breadcrumb-row {
  padding: 32px 0 14px 292px;
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
.offer-dashboard__body :deep(.sidebar-nav) {
  margin-top: -54px;
  margin-left: 16px;
}

.offer-dashboard__content {
  flex: 1;
  min-width: 0;
  padding: 0 24px 24px 16px;
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

/* Private Lane/Pagination 行本身贴着上面 20px 留白,下面到表头之间是
   16px(节点 7448:9916 "Table" 的 flex gap-[16px]),不是之前对称的
   8px/8px */
/* 2026-08 你指出 Private Lane / Pagination / 切换按钮三个要一行横向居中
   对齐:排查发现这一行的高度是由内容自己撑出来的(table 视图里
   Pagination 组件本身高 60px,比切换按钮/文字都高,算上 padding-bottom
   16px 这一行自然高度是 76px;tile 视图里没有 Pagination,自然高度缩到
   只剩切换按钮 32px+padding 16px=48px),用同一个 align-items:center 的
   话,行高一变,居中位置就跟着变,之前为了不让按钮跳动加的
   align-self:flex-start 反而破坏了三者原本该有的居中对齐。现在改成给
   这一行本身钉死 min-height:76px(这个文件全局 `* { box-sizing:
   border-box }`,min-height 量的是含 padding 的整个盒子,所以要按
   table 视图的自然总高 76px 设,不是内容区的 60px——量的是 Pagination
   组件在这一行里实际撑出来的高度,不是 Figma 核实数值,如果以后
   Pagination 组件本身改高度需要回来同步这个值),table/tile 两种模式下
   这一行的高度都固定一样高,align-items:center 可以放心统一对所有子
   元素生效——三个元素之间保持居中对齐,行高也不再随模式切换变化,按钮
   位置自然也不会再跳。这个组件自己的 `<style scoped>` 没有全局
   `box-sizing:border-box` reset(不像 component-playground.html 那边有
   `* { box-sizing:border-box }`),所以这里额外显式加了
   `box-sizing:border-box`,让 `min-height:76px` 在两边算出来的是同一个
   数值(含 padding 的整个盒子),不然这里会变成内容区 76px + padding
   16px = 92px,和 Playground 预览的效果就不一致了。 */
.offer-dashboard__table-top {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-height: 76px;
  padding: 0 0 16px;
  box-sizing: border-box;
}

.offer-dashboard__table-top-spacer {
  flex: 1;
  display: flex;
  align-items: center;
}

/* 2026-08 按你的要求新增,参照真实原型(My-ACV--Dealer-filter-main)的
   .private-lane / .lane-icon,不是 Figma 核实数据,见 METADATA */
.offer-dashboard__private-lane {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.4px;
  color: #545454;
}

.offer-dashboard__private-lane-icon {
  flex-shrink: 0;
}

.offer-dashboard__viewing-text {
  flex: 1;
  font-size: 14px;
  line-height: 21px;
  letter-spacing: 0.25px;
  color: #212121;
}

.offer-dashboard__view-toggle {
  display: flex;
  align-items: center;
}

.offer-dashboard__view-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #FFFFFF;
  border: 1px solid #D1D3D6;
  border-radius: 0;
  cursor: pointer;
}

/* 2026-08 按你的要求改成两端全圆角的 pill 形(之前是 4px 小圆角方形),
   对照节点 7432:69595 的 segmented button(rounded-***-[111px]) */
.offer-dashboard__view-toggle-btn:first-child {
  border-radius: 999px 0 0 999px;
}

.offer-dashboard__view-toggle-btn:last-child {
  border-left: none;
  border-radius: 0 999px 999px 0;
}

.offer-dashboard__view-toggle-btn--active {
  background: #F5F5F5;
}

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
.offer-dashboard__card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
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
