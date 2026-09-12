<!--
  ═══════════════════════════════════════════════════════════
  METADATA(Playground 读取用,不是最终页面渲染的一部分)
  name: Status Chip
  group: 数据表格 (Offers Table)
  order: 32
  description: >
    不是 Figma 来源的组件,是你直接要求做的一个展示壳:跟 Image Badge 这次
    改的做法一样,把 StatusChip 的所有真实状态同时铺出来,每个上方标一行
    文字说明是哪个状态,不用再靠 Controls 面板一个个切换 status 才能看到。
  path: fragments/StatusChip/StatusChipGallery.vue
  source_of_truth: >
    没有对应的 Figma 节点。芯片本身复用已经核实过的 StatusChip 组件,这里
    只是"摆放 + 打标签"的展示壳,6 个单独状态的数值直接抄原来
    StatusChip Playground 页面的 6 个 Mock examples(newExample/
    receivedExample/sentExample/declinedExample/expiredExample/
    overflowExample),没有重新编。额外加了一个"多个叠加"的示例,抄自
    fragments/StatusChip/mock.js 里的 stackedExample(New+Received 叠加
    在同一个表格单元格里的真实场景),这个示例之前只存在 mock.js 文件里,
    Playground 页面从来没有展示过。
  status: >
    2026-09-11 新增,替换掉 StatusChip 原来"单个 chip + Controls 面板切换
    status/label/showIcon"的演示方式,这次改动只影响 Playground 展示层
    ——StatusChip.vue 本身、以及 OfferTableRow/OfferCard 等真实用到它的
    地方都没有改动。
  ═══════════════════════════════════════════════════════════
-->
<template>
  <div class="status-chip-gallery">
    <div class="status-chip-gallery__row">
      <div v-for="item in items" :key="item.name" class="status-chip-gallery__item">
        <div class="status-chip-gallery__label">{{ item.name }}</div>
        <StatusChip :status="item.status" :label="item.label" :show-icon="item.showIcon" />
      </div>
    </div>
    <div class="status-chip-gallery__item">
      <div class="status-chip-gallery__label">Stacked (table cell example)</div>
      <div class="status-chip-gallery__stack">
        <StatusChip status="new" label="New" :show-icon="false" />
        <StatusChip status="received" label="Received" />
      </div>
    </div>
  </div>
</template>

<script setup>
import StatusChip from './StatusChip.vue'

// 2026-09-11 按你的要求:这 6 个组合是之前 StatusChip 自己 Playground 页面
// 的 6 个 Mock examples,需要点按钮才能一个个看;现在同时铺出来。
const items = [
  // 2026-09-11 更正:New 的星星图标只是组件自己 prop 的默认值(showIcon
  // 默认 true),但整个项目里所有真实用法(OfferTableRow/OfferCard 的
  // Update 列)从来没有用过这个默认值,永远显式传 show-icon="false"——你
  // 已经反复说过很多次"New chip 不该有星星"。这里之前照抄了旧 Mock
  // examples 里的 showIcon:true,和真实用法不一致,已改成 false。
  { name: 'New', status: 'new', label: 'New', showIcon: false },
  { name: 'Received', status: 'received', label: 'Received', showIcon: false },
  { name: 'Sent', status: 'sent', label: 'Sent', showIcon: false },
  { name: 'Declined', status: 'declined', label: 'Declined', showIcon: false },
  { name: 'Expired', status: 'expired', label: 'Expired', showIcon: false },
  { name: '+N (overflow badge)', status: 'overflow', label: '+1', showIcon: false }
]
</script>

<style scoped>
.status-chip-gallery {
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: 'Roboto', sans-serif;
}

.status-chip-gallery__row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 32px;
}

.status-chip-gallery__item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.status-chip-gallery__label {
  font-size: 12px;
  line-height: 16px;
  color: #757575;
}

/* 照 OfferTableRow.vue 的 .offer-table-row__status-pills 抄的同一个 gap
   (4px),这是真实表格 Update 列里多个 chip 叠加时用的间距,不是新发明的 */
.status-chip-gallery__stack {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
