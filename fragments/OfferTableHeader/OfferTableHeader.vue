<!--
  ═══════════════════════════════════════════════════════════
  METADATA
  name: Offer Table Header
  group: 数据表格 (Offers Table)
  order: 30
  description: >
    表格的表头行:图片占位列 + Dealer Name(带排序、Auction ID·Type 副标题
    和信息提示图标)+ Vehicle(带 Mileage·VIN 副标题) + Time Remaining
    (带排序) + ACV Estimate + Sent + Received + Update。
  path: fragments/OfferTableHeader/OfferTableHeader.vue
  source_of_truth: >
    Figma 文件 "Offers - Negotiation" (fileKey 4z7FK34Fgit7Fi9UxZu0za),
    节点 6837:16185("Frame 1371",hidden=false)。get_design_context 核实:
    - 每个表头 cell 高 50px,背景 #FAFAFA,底部描边 1px #DCDFE8。
    - 图片占位列(78px):无文字。
    - Dealer Name(200px,6847:50859):标题 "Dealer Name" Roboto Medium
      14px/20 letter-spacing .1px 色 #212121;副标题 "Auction ID·Type"
      Roboto Regular 12px/18 letter-spacing .4px 色 #757575;信息图标
      (6847:50863,Guide Component/Badge/Info)20×20 蓝色圆底 #2196F5
      白色"i";排序图标(6896:51261,Actions/Descending)16×16 色 #757575。
    - Vehicle(197px,6837:16191):标题 "Vehicle",副标题 "Mileage·VIN",
      样式同 Dealer Name,但没有排序图标和信息图标的实例。
    - Time Remaining(124px,6837:16195):两行标题 "Time"/"Remaining",
      同样带 Actions/Descending 排序图标。
    - ACV Estimate(123px,6837:16200)/ Sent(85px,6837:16201)/
      Received(90px,6837:16202)/ Update(flex-1,6837:16209):单行标题,
      均没有排序图标或副标题的实例。
  status: >
    Vehicle / ACV Estimate / Sent / Received / Update 这几列在 Figma 里
    都没有找到排序图标的实例,所以组件没有为它们加排序箭头,不是遗漏。
    另外表头左侧还有两个 hidden=true 的备用列(Frame 214975 下的
    "Arbitration Policy" + compare_arrows / meeting_room 图标),看起来
    是设计师保留的旧列,没有采用。

    【2026-08 新增 Type 信息图标弹窗,后续又替换成真实文案】之前这个信息
    图标只是纯装饰(aria-hidden,没有任何交互),你指出对照节点
    7487:64966 的标注,点它应该弹出一个说明 "In Negotiation"/
    "Make Offer" 分别是什么意思的卡片。第一版对照节点 7487:65180
    (占位拉丁文版本)实现;你随后给了节点 7487:65207(真实文案版本,
    hidden=false),已经替换成这个真实版本,不再是占位内容:
    - 结构/颜色不变:背景#F5FBFF圆角16px三层阴影,标题"Type" Medium
      20px/30,两段描述分别配 OfferTypeBadge(直接复用已核实的组件,不
      重复定义颜色)。
    - 描述文字改成真实内容(不再是拉丁文占位,不需要标"待替换"了):
      In Negotiation → "(6h limit) High bidder from the auction." +
      "**Actions:** Accept, Decline, or Counter.";Make Offer →
      "(24h limit) Post-auction offer from any buyer." + "**Actions:**
      Accept or Decline only."(Actions: 是 Medium 字重,其余 Regular)。
      文字颜色也从占位版本猜测的 #55575C 核实成 #0E0E0F(这个节点每段
      描述文字自己单独覆盖了父级的 secondary 色 token)。
    - footer 从"1/3步骤指示+两个按钮(Guide-Button/Guide-Button)"变成
      只有一个"Got it"按钮(靠右对齐),点它和点右上角 × 一样会关闭弹层。
      按钮的具体padding/圆角在 Figma 里通过 Code Connect 换成了项目
      自己的按钮组件,没有给出像素级样式,是按项目里其它按钮常见的圆角
      药丸形状合理还原的,不是从这个节点直接量出来的,待确认。
    点击外部/按 Escape 会关闭,照抄项目里其它弹层
    (DealershipFilterDropdown/Pagination下拉)的既有惯例。

    【2026-08 新增 isMultiDealer】对照你给的单经销商参照帧
    (6837:16538 → 表头行节点 6837:16636,hidden=false)核实:单经销商
    账号下,第二列(仍是 200px 宽)标题从 "Dealer Name" 变成
    "Auction ID",副标题从 "Auction ID・Type" 变成只有 "Type",而且
    这个状态下**没有排序图标**(多经销商版本 6847:50859 里的
    Actions/Descending 排序按钮在单经销商版本 6847:50837 里完全不存在,
    不是隐藏,是节点树里就没有这个子节点)。信息图标(Guide Component/
    Badge/Info)两个版本都有,只是因为排序按钮和副标题变短,横向位置
    跟着变了(x=118→48),但这只是自动布局跟着挪,不需要手动写死。据此
    加了 `isMultiDealer` prop 控制这一列的标题/副标题/是否显示排序按钮。
  ═══════════════════════════════════════════════════════════
