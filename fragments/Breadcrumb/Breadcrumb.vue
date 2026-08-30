<!--
  ═══════════════════════════════════════════════════════════
  METADATA (Playground 读取用,不是最终页面渲染的一部分)
  name: Breadcrumb
  group: 页面外壳 (Page Shell)
  order: 11
  description: >
    页面顶部的面包屑导航,展示当前页面在站点结构里的位置(如
    "My ACV > Offers")。
  path: fragments/Breadcrumb/Breadcrumb.vue
  source_of_truth: >
    Figma 文件 "Offers - Negotiation" (fileKey 4z7FK34Fgit7Fi9UxZu0za),
    节点 6837:16095("Frame 214972",顶层实例,hidden=false)内的
    6837:16096("breadcrumb" 实例,hidden=false)。
    通过 get_design_context 核实:
    - 文案节点 I6837:16096;1783:88925("My ACV")与
      I6837:16096;1783:88927("Offers")均为 Roboto Regular 16px/24,
      letter-spacing 0.15px,颜色 #545454(Global/text/secondary)。
    - 两个文案之间的间距 14px(容器 gap-[14px])。
    - 分隔符资源节点 I6837:16096;1783:88926("arrow right"),已下载真实
      SVG 字节内联使用,尺寸 11x11,填色 #DCDFE8(Backgrounds/Borders)。
    - "My ACV" 和 "Offers" 两级文字样式完全相同,没有发现"当前页高亮"
      之类的差异化样式,因此组件不对最后一级做特殊样式。
  status: >
    Figma 里这个面包屑只有两级("My ACV" > "Offers"),没有查到三级或更多
    层级的实例,因此组件按"任意长度的逗号分隔文案列表"设计,但超过两级
    时的样式(是否仍然一致)未被验证,待确认。
  ═══════════════════════════════════════════════════════════
-->
<template>
  <nav class="breadcrumb">
    <template v-for="(label, index) in items" :key="index">
      <span class="breadcrumb__item">{{ label }}</span>
      <span v-if="index < items.length - 1" class="breadcrumb__separator" aria-hidden="true">
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.20591 1.17005L2.8189 1.5635C2.72703 1.65689 2.72703 1.80791 2.8189 1.90131L6.35084 5.5L2.8189 9.09869C2.72703 9.19208 2.72703 9.34311 2.8189 9.4365L3.20591 9.82995C3.29777 9.92335 3.44632 9.92335 3.53819 9.82995L7.6311 5.66891C7.72297 5.57551 7.72297 5.42449 7.6311 5.33109L3.53819 1.17005C3.44632 1.07665 3.29777 1.07665 3.20591 1.17005V1.17005Z" fill="#DCDFE8"/>
        </svg>
      </span>
    </template>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 逗号分隔的面包屑文案,如 "My ACV,Offers"
  crumbs: {
    type: String,
    default: 'My ACV,Offers'
  }
})

const items = computed(() =>
  props.crumbs.split(',').map((s) => s.trim()).filter(Boolean)
)
</script>

<style scoped>
.breadcrumb {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  font-family: 'Roboto', sans-serif;
}

.breadcrumb__item {
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: #545454;
  white-space: nowrap;
}

.breadcrumb__separator {
  display: inline-flex;
  width: 11px;
  height: 11px;
  flex-shrink: 0;
}
</style>
