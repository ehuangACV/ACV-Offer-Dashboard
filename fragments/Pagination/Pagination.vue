<!--
  ═══════════════════════════════════════════════════════════
  METADATA
  name: Pagination
  group: 数据表格 (Offers Table)
  order: 34
  description: >
    表格顶部和底部各出现一次的分页控件:可选的 "Viewing X out of Y
    results" 文案 + "Rows per page" + 自定义下拉菜单(不是原生 <select>)
    + 上一页/下一页箭头。
  path: fragments/Pagination/Pagination.vue
  source_of_truth: >
    【2026-08 重大更新:改用 Claude Design 项目里的 ACV Pagination 组件,
    替换掉之前基于 Figma 静态稿 + 原生 <select> 拼出来的版本】按你的
    要求,通过 DesignSync 工具(claude_design MCP)读取了 Claude Design
    项目 "ACV Auctions Design System"
    (projectId 1294432b-f5f9-488f-9691-d01499283248)里的
    `components/09c-pagination.card.html` 文件,这是一份真实的组件卡片
    (不是 Figma 推断),里面同时给了 "ACV Pagination" 和 "MAX
    Pagination"(AG-Grid 主题,用的是完全不同的一套 token,这次没有用到)
    两套。这个组件对照的是 **ACV Pagination** 那一半:
    - 容器 `.acv`:flex 一行,gap 16px,背景白色,padding 12px 16px,
      圆角 4px。
    - "Rows per page" 文案:Roboto Regular 14px/20px(注意行高是20,不是
      之前版本的21),色 #212121,**没有** letter-spacing(之前版本写了
      0.1px,这次源文件没有这个声明,去掉了)。
    - 下拉按钮 `.dd`:70×36,padding 0 8px,边框 1px #DCDFE8,圆角4px,
      背景白色,同上字号字色。**下拉箭头换成了描边风格的 chevron**
      (`M7 10l5 5 5-5` stroke currentColor width 1.8),不是之前那个
      实心三角形 path,20×20。打开态/聚焦态有一个新的样式:
      `box-shadow: 0 0 0 3px #CFE3F5`。
    - **这次是真正的自定义下拉菜单**(`.menu`,点按钮展开/点选项收起/
      点外部收起/按 Escape 收起),不是原生 `<select>`——之前版本"下拉
      展开态的高亮蓝色是浏览器原生渲染"这条注释已经不适用了。菜单本身:
      白底,边框1px #DCDFE8,圆角(仅下方两角)4px,阴影
      `0 4px 10px rgba(0,0,0,.12)`;选项 padding 8px 12px,同字号字色
      (14px/20px 色 #55575C),hover 背景 #F0F1F4,选中项背景 #1A73E8
      文字白色。选项列表还是 10/20/50/100,和之前用户截图确认的一致,
      没有变化。
    - 【2026-08 你指出要按之前的样子补回来】源文件里这个 range 文案是
      **"{start}-{end} of {total}"**(比如 "1-10 of 35"),我一开始把
      "Viewing X out of Y results" 整个换成了这个格式,但你说这个文案
      "还是需要的",所以改回来了:文案本身还是 **"Viewing {viewingCount}
      out of {totalCount} results"**,样式也恢复成之前项目里的
      14px/21px letter-spacing .25px 色 #212121(不是 "Rows per page"
      那一套 14px/20px 无letter-spacing),Design System 卡片给的
      "{start}-{end} of {total}" 格式没有采用。其余(自定义下拉菜单、
      新图标、hover/focus 交互态)保持这次重做的样子,不受影响。
    - 上一页/下一页箭头:24×24,`display:grid;place-items:center`,
      **换成了描边风格的角括号图标**(prev `M14.5 5.5L8 12l6.5 6.5`,
      next `M9.5 5.5L16 12l-6.5 6.5`,stroke currentColor width 2),
      不是之前的实心 path。启用态色 #212121,禁用态色 #A1A1A1;新增
      hover态(仅启用时)背景#F0F1F4 圆形、focus-visible 态描边
      2px #0061A5 圆形——这两个交互态之前的版本没有。两个箭头之间
      gap 33px,和 "Rows per page" 组之间有 margin-left 8px。
  status: >
    "Viewing X out of Y results" 只在底部分页栏显示、顶部不显示,这是
    延续之前项目里"顶部/底部分页栏样式不同"的既有做法,如果顶部也应该
    显示,请告诉我。
    另外这个组件自带的白色背景+12px/16px padding 是作为一个独立卡片展示
    的样式,套进 OfferDashboard 的表格顶部/底部行之后,如果和周围已有的
    padding 叠加显得空隙过大,可能需要再调整外层容器的 padding,已经在
    浏览器里视觉检查过一次,如果之后看着还是不对请告诉我。
  ═══════════════════════════════════════════════════════════
