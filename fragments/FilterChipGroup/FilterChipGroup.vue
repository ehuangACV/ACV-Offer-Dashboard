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
  <div
    class="filter-chip-group"
    :class="{ 'filter-chip-group--mobile': mobile }"
    @mousedown="handleChipsMouseDown"
    @click.capture="handleChipsClickCapture"
  >
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

    <!-- 2026-09-11 按 Figma mobile 页面(node 7765:16893)自带的设计标注
         "Hide the 'In Negotiation' and 'Make Offer' filters on mobile
         view"——mobile 下这两个 chip 完全不渲染,不是禁用/隐藏,细节见
         notes.md。 -->
    <template v-if="!mobile">
      <button type="button" class="filter-chip" :disabled="negotiationCount === 0" :class="{ 'filter-chip--selected': negotiationSelectedLocal }" @click="negotiationSelectedLocal = !negotiationSelectedLocal">
        In negotiation{{ negotiationCount ? ` (${negotiationCount})` : '' }}
      </button>
      <button type="button" class="filter-chip" :disabled="makeOfferCount === 0" :class="{ 'filter-chip--selected': makeOfferSelectedLocal }" @click="makeOfferSelectedLocal = !makeOfferSelectedLocal">
        Make Offer{{ makeOfferCount ? ` (${makeOfferCount})` : '' }}
      </button>
    </template>

    <!-- 2026-09-12 按你的要求:这条竖线是用来分隔"多选组"(Dealership/
         In negotiation/Make Offer)和"单选组"(New/Received/Sent/
         Declined)的,不是专门为 Dealership 一个 chip 画的。桌面版
         In negotiation/Make Offer 永远会渲染,多选组不会是空的,divider
         恒定显示,不受影响;mobile 版这两个 chip 永远隐藏,多选组里
         唯一可能出现的就是 Dealership 一个 chip——如果它也因为
         isMultiDealer=false 不显示(比如 Buying tab),多选组就完全是
         空的,前面没有任何东西,不该再画这条线。 -->
    <span v-if="isMultiDealer || !mobile" class="filter-chip-group__divider" aria-hidden="true" />

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

    <!-- 2026-09-12 按你给的 Figma mobile 节点(7773:45581)——mobile 上
         "Clear" 不是一直显示,只有真的选了至少一个筛选项(chip 或
         Dealership)才出现;桌面版还是保持一直显示,不受这条影响。 -->
    <button v-if="!mobile || hasAnyFilterSelected" type="button" class="filter-chip-group__clear" @click="handleClear">Clear</button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

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
  showDeclined: { type: Boolean, default: true },
  // 2026-09-11 新增,配合 Offer Dashboard 的 mobile 版设计(Figma node
  // 7765:16893)——按 Figma 节点自带的设计标注隐藏 In negotiation/Make
  // Offer 两个 chip(不是禁用,完全不渲染),chip 本身的横向 padding从
  // 16px压缩成8px、chip内部icon/文字的gap从8px压缩成4px(核实自 Figma
  // node 7765:16923),整行允许横向滚动(479px内容在375px视口里放不下,
  // Figma 本身就是横向溢出的布局,不是换行)。默认 false,不影响任何
  // 已有用法。
  mobile: { type: Boolean, default: false }
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

// 2026-09-12 新增,配合上面的 "Clear 只在选了筛选项时才显示"(mobile
// 专属)——只要 negotiation/makeOffer/单选状态任一个选中,或者
// Dealership 已经应用了筛选(dealerChipLabel 非空),就算"有筛选项"。
// dealerChipLabel 是 prop 不是这个组件自己的状态,但逻辑上 Dealership
// 也是一种筛选,选了之后同样应该能用 Clear 清掉,所以一起算进来。
const hasAnyFilterSelected = computed(() =>
  negotiationSelectedLocal.value ||
  makeOfferSelectedLocal.value ||
  !!singleSelected.value ||
  !!props.dealerChipLabel
)

