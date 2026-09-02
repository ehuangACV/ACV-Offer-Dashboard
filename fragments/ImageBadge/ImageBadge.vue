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

/* PM 反馈"In Negotiation 徽标不够明显"之后定的第二种画法:不换主色调,
   加一圈白色描边,靠"有清晰边缘"提升可辨识度。字重是 Regular,不单独设
   font-weight。2026-09-02 按你的要求去掉了投影(原来是 box-shadow: 0 1px
   4px rgba(0, 0, 0, 0.45)),只保留描边——Card 上的图片叠层徽标现在是
   "白描边、无投影"。
   【2026-09-02 再次更正】你指出描边应该是"outside"(往外扩,不占用
   徽标本身的空间)——原来用 border 画描边,border 是盒子自身的一部分,
   会往内挤占空间,所以之前特地把 padding 从默认的 3px 6px 减到 2px 5px
   (让描边+padding的和还是24px高,视觉上不会变大)。现在改用 outline
   (只往外画,不参与盒模型计算,不影响元素自身尺寸),padding 直接跟
   .image-badge--in-negotiation 保持一致(3px 6px),不用再刻意减掉描边
   占的空间——outline-offset:0 让描边紧贴徽标外缘,不留额外间隙。 */
.image-badge--in-negotiation-ring {
  padding: 3px 6px;
  outline: 1px solid #FFFFFF;
  outline-offset: 0;
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
