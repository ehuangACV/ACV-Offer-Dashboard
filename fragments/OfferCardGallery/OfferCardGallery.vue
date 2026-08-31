<!--
  ═══════════════════════════════════════════════════════════
  METADATA (Playground 读取用,不是最终页面渲染的一部分)
  name: Offer Card — All States
  group: 卡片视图 (Card View)
  order: 41
  description: >
    不是 Figma 来源的组件,是你直接要求做的一个 QA/文档用途的"总览页":
    把 OfferCard 在 buyer/seller 两种视角下各自 5 种合法的"类型×状态"
    组合同时铺出来,每张卡片上方标一行文字说明这是什么状态,顶部有个
    Buyer/Seller 切换开关。方便一次性对照检查所有状态的文案/芯片/按钮
    是否符合 "Offer card — content & interaction spec",不用在 OfferCard
    自己的 Playground 页面里一个个切换 Mock 示例来看。
  path: fragments/OfferCardGallery/OfferCardGallery.vue
  source_of_truth: >
    没有对应的 Figma 节点。卡片本身复用已经核实过的 `OfferCard` 组件,
    这里只是"摆放 + 打标签"的展示壳,数值直接复用
    `fragments/OfferCard/mock.js` 里已经建好的 10 个 mock(buyer 5个/
    seller 5个),没有重新编数据。标签文案是你要求"卡片上方写上对应的
    状态,比如买家刚发offer等待卖家回复"照这个思路写的说明性短句,不是
    规范文档里的原文。
  status: >
    顶部 Buyer/Seller 切换用的是两个按钮拼成的 pill 分段控件,复用了
    OfferDashboard 视图切换按钮已经验证过的同一套 pill 视觉(圆角/描边/
    active态背景色),不是新发明一套切换样式。5种状态的顺序按"进行中→
    已结束"排:Received→Sent→Declined→Expired,Make Offer 类型的那个
    状态插在对应位置(buyer是Sent那格换成Make Offer·Sent,seller是
    Received那格换成Make Offer·Received)。
  ═══════════════════════════════════════════════════════════
-->
<template>
  <div class="offer-card-gallery">
    <div class="offer-card-gallery__toggle">
      <button
        type="button"
        class="offer-card-gallery__toggle-btn"
        :class="{ 'offer-card-gallery__toggle-btn--active': role === 'buyer' }"
        @click="role = 'buyer'"
      >Buyer</button>
      <button
        type="button"
        class="offer-card-gallery__toggle-btn"
        :class="{ 'offer-card-gallery__toggle-btn--active': role === 'seller' }"
        @click="role = 'seller'"
      >Seller</button>
    </div>

    <div class="offer-card-gallery__grid">
      <div v-for="item in activeItems" :key="item.label" class="offer-card-gallery__item">
        <div class="offer-card-gallery__label">{{ item.label }}</div>
        <OfferCard v-bind="item.props" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import OfferCard from '../OfferCard/OfferCard.vue'
import {
  buyerReceivedExample,
  buyerSentNegotiationExample,
  buyerSentMakeOfferExample,
  buyerDeclinedExample,
  buyerExpiredExample,
  sellerReceivedNegotiationExample,
  sellerSentExample,
  sellerReceivedMakeOfferExample,
  sellerDeclinedExample,
  sellerExpiredExample
} from '../OfferCard/mock.js'

const role = ref('buyer')

// 2026-08 按你的要求:每张卡片上方的说明短句,不是规范文档原文,是照你
// 举的例子("买家刚发offer等待卖家回复")这个思路写的
const buyerItems = [
  { label: 'In Negotiation · Received — 卖家刚还价,等你决定', props: buyerReceivedExample },
  { label: 'In Negotiation · Sent — 你刚还价,等卖家回复', props: buyerSentNegotiationExample },
  { label: 'Make Offer · Sent — 你刚发offer,等卖家回复', props: buyerSentMakeOfferExample },
  { label: 'Declined — 卖家拒绝了你的offer,已结束', props: buyerDeclinedExample },
  { label: 'Expired — 超时没人处理,已结束', props: buyerExpiredExample }
]

const sellerItems = [
  { label: 'In Negotiation · Received — 买家刚还价,等你决定', props: sellerReceivedNegotiationExample },
  { label: 'In Negotiation · Sent — 你刚还价,等买家回复', props: sellerSentExample },
  { label: 'Make Offer · Received — 买家刚发offer,等你决定', props: sellerReceivedMakeOfferExample },
  { label: 'Declined — 你拒绝了买家的offer,已结束', props: sellerDeclinedExample },
  { label: 'Expired — 超时没人处理,已结束', props: sellerExpiredExample }
]

const activeItems = computed(() => (role.value === 'buyer' ? buyerItems : sellerItems))
</script>

<style scoped>
.offer-card-gallery {
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: 'Roboto', sans-serif;
}

/* 复用 OfferDashboard 视图切换按钮已经验证过的同一套 pill 分段控件视觉
   (圆角999px/描边#D1D3D6/active态背景#F5F5F5),不是新发明一套样式 */
.offer-card-gallery__toggle {
  display: flex;
  align-items: center;
  align-self: flex-start;
}

.offer-card-gallery__toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 88px;
  height: 36px;
  padding: 0 16px;
  background: #FFFFFF;
  border: 1px solid #D1D3D6;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #212121;
  cursor: pointer;
}

.offer-card-gallery__toggle-btn:first-child {
  border-radius: 999px 0 0 999px;
}

.offer-card-gallery__toggle-btn:last-child {
  border-left: none;
  border-radius: 0 999px 999px 0;
}

.offer-card-gallery__toggle-btn--active {
  background: #F5F5F5;
}

.offer-card-gallery__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}

.offer-card-gallery__item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 截图上那种"小灰字标签贴在示例上方"的样式,不是 Figma 核实数值,照你
   给的截图目测的 */
.offer-card-gallery__label {
  font-size: 12px;
  line-height: 16px;
  color: #757575;
}
</style>
