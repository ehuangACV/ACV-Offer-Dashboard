<!--
  ═══════════════════════════════════════════════════════════
  METADATA
  name: Filter Chip Group
  group: 导航与筛选 (Nav & Filters)
  order: 22
  description: >
    搜索框下方的筛选 pill 组:Dealership(下拉触发器)、In negotiation、
    Make Offer,分隔线之后是 New / Received / Sent / Declined,最右侧
    "Clear" 文字按钮。数量为 0 的筛选项显示灰色 disabled 态。
  path: fragments/FilterChipGroup/FilterChipGroup.vue
  source_of_truth: >
    Figma 文件 "Offers - Negotiation" (fileKey 4z7FK34Fgit7Fi9UxZu0za),
    节点 6847:49392("Frame 630266072",hidden=false)。get_design_context
    核实:
    - 启用态 chip(Dealership 6847:49394 / In negotiation 6847:49395 /
      Make Offer 6847:49396 / New 6847:49399 / Received 6847:49400):
      背景白色,边框 1px #212121,文字 Roboto Regular 14px/21 letter-
      spacing .25px 色 #212121,圆角 8px,高 32px。
    - 数量为 0 的 disabled 态(Sent 6847:49401 / Declined 6847:49402):
      边框和文字都是 #8D9199(text/disabled),背景仍是白色。
    - Dealership 右侧的下拉箭头图标(I6847:49394;6847:49127):18×18,
      已下载真实 SVG。
    - chip 组之间的竖分隔线(6847:49397):高 28px,色 #0E0E0F。
    - "Clear" 文字按钮(6847:49406,Code Connect 映射到项目自身的
      acv-shared-vuejs Button.vue,style="text only"):具体文字色没有
      直接给出 hex,但本节点 get_design_context 返回的 design tokens 里
      唯一的链接色是 Global/text/link-on-light #004E7D,且与截图里的
      蓝色视觉一致,因此采用 #004E7D。
    - Figma 节点本身带有设计标注(data-interaction-annotations):
      Dealership / In Negotiation / Make Offer 支持多选;New / Received
      / Sent / Declined 互斥单选;都不选时默认显示 ALL。这条筛选逻辑
      直接来自 Figma 标注,不是我猜的。
  status: >
    【2026-08 补充确认:选中态】你给了新的参照节点 6847:49600(hidden=
    false 的真实可见实例),是 "In negotiation (2)" chip 的选中态:
    背景 #F0F8FF(Global/status/info/light-x),边框 1px #0061A5
    (Global/status/info/dark),文字色同为 #0061A5,圆角仍是 8px(没变),
    其余尺寸/字体不变。这个实例只核实了 "In negotiation" 这一个 chip,
    其余 chip(Dealership / Make Offer / New / Received / Sent /
    Declined)的选中态没有单独找到各自的可见实例,是按"同一个 Figma
    Chips/Filter 组件家族,选中态应该是同一套配色"这个假设,统一套用到
    所有 chip 上——这是合理推断,不是每个都单独核实过,如果某个 chip
    的选中态其实是别的颜色,需要你再指出来。之前"加粗边框"的占位样式已
    经替换掉。

    【2026-08 新增 isMultiDealer】对照你给的单经销商参照帧
    (6837:16538,hidden=false)核实:单经销商账号下,筛选行里根本没有
    "Dealership" chip——节点 6847:49743 的 Filters 容器宽度从多经销商版
    本的 840px 变成 713px,子元素直接从 "In negotiation (2)" 开始,后面
    Make Offer / 分隔线 / New / Received / Sent / Declined 的宽度和顺序
    与多经销商版本完全一致,只是少了最前面的 Dealership 那一个。据此加了
    `isMultiDealer` prop,为 false 时不渲染 Dealership chip。

    【2026-08 按你的要求:点 chip 要真的过滤 table/tile 内容】之前这些
    chip 只是自己切换选中态的颜色,不影响 OfferTableRow/OfferCard 显示
    哪些数据。现在加了 filter-change 事件,negotiationSelectedLocal /
    makeOfferSelectedLocal / singleSelected 三个内部状态任何一个变化
    (包括点 Clear 重置)都会 emit 一次 { negotiation, makeOffer, single }
    给父组件,由父组件(OfferDashboard)决定怎么过滤真正的行数据——这个
    组件本身不知道 row 长什么样,只负责告诉外面"现在选中的是什么"。
    Clear 按钮现在除了 emit clear 之外,也会把这三个内部状态自己重置掉,
    这样点 Clear 后 chip 的高亮外观和实际过滤结果能同步清空。

    【2026-08 按你的要求:所有 0 个的 chip 都要 disable + 去掉"(0)"】
    之前只有 New/Received/Sent/Declined 四个做了 `:disabled="xxxCount===0"`,
    In negotiation/Make Offer 漏了,不管数量是不是 0 都能点。现在六个
    chip 统一处理:数量为 0 时 `:disabled` + 不显示 "(0)"(只显示纯文字
    label,数量>0 时才显示 "(N)")。这些数量本身是 OfferDashboard 算好
    传进来的 props,这个组件不知道"数量为什么是这个值"——你指出"选了
    dealership 之后,数量应该跟着筛选结果变,不能还是全量的数字"这个
    问题的实际修复在 OfferDashboard(见其 notes.md),这里只负责"数量是
    0 时怎么显示",不负责数量怎么算出来。
  ═══════════════════════════════════════════════════════════
