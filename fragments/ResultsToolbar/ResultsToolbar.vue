<!--
  ═══════════════════════════════════════════════════════════
  METADATA
  name: Results Toolbar
  group: 数据表格 (Offers Table)
  order: 35
  description: >
    表格/卡片网格上方那一条工具条:tile 视图显示 "Viewing N results"
    文字,table 视图显示 "🔑 Private Lane" 标签 + 顶部 Pagination(只有
    rows-per-page 下拉和上一页/下一页箭头,不显示 "Viewing X out of Y"
    文案),右边永远是切换 table/tile 视图的 pill 分段按钮。
  path: fragments/ResultsToolbar/ResultsToolbar.vue
  source_of_truth: >
    2026-09-02 从 fragments/OfferDashboard/OfferDashboard.vue 里原样抽出来
    的既有实现(逐字搬迁,没有改动任何数值/行为),原因是你要求"table
    view 和 card view 的这两条工具条应该是同一个组件的两个 view,不是分开
    各自实现"。抽出来之前每一处的 Figma 核实记录/取舍原因(切换按钮的
    pill 形状/顺序核对自节点 7432:69595、Private Lane 标签抄自参照原型
    My-ACV--Dealer-filter-main、"三个元素固定 76px 行高保持居中对齐"的
    推导过程)都还记录在 OfferDashboard/notes.md 里,这里不重复贴一遍,
    只记录"抽成独立组件"这一步本身的取舍。
  status: >
    组件名字是我按你的要求自己起的("你看叫什么合适"),取
    "Viewing N results" 这行文案里的 "results" + 它本身是一条工具条
    ("toolbar")拼的,不是 Figma 图层自带的名字,如果你有更想用的名字
    随时可以让我改。
  ═══════════════════════════════════════════════════════════
-->
<template>
  <div class="results-toolbar">
    <div v-if="viewMode === 'tile'" class="results-toolbar__viewing-text">
      Viewing {{ resultsCount }} results
    </div>
    <template v-else>
      <div class="results-toolbar__spacer">
        <span class="results-toolbar__private-lane">
          <svg class="results-toolbar__private-lane-icon" width="16" height="16" viewBox="0 0 24 24" fill="#545454">
            <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
          </svg>
          Private Lane
        </span>
      </div>
      <Pagination :has-prev-page="hasPrevPage" :has-next-page="hasNextPage" @prev="$emit('prev')" @next="$emit('next')" />
    </template>

    <div class="results-toolbar__view-toggle">
      <button
        type="button"
        class="results-toolbar__view-toggle-btn"
        :class="{ 'results-toolbar__view-toggle-btn--active': viewMode === 'tile' }"
        aria-label="Grid view"
        @click="$emit('update:viewMode', 'tile')"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.5 9.83301C7.41667 9.83301 8.16699 10.5833 8.16699 11.5V14.833C8.16699 15.7497 7.41667 16.5 6.5 16.5H3.16699C2.25033 16.5 1.5 15.7497 1.5 14.833V11.5C1.5 10.5833 2.25033 9.83301 3.16699 9.83301H6.5ZM14.834 9.83301C15.7504 9.83327 16.5 10.5835 16.5 11.5V14.833C16.5 15.7495 15.7504 16.4997 14.834 16.5H11.5C10.5834 16.4999 9.83398 15.7496 9.83398 14.833V11.5C9.83398 10.5834 10.5834 9.8331 11.5 9.83301H14.834ZM6.5 1.5C7.41667 1.5 8.16699 2.25033 8.16699 3.16699V6.5C8.16699 7.41667 7.41667 8.16699 6.5 8.16699H3.16699C2.25033 8.16699 1.5 7.41667 1.5 6.5V3.16699C1.5 2.25033 2.25033 1.5 3.16699 1.5H6.5ZM14.834 1.5C15.7504 1.50027 16.5 2.25049 16.5 3.16699V6.5C16.5 7.4165 15.7504 8.16673 14.834 8.16699H11.5C10.5834 8.1669 9.83398 7.41661 9.83398 6.5V3.16699C9.83398 2.25038 10.5834 1.50009 11.5 1.5H14.834Z" fill="#1C1D1F"/>
        </svg>
      </button>
      <button
        type="button"
        class="results-toolbar__view-toggle-btn"
        :class="{ 'results-toolbar__view-toggle-btn--active': viewMode === 'table' }"
        aria-label="List view"
        @click="$emit('update:viewMode', 'table')"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.7105 9.75H2.28947C1.85526 9.75 1.5 10.0875 1.5 10.5V15C1.5 15.4125 1.85526 15.75 2.28947 15.75H15.7105C16.1447 15.75 16.5 15.4125 16.5 15V10.5C16.5 10.0875 16.1447 9.75 15.7105 9.75ZM15.7105 2.25H2.28947C1.85526 2.25 1.5 2.5875 1.5 3V7.5C1.5 7.9125 1.85526 8.25 2.28947 8.25H15.7105C16.1447 8.25 16.5 7.9125 16.5 7.5V3C16.5 2.5875 16.1447 2.25 15.7105 2.25Z" fill="#1C1D1F"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import Pagination from '../Pagination/Pagination.vue'