-->
<template>
  <div class="offer-table-header">
    <div class="offer-table-header__cell offer-table-header__cell--photo" />

    <div class="offer-table-header__cell offer-table-header__cell--dealer">
      <div class="offer-table-header__title-row">
        <span class="offer-table-header__title">{{ isMultiDealer ? 'Dealer Name' : 'Auction ID' }}</span>
        <button
          v-if="isMultiDealer"
          type="button"
          class="offer-table-header__sort"
          :class="{ 'offer-table-header__sort--active': sortColumn === 'dealer-name' }"
          @click="$emit('sort', 'dealer-name')"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.3333 8L12.3933 7.06L8.66667 10.78V2.66667H7.33333V10.78L3.61333 7.05333L2.66667 8L8 13.3333L13.3333 8Z" fill="#757575"/>
          </svg>
        </button>
      </div>
      <div class="offer-table-header__subtitle-row">
        <span class="offer-table-header__subtitle">{{ isMultiDealer ? 'Auction ID・Type' : 'Type' }}</span>
        <button
          ref="infoBtnRef"
          type="button"
          class="offer-table-header__info"
          aria-label="What do the type badges mean?"
          @click.stop="showTypeGuide = !showTypeGuide"
        >
          <svg width="20" height="20" viewBox="0 0 16.6667 16.6667" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0 8.33333C0 12.9333 3.73333 16.6667 8.33333 16.6667C12.9333 16.6667 16.6667 12.9333 16.6667 8.33333C16.6667 3.73333 12.9333 0 8.33333 0C3.73333 0 0 3.73333 0 8.33333Z" fill="#2196F5"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 12.5H9.16667V7.5H7.5V12.5ZM7.5 5.83333H9.16667V4.16667H7.5V5.83333Z" fill="white"/>
          </svg>
        </button>
        <!-- 2026-08 按你的要求,用节点 7487:65207(Guide Component/
             Announcement/MiddleImage,hidden=false)的真实文案替换掉了
             之前占位拉丁文版本(7487:65180)——这次描述文字是真实内容,
             不是占位符,不需要再标"待替换"。footer 也从"1/3 步骤指示器
             + 两个按钮"变成只有一个"Got it"按钮,没有步骤指示器了 */
        <div v-if="showTypeGuide" ref="typeGuideRef" class="offer-table-header__guide">
          <div class="offer-table-header__guide-arrow" />
          <div class="offer-table-header__guide-head">
            <span class="offer-table-header__guide-title">Type</span>
            <button type="button" class="offer-table-header__guide-close" aria-label="Close" @click="showTypeGuide = false">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="#545454" stroke-width="1.7" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="offer-table-header__guide-section">
            <OfferTypeBadge type="in-negotiation" label="In Negotiation" />
            <p class="offer-table-header__guide-desc">(6h limit) High bidder from the auction.</p>
            <p class="offer-table-header__guide-desc"><strong>Actions:</strong> Accept, Decline, or Counter.</p>
          </div>
          <div class="offer-table-header__guide-section">
            <OfferTypeBadge type="make-offer" label="Make Offer" />
            <p class="offer-table-header__guide-desc">(24h limit) Post-auction offer from any buyer.</p>
            <p class="offer-table-header__guide-desc"><strong>Actions:</strong> Accept or Decline only.</p>
          </div>
          <div class="offer-table-header__guide-footer">
            <button type="button" class="offer-table-header__guide-btn offer-table-header__guide-btn--primary" @click="showTypeGuide = false">Got it</button>
          </div>
        </div>
      </div>
    </div>

    <div class="offer-table-header__cell offer-table-header__cell--vehicle">
      <span class="offer-table-header__title">Vehicle</span>
      <span class="offer-table-header__subtitle">Mileage・VIN</span>
    </div>

    <div class="offer-table-header__cell offer-table-header__cell--time">
      <div class="offer-table-header__title-row">
        <span class="offer-table-header__title offer-table-header__title--two-line">Time<br>Remaining</span>
        <button
          type="button"
          class="offer-table-header__sort"
          :class="{ 'offer-table-header__sort--active': sortColumn === 'time-remaining' }"
          @click="$emit('sort', 'time-remaining')"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.3333 8L12.3933 7.06L8.66667 10.78V2.66667H7.33333V10.78L3.61333 7.05333L2.66667 8L8 13.3333L13.3333 8Z" fill="#757575"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 2026-09-02 按你的要求:这一列改成显示 Reserve Price,不再是 ACV
         Estimate(OfferTableRow.vue 那边的数据绑定也同步改了,细节见该
         文件注释)。class 名字暂时还叫 --estimate,历史命名,不影响
         页面上显示的文字。 -->
    <div class="offer-table-header__cell offer-table-header__cell--estimate">
      <span class="offer-table-header__title">Reserve Price</span>
    </div>
    <div class="offer-table-header__cell offer-table-header__cell--sent">
      <span class="offer-table-header__title">Sent</span>
    </div>
    <div class="offer-table-header__cell offer-table-header__cell--received">
      <span class="offer-table-header__title">Received</span>
    </div>
    <div class="offer-table-header__cell offer-table-header__cell--update">
      <span class="offer-table-header__title">Update</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import OfferTypeBadge from '../OfferTypeBadge/OfferTypeBadge.vue'

