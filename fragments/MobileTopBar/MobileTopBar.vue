<!--
  ═══════════════════════════════════════════════════════════
  METADATA
  name: Mobile Top Bar
  group: 页面外壳 (Page Shell)
  order: 13
  description: >
    Offer Dashboard mobile 版顶部条——返回箭头 + 页面标题,居中显示。
    桌面版对应的是 AppHeader(logo+导航)+ Breadcrumb(My ACV > Offers)
    两个组件叠在一起,mobile 版这两个都不存在,被换成了这一条单独的
    顶部条,新建独立组件,不是复用/魔改 AppHeader。
  path: fragments/MobileTopBar/MobileTopBar.vue
  source_of_truth: >
    Figma 文件 "Offers - Negotiation" (fileKey 4z7FK34Fgit7Fi9UxZu0za),
    mobile "Offers" 页面(node 7765:16893)里的 "Top Bar" 实例(节点
    7765:16897)。get_design_context 核实:
    - 背景 #FAFAFA(Global-shades/Backgrounds/light),高 56px,底部
      描边 1px #DCDFE8(Global-shades/Borders/border-base)。
    - 标题文字水平居中,Roboto Medium 20px/30 letter-spacing 0.15px,
      色 #545454(Global-text/secondary)。
    - 左侧返回箭头图标 24×24,左边距16px、上边距16px,已下载真实 SVG,
      填色 #212121(Global-text/primary)。
  status: >
    2026-09-11 新增,配合 Offer Dashboard 的 mobile 版设计。标题文字
    做成 `title` prop(默认 "Offers"),不是写死的,方便这个组件以后如果
    被别的 mobile 页面复用。返回箭头点击只 emit `back`,不自己决定
    "返回去哪",由使用方(目前是 OfferDashboard)决定实际行为——目前
    Offer Dashboard 是最外层页面,点返回具体要做什么还没有定,先只接
    这个事件出口。
  ═══════════════════════════════════════════════════════════
-->
<template>
  <div class="mobile-top-bar">
    <button type="button" class="mobile-top-bar__back" aria-label="Back" @click="$emit('back')">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.0005 11H7.83047L12.7105 6.11997C13.1005 5.72997 13.1005 5.08997 12.7105 4.69997C12.3205 4.30997 11.6905 4.30997 11.3005 4.69997L4.71047 11.29C4.32047 11.68 4.32047 12.31 4.71047 12.7L11.3005 19.29C11.6905 19.68 12.3205 19.68 12.7105 19.29C13.1005 18.9 13.1005 18.27 12.7105 17.88L7.83047 13H19.0005C19.5505 13 20.0005 12.55 20.0005 12C20.0005 11.45 19.5505 11 19.0005 11Z" fill="#212121"/>
      </svg>
    </button>
    <span class="mobile-top-bar__title">{{ title }}</span>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'Offers' }
})
defineEmits(['back'])
</script>

<style scoped>
/* position:sticky 跟桌面版 AppHeader 是同一个模式(该组件也是
   position:sticky;top:0),不用 fixed 是为了不用额外算 offset,细节
   见 AppHeader.vue 自己的说明 */
.mobile-top-bar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  height: 56px;
  background: #FAFAFA;
  border-bottom: 1px solid #DCDFE8;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
}

/* 绝对定位贴左,不占正常流的宽度,这样右边的标题才能用 flex:1 相对整行
   居中(不是相对"标题和箭头之间剩下的空间"居中)——跟 Figma 里标题
   left:calc(50%-0.5px) 独立于图标位置计算是同一个效果 */
.mobile-top-bar__back {
  position: absolute;
  left: 16px;
  top: 16px;
  display: inline-flex;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

.mobile-top-bar__title {
  flex: 1;
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  line-height: 30px;
  letter-spacing: 0.15px;
  color: #545454;
}
</style>
