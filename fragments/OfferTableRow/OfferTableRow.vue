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

    【2026-08 你指出:Update 列的 New chip 不应该有星星图标】你之前发过
    截图指出这个位置的 New chip 是没有图标的,一直没有生效(之前调
    `StatusChip` 组件默认 `showIcon` 时漏掉了这里)。补上
    `:show-icon="false"`,和 OfferCard 里 New chip 同样没有图标的处理
    保持一致。
  ═══════════════════════════════════════════════════════════
-->
<template>
  <div class="offer-table-row">
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
    >
      <img v-if="photoUrl" :src="photoUrl" alt="" class="offer-table-row__photo">
    </a>

    <div class="offer-table-row__cell offer-table-row__cell--dealer">
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
        <span class="offer-table-row__vin">{{ vin }}</span>
      </div>
    </div>

    <div class="offer-table-row__cell offer-table-row__cell--time">{{ timeRemaining }}</div>
    <div class="offer-table-row__cell offer-table-row__cell--estimate">{{ acvEstimate }}</div>
    <div class="offer-table-row__cell offer-table-row__cell--sent offer-table-row__cell--strong">{{ sentAmount }}</div>
    <div class="offer-table-row__cell offer-table-row__cell--received offer-table-row__cell--strong">{{ receivedAmount }}</div>

    <div class="offer-table-row__cell offer-table-row__cell--update">
      <div v-if="statusNew || statusReceived || statusSent || statusDeclined" class="offer-table-row__status-pills">
        <StatusChip v-if="statusNew" status="new" label="New" :show-icon="false" />
        <StatusChip v-if="statusReceived" status="received" label="Received" />
        <StatusChip v-if="statusSent" status="sent" label="Sent" />
        <StatusChip v-if="statusDeclined" status="declined" label="Declined" />
      </div>
      <div class="offer-table-row__update-date">{{ updateDate }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import StatusChip from '../StatusChip/StatusChip.vue'
import OfferTypeBadge from '../OfferTypeBadge/OfferTypeBadge.vue'

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
  timeRemaining: { type: String, default: '20h 45m' },
  acvEstimate: { type: String, default: '$25,000' },
  sentAmount: { type: String, default: '$26,000' },
  receivedAmount: { type: String, default: '$7,000' },
  statusNew: { type: Boolean, default: true },
  statusReceived: { type: Boolean, default: true },
  // 2026-08 按你的要求新增,见 METADATA 里记录的业务逻辑说明
  statusSent: { type: Boolean, default: false },
  statusDeclined: { type: Boolean, default: false },
  updateDate: { type: String, default: 'Today' }
})

const offerTypeLabel = computed(() =>
  props.offerType === 'make-offer' ? 'Make Offer' : 'In Negotiation'
)
</script>

<style scoped>
.offer-table-row {
  display: flex;
  align-items: stretch;
  font-family: 'Roboto', sans-serif;
  background: #FFFFFF;
}

.offer-table-row__cell {
  position: relative;
  height: 80px;
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
.offer-table-row__cell--photo {
  flex: 80 1 80px;
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

.offer-table-row__cell--dealer { flex: 200 1 200px; }
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
  flex: 195 1 195px;
  /* 2026-08 核实自节点 7448:9966(hidden=false):内容框实际是
     left:14px / right:35px(不是其余列常见的左右各16px),换算内容宽度
     195-14-35=146px,不是对称 padding,已按真实坐标改过来 */
  padding: 21px 35px 0 14px;
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
.offer-table-row__vin {
  font-weight: 500;
  color: #00558C;
}

.offer-table-row__cell--time { flex: 124 1 124px; padding-top: 30px; }
.offer-table-row__cell--estimate { flex: 123 1 123px; padding-top: 30px; font-weight: 400; }
.offer-table-row__cell--sent { flex: 85 1 85px; padding-top: 30px; }
.offer-table-row__cell--received { flex: 90 1 90px; padding-top: 30px; }
.offer-table-row__cell--strong { font-weight: 500; }

.offer-table-row__cell--update {
  flex: 225 1 225px;
  min-width: 0;
  padding: 21px 0 0 24px;
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
</style>
