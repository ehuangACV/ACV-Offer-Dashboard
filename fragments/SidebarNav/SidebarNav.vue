<!--
  ═══════════════════════════════════════════════════════════
  METADATA (Playground 读取用,不是最终页面渲染的一部分)
  name: Sidebar Nav
  group: 页面外壳 (Page Shell)
  order: 12
  description: >
    左侧主导航,包含 My Inventory / Saved Auctions / Request Inspection、
    Active / Pending Proxy / Negotiation / Offers(当前选中,带数量
    徽标)、Billing / Won / Sold / Titles Hub、Performance 四组,组间用
    分隔线隔开。Active / Negotiation / Billing 三项右侧带展开箭头图标,
    但箭头本身是纯展示,不做展开/收起交互(2026-08 按你的要求去掉了
    交互,箭头图标保留)。
  path: fragments/SidebarNav/SidebarNav.vue
  source_of_truth: >
    Figma 文件 "Offers - Negotiation" (fileKey 4z7FK34Fgit7Fi9UxZu0za),
    节点 6903:21933("Sidebar nav",顶层实例,hidden=false)。
    通过 get_design_context 核实以下均为 hidden=false 的可见实例:
    - 容器:背景 #FFFFFF,flex-col,item 间 gap 4px。
    - 普通项(My Inventory 6903:21934 / Saved Auctions 6903:21935 /
      Request Inspection 6903:21936 / Pending Proxy 6903:21949 /
      Won 6903:21958 / Sold 6903:21959 / Titles Hub 6903:21960 /
      Performance 6903:21962):文字 Roboto Regular 16px/24,letter-
      spacing 0.15px,色 #545454(Global/text/secondary),默认无背景。
    - 选中项 Offers(6903:21951):背景 #EBF6FF(ACV/Secondary/light-x),
      文字 Roboto Medium 16px/24,letter-spacing 0.15px,色 #004E7D
      (ACV/Secondary/base)。
    - 数量徽标(6903:21965,叠在 Offers 行上,hidden=false):背景
      var(--background---system/alt/danger,#ff5449),文字色
      var(--Text/primary-Invert-web,#f7f7f8),文字 14px/20,letter-
      spacing 0.1px,padding 8px/2px,rounded-full。数值 "5" 来自截图,
      当作示例值,不是固定文案。
    - 带展开箭头的三项——Active(6903:21948)、Negotiation(6903:21950)、
      Billing(6903:21957)——各自的 "Navigation/expand-more" 箭头图标
      实例本身是 hidden=false(可见),已下载真实 SVG(24×24,填色
      #545454)。
    - 分隔线(6903:21947 / 21956 / 21961):高 39px,内部 1px 线,色
      #DCDFE8(Global/borders/base),左右各留 16px。
  status: >
    【2026-08】之前版本给 Active / Negotiation / Billing 做了点击展开/
    收起的交互,展开内容来自 4 个 hidden=true 的 "Sub menu" 节点
    (6903:21938/21941/21943/21952),已经在 notes.md 里详细记录过这些
    节点内容彼此对不上、无法唯一归属的问题。你已经明确说"这个不用管,
    sidebar nav 不需要 interaction",所以这版直接把展开/收起功能整个
    去掉了——箭头图标本身(已核实、hidden=false)还保留展示,只是不再
    响应点击,也不再暴露任何展开态的 props/controls。之前那 4 个 hidden
    节点的内容归属问题也就不需要再确认了。
  ═══════════════════════════════════════════════════════════
-->
<template>
  <nav class="sidebar-nav">
    <button type="button" class="sidebar-nav__item" :class="itemClass('my-inventory')">
      My Inventory
    </button>
    <button type="button" class="sidebar-nav__item" :class="itemClass('saved-auctions')">
      Saved Auctions
    </button>
    <button type="button" class="sidebar-nav__item" :class="itemClass('request-inspection')">
      Request Inspection
    </button>

    <div class="sidebar-nav__divider" />

    <button type="button" class="sidebar-nav__item" :class="itemClass('active')">
      Active
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="sidebar-nav__expand-icon">
        <path d="M15.8805 9.29006L12.0005 13.1701L8.12047 9.29006C7.73047 8.90006 7.10047 8.90006 6.71047 9.29006C6.32047 9.68006 6.32047 10.3101 6.71047 10.7001L11.3005 15.2901C11.6905 15.6801 12.3205 15.6801 12.7105 15.2901L17.3005 10.7001C17.6905 10.3101 17.6905 9.68006 17.3005 9.29006C16.9105 8.91006 16.2705 8.90006 15.8805 9.29006V9.29006Z" fill="#545454"/>
      </svg>
    </button>

    <button type="button" class="sidebar-nav__item" :class="itemClass('pending-proxy')">
      Pending Proxy
    </button>

    <button type="button" class="sidebar-nav__item" :class="itemClass('negotiation')">
      Negotiation
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="sidebar-nav__expand-icon">
        <path d="M15.8805 9.29006L12.0005 13.1701L8.12047 9.29006C7.73047 8.90006 7.10047 8.90006 6.71047 9.29006C6.32047 9.68006 6.32047 10.3101 6.71047 10.7001L11.3005 15.2901C11.6905 15.6801 12.3205 15.6801 12.7105 15.2901L17.3005 10.7001C17.6905 10.3101 17.6905 9.68006 17.3005 9.29006C16.9105 8.91006 16.2705 8.90006 15.8805 9.29006V9.29006Z" fill="#545454"/>
      </svg>
    </button>

    <button type="button" class="sidebar-nav__item sidebar-nav__item--active-row" :class="itemClass('offers')">
      Offers
      <span class="sidebar-nav__badge">{{ offersCount }}</span>
    </button>

    <div class="sidebar-nav__divider" />

    <button type="button" class="sidebar-nav__item" :class="itemClass('billing')">
      Billing
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="sidebar-nav__expand-icon">
        <path d="M15.8805 9.29006L12.0005 13.1701L8.12047 9.29006C7.73047 8.90006 7.10047 8.90006 6.71047 9.29006C6.32047 9.68006 6.32047 10.3101 6.71047 10.7001L11.3005 15.2901C11.6905 15.6801 12.3205 15.6801 12.7105 15.2901L17.3005 10.7001C17.6905 10.3101 17.6905 9.68006 17.3005 9.29006C16.9105 8.91006 16.2705 8.90006 15.8805 9.29006V9.29006Z" fill="#545454"/>
      </svg>
    </button>

    <button type="button" class="sidebar-nav__item" :class="itemClass('won')">
      Won
    </button>
    <button type="button" class="sidebar-nav__item" :class="itemClass('sold')">
      Sold
    </button>
    <button type="button" class="sidebar-nav__item" :class="itemClass('titles-hub')">
      Titles Hub
    </button>

    <div class="sidebar-nav__divider" />

    <button type="button" class="sidebar-nav__item" :class="itemClass('performance')">
      Performance
    </button>
  </nav>
</template>

<script setup>
const props = defineProps({
  // 当前选中项 key,默认 offers 对应 Figma 截图里的选中态
  activeItem: {
    type: String,
    default: 'offers'
  },
  offersCount: {
    type: [String, Number],
    default: 5
  }
})

function itemClass(key) {
  return { 'sidebar-nav__item--active': props.activeItem === key }
}
</script>

<style scoped>
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 260px;
  background: #FFFFFF;
  font-family: 'Roboto', sans-serif;
  padding: 0;
}

.sidebar-nav__item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  margin: 0 12px;
  padding: 0 12px 0 24px;
  border: none;
  border-radius: 59px;
  background: none;
  text-align: left;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: #545454;
}

.sidebar-nav__item--active {
  background: #EBF6FF;
  color: #004E7D;
  font-weight: 500;
}

.sidebar-nav__item--active-row {
  padding-right: 12px;
}

.sidebar-nav__expand-icon {
  flex-shrink: 0;
}

.sidebar-nav__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  border-radius: 1000px;
  background: #FF5449;
  color: #F7F7F8;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0.1px;
}

.sidebar-nav__divider {
  height: 39px;
  margin: 0 16px;
  position: relative;
}

.sidebar-nav__divider::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background: #DCDFE8;
}
</style>
