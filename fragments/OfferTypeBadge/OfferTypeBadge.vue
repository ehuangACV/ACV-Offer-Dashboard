<!--
  ═══════════════════════════════════════════════════════════
  METADATA (Playground 读取用,不是最终页面渲染的一部分)
  name: Offer Type Badge
  group: 数据表格 (Offers Table)
  order: 33
  description: >
    显示在 Dealer Name / Auction ID 列下方的徽标,表示这条 offer 当前所处
    的阶段/类型(In Negotiation / Make Offer)。每行只会出现一个,和
    Update 列里可以叠加多个的 StatusChip 不是同一回事,是两个独立组件。
  path: fragments/OfferTypeBadge/OfferTypeBadge.vue
  source_of_truth: >
    两个状态均已用 hidden=false(实际渲染可见)的 Figma 实例核实:
    "In Negotiation" —— node 6837:16255 / 6837:16309,背景 #1C1D1F,
    白字 + 白色描边,直接作为独立实例出现,没有额外的包裹框。
    "Make Offer" —— 芯片本身 node 6837:16275,背景 #FFFFFF,文字
    #0E0E0F;【2026-08 更正】之前只单独查询了 6837:16275 这一个节点,
    误得出"未检测到边框"的结论。之后在 OfferTableRow(order 31)里
    连同表格行一起核实第二行数据时,发现 6837:16275 在真实表格行(node
    6837:16264 / 6837:16269,hidden=false)里被包在父节点 6837:16269
    ("status pills" 包裹框)里,这个包裹框才是真正带边框的部分:
    border 1px 色 var(--border/strong,#8d9199),圆角 3px。也就是
    "Make Offer" 芯片实际展示时是有边框的,边框颜色 #8D9199,不是之前
    说的"没有边框"。
  status: >
    "In Negotiation" 无需额外确认。"Make Offer" 的边框数值已经用行内
    完整实例更正过,如果未来发现 6837:16275 单独使用(不套在
    "status pills" 包裹框里)的场景,边框是否仍然存在需要再次核实。

    【2026-08 复核:圆角 + 对齐】用户给了新的参照节点 6837:16706
    (同一个 "In Negotiation" chip 的另一个实例),指出圆角不对、需要
    居中对齐。重新用 get_design_context 分别核对了 6837:16706
    (In Negotiation)和 6837:16269/6837:16275(Make Offer 的包裹框+
    内层芯片)——两处返回的圆角都是 `rounded-[3px]`,和代码里已有的
    `border-radius: 3px` 数值一致,没有发现需要改的圆角数值。但是
    6837:16706 的类名里有 `justify-center`(内容在 chip 内水平居中),
    之前的实现漏了这条,已经补上 `justify-content: center`(同时补了
    `box-sizing: border-box`,避免 1px 描边在没有全局 reset 的环境下把
    盒子撑大)。如果补完这些以后视觉上圆角还是不对,不是数据层面的问题
    (两次独立核实都是 3px),需要你发一张实际渲染出来的截图才能继续排查。

    【2026-08 用户直接指定覆盖】你发了截图说圆角看不出来,直接要求
    "圆角 4"。3px 在这个尺寸的 chip 上确实非常微妙,肉眼很容易看成直角。
    这不是 Figma 数据的问题(两次独立核实都是 3px),是你直接给的数值
    覆盖,已经改成 border-radius: 4px,不再是 Figma 核实的 3px——这是
    你的明确指示,不是我又去查到了新的 Figma 数值。
    StatusChip(order 32)用的是同一套 "Chips / Status" 组件家族,目前
    还是 Figma 核实的 3px,没有跟着改,如果你想让两者保持一致也改成
    4px,请告诉我。
  ═══════════════════════════════════════════════════════════
-->
<template>
  <span class="offer-type-badge" :class="`offer-type-badge--${type}`">
    {{ label }}
  </span>
</template>

<script setup>
defineProps({
  // in-negotiation | make-offer
  type: {
    type: String,
    default: 'in-negotiation'
  },
  label: {
    type: String,
    default: 'In Negotiation'
  }
})
</script>

<style scoped>
.offer-type-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 12px;
  letter-spacing: 0.4px;
  white-space: nowrap;
  font-family: 'Roboto', sans-serif;
  box-sizing: border-box;
}

/* ── In Negotiation ── (Figma node 6837:16255/16309, hidden=false) */
.offer-type-badge--in-negotiation {
  background: #1C1D1F;
  color: #FFFFFF;
  border: 1px solid #FFFFFF;
}

/* ── Make Offer ── (芯片本身 node 6837:16275,边框来自包裹框 node
   6837:16269 "status pills",两者均 hidden=false,2026-08 更正:之前
   漏看了包裹框上的边框) */
.offer-type-badge--make-offer {
  background: #FFFFFF;
  color: #0E0E0F;
  border: 1px solid #8D9199;
}
</style>
