<!--
  ═══════════════════════════════════════════════════════════
  METADATA(Playground 读取用,不是最终页面渲染的一部分)
  name: Image Badge
  group: 卡片视图 (Card View)
  order: 39
  description: >
    不是 Figma 来源的组件,是你直接要求做的一个展示壳:把 ImageBadge 的
    几个真实变体(In Negotiation / Make Offer / Dealer name)同时铺出来,
    每个上方标一行文字说明这是哪个变体,不用再靠 Controls 面板一个个切换
    variant 才能看到。
  path: fragments/ImageBadge/ImageBadgeGallery.vue
  source_of_truth: >
    没有对应的 Figma 节点。徽标本身复用已经核实过的 ImageBadge 组件,这里
    只是"摆放 + 打标签"的展示壳,数值直接抄 ImageBadge 之前 Playground
    页面的 3 个 mock 示例(inNegotiationExample / makeOfferExample /
    dealerExample),没有重新编数据。
  status: >
    2026-09-11 新增,替换掉 ImageBadge 原来"单个徽标 + Controls 面板切换
    variant/label/ring"的演示方式——ring 这个变体已经删除(细节见
    ImageBadge/notes.md),你要求把剩下的几个变体同时展示出来,所以这个
    页面不再需要 Controls 面板,也不再需要 Mock examples 按钮(Playground
    的 REGISTRY 里这个入口的 controls/mocks 都改成空对象)。
    只展示 3 个真实变体,没有包含 InformationDialog 专用的
    `stroke-make-offer`(边框版 Make Offer)——那是同一个 CSS,只是加了
    边框,不是一个独立的"徽标类型",细节见 ImageBadge/notes.md 和
    InformationDialog/notes.md。
  ═══════════════════════════════════════════════════════════
-->
<template>
  <div class="image-badge-gallery">
    <div v-for="item in items" :key="item.name" class="image-badge-gallery__item">
      <div class="image-badge-gallery__label">{{ item.name }}</div>
      <ImageBadge :variant="item.variant" :label="item.label" />
    </div>
  </div>
</template>

<script setup>
import ImageBadge from './ImageBadge.vue'

// 2026-09-11 按你的要求:之前这 3 个组合是 ImageBadge 自己 Playground 页面
// 的 3 个 Mock examples(inNegotiationExample/makeOfferExample/
// dealerExample),需要点按钮才能一个个看;现在同时铺出来,数值原样保留,
// 没有重新编。
const items = [
  { name: 'In Negotiation', variant: 'in-negotiation', label: 'In Negotiation' },
  { name: 'Make Offer', variant: 'make-offer', label: 'Make Offer' },
  { name: 'Dealer name (lane badge)', variant: 'dealer', label: 'Apple Chevrolet' }
]
</script>

<style scoped>
.image-badge-gallery {
  display: flex;
  align-items: flex-start;
  gap: 32px;
  font-family: 'Roboto', sans-serif;
}

.image-badge-gallery__item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

/* 照 OfferCardGallery 已经用过的"小灰字标签贴在示例上方"样式,不是新发明
   一套,细节见 OfferCardGallery/notes.md */
.image-badge-gallery__label {
  font-size: 12px;
  line-height: 16px;
  color: #757575;
}
</style>
