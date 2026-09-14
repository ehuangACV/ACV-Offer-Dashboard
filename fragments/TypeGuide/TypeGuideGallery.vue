<!--
  ═══════════════════════════════════════════════════════════
  METADATA(Playground 读取用,不是最终页面渲染的一部分)
  name: Type Guide
  group: Shared Components
  order: 27
  description: >
    TypeGuide 的 Playground 展示壳。2026-09-14 改版:之前是单个实例 +
    Controls 面板的 viewerRole select 来回切换 buyer/seller,你要求改成
    buyer 和 seller 两个同时铺出来(跟 OfferTypeBadgeGallery 的做法一样),
    不用再切换才能对比着看。
  path: fragments/TypeGuide/TypeGuideGallery.vue
  source_of_truth: >
    没有对应的 Figma 节点,纯 Playground 展示壳。TypeGuide 本身没有改动,
    这里只是同时渲染两个实例(viewerRole 分别是 buyer/seller)。

    同时修了一个展示壳自己的问题(不是 TypeGuide 组件本身的 bug):之前
    的壳给 `.type-guide-gallery`(TypeGuide 的定位祖先)设了
    `min-height: 360px`,而 TypeGuide 默认 `top: calc(100% + 10px)` 是
    "相对定位祖先的高度算的",相对祖先高度算下来变成"360px 之后再+10px"
    ,导致卡片在页面上出现的位置远比真实用法(紧贴在触发按钮下方10px)
    低很多。改成给每个 TypeGuide 单独包一层没有强制高度的
    `.type-guide-gallery__anchor`(position:relative,只设宽度320px不设
    高度——里面只有一个 position:absolute 的子元素,高度会自动收缩成0),
    这样 TypeGuide 自己完全没改的 `top: calc(100% + 10px)` 算出来就是
    "紧贴 anchor 顶部往下10px",跟真实用法里"紧贴触发按钮下方"的视觉效果
    一致,不是又给 Gallery 专门加一个 top 覆盖值。

    这个改法引出另一个问题:anchor 高度收缩成0之后,Playground 外层
    "舞台"容器是按正常流内容的高度来定自己高度的(不知道、也不该知道
    里面有个 position:absolute 的子元素撑出去了),算出来舞台只有一行
    label 那么高,于是这张 320~360px 高的卡片虽然定位数值是对的,但
    视觉上被舞台的 overflow 裁掉了,看起来"什么都没有"。这不能靠给
    anchor 本身加高度解决(会把上面刚修好的 top 值算法弄错,原地重新
    踩回"太低"那个坑)——所以是给 anchor 的父级 `.type-guide-gallery__
    item`(正常流的那一层,不是 TypeGuide 的定位参照物)单独设一个
    `min-height: 400px`,只用来告诉舞台"这一列实际需要多高",不影响
    anchor 自己(还是0高度)、也就不影响 top 的计算基准。
  ═══════════════════════════════════════════════════════════
-->
<template>
  <div class="type-guide-gallery">
    <div v-for="item in items" :key="item.name" class="type-guide-gallery__item">
      <div class="type-guide-gallery__label">{{ item.name }}</div>
      <div class="type-guide-gallery__anchor">
        <TypeGuide :viewer-role="item.viewerRole" />
      </div>
    </div>
  </div>
</template>

<script setup>
import TypeGuide from './TypeGuide.vue'

const items = [
  { name: 'Buyer', viewerRole: 'buyer' },
  { name: 'Seller', viewerRole: 'seller' }
]
</script>

<style scoped>
.type-guide-gallery {
  display: flex;
  align-items: flex-start;
  gap: 32px;
  font-family: 'Roboto', sans-serif;
}

.type-guide-gallery__item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  /* 只用来给外层"舞台"容器一个真实的高度参考(卡片本身是
     position:absolute,撑不出正常流的高度),不设在 anchor 上,
     不影响 TypeGuide 的 top 定位计算基准。 */
  min-height: 400px;
}

.type-guide-gallery__label {
  font-size: 12px;
  line-height: 16px;
  color: #757575;
}

.type-guide-gallery__anchor {
  position: relative;
  width: 320px;
}
</style>