defineProps({
  // 'tile' | 'table'
  viewMode: { type: String, default: 'table' },
  // tile 模式下 "Viewing N results" 用的数字
  resultsCount: { type: Number, default: 0 },
  // table 模式下顶部 Pagination 用的两个箭头状态——顶部 Pagination 本来
  // 就不显示 "Viewing X out of Y" 文案(showViewingText 一直是 false,
  // 这是 OfferDashboard 原来就有的设定,抽出来之后原样保留,没有做成
  // 可配置的 prop,因为目前只有这一种用法)
  hasPrevPage: { type: Boolean, default: false },
  hasNextPage: { type: Boolean, default: true }
})
defineEmits(['update:viewMode', 'prev', 'next'])
</script>

<style scoped>
/* 2026-08(原本在 OfferDashboard.vue 里,2026-09-02 抽出来时原样带过来）
   你指出 Private Lane / Pagination / 切换按钮三个要一行横向居中对齐:
   排查发现这一行的高度是由内容自己撑出来的(table 视图里 Pagination
   组件本身高 60px,比切换按钮/文字都高,算上 padding-bottom 16px 这一行
   自然高度是 76px;tile 视图里没有 Pagination,自然高度缩到只剩切换按钮
   32px+padding 16px=48px),用同一个 align-items:center 的话,行高一变,
   居中位置就跟着变。改成给这一行本身钉死 min-height:76px(按 table 视图
   的自然总高设,不是内容区的 60px——量的是 Pagination 组件在这一行里
   实际撑出来的高度,不是 Figma 核实数值,如果以后 Pagination 组件本身
   改高度需要回来同步这个值),table/tile 两种模式下这一行的高度都固定
   一样高,align-items:center 可以放心统一对所有子元素生效——三个元素
   之间保持居中对齐,行高也不再随模式切换变化,按钮位置也不会再跳。这个
   组件自己的 `<style scoped>` 没有全局 `box-sizing:border-box` reset
   (不像 component-playground.html 那边有 `* { box-sizing:border-box }`),
   所以这里额外显式加了 `box-sizing:border-box`,让 `min-height:76px` 在
   两边算出来的是同一个数值(含 padding 的整个盒子)。 */
.results-toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-height: 76px;
  padding: 0 0 16px;
  box-sizing: border-box;
}

.results-toolbar__spacer {
  flex: 1;
  display: flex;
  align-items: center;
}

.results-toolbar__private-lane {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.4px;
  color: #545454;
}

.results-toolbar__private-lane-icon {
  flex-shrink: 0;
}

.results-toolbar__viewing-text {
  flex: 1;
  font-size: 14px;
  line-height: 21px;
  letter-spacing: 0.25px;
  color: #212121;
}

.results-toolbar__view-toggle {
  display: flex;
  align-items: center;
}

/* 2026-09-02 按你的要求,对照 Figma node 7320:22065("segmented button",
   7330:79395/79396/79403)重做——之前是写死 32×32px 的正方形按钮,图标
   18px 贴着几乎撑满整个按钮,左右只剩約7px。这个节点量出来每个按钮是
   `padding: 10px 12px`(不是固定宽高),图标还是 18×18px 没变,整组
   两个按钮的真实尺寸是 100×36px。改成 padding 驱动尺寸(不再写死
   width/height),让左右/上下留白对得上这个节点的数值。
   【2026-09-02 再次更正】你要求左右 padding 再加 4px,从 12px 改成
   16px——不再是 Figma 核实的数值,是你直接给的覆盖,上下 padding
   (10px)没有变,只加宽了左右留白。 */
.results-toolbar__view-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  background: #FFFFFF;
  border: 1px solid #D1D3D6;
  border-radius: 0;
  cursor: pointer;
  box-sizing: border-box;
}

.results-toolbar__view-toggle-btn:first-child {
  border-radius: 111px 0 0 111px;
}

.results-toolbar__view-toggle-btn:last-child {
  border-left: none;
  border-radius: 0 111px 111px 0;
}

.results-toolbar__view-toggle-btn--active {
  background: #F5F5F5;
}
</style>