-->
<template>
  <div class="filter-chip-group">
    <!-- 单经销商账号时不显示这颗 chip,见 METADATA 里 6837:16538 的核实。
         2026-08 按你的要求:应用了经销商筛选之后,摘要 chip 要顶替这颗
         按钮本来的位置,不是在筛选行下面另起一行显示。参照真实原型
         (My-ACV--Dealer-filter-main)V2 版本 "chip default ↔ active
         states toggled by JS" 的做法,同一个按钮内部切换两种内容。 -->
    <button
      v-if="isMultiDealer"
      ref="dealershipBtnRef"
      type="button"
      class="filter-chip filter-chip--dealership"
      :class="{ 'filter-chip--selected': dealershipOpen, 'filter-chip--dealer-active': dealerChipLabel }"
      @click="$emit('toggle-dealership')"
    >
      <template v-if="dealerChipLabel">
        <span class="filter-chip__dealer-label">{{ dealerChipLabel }}</span>
        <span class="filter-chip__dealer-close" role="button" aria-label="Clear dealer filter" @click.stop="$emit('clear-dealer')">
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
            <path d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </span>
      </template>
      <template v-else>
        Dealership
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.4425 6.22125L9 9.65625L5.5575 6.22125L4.5 7.27875L9 11.7787L13.5 7.27875L12.4425 6.22125Z" fill="#0E0E0F"/>
        </svg>
      </template>
    </button>

    <button type="button" class="filter-chip" :disabled="negotiationCount === 0" :class="{ 'filter-chip--selected': negotiationSelectedLocal }" @click="negotiationSelectedLocal = !negotiationSelectedLocal">
      In negotiation{{ negotiationCount ? ` (${negotiationCount})` : '' }}
    </button>
    <button type="button" class="filter-chip" :disabled="makeOfferCount === 0" :class="{ 'filter-chip--selected': makeOfferSelectedLocal }" @click="makeOfferSelectedLocal = !makeOfferSelectedLocal">
      Make Offer{{ makeOfferCount ? ` (${makeOfferCount})` : '' }}
    </button>

    <span class="filter-chip-group__divider" aria-hidden="true" />

    <!-- New/Received/Sent/Declined 互斥单选,来自 Figma 节点自带的设计标注 -->
    <button type="button" class="filter-chip" :disabled="newCount === 0" :class="{ 'filter-chip--selected': singleSelected === 'new' }" @click="toggleSingleSelect('new')">
      New{{ newCount ? ` (${newCount})` : '' }}
    </button>
    <button type="button" class="filter-chip" :disabled="receivedCount === 0" :class="{ 'filter-chip--selected': singleSelected === 'received' }" @click="toggleSingleSelect('received')">
      Received{{ receivedCount ? ` (${receivedCount})` : '' }}
    </button>
    <button type="button" class="filter-chip" :disabled="sentCount === 0" :class="{ 'filter-chip--selected': singleSelected === 'sent' }" @click="toggleSingleSelect('sent')">
      Sent{{ sentCount ? ` (${sentCount})` : '' }}
    </button>
    <button v-if="showDeclined" type="button" class="filter-chip" :disabled="declinedCount === 0" :class="{ 'filter-chip--selected': singleSelected === 'declined' }" @click="toggleSingleSelect('declined')">
      Declined{{ declinedCount ? ` (${declinedCount})` : '' }}
    </button>

    <button type="button" class="filter-chip-group__clear" @click="handleClear">Clear</button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// 暴露 Dealership 触发按钮的 DOM 节点,给 OfferDashboard 用来把浮层
