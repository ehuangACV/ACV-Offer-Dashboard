<!--
  ═══════════════════════════════════════════════════════════
  METADATA
  name: Dealership Filter Dropdown
  group: 导航与筛选 (Nav & Filters)
  order: 23
  description: >
    点击 FilterChipGroup 里的 "Dealership" chip 后弹出的多选浮层面板:
    标题 + "已选 N 个" + "Select all"(会在"全选可见项"和"取消全选可见项"
    之间切换)、搜索框、经销商 checkbox 列表、底部 Reset / Apply Filter。
    只有 isMultiDealer=true(账号下挂多个经销商)时才会出现这个组件。
  path: fragments/DealershipFilterDropdown/DealershipFilterDropdown.vue
  source_of_truth: >
    【2026-08 重大更新:改为参照你提供的真实可交互原型,不再以 Figma
    静态稿为准】你给了本地文件
    `C:\Users\Einphix\Desktop\My-ACV--Dealer-filter-main\index.html`
    (配套 `style.css`),明确说"只参照里面的 V1 web 版本的 dealership
    filter 部分,其他大部分是老旧的错误内容"。这个原型里的 dealer
    filter 是一个真实可运行的浮层组件(`#dealer-popover` /
    `.dealer-filter-popover`,配套 JS 逻辑),比之前只能从 Figma 静态稿
    推断的内容更权威、更完整,所以这一版直接对照这个原型重做,不再依赖
    之前 Figma 节点 7372:19999 / 7462:38373 的推断值(那些记录仍保留在
    下面存档,但已不是当前实现的依据)。
    - 容器:白底渐变(`linear-gradient(to bottom, #fff, #fafbfc)`),边框
      #E8E9EB,圆角 12px,阴影 `0px 25px 50px -12px rgba(0,0,0,0.2)`,
      **固定尺寸 374×510px**(原型里是固定高度,不是内容撑高;这里改成
      由外层 OfferDashboard 的定位容器控制 `position:fixed`,组件本身
      只负责内部尺寸和样式,方便真正做成悬浮在触发按钮下方的浮层)。
    - 头部:sticky 在内部滚动区顶部,背景 `rgba(255,255,255,.95)`,底部
      描边 `rgba(229,231,235,.6)`。标题 "Select Dealerships" Roboto
      Medium 16px/24 色 #0E0E0F;"{n} selected" 14px/21 色 **#757575**
      (原型里是灰色,不是之前 Figma 版本猜的 #0E0E0F);"Select all" 链接
      色 #004E7D,并且原型里这个按钮的文字会在 "Select all" 和
      "Deselect all" 之间切换(取决于当前**搜索可见的**经销商是否已经
      全部勾选)。
    - 搜索框:边框 #E8E9EB 圆角8px,占位文案改成原型里的
      **"Search by dealer name or ID..."**(之前是 "Search dealer
      name")。搜索图标沿用项目里已经确认过的内联 SVG(#55575C),原型用
      的是 Material Icons 字体图标,这个项目没有引入该字体依赖,用同一个
      视觉效果的 SVG 代替,不算丢失信息。
    - 经销商列表:每行高44px,checkbox 改成原型的做法——**18×18 方框
      圆角3px 描边 #757575**,选中态背景/边框变 **#004E7D**、用
      `::after` 画一个白色勾(border-left+border-bottom 2px 旋转
      -45deg),不再是之前 Figma 版本用的 21×21/22×22 SVG 资源。这是
      更简单也更贴近这个真实原型的实现方式。
    - **经销商名单改成原型里的真实名单(10个,没有重复项)**:
      Asbury Automotive Group / Apple Chevrolet / Baxter Auto Mall /
      CarMax Boston / Classic Honda / DriveTime A / DriveTime Mall /
      DriveTime Denver / Enterprise Car Sales / Hendrick Automotive。
      **之前 Figma 版本里"Apple Chevrolet"重复出现两次、且没有
      "Enterprise Car Sales"/"Hendrick Automotive"这两个名字，一直标
      着"待确认、疑似设计师占位重复"——现在有了这份更权威的原型数据，
      直接确认那确实是 Figma 稿的遗留错误，已改用这份原型的正确名单，
      这一条"待确认"项现在可以直接关闭了。**
    - 底部:Reset(文字按钮,色 #004E7D,hover 背景
      `rgba(0,78,125,.06)`);Apply Filter(**渐变
      `linear-gradient(160deg, #F26522 13.86%, #FC4243 86.14%)`**,
      圆角100px,hover opacity .9)——这个渐变的精确角度和色标位置之前
      在 Figma 里一直拿不到("Gradient/Button" token 取值为空,只能用两个
      品牌色自己拼一个近似值),现在从这份真实原型的 CSS 里直接抄到了
      确切数值,不再是"合理还原",是真正核实过的值。
    - **交互(这是这次改动的重点,之前完全没做)**:原型把这个面板做成
      真正悬浮在触发按钮正下方的 `position:fixed` 浮层(不是原来那样
      在文档流里紧贴着筛选行往下顶开页面布局),点击面板外部 / 按
      Escape / 滚动页面时会关闭或跟着重新定位。这些交互逻辑不在这个
      组件内部实现(这个组件只管自己长什么样、内部的搜索/勾选/Reset/
      Apply),定位和开合、点击外部关闭、Escape 关闭、滚动跟随这些逻辑
      放在 `OfferDashboard.vue`(它同时也拿得到触发按钮的 DOM 节点),
      细节见该组件的 METADATA。
  status: >
    - 之前的所有 Figma 待确认项(checkbox 选中态、Apply Filter 渐变、
      Reset 文字色、Dealership chip 弹出方式)现在都被这份更权威的真实
      原型数据取代或确认,不再是待确认状态。
    - 你提供的原型里,悬浮面板是对齐触发按钮的**右边缘**弹出
      (`align: 'right'`);因为我们项目里 "Dealership" chip 是筛选行里
      最靠左的第一个按钮,如果也对齐右边缘,浮层会大概率超出视口左边界
      或显得很怪,所以改成了对齐触发按钮的**左边缘**弹出(浮层向右展开,
      和原型里 V2/V3 版本的按钮对齐方式一致)。这是因为我们的布局位置和
      原型不同而做的合理调整,不是原型本身弹层对齐方式有变化。
    - 原型里点击"当前筛选摘要小 chip"（`.dfc-chip`）的关闭按钮时,会把
      搜索框文字和经销商筛选一起清空(它自己的 `clearFilter` 函数是一个
      "全部清空"的合并逻辑)。我们项目里没有等价的"搜索框过滤文字"概念
      和这个经销商 chip 绑在一起,所以那颗小 chip 的关闭按钮**只清空
      经销商筛选**,不会牵连其他 filter chip——这是刻意收窄过的范围,
      不是照抄原型的合并逻辑,见 OfferDashboard.vue 的 METADATA。

    ────────── 以下是 2026-08 之前基于 Figma 静态稿的存档记录(不再是
    当前实现依据,仅保留历史脉络)──────────
    Figma 文件 "Offers - Negotiation" (fileKey 4z7FK34Fgit7Fi9UxZu0za),
    节点 7372:20080 / 7462:38268 一路核实下来的容器/头部/搜索框/列表/
    底部数值,和这次原型给出的数值绝大部分吻合(容器圆角12阴影、头部
    标题字号字色、搜索框圆角8、列表行高44、底部按钮结构),只有上面列出
    的几处（"selected"文字颜色、占位文案、checkbox画法、经销商名单、
    Apply Filter渐变精确值、悬浮定位交互）被这次的原型数据核实/更正。
  ═══════════════════════════════════════════════════════════
-->
<template>
  <div v-if="isMultiDealer" class="dealer-dropdown">
    <div class="dealer-dropdown__header">
      <div class="dealer-dropdown__title-row">
        <p class="dealer-dropdown__title">Select Dealerships</p>
        <div class="dealer-dropdown__title-actions">
          <span class="dealer-dropdown__selected-count">{{ selected.length }} selected</span>
          <button type="button" class="dealer-dropdown__link" @click="toggleSelectAll">
            {{ allVisibleSelected ? 'Deselect all' : 'Select all' }}
          </button>
        </div>
      </div>
      <label class="dealer-dropdown__search">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.1292 11.8792H12.4708L12.2375 11.6542C13.0542 10.7042 13.5458 9.47083 13.5458 8.12917C13.5458 5.1375 11.1208 2.7125 8.12917 2.7125C5.1375 2.7125 2.7125 5.1375 2.7125 8.12917C2.7125 11.1208 5.1375 13.5458 8.12917 13.5458C9.47083 13.5458 10.7042 13.0542 11.6542 12.2375L11.8792 12.4708V13.1292L16.0458 17.2875L17.2875 16.0458L13.1292 11.8792ZM8.12917 11.8792C6.05417 11.8792 4.37917 10.2042 4.37917 8.12917C4.37917 6.05417 6.05417 4.37917 8.12917 4.37917C10.2042 4.37917 11.8792 6.05417 11.8792 8.12917C11.8792 10.2042 10.2042 11.8792 8.12917 11.8792Z" fill="#55575C"/>
        </svg>
        <input
          ref="searchInputRef"
          class="dealer-dropdown__search-input"
          type="text"
          placeholder="Search by dealer name or ID..."
          :value="searchQuery"
          @input="searchQuery = $event.target.value"
        >
      </label>
    </div>

    <div class="dealer-dropdown__list">
      <label v-for="(dealer, index) in filteredDealers" :key="index" class="dealer-dropdown__item">
        <input
          type="checkbox"
          class="dealer-dropdown__native-checkbox"
          :checked="selected.includes(dealer)"
          @change="toggle(dealer)"
        >
        <span class="dealer-dropdown__checkbox" />
        {{ dealer }}
      </label>
      <p v-if="filteredDealers.length === 0" class="dealer-dropdown__empty">未找到匹配的经销商</p>
    </div>

    <div class="dealer-dropdown__footer">
      <button type="button" class="dealer-dropdown__reset" @click="reset">Reset</button>
      <button type="button" class="dealer-dropdown__apply" @click="$emit('apply', selected)">Apply Filter</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  // 只有账号下挂多个经销商时才显示这个组件
  isMultiDealer: {
    type: Boolean,
    default: true
  },
  // 逗号分隔的预选经销商名单
  preSelected: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['apply'])

// 2026-08 改用真实原型(My-ACV--Dealer-filter-main)里的经销商名单——
// 10 个真实名字,没有重复项;之前 Figma 稿里的"Apple Chevrolet"重复
// 两次已确认是设计稿遗留错误,不再保留
const dealers = [
  'Asbury Automotive Group',
  'Apple Chevrolet',
  'Baxter Auto Mall',
  'CarMax Boston',
  'Classic Honda',
  'DriveTime A',
  'DriveTime Mall',
  'DriveTime Denver',
  'Enterprise Car Sales',
  'Hendrick Automotive'
]

const searchQuery = ref('')
const searchInputRef = ref(null)
const selected = ref(
  props.preSelected
    ? props.preSelected.split(',').map((s) => s.trim()).filter(Boolean)
    : []
)

watch(() => props.preSelected, (v) => {
  selected.value = v ? v.split(',').map((s) => s.trim()).filter(Boolean) : []
})

// 原型里打开浮层时会自动聚焦搜索框(dfpSearchEl.focus()),这个组件本身
// 一挂载就代表浮层刚打开(由 OfferDashboard 用 v-if 控制挂载/卸载)
onMounted(() => {
  searchInputRef.value?.focus()
})

const filteredDealers = computed(() =>
  dealers.filter((d) => d.toLowerCase().includes(searchQuery.value.toLowerCase()))
)

// 原型里 "Select all" 只针对当前搜索可见的经销商生效,并且全部选中后
// 文字会变成 "Deselect all"(再点一次会取消勾选这些可见项,不影响
// 搜索框之外、当前不可见的已选项)
const allVisibleSelected = computed(() =>
  filteredDealers.value.length > 0 &&
  filteredDealers.value.every((d) => selected.value.includes(d))
)

function toggleSelectAll() {
  if (allVisibleSelected.value) {
    selected.value = selected.value.filter((d) => !filteredDealers.value.includes(d))
  } else {
    selected.value = [...new Set([...selected.value, ...filteredDealers.value])]
  }
}

function toggle(dealer) {
  const i = selected.value.indexOf(dealer)
  if (i === -1) selected.value.push(dealer)
  else selected.value.splice(i, 1)
}

// Reset 也要真的把 table/tile 的经销商过滤清空,不只是把这个下拉自己
// 里面的勾选状态清空,所以额外 emit 一次空数组(原型里 Reset 不会关闭
// 浮层,这里也保持一致,交给 OfferDashboard 决定要不要关)
function reset() {
  selected.value = []
  searchQuery.value = ''
  emit('apply', [])
}
</script>

<style scoped>
.dealer-dropdown {
  display: flex;
  flex-direction: column;
  width: 374px;
  height: 510px;
  max-height: calc(100vh - 120px);
  background: linear-gradient(to bottom, #FFFFFF, #FAFBFC);
  border: 1px solid #E8E9EB;
  border-radius: 12px;
  box-shadow: 0px 25px 50px -12px rgba(0, 0, 0, 0.2);
  font-family: 'Roboto', sans-serif;
  overflow: hidden;
}

.dealer-dropdown__header {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid rgba(229, 231, 235, 0.6);
  position: sticky;
  top: 0;
  z-index: 1;
}

.dealer-dropdown__title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dealer-dropdown__title {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: #0E0E0F;
}

.dealer-dropdown__title-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dealer-dropdown__selected-count {
  font-size: 14px;
  line-height: 21px;
  letter-spacing: 0.25px;
  color: #757575;
}

.dealer-dropdown__link {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.1px;
  color: #004E7D;
  padding: 0;
  line-height: 21px;
}

.dealer-dropdown__link:hover {
  opacity: 0.75;
}

.dealer-dropdown__search {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border: 1px solid #E8E9EB;
  border-radius: 8px;
  background: #FFFFFF;
}

.dealer-dropdown__search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  line-height: 21px;
  letter-spacing: 0.25px;
  color: #212121;
  background: transparent;
}

.dealer-dropdown__search-input::placeholder {
  color: #8D9199;
}

.dealer-dropdown__list {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding: 8px 20px 0;
  scrollbar-width: thin;
  scrollbar-color: #E8E9EB transparent;
}
.dealer-dropdown__list::-webkit-scrollbar {
  width: 8px;
}
.dealer-dropdown__list::-webkit-scrollbar-thumb {
  background: #E8E9EB;
  border-radius: 1000px;
}

.dealer-dropdown__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 44px;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: #212121;
  cursor: pointer;
  user-select: none;
}

