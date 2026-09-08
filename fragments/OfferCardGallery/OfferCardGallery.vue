<!--
  ═══════════════════════════════════════════════════════════
  METADATA (Playground 读取用,不是最终页面渲染的一部分)
  name: Offer Card — All States
  group: 卡片视图 (Card View)
  order: 41
  description: >
    不是 Figma 来源的组件,是你直接要求做的一个 QA/文档用途的"总览页":
    把 OfferCard 在 buyer/seller 两种视角下各自合法的"类型×状态"组合同时
    铺出来,每张卡片上方标一行文字说明这是什么状态,顶部有个 Buyer/Seller
    切换开关。方便一次性对照检查所有状态的文案/芯片/按钮是否符合
    "Offer card — content & interaction spec",不用在 OfferCard 自己的
    Playground 页面里一个个切换 Mock 示例来看。
    【2026-09-03 更正数量】原来每个角色只做了 5 种组合,你要求核对之后
    发现漏了 4 种(In Negotiation 的 declined 只做了买家视角、缺卖家
    视角;In Negotiation 的 expired 只做了买家视角、缺卖家视角;Make
    Offer 的 expired 只做了卖家视角、缺买家视角——declined/expired 在
    两种 offerType 下理应买卖双方各有一份,不能只做其中一边),现在每个
    角色是完整的 7 种(In Negotiation 4 种:received/sent/declined/
    expired,Make Offer 3 种:买家 sent/declined/expired,卖家
    received/declined/expired——买家在 Make Offer 上不会 received、
    卖家不会 sent,因为 Make Offer 卖家只能 accept/decline,不会
    counter),不再是 5 种。
  path: fragments/OfferCardGallery/OfferCardGallery.vue
  source_of_truth: >
    没有对应的 Figma 节点。卡片本身复用已经核实过的 `OfferCard` 组件,
    这里只是"摆放 + 打标签"的展示壳,数值直接复用
    `fragments/OfferCard/mock.js` 里已经建好的 14 个 mock(buyer 7个/
    seller 7个,2026-09-03 从 10 个/各5个补到 14 个/各7个,细节见上面
    description 的更正记录),没有重新编数据。标签文案是你要求"卡片上方
    写上对应的状态,比如买家刚发offer等待卖家回复"照这个思路写的说明性
    短句,不是规范文档里的原文。
  status: >
    顶部 Buyer/Seller 切换用的是两个按钮拼成的 pill 分段控件,复用了
    OfferDashboard 视图切换按钮已经验证过的同一套 pill 视觉(圆角/描边/
    active态背景色),不是新发明一套切换样式。每组内部按"进行中→已结束"
    排:Received→Sent→Declined→Expired(Make Offer 缺的那一档跳过,不
    留空位——买家跳过 Received,卖家跳过 Sent)。
    【2026-09-03 补充:卡片顶部说明文字不等高导致图片错位】你指出卡片
    没有对齐——因为每张卡片上方那行灰色说明文字(`.offer-card-gallery__
    label`)长度不一样,有的换行有的没换行,导致下面 `OfferCard` 图片在
    同一行里的起始高度不一样(比如"buyer just countered, waiting on
    you" 这种换成两行的标签,把它下面的卡片往下推了一截,旁边一行的
    标签只有一行,卡片就顶到更靠上的位置)。给 `.offer-card-gallery__
    label` 加了 `min-height:32px`(2倍 16px 行高,按这批标签实测最多
    换到2行)+ `display:flex;align-items:flex-end`,不管这张卡片自己的
    说明文字是1行还是2行,这块区域高度都固定一样,下面的卡片图片就能在
    同一行里贴齐;`align-items:flex-end` 是让文字贴在这块固定高度区域的
    底部(贴着卡片顶边),不是顶部,1行文字时视觉上更贴近原来"文字紧贴在
    卡片上方"的效果,不会因为多出来的空白把文字推到离卡片很远的地方。
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

    <div v-for="group in activeGroups" :key="group.type" class="offer-card-gallery__group">
      <div class="offer-card-gallery__group-title">{{ group.title }}</div>
      <div class="offer-card-gallery__grid">
        <div v-for="item in group.items" :key="item.label" class="offer-card-gallery__item">
          <div class="offer-card-gallery__label">{{ item.label }}</div>
          <OfferCard v-bind="item.props" />
        </div>
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
  buyerDeclinedNegotiationExample,
  buyerExpiredExample,
  buyerExpiredMakeOfferExample,
  sellerReceivedNegotiationExample,
  sellerSentExample,
  sellerReceivedMakeOfferExample,
  sellerDeclinedExample,
  sellerDeclinedNegotiationExample,
  sellerExpiredExample,
  sellerExpiredNegotiationExample
} from '../OfferCard/mock.js'

const role = ref('buyer')

