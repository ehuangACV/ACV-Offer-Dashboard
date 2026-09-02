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
  ═══════════════════════════════════════════════════════════
-->
<template>
  <span
    class="image-badge"
    :class="[`image-badge--${variant}`, variant === 'in-negotiation' && ring ? 'image-badge--in-negotiation-ring' : '']"
  >{{ label }}<slot /></span>
</template>

<script setup>
defineProps({
  // 'in-negotiation' | 'make-offer' | 'dealer'
  variant: { type: String, default: 'in-negotiation' },
  label: { type: String, required: true },
  // 只在 variant='in-negotiation' 时生效——PM 反馈默认样式不够明显,
  // 定下来的第二种画法(深色底不变,加一圈白色描边+投影),细节见
  // fragments/OfferCard/notes.md
  ring: { type: Boolean, default: false }
})
</script>

<style scoped>
/* 三个 variant 共用的几何属性——高度(24px = 18px 行高 + 上下 padding)
   和圆角(4px)统一,只有颜色/边框/水平 padding 各自不同 */
.image-badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.4px;
  white-space: nowrap;
  border-radius: 4px;
  box-sizing: border-box;
}

.image-badge--in-negotiation {
  background: #1C1D1F;
  color: #FFFFFF;
  padding: 3px 6px;
}

/* PM 反馈"In Negotiation 徽标不够明显"之后定的第二种画法:不换主色调,
   加一圈白色描边,靠"有清晰边缘"提升可辨识度。padding 比默认样式
   少 1px(减掉描边占的空间),让最终外框高度还是 24px,不会看起来变大。
   字重是 Regular,不单独设 font-weight。2026-09-02 按你的要求去掉了投影
   (原来是 box-shadow: 0 1px 4px rgba(0, 0, 0, 0.45)),只保留描边——
   Card 上的图片叠层徽标现在是"白描边、无投影"。 */
.image-badge--in-negotiation-ring {
  border: 1px solid #FFFFFF;
  padding: 2px 5px;
}

.image-badge--make-offer {
  background: #FFFFFF;
  color: #0E0E0F;
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
