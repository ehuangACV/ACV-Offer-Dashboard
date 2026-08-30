<!--
  ═══════════════════════════════════════════════════════════
  METADATA
  name: Offer Tabs
  group: 导航与筛选 (Nav & Filters)
  order: 20
  description: >
    Buying / Selling 切换 tab,每个 tab 右侧带数量圆点徽标,选中态有橙色
    底部指示条。
  path: fragments/OfferTabs/OfferTabs.vue
  source_of_truth: >
    Figma 文件 "Offers - Negotiation" (fileKey 4z7FK34Fgit7Fi9UxZu0za),
    节点 6903:23020("Tabs",hidden=false)。get_design_context 核实:
    - 底部通用分隔线(6903:23021 "track"):#DCDFE8。
    - Buying(选中态,6903:23023):背景 #FEF9F6(colors/accent-primary/
      primary-999),文字 Roboto Medium 16px/24 letter-spacing .15px 色
      #F26522(background/brand);数量徽标(6903:23026)背景 #F26522,
      文字白色 Inter Bold 12px/18;底部指示条(6903:23028)高 2px 色
      #F26522。
    - Selling(未选中态,6903:23029):无背景,文字 Roboto Regular 16px/24
      色 #757575(Global/text/tertiary);数量徽标(6903:23032)背景
      #D1D3D6(Global/grey/base),文字 #55575C(text/secondary)Inter
      Bold 12px/18;底部指示条资源(6903:23034)是 opacity=0 的线条,已
      下载真实 SVG 确认——未选中态確实没有可见指示条,不是漏画。
  status: >
    [2026-08 已解决] 之前 Figma 里只找到 "Buying 选中" 的可见实例,
    "Selling 选中"的样式是照搬 Buying 选中态数值互换过来的,标注过待确认。
    重新核实节点 7487:63045(hidden=false)后,找到了真实的"Selling 选中
    /Buying 未选中"实例——数值和之前互换猜测的完全一致(背景
    #FEF9F6、文字/指示条 #F26522、未选中态文字#757575/徽标背景#D1D3D6),
    不需要改动,这个待确认项可以关闭。
    另外还发现两个 hidden=true 的备用 tab 变体(6903:23035 带 "sell" 图标、
    6903:23041 带 "shopping_cart" 图标),看起来是带图标的旧设计,当前
    不用,未采用。

    [2026-08 新增点击交互] 之前这个组件完全是"哑"组件,两个 tab 按钮没有
    任何 click 处理,点 Selling 没有任何反应。按你的要求加了
    `@click` + `emit('select', 'buying'/'selling')`,由外层
    OfferDashboard 接住这个事件去真正切换 activeTab 和对应的数据,这个
    组件本身还是不持有状态,只是把"用户点了哪个"上报出去。

    [2026-08 修复:底部分割线实际渲染不可见] 你截图对比指出,底部通用
    分隔线(#DCDFE8)在实际页面里基本看不见,只有橙色选中指示条,没有
    灰色横线。排查发现:颜色/宽度/位置在 devtools 里量出来全部正确
    (`.offer-tabs__track` 是 `position:absolute` + `z-index:-1` + 1px
    高度),但这种写法在实际渲染里很容易被浏览器"抗锯齿"掉,是已知的
    CSS 坑,不是数值算错了。已经改成直接在 `.offer-tabs` 容器本身加
    `border-bottom:1px solid #DCDFE8`(标准、稳妥的画1px线做法),同时
    加了 `box-sizing:border-box` 让这条线占用组件本来就有的高度,不会
    多出1px 把 OfferDashboard 里已经核实过的"Tabs→搜索框 24px"这类间距
    顶下去。颜色/位置/覆盖范围和之前完全一样,只是实现机制换了。
  ═══════════════════════════════════════════════════════════
-->
<template>
  <div class="offer-tabs">
    <button
      type="button"
      class="offer-tabs__tab"
      :class="{ 'offer-tabs__tab--selected': activeTab === 'buying' }"
      @click="$emit('select', 'buying')"
    >
      <span class="offer-tabs__label">Buying</span>
      <span class="offer-tabs__count">{{ buyingCount }}</span>
      <span v-if="activeTab === 'buying'" class="offer-tabs__indicator" />
    </button>
    <button
      type="button"
      class="offer-tabs__tab"
      :class="{ 'offer-tabs__tab--selected': activeTab === 'selling' }"
      @click="$emit('select', 'selling')"
    >
      <span class="offer-tabs__label">Selling</span>
      <span class="offer-tabs__count">{{ sellingCount }}</span>
      <span v-if="activeTab === 'selling'" class="offer-tabs__indicator" />
    </button>
  </div>
</template>

<script setup>
defineProps({
  // buying | selling
  activeTab: {
    type: String,
    default: 'buying'
  },
  buyingCount: {
    type: [String, Number],
    default: 3
  },
  sellingCount: {
    type: [String, Number],
    default: 2
  }
})
defineEmits(['select'])
</script>

<style scoped>
/* 2026-08 按你的要求修复:底部通用分隔线之前是一个 z-index:-1、
   position:absolute、高度只有 1px 的 div(.offer-tabs__track),量出来的
   位置/颜色/宽度全部正确,但实际渲染出来几乎看不见——1px 高的绝对定位
   元素在有小数像素/图层合成的情况下很容易被浏览器"抗锯齿"到基本消失,
   这是已知的 CSS 坑,不是数值算错。改成直接在 `.offer-tabs` 容器本身
   加 `border-bottom`,这是画 1px 线最稳妥的标准做法,不会有这个问题。
   颜色/位置/覆盖范围和之前完全一样(#DCDFE8,贴着整行 tabs 底边,
   横跨全宽),只是实现方式换了,视觉效果应该是一致的,不是重新设计。 */
.offer-tabs {
  position: relative;
  display: flex;
  align-items: stretch;
  font-family: 'Roboto', sans-serif;
  border-bottom: 1px solid #DCDFE8;
  box-sizing: border-box;
}
/* 说明:.offer-tabs 高度是 auto(由内容撑起来的),box-sizing 对 auto
   高度不起"把border吸收进现有高度"的作用,所以整体高度确实比之前多了
   1px。这不影响 OfferDashboard 里已经核实过的"Tabs→搜索框 24px"这类
   间距——那些间距是通过下一个元素的 padding 相对 Tabs 底边算出来的,
   Tabs 底边往下移1px,后面的 padding 距离量出来还是精确 24px,只是整
   页高度多了可以忽略的1px,不是回归。 */

.offer-tabs__tab {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: none;
  background: none;
  cursor: pointer;
  padding: 10px 16px 1px;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: #757575;
}

.offer-tabs__tab--selected {
  background: #FEF9F6;
  border-radius: 8px;
  color: #F26522;
  font-weight: 500;
}

.offer-tabs__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 99px;
  background: #D1D3D6;
  color: #55575C;
  font-family: 'Inter', 'Roboto', sans-serif;
  font-weight: 700;
  font-size: 12px;
  line-height: 18px;
}

.offer-tabs__tab--selected .offer-tabs__count {
  background: #F26522;
  color: #FFFFFF;
}

.offer-tabs__indicator {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  border-radius: 4px 4px 0 0;
  background: #F26522;
}

</style>