// 2026-09-12 新增,配合 mobile 版设计:隐藏原生滚动条外观之后,真机上
// 触屏划动本来就能滚动,但桌面浏览器用鼠标没有"划"这个手势,鼠标在这行
// 上点击拖拽并不会滚动——补一个鼠标拖拽滚动的实现,只在 mobile=true 时
// 启用,不碰桌面版本来的表现。拖拽状态放在普通对象里,不需要响应式。
const chipsDrag = { active: false, startX: 0, startScrollLeft: 0, moved: false, el: null }
function handleChipsMouseDown(e) {
  if (!props.mobile) return
  chipsDrag.active = true
  chipsDrag.moved = false
  chipsDrag.startX = e.clientX
  chipsDrag.el = e.currentTarget
  chipsDrag.startScrollLeft = chipsDrag.el.scrollLeft
  window.addEventListener('mousemove', handleChipsMouseMove)
  window.addEventListener('mouseup', handleChipsMouseUp)
}
function handleChipsMouseMove(e) {
  if (!chipsDrag.active) return
  const dx = e.clientX - chipsDrag.startX
  // 3px 的容错阈值——鼠标点击时手指/鼠标不可能完全不抖动,不设阈值的话
  // 正常点击一个 chip 也会被误判成"发生了拖拽",导致下面 click.capture
  // 把这次真正的点击吞掉,chip 选不中
  if (Math.abs(dx) > 3) chipsDrag.moved = true
  chipsDrag.el.scrollLeft = chipsDrag.startScrollLeft - dx
}
function handleChipsMouseUp() {
  chipsDrag.active = false
  window.removeEventListener('mousemove', handleChipsMouseMove)
  window.removeEventListener('mouseup', handleChipsMouseUp)
}
// 刚发生过拖拽的那次 click 不应该真的触发 chip 的选中/取消选中——不然
// "拖了一下"经常会被浏览器同时当成一次 click,选中态被意外切换
function handleChipsClickCapture(e) {
  if (chipsDrag.moved) {
    e.stopPropagation()
    chipsDrag.moved = false
  }
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

/* 2026-09-11 mobile 变体(Figma node 7765:16923)——479px 的内容在375px
   视口里放不下,Figma 本身就是横向溢出、靠滚动查看剩下的 chip,不是换行
   或者缩得更小硬塞进去,所以允许横向滚动;chip 自己的横向 padding 从
   16px 压缩成8px、内部 icon/文字的 gap 从8px压缩成4px,这两个是核实过
   的 Figma 数值,不是随手估的。 */
/* 2026-09-12 按你的要求:mobile 上不应该有可见的横向滚动条 UI(截图里
   那种带左右箭头+灰色滚动条的样子是桌面浏览器渲染 overflow:auto 的
   默认外观,真实手机上原生触屏滚动不会长这样,只隐藏滚动条的外观,
   横向滚动本身的功能不受影响,和桌面版表格的影子滚动条那次同一个
   处理思路(只藏外观,不藏功能)。 */
.filter-chip-group--mobile {
  overflow-x: auto;
  flex-wrap: nowrap;
  scrollbar-width: none;
  cursor: grab;
}

.filter-chip-group--mobile::-webkit-scrollbar {
  display: none;
}

/* 2026-09-12 按你给的截图:"Clear" 应该贴着可视区域右边缘,滚动到还没
   到底时会盖在当时刚好在那个位置的 chip 上面(比如截图里盖住了
   "Received"的一部分),不是跟着别的 chip 一起被滚走。position:sticky
   + right:0 正好是这个效果——没滚到底时,它会被"钉"在可视区域右边缘,
   视觉上盖住底下的 chip(所以需要一个不透明的白色背景 + 比 chip 高的
   z-index);一旦滚到底,它自己在文档流里的位置正好也到了右边缘,不再
   需要覆盖任何东西,行为和普通"贴底"的 sticky 元素完全一样,不是额外
   加的特例。 */
/* 2026-09-12 按你的要求:Clear 底下盖住的那个 chip 是 32px 高的圆角
   边框盒子,但 Clear 自己原来的高度是靠 padding(6px)+行高(14px)撑出
   来的 26px,比 32px 矮了6px,导致被盖住的 chip 的圆角边框上下各露出
   一点(截图里 "Clear" 左边那个 "[" 形状的缺口)。改成显式
   height:32px + inline-flex 垂直居中文字,让 Clear 的白色背景刚好
   盖满整个 chip 的高度,不多不少,边框就完全看不到了。 */
.filter-chip-group--mobile .filter-chip-group__clear {
  position: sticky;
  right: 0;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  height: 32px;
  background: #FFFFFF;
  padding: 0 12px;
}

.filter-chip-group--mobile .filter-chip {
  padding: 6px 8px;
  gap: 4px;
}

.filter-chip-group--mobile .filter-chip--dealership {
  padding-left: 8px;
  padding-right: 8px;
}

.filter-chip-group--mobile .filter-chip--dealer-active {
  padding-left: 8px;
  padding-right: 8px;
}
</style>
