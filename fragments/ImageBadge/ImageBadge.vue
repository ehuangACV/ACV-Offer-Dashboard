<!--
  ═══════════════════════════════════════════════════════════
  METADATA
  name: Image Badge
  group: 卡片视图 (Card View)
  order: 39
  description: >
    OfferCard 图片左下角叠的小徽标——In Negotiation / Make Offer 两种
    "deal type" 徽标,加上 dealer name(lane badge)。三个之前是 OfferCard.vue
    里各自手写的 <span> + 独立 CSS class,你指出它们应该统一用同一个
    组件、同一套高度/圆角,这次抽成独立组件。
  path: fragments/ImageBadge/ImageBadge.vue
  source_of_truth: >
    2026-09-02 从 fragments/OfferCard/OfferCard.vue 里原样抽出来的既有实现
    (颜色/边框数值没有变,只是把分散的 3 个 class 合并成 1 个组件 + 3 个
    variant)。高度/圆角这次顺带统一成同一套数值(24px / 4px),细节和
    "为什么是这两个数字"的推导过程见 fragments/OfferCard/notes.md 里
    2026-09-02 那几条记录,这里不重复。
  status: >
    颜色本身(#1C1D1F / #FFFFFF / #8D9199 等)沿用的是之前分别核实过的
    Figma 数值,没有重新核实;圆角统一成 4px 是你直接指出"Make Offer 看
    起来是4px"之后定的,不是重新核实的 Figma 数值(细节见
    OfferCard/notes.md)。

    【2026-09-11 移除】`ring` prop 和对应的 `.image-badge--in-negotiation-
    ring` class 已删除——2026-09-08 就已经把 OfferCard 里唯一的真实用法
    去掉了(不再传 `:ring`),之后这个能力只在这个组件自己的 Playground
    页面上留着做演示,没有任何真实页面在用,现在按你的要求彻底删掉。细节见
    notes.md。
  ═══════════════════════════════════════════════════════════
-->
<template>
  <span
    class="image-badge"
    :class="[
      `image-badge--${variant}`,
      variant === 'make-offer' && strokeMakeOffer ? 'image-badge--make-offer-stroke' : ''
    ]"
  >{{ label }}<slot /></span>
</template>

<script setup>
defineProps({
  // 'in-negotiation' | 'make-offer' | 'dealer'
  variant: { type: String, default: 'in-negotiation' },
  label: { type: String, required: true },
  // 2026-09-09 新增,只在 variant='make-offer' 时生效——这个组件同时被
  // OfferCard(卡片图片上的徽标)和 InformationDialog(弹层顶部主徽标)
  // 共用同一份 CSS,但你要求两处的 Make Offer 徽标要不一样:卡片不要
  // 边框,InformationDialog 要保留原来的边框。default false 保持卡片
  // 现在的样子不变(不传就没有边框),InformationDialog 那边显式传
  // true。细节见 fragments/ImageBadge/notes.md。
  strokeMakeOffer: { type: Boolean, default: false }
})
</script>

<style scoped>
/* 三个 variant 共用的几何属性——高度(24px = 18px 行高 + 上下 padding)
   和圆角统一,只有颜色/边框/水平 padding 各自不同。2026-09-02 按你的要求
   圆角从 4px 改成 8px,同样统一套用到三个 variant,不是只改其中一个。 */
.image-badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.4px;
  white-space: nowrap;
  border-radius: 8px;
  box-sizing: border-box;
}

.image-badge--in-negotiation {
  background: #1C1D1F;
  color: #FFFFFF;
  padding: 3px 6px;
}

.image-badge--make-offer {
  background: #FFFFFF;
  color: #0E0E0F;
  padding: 3px 6px;
}

/* 2026-09-09 新增,只给 InformationDialog 用——边框数值(#8D9199)是
   之前删掉的那个既有值,不是新核实的。border 是盒子自身的一部分会往内
   挤占空间,padding 从 3px 6px 减到 2px 6px 补偿(总高度还是24px,跟
   base 的 .image-badge--make-offer 一致),细节见
   fragments/ImageBadge/notes.md。 */
.image-badge--make-offer-stroke {
  border: 1px solid #8D9199;
  padding: 2px 6px;
}

.image-badge--dealer {
  backdrop-filter: blur(0.75px);
  background: rgba(0, 0, 0, 0.4);
  color: #FFFFFF;
  text-align: right;
  padding: 3px 10px;
}
</style>
