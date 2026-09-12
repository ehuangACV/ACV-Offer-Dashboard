<!--
  ═══════════════════════════════════════════════════════════
  METADATA(Playground 读取用,不是最终页面渲染的一部分)
  name: Offer Type Badge
  group: 数据表格 (Offers Table)
  order: 33
  description: >
    不是 Figma 来源的组件,是你直接要求做的一个展示壳:跟 Image Badge/
    Status Chip 这次改的做法一样,把 OfferTypeBadge 的两个真实变体同时
    铺出来,每个上方标一行文字说明是哪个类型,不用再靠 Controls 面板切换
    type 才能看到。
  path: fragments/OfferTypeBadge/OfferTypeBadgeGallery.vue
  source_of_truth: >
    没有对应的 Figma 节点。徽标本身复用已经核实过的 OfferTypeBadge 组件,
    这里只是"摆放 + 打标签"的展示壳,数值直接抄原来 OfferTypeBadge
    Playground 页面的 2 个 Mock examples(inNegotiationExample/
    makeOfferExample),没有重新编。
  status: >
    2026-09-11 新增,替换掉 OfferTypeBadge 原来"单个徽标 + Controls 面板
    切换 type/label"的演示方式,这次改动只影响 Playground 展示层——
    OfferTypeBadge.vue 本身、以及 OfferTableRow/OfferTableHeader/
    InformationDialog 等真实用到它的地方都没有改动。
  ═══════════════════════════════════════════════════════════
-->
<template>
  <div class="offer-type-badge-gallery">
    <div v-for="item in items" :key="item.name" class="offer-type-badge-gallery__item">
      <div class="offer-type-badge-gallery__label">{{ item.name }}</div>
      <OfferTypeBadge :type="item.type" :label="item.label" />
    </div>
  </div>
</template>

<script setup>
import OfferTypeBadge from './OfferTypeBadge.vue'

// 2026-09-11 按你的要求:这 2 个组合是之前 OfferTypeBadge 自己 Playground
// 页面的 2 个 Mock examples,需要点按钮才能一个个看;现在同时铺出来,数值
// 原样保留,没有重新编。
const items = [
  { name: 'In Negotiation', type: 'in-negotiation', label: 'In Negotiation' },
  { name: 'Make Offer', type: 'make-offer', label: 'Make Offer' }
]
</script>

<style scoped>
.offer-type-badge-gallery {
  display: flex;
  align-items: flex-start;
  gap: 32px;
  font-family: 'Roboto', sans-serif;
}

.offer-type-badge-gallery__item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.offer-type-badge-gallery__label {
  font-size: 12px;
  line-height: 16px;
  color: #757575;
}
</style>