.dealer-dropdown__native-checkbox {
  display: none;
}

/* 2026-08 改成原型(My-ACV--Dealer-filter-main)的画法:18×18 方框圆角3,
   用 ::after 画勾,不再是 SVG 资源 */
.dealer-dropdown__checkbox {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  border: 1px solid #757575;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, border-color 0.15s;
}

.dealer-dropdown__native-checkbox:checked ~ .dealer-dropdown__checkbox {
  background: #004E7D;
  border-color: #004E7D;
}

.dealer-dropdown__native-checkbox:checked ~ .dealer-dropdown__checkbox::after {
  content: '';
  display: block;
  width: 10px;
  height: 6px;
  border-left: 2px solid #FFFFFF;
  border-bottom: 2px solid #FFFFFF;
  transform: rotate(-45deg) translateY(-1px);
}

.dealer-dropdown__empty {
  padding: 12px 0;
  color: #757575;
  font-size: 14px;
}

.dealer-dropdown__footer {
  flex-shrink: 0;
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 74px;
  padding: 17px 16px 16px;
  border-top: 1px solid #E8E9EB;
  background: #FFFFFF;
}

.dealer-dropdown__reset {
  border: none;
  background: none;
  cursor: pointer;
  color: #004E7D;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.1px;
  padding: 10px 16px;
  border-radius: 4px;
}

.dealer-dropdown__reset:hover {
  background: rgba(0, 78, 125, 0.06);
}

/* 2026-08 核实自真实原型 CSS:确切的渐变角度/色标,不再是用品牌色自己
   拼的近似值 */
.dealer-dropdown__apply {
  border: none;
  border-radius: 100px;
  background: linear-gradient(160deg, #F26522 13.86%, #FC4243 86.14%);
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.1px;
  padding: 10px 24px;
  cursor: pointer;
}

.dealer-dropdown__apply:hover {
  opacity: 0.9;
}
</style>