// 2026-08 按你的要求:每张卡片上方的说明短句,不是规范文档原文,是照你
// 举的例子("买家刚发offer等待卖家回复")这个思路写的。
// 2026-09-02 按你的要求新增 type 字段(值直接抄自每个 mock 自己的
// offerType,不是另外编的),用来把 In Negotiation / Make Offer 这两类
// 分成两个独立的分组——Declined/Expired 各自的 type 跟着它自己 mock 里
// 原本就有的 offerType 走(比如买家侧的 Declined 例子本身就是
// make-offer 状态关闭,不是重新分类)。
// 2026-09-03 按你的要求核对 "Offer States Logic for CC.md" 补齐了 4 个
// 之前漏掉的合法组合(declined 永远是卖家的动作,但买家/卖家两种视角都要
// 各有一份;In Negotiation 和 Make Offer 各自的 declined/expired 也不能
// 只做其中一个类型),细节和补的具体数值见 fragments/OfferCard/mock.js
// 文件里这 4 个新 mock 旁边的注释,这里只是把它们摆进对应的分组。
const buyerItems = [
  { type: 'in-negotiation', label: 'In Negotiation · Received — 卖家刚还价,等你决定', props: buyerReceivedExample },
  { type: 'in-negotiation', label: 'In Negotiation · Sent — 你刚还价,等卖家回复', props: buyerSentNegotiationExample },
  { type: 'in-negotiation', label: 'In Negotiation · Declined — 卖家拒绝了你的还价,已结束', props: buyerDeclinedNegotiationExample },
  { type: 'in-negotiation', label: 'In Negotiation · Expired — 超时没人处理,已结束', props: buyerExpiredExample },
  { type: 'make-offer', label: 'Make Offer · Sent — 你刚发offer,等卖家回复', props: buyerSentMakeOfferExample },
  { type: 'make-offer', label: 'Make Offer · Declined — 卖家拒绝了你的offer,已结束', props: buyerDeclinedExample },
  { type: 'make-offer', label: 'Make Offer · Expired — 超时没人处理,已结束', props: buyerExpiredMakeOfferExample }
]

const sellerItems = [
  { type: 'in-negotiation', label: 'In Negotiation · Received — 买家刚还价,等你决定', props: sellerReceivedNegotiationExample },
  { type: 'in-negotiation', label: 'In Negotiation · Sent — 你刚还价,等买家回复', props: sellerSentExample },
  { type: 'in-negotiation', label: 'In Negotiation · Declined — 你拒绝了买家的还价,已结束', props: sellerDeclinedNegotiationExample },
  { type: 'in-negotiation', label: 'In Negotiation · Expired — 超时没人处理,已结束', props: sellerExpiredNegotiationExample },
  { type: 'make-offer', label: 'Make Offer · Received — 买家刚发offer,等你决定', props: sellerReceivedMakeOfferExample },
  { type: 'make-offer', label: 'Make Offer · Declined — 你拒绝了买家的offer,已结束', props: sellerDeclinedExample },
  { type: 'make-offer', label: 'Make Offer · Expired — 超时没人处理,已结束', props: sellerExpiredExample }
]

const activeItems = computed(() => (role.value === 'buyer' ? buyerItems : sellerItems))

// 2026-09-02 按你的要求新增:In Negotiation 和 Make Offer 是两种类型,
// 页面上要分开显示,不是混在一个网格里。分组顺序固定 In Negotiation 在
// 前、Make Offer 在后,组内顺序保留原来"进行中→已结束"的排法不变。
const activeGroups = computed(() => {
  const items = activeItems.value
  return [
    { type: 'in-negotiation', title: 'In Negotiation', items: items.filter((item) => item.type === 'in-negotiation') },
    { type: 'make-offer', title: 'Make Offer', items: items.filter((item) => item.type === 'make-offer') }
  ]
})
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

/* 2026-09-02 新增,把 In Negotiation / Make Offer 分成两个独立分组显示,
   不是 Figma 核实数值,是这个 QA 页面自己的排版判断 */
.offer-card-gallery__group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.offer-card-gallery__group-title {
  font-size: 16px;
  font-weight: 500;
  color: #212121;
  padding-bottom: 8px;
  border-bottom: 1px solid #E8E9EB;
}

/* 2026-09-02 按你的要求:卡片宽度默认固定 360px(不再是 minmax(320px,
   1fr)撑满可用空间的自适应宽度),用 auto-fill 让每列固定 360px 宽,
   多出来的行自动往下排,不是每张卡都被拉宽到填满一行 */
.offer-card-gallery__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 360px);
  gap: 16px;
}

.offer-card-gallery__item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 截图上那种"小灰字标签贴在示例上方"的样式,不是 Figma 核实数值,照你
   给的截图目测的。2026-09-03 加了 min-height + flex 让文字不管换1行
   还是2行都固定占用同一块高度,贴着底部(靠近卡片顶边)——这样同一行
   相邻卡片的图片才能顶部对齐,不会因为某张卡片的说明文字换行更多而被
   往下推,细节见上面 METADATA 的说明 */
.offer-card-gallery__label {
  min-height: 32px;
  display: flex;
  align-items: flex-end;
  font-size: 12px;
  line-height: 16px;
  color: #757575;
}
</style>
