<!--
  ═══════════════════════════════════════════════════════════
  METADATA (Playground 读取用,不是最终页面渲染的一部分)
  name: Status Chip
  group: 数据表格 (Offers Table)
  order: 32
  description: >
    展示单条 offer 在表格 Update 列的更新事件徽标(New / Received)。
    可在同一格内叠加显示多个;超出显示宽度时用 "+N" 溢出徽标收纳剩余的
    chip。注意:这个组件对应的是 Update 列,不是筛选行的 FilterChipGroup
    (两者视觉相似但是完全不同的组件,用途和出现位置都不同)。
  path: fragments/StatusChip/StatusChip.vue
  source_of_truth: >
    颜色/文案值来自 Figma 文件 "Offers - Negotiation"
    (fileKey 4z7FK34Fgit7Fi9UxZu0za)里 Chips / Status 组件的真实实例,
    且只保留 hidden=false(实际渲染可见)的实例,不采用 hidden=true 的
    变体 —— hidden 在 Figma 里通常代表"设计师保留的旧版本/未使用状态",
    不能等同于"当前有效的设计"。
    已核实且可见的 node:6837:16249(Received)、6837:16247(New)、
    6837:16248(+1 溢出徽标,hidden=false)。
    【2026-08 新增 sent/declined】你指出 Frame 630266091(node 7487:62998,
    hidden=false)里的 New/Received/Sent/Declined 四个 chip 对应筛选行
    New/Received/Sent/Declined 四个 filter chip 的状态,核实到:
    - Sent(7487:62990):背景 #E0E0E0,文字 #212121,圆角 **3px**(和
      New/Received/Declined 的 4px 不一样,Figma 这几个 chip 实例本身
      圆角就不完全统一,不是我写错)。
    - Declined(7487:62983):背景 #FFEFBF,文字 #402D00,圆角 4px。
    - 同时核实到 New(7487:41460)背景/文字和之前一致(#F4FFF6/#006C4C),
      但圆角是 **4px**,不是组件里之前统一写的 3px;Received(7487:41462)
      同理也是 4px。已经把 New/Received 的圆角从 3px 改成 4px,不再和
      "overflow"溢出徽标共用同一个圆角数值(overflow 圆角保持 3px 不变,
      因为它来自另一个单独核实过的 node 6837:16248,这次没有新数据说
      要改它)。
  status: >
    "Counter Received" / "Counter Sent"(node 6837:16250 / 6837:16251)
    在这个 Offers frame 里都是 hidden=true 的变体,之前误当成已确认状态
    列了进来,现已移除。这两个状态是否真的存在于当前设计里,以及
    "In Negotiation"(6837:16255/16309,同样在这个 frame 里以 hidden 出现
    过)是否属于 Update 列,都需要你确认后再加回来。
    Declined / Outbid 之前一直没找到实例,现在 Declined 已经通过
    node 7487:62983 核实(见上面 source_of_truth),不再是未确认状态;
    Outbid 依旧没有找到任何实例,继续保持未确认。
  ═══════════════════════════════════════════════════════════
-->
<template>
  <span class="status-chip" :class="`status-chip--${status}`">
    <component :is="iconComponent" v-if="iconComponent" class="chip-icon" />
    {{ label }}
  </span>
</template>

<script setup>
import { computed, h } from 'vue'

const props = defineProps({
  // new | received | sent | declined | expired | overflow
  // (new/received/sent/declined 是 hidden=false 的已核实状态;expired 是
  // 2026-08 按你给的 card 内容规范新增的第5个状态,Figma 里没有找到对应
  // 实例,颜色是照现有灰色系估的,不是核实数值,见下面 CSS 注释)
  status: {
    type: String,
    default: 'new'
  },
  label: {
    type: String,
    default: 'New'
  },
  showIcon: {
    type: Boolean,
    default: true
  }
})

// 2026-08 按你的要求:之前这颗星是 fill:none + 0.8px 极细描边,在
// 12×12 这么小的尺寸下几乎看不出是个星星,所以你说"没有星星"——图形本身
// (5角星路径)没有变,只是改成实心填色(同色号 #006C4C,不再是描边),
// 这样才能在实际渲染大小下清楚看出是颗星
const icons = {
  new: () =>
    h('svg', { viewBox: '0 0 12 12', fill: 'none' }, [
      h('path', {
        d: 'M6 1L7.24 4.15H10.5L7.88 6.11L8.93 9.25L6 7.42L3.07 9.25L4.12 6.11L1.5 4.15H4.76L6 1Z',
        fill: '#006C4C'
      })
    ])
}

const iconComponent = computed(() => {
  if (!props.showIcon) return null
  return icons[props.status] || null
})
</script>

<style scoped>
.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 6px;
  font-size: 12px;
  line-height: 12px;
  letter-spacing: 0.4px;
  white-space: nowrap;
  font-family: 'Roboto', sans-serif;
}

.chip-icon {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

/* ── New ── (Figma node 7487:41460,hidden=false;圆角 2026-08 从 3px 核实
   改成 4px,见 METADATA source_of_truth) */
.status-chip--new {
  background: #F4FFF6;
  color: #006C4C;
  border-radius: 4px;
}

/* ── Received ── (Figma node 7487:41462,hidden=false;圆角同上改成 4px) */
.status-chip--received {
  background: #F0F8FF;
  color: #0061A5;
  border-radius: 4px;
}

/* ── Sent ── (2026-08 新增,Figma node 7487:62990,hidden=false;注意圆角
   是 3px,和 New/Received/Declined 的 4px 不一样,Figma 里这几个 chip
   本身圆角就没统一,不是我写错) */
.status-chip--sent {
  background: #E0E0E0;
  color: #212121;
  border-radius: 3px;
}

/* ── Declined ── (2026-08 新增,Figma node 7487:62983,hidden=false) */
.status-chip--declined {
  background: #FFEFBF;
  color: #402D00;
  border-radius: 4px;
}

/* ── Expired ── (2026-08 新增,来自你给的 card 内容规范"grey fill, dark
   grey text",不是 Figma 核实数值——照 Sent 的灰底 #E0E0E0 配了个比 Sent
   的 #212121 浅一点的深灰 #55575C 做区分,圆角跟 New/Received/Declined
   一样用 4px,待你确认真实设计稿数值) */
.status-chip--expired {
  background: #E0E0E0;
  color: #55575C;
  border-radius: 4px;
}

/* ── 溢出徽标 "+N" ── (Figma node 6837:16248,hidden=false,独立核实过的
   node,圆角保持 3px 不变,这次没有新数据说要改它) */
.status-chip--overflow {
  background: #E0E0E0;
  color: #212121;
  border-radius: 3px;
  justify-content: center;
}
</style>
