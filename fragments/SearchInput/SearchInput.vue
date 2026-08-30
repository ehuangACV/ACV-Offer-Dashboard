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
    只找到空态(占位文案)的可见实例,没有找到已输入文字/聚焦态/清除按钮
    等状态的实例,这些交互态样式待确认,组件目前只实现了受控输入 +
    占位文案两种情况。
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
    >
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
defineEmits(['update:modelValue'])
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
</style>