defineProps({
  // dealer-name | time-remaining | null
  sortColumn: {
    type: String,
    default: null
  },
  // 单经销商账号时第二列变成 "Auction ID"(无排序),见 6837:16538
  isMultiDealer: {
    type: Boolean,
    default: true
  }
})
defineEmits(['sort'])

// 2026-08 按你的要求新增:点击 "Type" 信息图标弹出说明卡片(对照节点
// 7487:65180 核实),照抄项目里已有弹层组件(DealershipFilterDropdown/
// Pagination 下拉)的"点外部关闭 + Escape 关闭"惯例
const showTypeGuide = ref(false)
const infoBtnRef = ref(null)
const typeGuideRef = ref(null)

function handleOutsideClick(event) {
  if (!showTypeGuide.value) return
  if (infoBtnRef.value?.contains(event.target)) return
  if (typeGuideRef.value?.contains(event.target)) return
  showTypeGuide.value = false
}
function handleEscapeKey(event) {
  if (event.key === 'Escape') showTypeGuide.value = false
}
onMounted(() => {
  document.addEventListener('mousedown', handleOutsideClick)
  document.addEventListener('keydown', handleEscapeKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleOutsideClick)
  document.removeEventListener('keydown', handleEscapeKey)
})
</script>

<style scoped>
.offer-table-header {
  display: flex;
  align-items: stretch;
  font-family: 'Roboto', sans-serif;
}

/* 2026-08 按你的要求覆盖:表头上下 padding 改成 12px。之前
   `height:50px` 是 Figma 核实过的固定值(节点 6837:16185),配的是
   `padding:5px 16px 0`——如果还保留这个固定高度,新的12px上下padding
   (合计24px)会比之前的5px挤压掉更多内容区域,两行的表头(Dealer
   Name/Vehicle/Time Remaining 都是标题+副标题两行)会被压得放不下,
   所以把固定高度去掉,改成 auto,行高交给内容+padding 自己撑出来
   (两行文字42px+24px padding≈66px),再靠 `.offer-table-header` 本身的
   `align-items:stretch` 让单行文字的列(ACV Estimate/Sent/Received/
   Update 等)跟着拉伸到同一行高,用 justify-content:center 居中,不会
   看起来矮一块。这是你直接要的改动,不是重新核实的 Figma 数值。 */
.offer-table-header__cell {
  position: relative;
  background: #FAFAFA;
  border-bottom: 1px solid #DCDFE8;
  box-sizing: border-box;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}

