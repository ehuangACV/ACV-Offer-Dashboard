<!--
  ═══════════════════════════════════════════════════════════
  METADATA
  name: Search Input
  group: 导航与筛选 (Nav & Filters)
  order: 21
  description: >
    表格上方的搜索框,带放大镜图标和占位文案 "Search by year, make,
    model, VIN"。
  path: fragments/SearchInput/SearchInput.vue
  source_of_truth: >
    Figma 文件 "Offers - Negotiation" (fileKey 4z7FK34Fgit7Fi9UxZu0za),
    节点 6837:16150("Text Input",hidden=false)。get_design_context 核实:
    - 底色 #F7F7F8(background/container),顶部圆角 4px。
    - 占位文案 "Search by year, make, model, VIN":Roboto Regular 16px/
      24,letter-spacing 0.5px,色 rgba(0,0,0,0.67)。
    - 搜索图标(资源节点 I6837:16150;244:206):20×20,已下载真实 SVG,
      填色 fill-opacity 0.87 的黑色。
  status: >
    只找到空态(占位文案)的可见实例,没有找到已输入文字/聚焦态的实例,
    这两种交互态样式仍待确认。

    【2026-09-11 补充】你给了新的参照截图(Frame 630266015),确认了
    "已输入文字 + 右侧 × 清空按钮"这个状态,已按截图实现,细节见
    notes.md。

    【2026-09-11(第二次)补充】新增 `search` emit——组件本身还是纯展示
    的受控输入框(`update:modelValue` 照常实时上报每次按键后的文字,
    用于显示/清空按钮的显隐判断),但"要不要真的执行搜索"这个决定交给
    用父组件:按 Enter 或点清空按钮时才 emit `search`(携带要提交的
    文字),父组件(OfferDashboard)只在收到这个事件时才更新用来过滤
    数据的那个值,不再是输入一有变化就触发。细节见 notes.md 和
    OfferDashboard/notes.md。
  ═══════════════════════════════════════════════════════════
-->
<template>
  <label class="search-input">
    <span class="search-input__icon" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.4369 12.0629H12.7106L12.4581 11.8122C13.35 10.7721 13.8925 9.42367 13.8925 7.94625C13.8925 4.66209 11.2304 2 7.94625 2C4.66209 2 2 4.66209 2 7.94625C2 11.2304 4.66209 13.8925 7.94625 13.8925C9.42367 13.8925 10.7712 13.3509 11.8113 12.4599L12.0638 12.7106V13.4351L16.636 18.0009L18 16.6369L13.4369 12.0629V12.0629ZM7.94626 12.0629C5.67204 12.0629 3.82962 10.2205 3.82962 7.94625C3.82962 5.67295 5.67204 3.82961 7.94626 3.82961C10.2196 3.82961 12.0629 5.67295 12.0629 7.94625C12.0629 10.2205 10.2196 12.0629 7.94626 12.0629V12.0629Z" fill="black" fill-opacity="0.87"/>
      </svg>
    </span>
    <input
      class="search-input__field"
      type="text"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @keyup.enter="$emit('search', modelValue)"
    >
    <!-- 2026-09-11 按你给的截图(Frame 630266015)新增:有输入内容时显示
         清空按钮,点击清空文字。图标复用项目里已经在用的同一个"×"描边
         路径(InformationDialog/RemoveFromListDialog/OfferTableHeader
         说明弹层关闭按钮同款,viewBox 0 0 24 24,path "M6 6l12 12M18 6L6
         18"),不是新画的,尺寸跟左边放大镜图标一样 20×20,两端对称。
         2026-09-11(第二次)按你的要求:输入本身不再实时触发搜索,只有
         按 Enter(见上面 input 的 @keyup.enter)或点这个清空按钮才会真的
         提交搜索(清空按钮提交的是空字符串,相当于立刻清掉筛选结果)。 -->
    <button
      v-if="modelValue"
      type="button"
      class="search-input__clear"
      aria-label="Clear search"
      @click="$emit('update:modelValue', ''); $emit('search', '')"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </button>
  </label>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Search by year, make, model, VIN'
  }
})
defineEmits(['update:modelValue', 'search'])
</script>

<style scoped>
.search-input {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 56px;
  padding: 0 16px;
  background: #F7F7F8;
  border-radius: 4px 4px 0 0;
  box-sizing: border-box;
}

.search-input__icon {
  display: inline-flex;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.search-input__field {
  flex: 1;
  border: none;
  outline: none;
  background: none;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.5px;
  color: rgba(0, 0, 0, 0.87);
}

.search-input__field::placeholder {
  color: rgba(0, 0, 0, 0.67);
}

.search-input__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  flex-shrink: 0;
  border: none;
  background: none;
  color: rgba(0, 0, 0, 0.67);
  cursor: pointer;
}

.search-input__clear:hover {
  color: rgba(0, 0, 0, 0.87);
}
</style>