-->
<template>
  <div ref="rootRef" class="pagination">
    <span v-if="showViewingText" class="pagination__viewing-text">Viewing {{ viewingCount }} out of {{ totalCount }} results</span>

    <span class="pagination__label">Rows per page</span>

    <div class="pagination__dropdown-wrap">
      <button
        type="button"
        class="pagination__dropdown-btn"
        :class="{ 'pagination__dropdown-btn--open': dropdownOpen }"
        aria-haspopup="listbox"
        :aria-expanded="dropdownOpen ? 'true' : 'false'"
        @click="dropdownOpen = !dropdownOpen"
        @keydown.escape="dropdownOpen = false"
      >
        <span class="pagination__dropdown-value">{{ rowsPerPage }}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M7 10l5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <ul v-if="dropdownOpen" class="pagination__menu" role="listbox">
        <li
          v-for="option in rowsPerPageOptions"
          :key="option"
          role="option"
          :aria-selected="String(rowsPerPage) === String(option)"
          @click="selectRowsPerPage(option)"
        >
          {{ option }}
        </li>
      </ul>
    </div>

    <span class="pagination__nav">
      <button type="button" class="pagination__arrow" :disabled="!hasPrevPage" aria-label="Previous page" @click="$emit('prev')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M14.5 5.5L8 12l6.5 6.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <button type="button" class="pagination__arrow" :disabled="!hasNextPage" aria-label="Next page" @click="$emit('next')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9.5 5.5L16 12l-6.5 6.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </span>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  // 显示 "Viewing X out of Y results" 文案,还是只有下拉+箭头(顶部分页栏
  // 不显示、底部显示,这是延续之前项目的既有用法,见 METADATA)
  showViewingText: { type: Boolean, default: false },
  viewingCount: { type: [String, Number], default: 6 },
  totalCount: { type: [String, Number], default: 6 },
  rowsPerPage: { type: [String, Number], default: 10 },
  hasPrevPage: { type: Boolean, default: false },
  hasNextPage: { type: Boolean, default: true }
})
const emit = defineEmits(['update:rowsPerPage', 'prev', 'next'])

const rowsPerPageOptions = [10, 20, 50, 100]

const rootRef = ref(null)
const dropdownOpen = ref(false)

function selectRowsPerPage(option) {
  emit('update:rowsPerPage', option)
  dropdownOpen.value = false
}

// 参照真实原型:点击下拉外部 / 按 Escape 都会收起菜单
function handleOutsideClick(event) {
  if (dropdownOpen.value && rootRef.value && !rootRef.value.contains(event.target)) {
    dropdownOpen.value = false
  }
}
function handleEscapeKey(event) {
  if (event.key === 'Escape') dropdownOpen.value = false
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
.pagination {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #FFFFFF;
  padding: 12px 16px;
  border-radius: 4px;
  font-family: 'Roboto', sans-serif;
}

.pagination__label {
  font-size: 14px;
  line-height: 20px;
  color: #212121;
  white-space: nowrap;
}

/* 恢复之前项目里的 "Viewing X out of Y results" 文案样式(14px/21
   letter-spacing .25px 色 #212121),和 "Rows per page" 的字体样式
   (14px/20 无letter-spacing)不是同一套,分开定义 */
.pagination__viewing-text {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  line-height: 21px;
  letter-spacing: 0.25px;
  color: #212121;
}

.pagination__dropdown-wrap {
  position: relative;
}

.pagination__dropdown-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  width: 70px;
  height: 36px;
  padding: 0 8px;
  border: 1px solid #DCDFE8;
  border-radius: 4px;
  background: #FFFFFF;
  color: #212121;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  line-height: 20px;
  cursor: pointer;
  box-sizing: border-box;
}

.pagination__dropdown-btn:focus-visible,
.pagination__dropdown-btn--open {
  outline: none;
  box-shadow: 0 0 0 3px #CFE3F5;
}

.pagination__dropdown-btn svg {
  display: block;
  flex-shrink: 0;
}

.pagination__dropdown-value {
  line-height: 20px;
}

.pagination__menu {
  position: absolute;
  top: calc(100% + 1px);
  left: 0;
  min-width: 100%;
  background: #FFFFFF;
  border: 1px solid #DCDFE8;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
  padding: 0;
  margin: 0;
  list-style: none;
  z-index: 5;
}

.pagination__menu li {
  padding: 8px 12px;
  font-size: 14px;
  line-height: 20px;
  color: #55575C;
  cursor: pointer;
  white-space: nowrap;
}

.pagination__menu li:hover {
  background: #F0F1F4;
}

.pagination__menu li[aria-selected='true'] {
  background: #1A73E8;
  color: #FFFFFF;
}

.pagination__nav {
  display: flex;
  align-items: center;
  gap: 33px;
  margin-left: 8px;
}

.pagination__arrow {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  padding: 0;
  color: #212121;
  cursor: pointer;
}

.pagination__arrow svg {
  display: block;
}

.pagination__arrow:disabled {
  color: #A1A1A1;
  cursor: default;
}

.pagination__arrow:not(:disabled):hover {
  background: #F0F1F4;
  border-radius: 50%;
}

.pagination__arrow:focus-visible {
  outline: 2px solid #0061A5;
  outline-offset: 1px;
  border-radius: 50%;
}
</style>