/* 2026-08 按你的要求(Dashboard 全屏 presentation 时表格要跟着变宽):
   把 width:Npx 换成 flex:N 1 Npx——basis 还是原来核实过的 Figma 像素值,
   grow 用同一个数值,这样只要表格容器正好是 1122px(现在默认就是),
   flex 算出来的最终宽度和原来的固定 px 完全一样,不影响任何已核实的
   数值;只有当容器比 1122px 更宽时(全屏铺满可用宽度那种场景),每一列
   才会按各自宽度的同一个比例一起变宽,不是某一列单独吃掉多余空间。
   Update 列原来是 flex:1(吃掉表格剩余空间,算出来正好是 1122-897=225),
   这里把 225 也写成明确的 basis/grow,让它跟其它列用同一套比例缩放
   逻辑,不再是"跟其他列不同规则"的特例。 */
.offer-table-header__cell--photo { flex: 78 1 78px; padding: 0; }
.offer-table-header__cell--dealer { flex: 200 1 200px; }
.offer-table-header__cell--vehicle { flex: 197 1 197px; }
.offer-table-header__cell--time { flex: 124 1 124px; }
.offer-table-header__cell--estimate { flex: 123 1 123px; }
.offer-table-header__cell--sent { flex: 85 1 85px; }
.offer-table-header__cell--received { flex: 90 1 90px; }
.offer-table-header__cell--update { flex: 225 1 225px; min-width: 0; }

.offer-table-header__title-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.offer-table-header__title {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0.1px;
  color: #212121;
  white-space: nowrap;
}

.offer-table-header__title--two-line {
  line-height: 20px;
}

.offer-table-header__subtitle-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.offer-table-header__subtitle {
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0.4px;
  color: #757575;
  white-space: nowrap;
}

.offer-table-header__info {
  position: relative;
  display: inline-flex;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
}

.offer-table-header__sort {
  display: inline-flex;
  width: 16px;
  height: 16px;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  flex-shrink: 0;
}

/* 2026-08 新增,对照节点 7487:65180(Guide Component/Announcement/
   MiddleImage,hidden=false)核实的卡片本身样式(背景/圆角/阴影/内间距/
   标题字号/描述字号/step文字色号)。两个 "Guide - Button" 按钮的具体
   padding/圆角在 Figma 里是通过 Code Connect 换成了项目自己的
   Buttons--Common 组件,没有直接给出像素级样式,这里按项目里其它按钮
   常见的圆角药丸形状做了合理还原,不是从这个节点直接量出来的,待确认。 */
.offer-table-header__guide {
  position: absolute;
  top: calc(100% + 14px);
  left: -12px;
  z-index: 20;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: #F5FBFF;
  border-radius: 16px;
  box-shadow: 0 11px 15px rgba(132, 132, 132, 0.2), 0 9px 46px rgba(132, 132, 132, 0.12), 0 24px 38px rgba(132, 132, 132, 0.14);
  font-family: 'Roboto', sans-serif;
  cursor: default;
}

.offer-table-header__guide-arrow {
  position: absolute;
  top: -8px;
  left: 20px;
  width: 16px;
  height: 8px;
  background: #F5FBFF;
  clip-path: polygon(50% 0, 0 100%, 100% 100%);
}

.offer-table-header__guide-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.offer-table-header__guide-title {
  font-size: 20px;
  font-weight: 500;
  line-height: 30px;
  letter-spacing: 0.15px;
  color: #0E0E0F;
}

.offer-table-header__guide-close {
  display: inline-flex;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  flex-shrink: 0;
}

.offer-table-header__guide-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

/* 2026-08 按你的要求用真实文案节点(7487:65207)替换,颜色从占位版本
   的 #55575C 改成这个节点标注的 #0E0E0F(每段描述文字自己单独覆盖了
   父级的 secondary 色 token,不是继承来的) */
.offer-table-header__guide-desc {
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0.1px;
  color: #0E0E0F;
}

.offer-table-header__guide-desc strong {
  font-weight: 500;
}

/* 真实文案版本(7487:65207)footer 只有一个 "Got it" 按钮,没有步骤
   指示器了,靠右对齐(占位版本的 .offer-table-header__guide-step 已删掉) */
.offer-table-header__guide-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.offer-table-header__guide-btn {
  border: none;
  background: none;
  padding: 8px 16px;
  border-radius: 100px;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 14px;
  letter-spacing: 0.1px;
  white-space: nowrap;
  cursor: pointer;
}

.offer-table-header__guide-btn--primary {
  background: #0077D8;
  color: #FFFFFF;
}
</style>