// popover 定位在按钮下方(见 DealershipFilterDropdown 2026-08 的改动)
const dealershipBtnRef = ref(null)
defineExpose({ dealershipBtnRef })

const props = defineProps({
  // 单经销商账号时不显示 Dealership chip(见 6837:16538)
  isMultiDealer: { type: Boolean, default: true },
  dealershipOpen: { type: Boolean, default: false },
  // 已应用的经销商筛选摘要文字(比如 "Apple Chevrolet, +1"),非空时
  // Dealership 按钮会顶替显示这个摘要 + 关闭按钮,而不是默认的
  // "Dealership" + 下拉箭头,见上面 template 的说明
  dealerChipLabel: { type: String, default: '' },
  negotiationCount: { type: [String, Number], default: 2 },
  negotiationSelected: { type: Boolean, default: false },
  makeOfferCount: { type: [String, Number], default: 1 },
  makeOfferSelected: { type: Boolean, default: false },
  newCount: { type: [String, Number], default: 1 },
  newSelected: { type: Boolean, default: false },
  receivedCount: { type: [String, Number], default: 1 },
  receivedSelected: { type: Boolean, default: false },
  sentCount: { type: [String, Number], default: 0 },
  sentSelected: { type: Boolean, default: false },
  declinedCount: { type: [String, Number], default: 0 },
  declinedSelected: { type: Boolean, default: false },
  // 2026-09-02 按你的要求新增:Selling tab 不应该有 Declined 这个筛选项
  // (Buying 保持不变),默认 true 不影响任何已有用法——OfferDashboard 按
  // 当前 tab 传 false 进来才会隐藏,不是靠 declinedCount===0 的 disabled
  // 态(disabled 态还是灰着显示在那里,这次是要求整个隐藏,不是禁用)。
  showDeclined: { type: Boolean, default: true }
})
const emit = defineEmits(['toggle-dealership', 'clear', 'filter-change', 'clear-dealer'])

// Dealership / In negotiation / Make Offer 是多选,各自独立点击切换;
// New / Received / Sent / Declined 是互斥单选(Figma 节点自带的设计标注)。
// 用 props 作为初始值,点击后在组件内部维护,方便在 Playground 里直接
// 点着看选中态,不需要靠外部父组件重新传值。
const negotiationSelectedLocal = ref(props.negotiationSelected)
const makeOfferSelectedLocal = ref(props.makeOfferSelected)
const singleSelected = ref(
  props.newSelected ? 'new' :
  props.receivedSelected ? 'received' :
  props.sentSelected ? 'sent' :
  props.declinedSelected ? 'declined' : null
)

function toggleSingleSelect(key) {
  singleSelected.value = singleSelected.value === key ? null : key
}

