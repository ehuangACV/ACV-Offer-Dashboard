<!--
  ═══════════════════════════════════════════════════════════
  METADATA
  name: Offer Table Row
  group: 数据表格 (Offers Table)
  order: 31
  description: >
    表格的一条数据行:车辆缩略图 + Dealer Name/Auction ID(+ 可选
    OfferTypeBadge) + Vehicle/Mileage·VIN + Time Remaining + ACV
    Estimate + Sent + Received + Update 列(StatusChip 堆叠 + 更新日期)。
    复用了已核实的 fragments/StatusChip 和 fragments/OfferTypeBadge。
  path: fragments/OfferTableRow/OfferTableRow.vue
  source_of_truth: >
    Figma 文件 "Offers - Negotiation" (fileKey 4z7FK34Fgit7Fi9UxZu0za),
    对照了三条真实可见的行实例(均 hidden=false):
    - 第一行(6837:16215,CarMax Boston):264578 / 2018 Ford Somemodel /
      250,000 miles / VIN 192211 / 20h 45m / $25,000 / $26,000 / $7,000 /
      Update = New + Received / Today。Dealer 列下方叠了 "In Negotiation"
      OfferTypeBadge(6837:16255,无包裹框,直接边框白色)。
    - 第二行(6837:16256,Asbury Automotive Group):876143 / 同一辆
      2018 Ford Somemodel / 20h45m / $5,000 / Sent 列 "--" / Received
      $4,000 / Update = 仅 Received / Today。Dealer 列下方叠了
      "Make Offer" OfferTypeBadge,套在带边框 #8D9199 的包裹框
      (6837:16269)里——这个发现同时更正了 fragments/OfferTypeBadge 的
      "Make Offer 无边框" 结论,详见该组件 notes.md 的"更正记录二"。
    - 第三行(6837:16296,Asbury Automotive Group):876413 / 同一辆车 /
      20h45m / $5,000 / Sent "--" / Received $4,000 / Update = 无任何
      StatusChip,只有 "Today" 日期文字。Dealer 列下方叠了
      "In Negotiation" OfferTypeBadge。
    - 各列宽度、字体、颜色均取自这三行 + 表头行(order 30)的真实数值,
      与 OfferTableHeader 对齐。Sent 列出现真实值 "--"(不是我编的占位,
      是 Figma 里字面写的文案),说明这一列允许"未发起"态,直接显示
      两个字符 "--"。
    - Update 列 StatusChip / Dealer 列 OfferTypeBadge 均直接复用已核实
      的 fragments/StatusChip/StatusChip.vue 和
      fragments/OfferTypeBadge/OfferTypeBadge.vue,不重复定义颜色。
  status: >
    车辆缩略图的圆角数值——Figma 里用的是一个 mask SVG,没有直接给出
    border-radius 的像素值,组件先用 8px 占位,待确认真实圆角。
    另外三行车辆缩略图在 Figma 里似乎都用了同一张车图的两层叠加导出
    (imgImage1 + imgImage2 完全重叠),看起来是设计稿导出时的图层重复,
    不是"两张不同照片叠加"的设计意图,组件只用一张图片 prop 表示。

    【2026-08 更正:Auction ID 和 OfferTypeBadge 的排布】用户指出
    Auction ID 应该在 OfferTypeBadge 旁边,不是之前那样竖着堆三行
    (Dealer Name / Auction ID / Badge 各占一行)。对照用户新给的 Figma
    帧 7403:4653(同一个表格,和之前核实过的 6837:16215/16256/16296
    结构一致,只是节点 id 不同)重新量了坐标:
    - 第一行(7403:4694 Dealer 列,7403:4726 In Negotiation 徽标):
      徽标绝对定位在 left:147px top:44px,Dealer 列本身 x=80 起,换算成
      列内相对坐标是 x=67,y=44;而 Auction ID 文案容器在列内 x=16,
      y=21+25=46,两者几乎同一行,徽标起点(67)比 Auction ID 文案框
      估计的右边缘(约 59)多出 8px 左右的间距。
    - 第二行(7403:4735-4746,Make Offer):Auction ID 和徽标包裹框
      "status pills" 都在同一个父容器 "Frame 630266016" 里,徽标相对
      该容器 x=51(容器本身在列内 x=16,换算列内绝对 x=67),同样和
      Auction ID(列内 x=16)在同一行、间距一致。
    已经把模板改成 Auction ID 和 OfferTypeBadge 包在同一个 flex 行容器
    里(gap 8px,来自上面两行数据换算出的真实间距,不是估的),不再是
    三行竖排。

    【2026-08 新增 isMultiDealer】对照单经销商参照帧(6837:16538 → 表格
    行节点 6837:16674,hidden=false)核实:单经销商账号下,第二列不再
    显示 Dealer Name,而是把 Auction ID 直接当作这一列的"主标题"来显示
    (用的是原来 dealer-name 那套字号字色:14px/21 letter-spacing .25px
    色 #0E0E0F,不是原来 auctionId 用的 12px 灰字),下面第二行只有
    OfferTypeBadge,单独一个、贴左对齐(x=16,和主标题左边对齐,不是像
    多经销商版本那样偏右贴着 auctionId)。也就是说单经销商模式下
    auctionId 只显示一次(在主标题位置),不会在第二行重复出现。

    【2026-08 按你的要求:vehicleTitle 太长也要 truncate】之前只有
    dealer-name 那一列做了单行截断(white-space:nowrap + overflow:hidden
    + text-overflow:ellipsis + max-width:168px,来自 200px 列宽减去左右
    16px padding)。vehicle-title 这一列(195px 列宽,同样左右 16px
    padding,换算 max-width:163px)现在补上同一套截断样式,和 dealer-name
    保持一致,不是 Figma 新核实到的数值,是你直接要求的行为、照抄已有的
    dealer-name 截断规则套用过来。你紧接着又要求 vehicle-title 改成
    左对齐,已加 `text-align:left` 覆盖掉当时继承来的居中,但 mileage・
    VIN 那一行(vehicle-sub)当时保持了居中不变,标着"待你确认要不要也
    改左对齐"。

    【2026-08 你指出对齐有问题,对照新节点核实,确认 mileage 和 title
    都应该左对齐】你给了新的 Figma 节点 7448:9966(hidden=false 的真实
    可见实例),get_design_context 核实:Vehicle 列内容框的 flex-col
    容器虽然自己写的是 `items-center`,但标题行和 mileage・VIN 行两个
    子元素都是 `w-full`(撑满整个内容框宽度),所以父级的 `items-center`
    对它们没有任何视觉效果——实际渲染结果是标题和 mileage・VIN 两行都
    紧贴内容框左边界,即两者都是真正的左对齐,不是"标题左对齐、副标题
    居中"。之前"vehicle-sub 保持居中"的判断已经确认是错的,现在改成
    `justify-content:flex-start`,和 vehicle-title 保持一致。

    同时借这个新节点核实到 Vehicle 列内容框的真实内间距是
    **left:14px / right:35px**(不是其余列常见的左右各16px对称
    padding),换算内容宽度 195-14-35=146px,已经把
    `.offer-table-row__cell--vehicle` 的 padding 和
    `.offer-table-row__vehicle-title` 的 max-width(146px)都按这个真实
    坐标改过来,不再是之前假设对称padding算出来的163px。

    【2026-08 新增 statusSent/statusDeclined + 你说明的业务逻辑】
    新增了两个 StatusChip 状态(颜色/圆角见 fragments/StatusChip 核实
    过的数据,不是这里重新核实的)。你说明的业务逻辑(不是 Figma 数据,
    是你直接告诉我的,记录下来避免以后误改):
    - New 可以和其他三个状态(Received/Sent/Declined)同时出现。
    - Received = 收到了对方的 counter 或 offer。
    - Sent = 我方发出了 counter 或 offer。
    - Declined = 这笔 deal 被拒绝了。
    - [还没实现,你明确说先不用管] New 状态本来应该在用户点开这笔 deal
      进入 VDP 页面或者 information dialog 之后就消失——VDP 和 dialog
      都还没开始做,这条消失逻辑目前没有实现,`statusNew` 现在纯粹是个
      静态 prop,不会因为"打开过"就自动变 false。
    Mock 数据里补了 `rowChevyMalibu`(New+Received+Sent 三个同时出现,
    演示 New 和其他状态共存)和 `rowFiat500`(单独 Declined)两个例子,
    让 Sent/Declined 至少各出现一次,细节见 mock.js 里的注释。
    【2026-09-01 更正】`rowFiat500` 已经删掉(`offerType:'none'` 不是
    合法类型,见 mock.js 文件头注释),现在演示 Declined 状态的是
    `rowLexusES`(`statusDeclined:true`,细节见 mock.js)。

    【2026-08 你指出:Update 列的 New chip 不应该有星星图标】你之前发过
    截图指出这个位置的 New chip 是没有图标的,一直没有生效(之前调
    `StatusChip` 组件默认 `showIcon` 时漏掉了这里)。补上
    `:show-icon="false"`,和 OfferCard 里 New chip 同样没有图标的处理
    保持一致。

    【2026-09-02 新增:hover CTA + InformationDialog】你要求"table hover
    的 CTA 完全对应 card hover 的 CTA,点击后打开同一个 Information
    Dialog,table/tile 是同一个 deal 只是不同 view,数据和交互都该一样",
    并给了 Figma node 1:21166(fileKey 4z7FK34Fgit7Fi9UxZu0za,"Offers -
    Negotiation" 文件)作为 CTA 具体样式的参照。这个节点真实渲染出来是
    一条 hover 态的表格行:Update 列的 StatusChip/日期被换成
    "Counter"(outlined)+ "Accept $26,000"(filled,渐变)+ 一条 1px 分割
    线 + 纯文字链接 "More Info"(颜色 #0061A5,和本项目已核实过的链接色
    一致,不是 Figma token 给的 #004E7D)。【2026-09-02 更正】Accept 按钮
    最初带了字面的"✓"字符前缀(和 InformationDialog 的 Accept 按钮同一个
    写法),你直接要求去掉,现在两处都只是纯文字"Accept $X",不再有勾。
    - 哪个状态显示哪些按钮,直接复用 OfferCard 的 `hoverButtons` 状态表
      (buyer/seller × received/sent/declined,同一套 viewerRole+
      dealState 判断,新增了 `viewerRole` prop,由 `OfferDashboard.vue`
      按当前 Buying/Selling tab 传进来),只是多拆出一个 `infoLink`
      字段——Figma 这个参照帧里 "More Info" 是分割线右边单独的链接,不是
      第三个和 Counter/Accept 同等视觉权重的按钮,这一点和卡片版本(三个
      按钮堆成一排竖排大按钮,没有分割线+链接结构)不一样,但背后对应的
      还是同一组动作,不是新发明的交互。`declined` 这个组合两个按钮都不是
      "主操作",没有对应的分割线+链接结构可参照,保持原来两个平级按钮的
      样子。
    - 点按钮组里任意一个(包括"More Info")都打开同一个
      InformationDialog,不按点了哪个区分内容——这是延续 OfferCard 那边
      "先这样做,之后会调整"的已知简化,不是这次新引入的。
    - 新增了 `reservePrice`/`reportUrl`/`history` 三个 prop——这几个字段
      本来就已经在 `mock.js` 每一行数据上了(之前是给 `rowsAsCards` 转成
      OfferCard props 用的),只是这个组件之前没有声明成自己的 prop,
      `v-bind="row"` 传过来的时候被当成多余的 DOM attribute 丢掉了,现在
      declare 出来才能真正喂给这里新增的 InformationDialog。
    - CSS 上没有照抄 OfferCard 那套"绝对定位 + backdrop-filter 模糊"的
      hover 机制——表格行只有 80px 高,Update 列背后本来就没有车辆信息
      挡着,直接用 `display:none`/`flex` 切换"chips+日期"和"CTA按钮组"
      两块内容,鼠标移开恢复原状,更简单也不需要模糊任何东西。

    【2026-09-03 新增:VIN 复制图标 + hover tooltip】对照 Figma node
    7675:28425("Offers - Negotiation" 文件)核实:table view 的 VIN
    之前一直是纯文字,没有 OfferCard 早就有的"点图标复制到剪贴板"功能。
    这个节点显示 VIN 数字外面套了一个浅蓝底(#F5FBFF)pill,右边贴着一个
    复制图标,hover 图标时下方弹出深色 tooltip "Copy full VIN"(背景
    #1C1D1F,文字 #F7F7F8,和 AppHeader.vue 收缩态 Rewards 图标的 tooltip
    同一套数值,不是重新设计)。已经把 `.offer-table-row__vin` 从纯文字
    改成 pill(`display:inline-flex`,右padding 4px,圆角999px),新增
    `copyVin()` 方法(逻辑同 OfferCard.vue 的 copyVin,两个组件没有共享
    script,只能各自维护一份)。复制图标的 SVG 直接从这个节点下载的真实
    资源("Actions/copy",16×16,fill #00558C 和 VIN 文字同色),不是沿用
    OfferCard 那个 10×12 的旧图标(形状是同一个"两张重叠单据"图案,只是
    这次这个节点给的是新导出的 16×16 版本,按 G5 资产一致性原则用这次
    实际下载到的资源,不混用两个不同尺寸的导出)。
  ═══════════════════════════════════════════════════════════
-->
<template>
  <div class="offer-table-row" :class="{ 'offer-table-row--grid': gridLayout }">
    <!-- 2026-08 你之前给的那份 VDP 静态 html 信息太碎(另一个团队的页面,
         不是我们组件库的一部分),你决定先删掉那份 html,改用一张真实
         VDP 页面截图当占位——点最左边的图片在新标签页"打开一个页面"
         展示这张截图(assets/vdp/vdp-page.html,就是一个包了这张图的
         最简单 html,装作是 VDP 页面),不是直接链到图片文件本身(直接
         链图片文件在部分浏览器/情况下会变成"下载图片"而不是"打开页面
         查看",你明确说要的是打开页面,不是下载)。这仍然只是示意"点
         图片会去 VDP"这个交互位置,不是真的 VDP 集成,等真正的 VDP
         页面/组件方案定下来了再换掉 -->
    <a
      href="/assets/vdp/vdp-page.html"
      target="_blank"
      rel="noopener"
      class="offer-table-row__cell offer-table-row__cell--photo"
      @click="$emit('viewed')"
    >
      <img v-if="photoUrl" :src="photoUrl" alt="" class="offer-table-row__photo">
    </a>

    <div class="offer-table-row__cell offer-table-row__cell--dealer" :class="{ 'offer-table-row__cell--dealer--wide': isMultiDealer }">
      <template v-if="isMultiDealer">
        <div class="offer-table-row__dealer-name">{{ dealerName }}</div>
        <div class="offer-table-row__dealer-sub">
          <span class="offer-table-row__dealer-id">{{ auctionId }}</span>
          <OfferTypeBadge v-if="offerType !== 'none'" :type="offerType" :label="offerTypeLabel" />
        </div>
      </template>
      <template v-else>
        <div class="offer-table-row__dealer-name">{{ auctionId }}</div>
        <div v-if="offerType !== 'none'" class="offer-table-row__dealer-sub">
          <OfferTypeBadge :type="offerType" :label="offerTypeLabel" />
        </div>
      </template>
    </div>

    <div class="offer-table-row__cell offer-table-row__cell--vehicle">
      <div class="offer-table-row__vehicle-title">{{ vehicleTitle }}</div>
      <div class="offer-table-row__vehicle-sub">
        <span>{{ mileage }}</span>
        <span>・</span>
        <span class="offer-table-row__vin" :class="{ 'is-copied': copiedVin }">
          {{ vin }}
          <button type="button" class="offer-table-row__vin-copy-btn" :class="{ 'is-copied': copiedVin }" aria-label="Copy full VIN" @click="copyVin">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.37792 11.6C6.05439 11.6 5.77752 11.4826 5.54733 11.2478C5.31674 11.0126 5.20145 10.73 5.20145 10.4V3.2C5.20145 2.87 5.31674 2.5874 5.54733 2.3522C5.77752 2.1174 6.05439 2 6.37792 2H11.672C11.9956 2 12.2726 2.1174 12.5032 2.3522C12.7334 2.5874 12.8485 2.87 12.8485 3.2V10.4C12.8485 10.73 12.7334 11.0126 12.5032 11.2478C12.2726 11.4826 11.9956 11.6 11.672 11.6H6.37792ZM4.02498 14C3.70145 14 3.42439 13.8826 3.1938 13.6478C2.9636 13.4126 2.84851 13.13 2.84851 12.8V5C2.84851 4.83 2.90498 4.6874 3.01792 4.5722C3.13047 4.4574 3.27007 4.4 3.43674 4.4C3.60341 4.4 3.74321 4.4574 3.85615 4.5722C3.9687 4.6874 4.02498 4.83 4.02498 5V12.8H9.90733C10.074 12.8 10.2138 12.8576 10.3267 12.9728C10.4393 13.0876 10.4956 13.23 10.4956 13.4C10.4956 13.57 10.4393 13.7124 10.3267 13.8272C10.2138 13.9424 10.074 14 9.90733 14H4.02498Z" fill="#00558C"/>
            </svg>
            <span class="offer-table-row__vin-tooltip">{{ copiedVin ? 'Copied' : 'Copy full VIN' }}</span>
          </button>
        </span>
      </div>
    </div>

    <div class="offer-table-row__cell offer-table-row__cell--time">{{ timeRemaining }}</div>
    <!-- 2026-09-02 按你的要求:这一列显示的数字从 acvEstimate 换成
         reservePrice(表头文案跟着从 "ACV Estimate" 改成 "Reserve
         Price",见 OfferTableHeader.vue)。acvEstimate 这个 prop 本身
         没有删除——InformationDialog 的 "ACV Estimate" 那一行还在用它,
         只是表格这一列不再显示它,class 名字暂时还叫 --estimate,是
         历史遗留的内部命名,不影响页面上显示的文字。 -->
    <div class="offer-table-row__cell offer-table-row__cell--estimate">{{ reservePrice }}</div>
    <!-- 2026-09-08 按你的要求:去掉 Sent/Received 的 --strong 修饰类,
         统一成和 Reserve/Time Remaining 一样的 Regular 字重——之前这两列
         是对照 Figma 真实行实例核实过的 Medium 字重(细节见notes.md
         "已核实"表格里的记录),这次是你明确要求改成和其它列一致,不是
         发现核实错了。 -->
    <div class="offer-table-row__cell offer-table-row__cell--sent">{{ sentAmount }}</div>
    <div class="offer-table-row__cell offer-table-row__cell--received">{{ receivedAmount }}</div>

    <div class="offer-table-row__cell offer-table-row__cell--update">
      <div class="offer-table-row__update-default">
        <div class="offer-table-row__status-pills">
          <StatusChip v-if="showNewChip" status="new" label="New" :show-icon="false" />
          <StatusChip :status="dealState" :label="stateChipLabel" />
        </div>
        <div class="offer-table-row__update-date">{{ updateDate }}</div>
      </div>
      <!-- 2026-09-02 按你的要求,参照 Figma node 1:21166(fileKey
           4z7FK34Fgit7Fi9UxZu0za,"Offers - Negotiation" 文件)新增:
           hover 这一行时,Update 列的 StatusChip/日期换成这一组 CTA——
           小号 pill 按钮(outlined secondary + filled primary)+ 一条
           1px 分割线 + 纯文字链接"More Info"(filled 按钮最初带字面的
           "✓" 字符前缀,和 InformationDialog 的 Accept 按钮同一个写法,
           2026-09-02 你直接要求去掉,两处都改成纯文字)。按钮组的
           内容(哪个状态显示哪些按钮)直接复用 OfferCard 的 hoverButtons
           状态表(见下面 script,同一套 viewerRole+dealState 判断),
           只是这里按 Figma 参照的样子换成小号横排 pill,不是卡片那套
           竖排大按钮——两种视图密度不同,不代表数据/交互不同,点任意一个
           都打开同一个 InformationDialog,用的是同一行数据,和卡片视图
           点 hover CTA 打开的效果完全对应。【2026-09-02 例外】"Remove
           From List" 已经单独拆出来,不再打开这个 Dialog,改成先弹二次
           确认框,细节见 fragments/RemoveFromListDialog/notes.md。 -->
      <div class="offer-table-row__ctas">
        <button
          v-for="(btn, i) in hoverButtons.buttons"
          :key="i"
          type="button"
          class="offer-table-row__cta-btn"
          :class="`offer-table-row__cta-btn--${btn.style}`"
          @click="handleHoverButtonClick(btn.label)"
        >{{ btn.label }}</button>
        <span v-if="hoverButtons.infoLink" class="offer-table-row__cta-divider" />
        <button
          v-if="hoverButtons.infoLink"
          type="button"
          class="offer-table-row__cta-link"
          @click="handleHoverButtonClick(hoverButtons.infoLink)"
        >{{ hoverButtons.infoLink }}</button>
      </div>
    </div>

    <InformationDialog
      v-model="dialogOpen"
      :photo-url="photoUrl"
      :vehicle-title="vehicleTitle"
      :vin="vin"
      :mileage="mileage"
      :auction-id="auctionId"
      :offer-type="offerType"
      :viewer-role="viewerRole"
      :deal-state="dealState"
      :is-new="dialogIsNewSnapshot"
      :counterparty-amount="receivedAmount"
      :own-amount="sentAmount"
      :reserve-price="reservePrice"
      :acv-estimate="acvEstimate"
      :report-url="reportUrl"
      :time-left="timeRemaining ? `${timeRemaining} Left` : ''"
      :time-left-urgent="timeLeftUrgent"
      :history="history"
      :has-prev="hasPrevDeal"
      :has-next="hasNextDeal"
      @prev="$emit('prev-deal')"
      @next="$emit('next-deal')"
    />
    <RemoveFromListDialog v-model="removeDialogOpen" @remove="$emit('remove-from-list')" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import StatusChip from '../StatusChip/StatusChip.vue'
import OfferTypeBadge from '../OfferTypeBadge/OfferTypeBadge.vue'
import InformationDialog from '../InformationDialog/InformationDialog.vue'
import RemoveFromListDialog from '../RemoveFromListDialog/RemoveFromListDialog.vue'

const props = defineProps({
  // 单经销商账号时不显示 dealerName,第二列改用 auctionId 做主标题
  // (见 6837:16538)
  isMultiDealer: { type: Boolean, default: true },
  photoUrl: { type: String, default: '' },
  dealerName: { type: String, default: 'CarMax Boston' },
  auctionId: { type: String, default: '264578' },
  // in-negotiation | make-offer | none
  offerType: { type: String, default: 'in-negotiation' },
  vehicleTitle: { type: String, default: '2018 Ford Somemodel' },
  mileage: { type: String, default: '250,000 miles' },
  vin: { type: String, default: '192211' },
  // 2026-09-01:默认值原来是 Figma 核实截图当时的原始数字($26,000/
  // $7,000/20h 45m),按 "Offer States Logic for CC.md" 的 Number rules
  // 重新生成 mock.js 之后跟着同步,不再是最初核实截图的字面值——上面
  // METADATA/source_of_truth 记录的仍然是当时 Figma 截图的原始数字,这里
  // 只是组件自己的 prop 默认值,两者不是同一件事,细节见 mock.js 文件头
  // 注释。
  timeRemaining: { type: String, default: '3h 15m' },
  acvEstimate: { type: String, default: '$25,000' },
  sentAmount: { type: String, default: '$26,000' },
  receivedAmount: { type: String, default: '$26,800' },
  statusNew: { type: Boolean, default: true },
  statusReceived: { type: Boolean, default: true },
  // 2026-08 按你的要求新增,见 METADATA 里记录的业务逻辑说明
  statusSent: { type: Boolean, default: false },
  statusDeclined: { type: Boolean, default: false },
  // 2026-09-02 按你的要求,所有"Today"都要带具体时间,默认值也跟着改
  updateDate: { type: String, default: 'Today, 08:45 AM' },
  // 2026-09-02 新增,给 hover CTA + InformationDialog 用——table view 和
  // tile view(OfferCard)是同一笔 deal 的两种展示方式,这几个字段和
  // OfferCard 用的是同一套(viewerRole 由 OfferDashboard 按当前
  // Buying/Selling tab 传进来,reservePrice/reportUrl/history 本来就已经
  // 在 mock.js 每一行上了,只是之前没有声明成这个组件的 prop,v-bind="row"
  // 传过来的时候被当成多余的 DOM attribute 丢掉了)。
  // 默认值要和上面 sentAmount/receivedAmount 的默认值($26,000/$26,800,
  // 抄自 rowWithNewAndReceived,一行 Buying tab 的真实数据)保持同一个
  // 视角——那两个默认金额里,$26,000 是买家自己出的价(sentAmount),
  // $26,800 是买家收到的卖家还价(receivedAmount),这组默认数据本来就是
  // "买家视角",如果这里默认给 'seller' 会让默认打开的 Information
  // Dialog 显示反过来(Buyer High Bid 比 Seller Counter 还高,违反买家<
  // 卖家<reserve 这条顺序)。
  viewerRole: { type: String, default: 'buyer' },
  reservePrice: { type: String, default: '$27,000' },
  reportUrl: { type: String, default: '#' },
  history: { type: Array, default: () => [] },
  // 2026-09-02 按 Figma node 7597:112866 新增,透传给 InformationDialog
  // 的 hasPrev/hasNext——这一行是不是列表里第一/最后一行,OfferTableRow
  // 自己不知道(只认识自己这一行),由外层(OfferDashboard 的
  // rowsWithDealerMode)按当前行在可见列表里的位置算好了传进来。默认都是
  // false,不传就是"没有其他 deal 可以切",不影响任何已有用法。
  hasPrevDeal: { type: Boolean, default: false },
  hasNextDeal: { type: Boolean, default: false },
  // 2026-09-08(第三次)新增:同 OfferTableHeader.vue 的同名 prop,细节见
  // fragments/OfferDashboard/notes.md 同名条目——OfferDashboard.vue 的
  // table view 现在把表头+所有数据行放进同一个 CSS Grid 共享列宽,这个
  // 组件需要从"自己是一个 flex 容器"变成"直接把 8 个 cell 交给外层 grid
  // 摆放"(display:contents)。默认 false,不影响这个组件自己独立的
  // Playground 预览(order 31)。
  gridLayout: { type: Boolean, default: false }
})
// 2026-09-02 新增,配合上面两个 prop——点了 InformationDialog 的
// Previous/Next 之后,原样往上 emit,交给真正维护列表的 OfferDashboard 处理
// 2026-09-02 新增 remove-from-list,同 OfferCard.vue 的道理,细节见
// fragments/RemoveFromListDialog/notes.md
const emit = defineEmits(['prev-deal', 'next-deal', 'remove-from-list', 'viewed'])

const offerTypeLabel = computed(() =>
  props.offerType === 'make-offer' ? 'Make Offer' : 'In Negotiation'
)

const dialogOpen = ref(false)
const removeDialogOpen = ref(false)
// 2026-09-14 新增,同 OfferCard.vue 的道理(细节见该文件同名注释):打开
// 的这个 dialog 显示的 New 徽标不能直接绑活的 `statusNew` prop——那样会
// 随着下面 emit('viewed') 让父级同步标记已读,立刻变成 false,dialog
// 里的 New 徽标就跟着背后列表一起消失了。你要求这次打开时它还应该显示
// New,要等关掉、重新打开(第二次)才不显示——所以在打开的这一刻拍一张
// 当时 statusNew 值的"快照"存起来,传给 dialog 的是这个快照,不随背后
// 状态变化,直到下一次重新打开才会拍新的快照。
const dialogIsNewSnapshot = ref(false)
// 2026-09-02 按你的要求,同 OfferCard.vue 的道理:点 VDP 图片链接、或点
// 任何一个会打开 InformationDialog 的 hover 按钮都算"看过"了,细节见
// fragments/OfferDashboard/notes.md
function handleHoverButtonClick(label) {
  if (label === 'Remove From List') {
    removeDialogOpen.value = true
  } else {
    // 拍快照必须在 emit('viewed') 之前,理由同 OfferCard.vue。
    dialogIsNewSnapshot.value = props.statusNew
    dialogOpen.value = true
    emit('viewed')
  }
}
// 2026-09-02 按 Figma node 7597:112866 新增,同 OfferCard.vue 的道理:
// OfferDashboard 需要能"关掉这一行的对话框、打开相邻那一行的对话框",
// 露出这两个方法作为唯一的外部控制入口,不直接暴露 dialogOpen 这个 ref。
// 2026-09-14 openDialog 新增可选参数 isNewSnapshot,理由同 OfferCard.vue
// ——OfferDashboard 那边是"先 markSeen 再 openDialog",这里如果自己现场
// 读 props.statusNew,读到的已经是 markSeen 生效之后的 false。
defineExpose({
  openDialog: (isNewSnapshot) => {
    dialogIsNewSnapshot.value = isNewSnapshot !== undefined ? isNewSnapshot : props.statusNew
    dialogOpen.value = true
  },
  closeDialog: () => { dialogOpen.value = false }
})
// 2026-09-03 按 Figma node 7675:28425 新增:table view 的 VIN 一直只是
// 纯文字,没有 OfferCard 早就有的"复制到剪贴板"功能——这个节点显示 hover
// 图标时下方弹出深色 tooltip "Copy full VIN",照抄的是同一个动作,逻辑和
// OfferCard.vue 的 copyVin() 一模一样,这里单独一份是因为两个组件没有
// 共享的 script,不是故意写了不一样的实现。
// 2026-09-08 按你的要求新增:点击复制之后 tooltip 文字临时换成
// "Copied"(1.5秒后自动变回"Copy full VIN"),不管是这里(table)还是
// OfferCard.vue(card)都要有同样的反馈,两边各自维护一份 copiedVin
// 状态,逻辑一模一样。`.is-copied` 这个 class 除了让 tooltip 强制保持
// opacity:1(不然复制完鼠标一移开,tooltip 跟着 hover 状态一起消失,
// "Copied" 还没看清就没了),还让 pill 底色/padding 和图标本身也强制
// 保持可见(不依赖 `.offer-table-row:hover`)——否则点完之后鼠标只要
// 移出这一行,图标会因为 display:none 直接消失,"Copied" 反馈也就跟着
// 图标一起没了。
const copiedVin = ref(false)
let copiedVinTimer = null
function copyVin() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(props.vin).catch(() => {})
  }
  copiedVin.value = true
  clearTimeout(copiedVinTimer)
  copiedVinTimer = setTimeout(() => { copiedVin.value = false }, 1500)
}
// 表格行没有 statusExpired 这个字段(过期这个概念目前只在 OfferCard 的
// mock 里演示过),所以这里只会落到 declined/sent/received 三种之一,
// 和 OfferDashboard.vue 里 rowsAsCards 用的 rowToDealState() 是同一套
// 优先级判断(declined优先,再sent,再默认received)
const dealState = computed(() => {
  if (props.statusDeclined) return 'declined'
  if (props.statusSent) return 'sent'
  return 'received'
})
// 2026-09-02 按你的要求:Update 列之前直接把 statusNew/statusReceived/
// statusSent/statusDeclined 四个布尔值各自渲染成一个 StatusChip,同一行
// 数据(比如 statusNew+statusReceived+statusSent 三个都是 true)会同时
// 冒出三个 chip,和卡片视图(只认 dealState 这一个值,同一时间只显示一个
// 状态chip)完全不一样,导致 table/card 看起来是两种不同的状态。以 card
// 上的内容为准,这里改成和 OfferCard.vue 一模一样的 showNewChip/
// stateChipLabel 计算方式(New 只能和 received/declined 搭配,状态本身
// 永远只显示 dealState 对应的这一个 chip,不是四个布尔值各自独立展示)。
const showNewChip = computed(() =>
  props.statusNew && (dealState.value === 'received' || dealState.value === 'declined')
)
const stateChipLabel = computed(() => {
  const labels = { received: 'Received', sent: 'Sent', declined: 'Declined' }
  return labels[dealState.value] || ''
})
const timeLeftUrgent = computed(() =>
  !!props.timeRemaining && !/[hd]/.test(props.timeRemaining) && /m/.test(props.timeRemaining)
)

// 2026-09-02 按 Figma node 1:21166 核实的样子(见上面模板注释)新增:
// 和 OfferCard 的 hoverButtons computed 是同一套 viewerRole+dealState
// 状态表(细节见 fragments/OfferCard/OfferCard.vue 的 hoverButtons),
// 只是这里多拆出一个 infoLink 字段——Figma 这个参照帧里 "Counter" +
// "Accept $X" 是两个真正的按钮,"More Info" 是分割线右边单独的纯文字
// 链接,不是第三个同等视觉权重的按钮,和卡片版本三个按钮堆成一排视觉上
// 不一样(卡片是竖排大按钮,没有分割线+链接这个结构),但背后对应的还是
// 同一组动作(Accept/Counter/查看详情),点这里任意一个和点卡片任意一个
// hover 按钮一样,统一打开同一个 InformationDialog,不按点了哪个区分
// 内容——这个简化和卡片是同一个已知的临时决定,不是这次新引入的。
// declined 这个组合(两个按钮都不是"主操作",没有对应的分割线+链接
// 结构可参照)保持原来两个平级按钮的样子,不套用这个新结构。
// 2026-09-03 按你的要求简化,和 OfferCard.vue 的道理一样(table/tile 是
// 同一笔 deal 的两种展示,交互要对应):除了 declined(表格行没有
// expired 这个状态,维持原来两个按钮 View Details + Remove From List 不
// 变)之外,不管 buyer/seller、received/sent 哪种组合,统一只显示一个
// 按钮 "Manage Offer",不再有 Counter/Accept/Raise Your Offer/View
// Details 这些区分,也不再拆出单独的 "More Info" 分割线链接——点这个唯一
// 按钮的行为没变,还是走下面同一个 handleHoverButtonClick,打开同一个
// InformationDialog。
// 2026-09-14 按你的要求新增一条业务规则,同 OfferCard.vue 的道理(细节
// 见该文件同名注释):Make Offer 里买家已经发出offer、还在等卖家
// Accept/Decline(sent)的时候不能再发第二次,这时候点开 dialog 什么都
// 做不了,CTA 也该改成 "View Details"。
const hoverButtons = computed(() => {
  const s = dealState.value
  if (s === 'declined') {
    return {
      buttons: [
        { label: 'View Details', style: 'outlined' },
        { label: 'Remove From List', style: 'grey-outline' }
      ],
      infoLink: null
    }
  }
  if (s === 'sent' && props.offerType === 'make-offer' && props.viewerRole === 'buyer') {
    return { buttons: [{ label: 'View Details', style: 'outlined' }], infoLink: null }
  }
  return { buttons: [{ label: 'Manage Offer', style: 'filled' }], infoLink: null }
})
</script>

<style scoped>
.offer-table-row {
  display: flex;
  align-items: stretch;
  font-family: 'Roboto', sans-serif;
  background: #FFFFFF;
}

/* 2026-09-08(第三次)同 OfferTableHeader.vue 的 --grid 修饰类——只在
   gridLayout=true 时把这个元素自己"拆开",直接把 8 个 __cell 交给外层
   OfferDashboard.vue 的 `.offer-dashboard__table-scroll`(display:grid)
   摆放,列宽完全由那个共享的 grid-template-columns 决定。display:
   contents 的元素自己不再生成盒子,原来直接画在 .offer-table-row 这个
   盒子上的背景色(整行白底 + hover 变蓝)不会再生效,所以下面单独给
   .offer-table-row__cell 补了默认白底,并把 hover 变色规则从"整行"
   改成"整行 hover 时,每个 cell 各自变色"——两条规则并存,flex 模式下
   视觉结果不变(蓝色背景画在cell上还是画在行上,肉眼看不出差别),grid
   模式下变成唯一生效的规则。:hover 状态本身不依赖盒子,display:contents
   元素的悬浮状态照样能正确根据"鼠标是否在它某个子元素上"判断,这条
   descendant selector 在两种模式下都能正常触发。 */
.offer-table-row--grid {
  display: contents;
}

.offer-table-row:hover {
  background: #F0F8FF;
}

.offer-table-row:hover .offer-table-row__cell {
  background: #F0F8FF;
}

.offer-table-row__cell {
  position: relative;
  height: 80px;
  background: #FFFFFF;
  box-sizing: border-box;
  padding: 21px 16px 0;
  border-bottom: 1px solid #DCDFE8;
  font-size: 14px;
  color: #212121;
}

/* 2026-08 按你的要求(Dashboard 全屏 presentation 时表格要跟着变宽):
   width:Npx 换成 flex:N 1 Npx,和 OfferTableHeader 的改法、原因、
   "容器正好1122px时数值完全不变"的结论都一样,这里不重复贴一遍,细节看
   那边的注释。dealer-name / vehicle-title 两处原来用来做单行截断的
   max-width(168px/146px)也一起删掉了,改成让它们自然撑满所在 cell
   的内容宽度(cell 本身的 padding 不变,内容宽度 = flex 算出来的 cell
   宽度减掉 padding,列变宽之后截断的文字会跟着显示得更多,不是列变宽了
   文字还卡在原来那个更窄的宽度截断)。 */
/* 2026-09-08 按你的要求:table view 在窄屏下不再靠 flex-shrink 把每一列
   越挤越小——之前每列 shrink 都是1,但表头的图片格子是空 div(几乎没有
   最小宽度),这里的图片格子里有一张真实64px图片(有实际的最小宽度
   下限),两边收缩的幅度不一样,越窄越对不上表头;文字类列没做限制,
   挤太窄还会被迫换行,撑破写死的80px行高。改成 shrink:0,每一列永远
   保持 Figma 核实过的宽度,不够宽时靠外层新增的
   `.offer-dashboard__table-scroll` 横向滚动,细节和根因分析见
   fragments/OfferDashboard/notes.md 同名条目。 */
/* 2026-09-08(第二次)你反馈宽屏(比如全屏预览)下对齐又出问题、
   Auction ID 列太宽——根因和改法见 OfferTableHeader.vue 同一处注释:
   grow 之前一直没归零,宽屏时每列还会按比例被拉宽,浮点比例分配在表头/
   数据行两个独立 flex 容器里可能算出不完全一致的像素值,列数多、拉得
   越宽误差越容易被看见;而且拉宽本身也会让 Auction-ID-only 模式(不需要
   200px)显得空得很不自然。这次连 grow 也归零,每一列永远精确等于自己
   的 basis 像素值。 */
.offer-table-row__cell--photo {
  flex: 0 0 80px;
  padding: 8px;
  display: flex;
}

.offer-table-row__photo {
  width: 64px;
  height: 64px;
  object-fit: cover;
  /* mask 圆角具体数值未从 Figma 拿到,先用 8px 占位,待确认 */
  border-radius: 8px;
}

/* 2026-09-08(第二次)按你的要求:isMultiDealer=false 时这一列只显示
   Auction ID + Type 徽标(最宽的 "In Negotiation" 徽标实测92px),200px
   是给 Dealer Name 模式(可能是长经销商名)准备的宽度,Auction ID 模式下
   明显太宽,收窄到140px(92px徽标+左右各16px padding=124px,留一点
   余量)。isMultiDealer=true 时保持200px不变。OfferTableHeader.vue
   同一列做了同样的切换,细节见该文件同一处注释。 */
/* 2026-09-08(第八次)按你的要求:除 Vehicle/Update 外,其余列的左右
   padding 各减少12px(16px→4px),内容区宽度不变,列宽跟着各减少24px,
   细节和为什么不直接砍列宽(会裁切内容)见
   fragments/OfferDashboard/notes.md 同名条目。 */
.offer-table-row__cell--dealer { flex: 0 0 116px; padding-left: 4px; padding-right: 4px; }
.offer-table-row__cell--dealer--wide { flex: 0 0 176px; }
.offer-table-row__dealer-name {
  font-size: 14px;
  line-height: 21px;
  letter-spacing: 0.25px;
  color: #0E0E0F;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.offer-table-row__dealer-sub {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}
.offer-table-row__dealer-id {
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.4px;
  color: #55575C;
}

.offer-table-row__cell--vehicle {
  flex: 0 0 176px;
  /* 2026-08 核实自节点 7448:9966(hidden=false):内容框实际是
     left:14px / right:35px(不是其余列常见的左右各16px),换算内容宽度
     195-14-35=146px,不是对称 padding,已按真实坐标改过来。
     2026-09-08(第五次)按你的要求,右侧35px压缩到16px(触发横向滚动
     之前先把每列自己的留白统一压到16px,尽量多撑一会儿再滚动),内容
     宽度146px不变,列宽跟着从195px收窄到 146+14+16=176px,细节见
     fragments/OfferDashboard/notes.md 同名条目。 */
  padding: 21px 16px 0 14px;
  text-align: left;
}
.offer-table-row__vehicle-title {
  font-size: 14px;
  line-height: 21px;
  letter-spacing: 0.25px;
  color: #212121;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.offer-table-row__vehicle-sub {
  margin-top: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 2px;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.4px;
  color: #757575;
}
/* 2026-09-03 对照 Figma node 7675:28425 补上一直缺失的复制图标 + pill
   底色(之前 VIN 一直是纯文字,没有 OfferCard 早就有的复制到剪贴板
   功能)。
   【2026-09-03 更正】你指出默认状态不该变——对照 node 7676:28776(同一
   套行,默认态)核实,默认状态下 VIN 就是纯文字,没有 pill 底色也没有
   复制图标,pill 底色 + 图标只在 hover 这一行时才出现(照抄 7675:28425
   这个 hover 态节点)。之前一直显示是我把"hover 才有的效果"错当成
   "一直显示的效果"实现了。改成默认不显示(`.offer-table-row__vin` 不带
   背景/padding,`.offer-table-row__vin-copy-btn` 默认 `display:none`),
   只在 `.offer-table-row:hover` 时才切换出来——和这一整行本来就有的
   "hover 换出 CTA 按钮组"是同一个触发时机(hover 整行,不是单独 hover
   VIN 这几个字),不是新发明一套触发逻辑。 */
.offer-table-row__vin {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  font-weight: 500;
  color: #00558C;
}
.offer-table-row:hover .offer-table-row__vin,
.offer-table-row__vin.is-copied {
  gap: 2px;
  padding: 0 4px 0 0;
  background: #F5FBFF;
}
.offer-table-row__vin-copy-btn {
  position: relative;
  display: none;
  align-items: center;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  color: inherit;
}
.offer-table-row:hover .offer-table-row__vin-copy-btn,
.offer-table-row__vin-copy-btn.is-copied {
  display: inline-flex;
}
.offer-table-row__vin-copy-btn svg {
  display: block;
}
/* 2026-09-03 新增:hover 图标弹出的说明 tooltip,颜色/圆角/padding 和
   项目里已有的同一套 tooltip 惯例(AppHeader.vue 的
   `.app-header__tooltip`,Rewards 收缩态图标 hover 用的那个)完全一样,
   不是重新设计一套——这个项目里深色 tooltip 的样式已经在别处核实过
   一次,这里直接复用同一份数值。 */
.offer-table-row__vin-tooltip {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 10px;
  border-radius: 4px;
  background: #1C1D1F;
  color: #F7F7F8;
  font: 400 12px/18px 'Roboto', sans-serif;
  letter-spacing: 0.4px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity .1s ease;
  z-index: 10;
}
.offer-table-row__vin-copy-btn:hover .offer-table-row__vin-tooltip,
.offer-table-row__vin-copy-btn:focus-visible .offer-table-row__vin-tooltip,
.offer-table-row__vin-copy-btn.is-copied .offer-table-row__vin-tooltip {
  opacity: 1;
}

.offer-table-row__cell--time { flex: 0 0 100px; padding-top: 30px; padding-left: 4px; padding-right: 4px; }
/* 2026-09-08(第七次)123px 是"ACV Estimate"这个旧标题核实来的历史
   宽度,标题缩短成"Reserve"之后一直没跟着缩短列宽,细节见
   fragments/OfferDashboard/notes.md 同名条目。收窄到90px。
   2026-09-08(第八次)再压缩左右padding到4px(16px→4px),宽度跟着
   再收窄24px变成66px。 */
/* 2026-09-08(第十一次)按你的要求,三列的最小列宽各增加12px,跟
   OfferTableHeader.vue/OfferDashboard.vue 的改动同步。
   2026-09-08(第十二次)按你的要求再加12px。 */
.offer-table-row__cell--estimate { flex: 0 0 102px; padding-top: 30px; padding-left: 4px; padding-right: 4px; font-weight: 400; }
.offer-table-row__cell--sent { flex: 0 0 97px; padding-top: 30px; padding-left: 4px; padding-right: 4px; }
.offer-table-row__cell--received { flex: 0 0 105px; padding-top: 30px; padding-left: 4px; padding-right: 4px; }

/* 2026-09-02:原来是纯 padding-top 撑开内容,现在要在同一块地方切换
   "chips+日期"和"CTA按钮组"两种内容,改成 flex + align-items:center
   垂直居中——不管当前显示哪一块,都能在 80px 行高里居中,不用像原来那样
   手动算 padding-top 凑位置。左侧 padding 保持 24px 不变(原来数值),
   右侧留 16px,和其它列右边留白一致。
   2026-09-08(第五次)按你的要求,左侧24px压缩到16px(触发横向滚动
   之前先把每列自己的留白统一压到16px),内容区宽度(225-24-16=185px)
   不变,列宽跟着从225px收窄到 185+16+16=217px,细节见
   fragments/OfferDashboard/notes.md 同名条目。 */
.offer-table-row__cell--update {
  flex: 0 0 217px;
  min-width: 0;
  display: flex;
  align-items: center;
  padding: 0 16px 0 16px;
}
.offer-table-row__update-default {
  display: flex;
  flex-direction: column;
}
.offer-table-row__status-pills {
  display: flex;
  align-items: center;
  gap: 4px;
}
.offer-table-row__update-date {
  margin-top: 0;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.4px;
  color: #757575;
}

/* 2026-09-02 按 Figma node 1:21166(fileKey 4z7FK34Fgit7Fi9UxZu0za)
   新增:hover 这一行时,Update 列的 chips+日期换成这一组小号 CTA——细节
   和"为什么按钮/分割线/链接是这个结构"的说明见上面模板注释。默认不显示
   (display:none),鼠标移到整行(.offer-table-row:hover)才切换显示,
   和 chips+日期互斥,不是叠在一起。这里没有做成像 OfferCard 那样绝对
   定位+模糊覆盖——表格行本身只有 80px 高、Update 列只有一小块区域,
   直接切换显示/隐藏更简单,不需要模糊背后的车辆信息(本来也没有车辆
   信息挡在这一列)。 */
/* 2026-09-02 按你的要求 + 对照 Figma node 1:21166:CTA 按钮组是右对齐
   的(Figma 里这一坨按钮是 right:16px 绝对定位贴着列右边缘,不是贴左)。
   这里没有用绝对定位(原因见上面注释),改成让这个 flex 容器自己撑满
   整列宽度、内部子元素靠 justify-content:flex-end 推到右边——只影响
   CTA 这一块,不影响它旁边 chips+日期(.offer-table-row__update-default)
   那一块的对齐方式,两者是互斥显示、各自独立布局 */
.offer-table-row__ctas {
  display: none;
  width: 100%;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}
.offer-table-row:hover .offer-table-row__update-default {
  display: none;
}
.offer-table-row:hover .offer-table-row__ctas {
  display: flex;
}
.offer-table-row__cta-btn {
  flex-shrink: 0;
  padding: 8px 16px;
  border-radius: 999px;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
  cursor: pointer;
  box-sizing: border-box;
}
/* 和 OfferCard 的 .offer-card__hover-btn--filled/--outlined/
   --grey-outline 是同一套视觉数值(渐变色/描边色都取自已经核实过的同一
   个 token),这里没有重新定义一套新颜色,只是按钮尺寸按表格行的小号
   pill 缩小了(卡片是撑满宽度的大按钮,这里是内容多宽按钮就多宽) */
.offer-table-row__cta-btn--filled {
  border: none;
  background: linear-gradient(160deg, #F26522 13.86%, #FC4243 86.14%);
  color: #FFFFFF;
}
.offer-table-row__cta-btn--outlined {
  border: 1px solid #F26522;
  background: #FFFFFF;
  color: #F26522;
}
.offer-table-row__cta-btn--grey-outline {
  border: 1px solid #D1D3D6;
  background: #FFFFFF;
  color: #55575C;
}
/* Figma 里这条分割线是单独一个 16px 宽的占位框,线本身细看是居中的 1px
   竖线,这里直接做成一条固定高度的竖线,不额外占一整个按钮宽度的空位 */
.offer-table-row__cta-divider {
  flex-shrink: 0;
  width: 1px;
  height: 20px;
  background: #DCDFE8;
}
/* "More Info" 是纯文字链接,不是按钮——颜色沿用项目里已经核实过的链接色
   #0061A5(InformationDialog 的 "View Report"/"Close" 链接用的是同一个
   颜色,不是 Figma 原始 token 给的 #004E7D,细节见该组件 notes.md) */
.offer-table-row__cta-link {
  flex-shrink: 0;
  border: none;
  background: none;
  padding: 0;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: #0061A5;
  white-space: nowrap;
  cursor: pointer;
}
</style>