// 2026-08 按你的要求:所有数量为 0 的 chip 都要 disable(In negotiation/
// Make Offer 之前漏了,只有 New/Received/Sent/Declined 做了 disabled 态,
// 现在补齐),并且要去掉 "(0)" 的显示(见上面 template)。这里额外加一层
// 防御:如果一个 chip 已经被选中,后来因为外部筛选(比如你选了经销商)
// 导致它的数量变成 0,自动把这个选中态清掉,不然会出现"看起来是灰色
// disabled,但其实还是选中态"这种矛盾的样子。
watch(() => props.negotiationCount, (v) => { if (Number(v) === 0) negotiationSelectedLocal.value = false })
watch(() => props.makeOfferCount, (v) => { if (Number(v) === 0) makeOfferSelectedLocal.value = false })
watch(() => props.newCount, (v) => { if (Number(v) === 0 && singleSelected.value === 'new') singleSelected.value = null })
watch(() => props.receivedCount, (v) => { if (Number(v) === 0 && singleSelected.value === 'received') singleSelected.value = null })
watch(() => props.sentCount, (v) => { if (Number(v) === 0 && singleSelected.value === 'sent') singleSelected.value = null })
watch(() => props.declinedCount, (v) => { if (Number(v) === 0 && singleSelected.value === 'declined') singleSelected.value = null })
// 2026-09-02 同样的防御:Declined chip 整个隐藏时(showDeclined变false,
// 比如切到 Selling tab),如果它当时还是选中态,一起清掉,不然切回 Buying
// tab 时会莫名其妙发现 Declined 还是选中的
watch(() => props.showDeclined, (v) => { if (!v && singleSelected.value === 'declined') singleSelected.value = null })

function handleClear() {
  negotiationSelectedLocal.value = false
  makeOfferSelectedLocal.value = false
  singleSelected.value = null
  emit('clear')
}

// 2026-08 按你的要求:点 chip 要真的过滤 table/tile 的内容,不只是自己
// 变个颜色。这个组件本身不知道 OfferTableRow 长什么样,所以把当前选中
// 状态整个 emit 给父组件(OfferDashboard),由父组件决定怎么过滤 rows。
watch([negotiationSelectedLocal, makeOfferSelectedLocal, singleSelected], () => {
  emit('filter-change', {
    negotiation: negotiationSelectedLocal.value,
    makeOffer: makeOfferSelectedLocal.value,
    single: singleSelected.value
  })
})
</script>

<style scoped>
.filter-chip-group {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Roboto', sans-serif;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 32px;
  padding: 6px 16px;
  border-radius: 8px;
  border: 1px solid #212121;
  background: #FFFFFF;
  color: #212121;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  letter-spacing: 0.25px;
  cursor: pointer;
  white-space: nowrap;
}

.filter-chip--dealership {
  padding-left: 16px;
  padding-right: 8px;
}

/* 2026-08:应用了经销商筛选后的"顶替态"——照抄之前 OfferDashboard 里
   独立摘要 chip 的配色(浅蓝底 #E6F6FC 描边/文字 #00558C),现在挪到这颗
   按钮自己身上,不再单独占一行 */
.filter-chip--dealer-active {
  background: #E6F6FC;
  border-color: #00558C;
  color: #00558C;
  padding-left: 14px;
  padding-right: 8px;
}

.filter-chip__dealer-label {
  white-space: nowrap;
}

.filter-chip__dealer-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #00558C;
  padding: 2px;
  border-radius: 50%;
  opacity: 0.85;
}

.filter-chip__dealer-close:hover {
  opacity: 1;
  background: rgba(0, 85, 140, 0.1);
}

/* 数量为 0 时的 disabled 灰色态,来自 Figma 节点 6847:49401 / 49402 */
.filter-chip:disabled {
  border-color: #8D9199;
  color: #8D9199;
  cursor: not-allowed;
}

/* 选中态 —— 来自 Figma node 6847:49600("In negotiation" chip 的选中
   实例,hidden=false),其余 chip 的选中态套用同一套配色(推断,未逐个
   核实,见 METADATA status) */
.filter-chip--selected {
  background: #F0F8FF;
  border-color: #0061A5;
  color: #0061A5;
}

.filter-chip-group__divider {
  width: 1px;
  height: 28px;
  background: #0E0E0F;
  flex-shrink: 0;
}

.filter-chip-group__clear {
  border: none;
  background: none;
  cursor: pointer;
  color: #004E7D;
  font-size: 14px;
  font-weight: 500;
  line-height: 14px;
  letter-spacing: 0.1px;
  margin-left: 4px;
}
</style>
