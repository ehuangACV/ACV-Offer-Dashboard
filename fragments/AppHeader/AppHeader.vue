<!--
  ═══════════════════════════════════════════════════════════
  METADATA (Playground 读取用,不是最终页面渲染的一部分)
  name: App Header
  group: 页面外壳 (Page Shell)
  order: 10
  description: >
    页面顶部的 App Bar。左侧 ACV logo + 站内导航 tabs;右侧 Dealer
    Rewards Program 徽章 + 通知铃铛 + 用户信息 + 汉堡菜单。这是一个真正
    响应式收缩的组件:容器变窄时,依次收缩 Rewards 徽章(文字pill → 纯
    图标)→ 用户信息(姓名+公司 → 只剩头像)→ 导航项(溢出的项收进
    "More" 下拉菜单),不是"移动端另切一套样式",而是同一套 DOM 按可用
    空间实时重排。
  path: fragments/AppHeader/AppHeader.vue
  source_of_truth: >
    【2026-08 替换】本组件已从 Figma 版本整体替换为 Claude Design 项目
    "ACV Auctions Design System"(projectId
    1294432b-f5f9-488f-9691-d01499283248)里的
    `components/08-app-bar-navigation-web.card.html`(通过 DesignSync
    工具的 get_file 读取,不是 get_design_context/Figma),以及该文件引用
    的 `assets/logo.svg`。这是用户直接指定要替换成的版本,以这个文件
    的真实 CSS/HTML/JS 为准,不再沿用之前 Figma "App Bar / ACV" 节点
    (6837:16087)的样式数值——两者在选中态处理上不同,不是同一版设计:
    - 容器:高 58px,白底,底部描边 1px #D1D3D6。
    - Logo:直接使用卡片引用的 `assets/logo.svg` 原始内容(渐变
      #F06925→#E55625→#C92626→#C62127,深蓝文字部分 rgb(29,56,100)),
      不是之前 Figma 导出的那份。
    - 导航 tab:默认色 #55575C;hover 背景 #FAFAFA;按下背景 #F1F1F1;
      选中态——文字色 #F26522 + 底部 2px 实色下划线(不是之前 Figma 版本
      的"浅橙背景 + 圆点"样式);"New" 徽标背景 #FF5449,文字 #F7F7F8,
      10px/14px,圆角 60px(这次是明确给出的真实数值,不再是占位)。
      源文件里明确写了"no focus treatment is defined"给 nav item,所以
      没有为 tab 加 focus-visible 样式,这是源文件本来的设计缺口,不是
      我漏做。
    - "More" 溢出菜单:白底,圆角 4px,阴影
      0 2px 4px rgba(132,132,132,.14), 0 4px 5px rgba(132,132,132,.11),
      0 1px 10px rgba(132,132,132,.2);菜单项高 48px,字号16/24 色
      #545454,hover #FAFAFA,按下 #F1F1F1。
    - Dealer Rewards Program:展开态是描边 #F26522、圆角 60px 的 pill,
      文字/图标色 #F26522,hover 背景 rgba(242,101,34,.06),按下
      rgba(242,101,34,.14);收缩态是 36×36 圆形图标按钮,描边 #D44D0C,
      hover 时下方弹出深色 tooltip(背景 #1C1D1F,文字 #F7F7F8)。
    - 通知铃铛 / 汉堡菜单:40×40 圆形按钮,hover 背景 #F5F5F5,按下
      #E0E0E0,focus-visible 描边 2px #7B61FF(这两个图标按钮源文件里是
      明确给了 focus 样式的,和 nav tab 不同)。
    - 用户信息:头像 32×32 圆形,背景 #F26522,文字白色;展开态额外显示
      姓名(14px,#55575C)+ 公司(12px,#55575C);收缩态只剩头像。
    - 响应式收缩逻辑直接照搬源文件 `layout()` 函数的算法:先量
      导航区右边缘和右侧区左边缘的间距,≤15px 时依次触发
      "Rewards 转图标" → "姓名收起" → "至少 2 个 nav 项挪进 More" →
      继续逐个把最后的 nav 项挪进 More,直到间距 > 15px 或只剩 1 个
      nav 项。容器宽度 < 980px 时额外应用 "md" 断点(logo 左边距
      24→16,导航 gap 24→16)。
  status: >
    用户已明确要求"remove nav 6 and 7",源文件原本的 NAV 列表有 7 项
    (Marketplace / My ACV / Market Report / ACV Capital / ACV
    Transport+New / Nav 6 / Nav 7),这里按要求只保留前 5 项,"Nav 6"、
    "Nav 7" 这两个占位项已经删除,不是遗漏。
    SidebarNav 的展开/收起交互按你的说明已不再需要,这里不涉及,仅记录
    这一决定発生在同一轮对话里。

    【2026-08 按你的要求新增:My ACV 旁边的 New 红点】对照 Figma 节点
    7432:69595 的截图,"My ACV" tab 文字右上角有一个纯色小红点(不带
    文字,和 "ACV Transport" 那个写着 "New" 字样的文字徽标是两种不同的
    东西)。get_design_context 返回的这颗按钮的 Code Connect props 里
    对应这个点的属性名被截断/乱码了(拿到的是一段不完整的
    `="107:37970"`,看不出真实属性名),没能拿到这颗点的精确像素数值
    (直径/间距/位置),这里是按截图肉眼估的一个小圆点,不是像素级核实,
    待确认。新增 `hasNewOffers` prop,只在 "My ACV" 这一项、且为
    true 时显示;是否显示由外层(OfferDashboard)算出"当前是否有任何
    New 状态的 deal"来决定,这个组件本身不知道 deal 数据。
  ═══════════════════════════════════════════════════════════
-->
<template>
  <header ref="barRef" class="app-header" :class="{ 'app-header--md': isMd }">
    <div class="app-header__logo">
      <!-- 来自 Claude Design 项目 assets/logo.svg 的原始内容 -->
      <svg viewBox="0 0 100 50" width="82" height="41" role="img" aria-label="ACV Auctions">
        <defs>
          <linearGradient id="ah_acvGrad" gradientUnits="userSpaceOnUse" x1="5" y1="44" x2="96" y2="3">
            <stop offset="0.0632" stop-color="#F06925"/>
            <stop offset="0.3294" stop-color="#E55625"/>
            <stop offset="0.8619" stop-color="#C92626"/>
            <stop offset="0.9220" stop-color="#C62127"/>
          </linearGradient>
        </defs>
        <g fill="url(#ah_acvGrad)" fill-rule="nonzero">
          <path transform="translate(38.76 8.368)" d="M 13.884 21.141 C 10.471 21.141 8.051 18.319 8.478 14.838 C 8.906 11.357 12.02 8.535 15.433 8.535 C 17.398 8.535 19.033 9.472 19.986 10.93 L 26.222 4.521 C 23.937 1.735 20.457 0 16.367 0 C 8.391 0 1.115 6.595 0.115 14.73 C -0.885 22.865 4.77 29.46 12.746 29.46 C 16.853 29.46 20.773 27.709 23.747 24.902 L 18.221 19.515 C 17.001 20.525 15.476 21.142 13.882 21.142 L 13.884 21.141 Z"/>
          <path transform="translate(63.852 3)" d="M 20.849 0 L 32.057 0 L 11.208 33.535 L 0 33.535 L 20.849 0 Z"/>
          <path transform="translate(23.759 11.046)" d="M 14.055 14.018 C 14.051 13.336 14.091 12.645 14.176 11.945 C 14.287 11.041 14.473 10.147 14.728 9.275 L 13.478 0 L 6.342 11.482 L 6.916 15.722 L 3.691 15.722 L 0 21.674 L 7.717 21.674 L 8.23 25.49 L 16.915 25.49 L 16.453 22.069 C 14.865 19.755 14.04 16.984 14.056 14.019 L 14.055 14.018 Z"/>
          <path transform="translate(5 9.67)" d="M 20.849 0 L 32.057 0 L 11.208 33.535 L 0 33.535 L 20.849 0 Z"/>
          <path transform="translate(61.281 9.67)" d="M 7.578 0 L 1.204 0 C 2.576 0.799 3.811 1.902 4.955 3.217 L 0 8.299 L 2.336 25.623 L 9.472 14.147 L 7.577 0 L 7.578 0 Z"/>
        </g>
        <g fill="rgb(29,56,100)" fill-rule="nonzero">
          <path transform="translate(18.364 39.204)" d="M 6.715 8.28 L 6.555 7.026 L 3.128 7.026 L 2.421 8.28 L 0 8.28 L 4.941 0 L 7.622 0 L 8.925 8.28 L 6.715 8.28 Z M 5.983 1.801 L 4.084 5.227 L 6.393 5.227 L 5.984 1.801 L 5.983 1.801 Z"/>
          <path transform="translate(28.058 39.205)" d="M 0 5.475 C 0 5.338 0.037 4.928 0.124 4.556 L 1.129 0 L 3.301 0 L 2.271 4.643 C 2.222 4.866 2.196 5.077 2.196 5.238 C 2.209 5.958 2.681 6.566 3.711 6.566 C 4.804 6.566 5.349 5.846 5.561 4.878 L 6.641 0 L 8.814 0 L 7.721 4.915 C 7.286 6.926 6.219 8.428 3.575 8.428 C 1.205 8.428 0 7.212 0 5.474 L 0 5.475 Z"/>
          <path transform="translate(36.908 39.067)" d="M 4.892 0 C 7.126 0 8.293 1.254 8.727 2.545 L 6.666 3.215 C 6.431 2.383 5.711 1.886 4.792 1.886 C 3.352 1.886 2.222 3.14 2.222 4.667 C 2.222 5.785 3.029 6.678 4.32 6.678 C 4.99 6.678 5.747 6.281 6.12 5.722 L 7.783 6.815 C 6.79 8.167 5.3 8.565 4.195 8.565 C 1.862 8.565 0 7.112 0 4.804 C 0 1.912 2.235 0 4.891 0 L 4.892 0 Z"/>
          <path transform="translate(45.971 39.205)" d="M 0.918 8.279 L 2.321 1.862 L 0 1.862 L 0.422 0 L 7.187 0 L 6.777 1.862 L 4.456 1.862 L 3.054 8.279 L 0.919 8.279 L 0.918 8.279 Z"/>
          <path transform="translate(52.351 39.204)" d="M 0 8.28 L 1.825 0 L 3.959 0 L 2.135 8.28 L 0 8.28 Z"/>
          <path transform="translate(56.348 39.067)" d="M 4.891 0 C 7.262 0 9.086 1.49 9.086 3.736 C 9.086 6.417 7.001 8.565 4.195 8.565 C 1.825 8.565 0 7.076 0 4.805 C 0 2.135 2.085 0.001 4.891 0.001 L 4.891 0 Z M 4.766 1.887 C 3.314 1.887 2.221 3.141 2.221 4.668 C 2.221 5.873 3.09 6.679 4.319 6.679 C 5.772 6.679 6.864 5.425 6.864 3.898 C 6.864 2.694 5.995 1.887 4.766 1.887 Z"/>
          <path transform="translate(65.485 39.204)" d="M 5.635 8.28 L 3.289 3.016 L 2.135 8.28 L 0 8.28 L 1.825 0 L 4.022 0 L 6.268 5.027 L 7.373 0 L 9.52 0 L 7.695 8.28 L 5.635 8.28 Z"/>
          <path transform="translate(74.473 39.081)" d="M 1.277 5.474 C 1.873 6.231 2.99 6.727 4.095 6.727 C 4.803 6.727 5.076 6.367 5.076 6.045 C 5.076 5.647 4.555 5.424 3.835 5.175 C 2.681 4.778 1.117 4.22 1.117 2.606 C 1.117 1.427 2.272 0 4.469 0 C 5.81 0 7.101 0.484 7.933 1.365 L 6.655 2.83 C 6.046 2.135 5.004 1.8 4.221 1.8 C 3.65 1.8 3.327 2.098 3.327 2.433 C 3.327 2.793 3.861 3.016 4.556 3.265 C 5.735 3.65 7.312 4.257 7.312 5.76 C 7.312 7.263 6.045 8.553 3.947 8.553 C 2.259 8.553 0.769 7.92 0 6.976 L 1.278 5.475 L 1.277 5.474 Z"/>
        </g>
      </svg>
    </div>

    <nav ref="ltRef" class="app-header__tabs">
      <button
        v-for="(item, i) in visibleItems"
        :key="i"
        type="button"
        class="app-header__tab"
        :class="{ 'app-header__tab--selected': i === selectedIndex }"
        @click="selectedIndex = i"
      >
        {{ item.label }}
        <span v-if="item.badge" class="app-header__tab-badge">{{ item.badge }}</span>
        <span v-if="item.label === 'My ACV' && hasNewOffers" class="app-header__tab-dot" aria-hidden="true" />
      </button>

      <div v-if="hiddenItems.length" class="app-header__more-wrap">
        <button type="button" class="app-header__tab" @click="menuOpen = !menuOpen">
          More
          <span class="app-header__chevron">
            <svg viewBox="0 0 24 24" fill="none"><path d="M6.5 9.5L12 15l5.5-5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
        </button>
        <div v-if="menuOpen" class="app-header__menu">
          <button
            v-for="(item, j) in hiddenItems"
            :key="j"
            type="button"
            @click="selectItemFromMenu(item)"
          >
            {{ item.label }}
          </button>
        </div>
      </div>
    </nav>

    <div ref="rtRef" class="app-header__right">
      <button v-if="!rewardsCollapsed" type="button" class="app-header__rewards">
        <span class="app-header__rewards-icon" v-html="ICONS.trophy" />
        {{ rewardsLabel }}
      </button>
      <button v-else type="button" class="app-header__rewards-icon-btn" aria-label="Dealer Rewards Program">
        <span v-html="ICONS.trophy" />
        <span class="app-header__tooltip">{{ rewardsLabel }}</span>
      </button>

      <button type="button" class="app-header__icon-btn" aria-label="Notifications" v-html="ICONS.bell" />

      <div v-if="!nameCollapsed" class="app-header__profile">
        <div class="app-header__avatar">{{ avatarLetter }}</div>
        <div class="app-header__profile-text">
          <div class="app-header__username">{{ userName }}</div>
          <div class="app-header__company">{{ companyName }}</div>
        </div>
      </div>
      <div v-else class="app-header__avatar">{{ avatarLetter }}</div>

      <button type="button" class="app-header__icon-btn" aria-label="Menu" v-html="ICONS.burger" />
    </div>
  </header>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  companyName: { type: String, default: 'Magnacar Auto Corp' },
  userName: { type: String, default: 'Emily Huang' },
  avatarLetter: { type: String, default: 'A' },
  rewardsLabel: { type: String, default: 'Dealer Rewards Program' },
  // 初始选中的 nav 项下标(0-4),源文件里叫 selected,点击后会在组件内部改变
  initialSelectedIndex: { type: [Number, String], default: 0 },
  // 2026-08 按你的要求新增,对照节点 7432:69595 核实:"My ACV" 旁边是否
  // 显示 New 红点,由外层根据"当前是否有 New 状态的 deal"传入
  hasNewOffers: { type: Boolean, default: false }
})

// Nav 6 / Nav 7 已按要求移除,只保留这 5 项(与源卡片一致)
const NAV = [
  { label: 'Marketplace' },
  { label: 'My ACV' },
  { label: 'Market Report' },
  { label: 'ACV Capital' },
  { label: 'ACV Transport', badge: 'New' }
]

const ICONS = {
  trophy: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4h10v2h3v3a4 4 0 01-3.2 3.9A5 5 0 0113 16.9V19h3v2H8v-2h3v-2.1a5 5 0 01-3.8-4A4 4 0 014 9V6h3V4zm0 4H6v1a2 2 0 001 1.7V8zm10 0v2.7A2 2 0 0018 9V8h-1z"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 4a5 5 0 015 5v4l1.5 2.5H5.5L7 13V9a5 5 0 015-5zM10 19h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  burger: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'
}

const selectedIndex = ref(Number(props.initialSelectedIndex))
const menuOpen = ref(false)
const hiddenCount = ref(0)
const rewardsCollapsed = ref(false)
const nameCollapsed = ref(false)
const isMd = ref(false)

const visibleItems = computed(() => NAV.slice(0, NAV.length - hiddenCount.value))
const hiddenItems = computed(() => NAV.slice(NAV.length - hiddenCount.value))

function selectItemFromMenu(item) {
  selectedIndex.value = NAV.indexOf(item)
  menuOpen.value = false
}

const barRef = ref(null)
const ltRef = ref(null)
const rtRef = ref(null)
let resizeObserver = null

function gap() {
  if (!ltRef.value || !rtRef.value) return 999
  return rtRef.value.getBoundingClientRect().left - ltRef.value.getBoundingClientRect().right
}

// 直接照搬源文件的 layout() 收缩算法:每改一次状态就等 DOM 更新完再重新量一次间距
async function layout() {
  hiddenCount.value = 0
  rewardsCollapsed.value = false
  nameCollapsed.value = false
  await nextTick()

  if (gap() <= 15) {
    rewardsCollapsed.value = true
    await nextTick()
  }
  if (gap() <= 15) {
    nameCollapsed.value = true
    await nextTick()
  }
  if (gap() <= 15) {
    hiddenCount.value = 2
    await nextTick()
  }
  while (gap() <= 15 && NAV.length - hiddenCount.value > 1) {
    hiddenCount.value++
    await nextTick()
  }

  if (barRef.value) {
    isMd.value = barRef.value.clientWidth < 980
  }
}

function onClickOutside(e) {
  if (menuOpen.value && !e.target.closest('.app-header__more-wrap')) {
    menuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
  resizeObserver = new ResizeObserver(() => layout())
  if (barRef.value) resizeObserver.observe(barRef.value)
  layout()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
  if (resizeObserver) resizeObserver.disconnect()
})
</script>

<style scoped>
.app-header {
  position: relative;
  height: 58px;
  background: #FFFFFF;
  border-bottom: 1px solid #D1D3D6;
  display: flex;
  align-items: stretch;
  overflow: visible;
  font-family: 'Roboto', sans-serif;
  box-sizing: border-box;
  resize: horizontal;
  min-width: 420px;
  max-width: 100%;
}

.app-header__logo {
  display: flex;
  align-items: center;
  padding-left: 24px;
  flex-shrink: 0;
}
.app-header--md .app-header__logo { padding-left: 16px; }
.app-header__logo svg { display: block; height: 41px; width: 82px; }

.app-header__tabs {
  display: flex;
  align-items: stretch;
  gap: 24px;
  margin-left: 24px;
  min-width: 0;
}
.app-header--md .app-header__tabs { gap: 16px; margin-left: 16px; }

.app-header__tab {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 4px;
  border: 0;
  background: transparent;
  font: 400 16px/24px 'Roboto', sans-serif;
  color: #55575C;
  cursor: pointer;
  white-space: nowrap;
  border-bottom: 2px solid transparent;
}
.app-header__tab:hover { background: #FAFAFA; }
.app-header__tab:active { background: #F1F1F1; }
.app-header__tab--selected {
  color: #F26522;
  border-bottom-color: #F26522;
}

.app-header__tab-badge {
  display: inline-grid;
  place-items: center;
  padding: 1px 5px;
  border-radius: 60px;
  background: #FF5449;
  color: #F7F7F8;
  font-size: 10px;
  line-height: 14px;
}

/* 2026-08 按你的要求新增,对照节点 7432:69595 截图估的小红点(不是像素
   级核实,细节见 METADATA):纯圆点,不带文字,和上面 .app-header__tab-badge
   那个"New"文字徽标是两种不同的东西,不复用同一个 class */
.app-header__tab-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #FF5449;
  margin-left: 4px;
  vertical-align: top;
  position: relative;
  top: 2px;
}

.app-header__chevron {
  width: 18px;
  height: 18px;
}
.app-header__chevron svg { display: block; width: 100%; height: 100%; }

.app-header__more-wrap {
  position: relative;
  display: flex;
  align-items: stretch;
}

.app-header__menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 244px;
  background: #FFFFFF;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(132, 132, 132, .14), 0 4px 5px rgba(132, 132, 132, .11), 0 1px 10px rgba(132, 132, 132, .2);
  z-index: 20;
  padding: 4px 0;
}
.app-header__menu button {
  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
  padding: 0 20px;
  border: 0;
  background: transparent;
  font: 400 16px/24px 'Roboto', sans-serif;
  color: #545454;
  cursor: pointer;
  text-align: left;
}
.app-header__menu button:hover { background: #FAFAFA; }
.app-header__menu button:active { background: #F1F1F1; }

.app-header__right {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  padding-right: 16px;
  flex-shrink: 0;
}

.app-header__rewards {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 14px;
  border: 1px solid #F26522;
  border-radius: 60px;
  background: transparent;
  color: #F26522;
  font: 500 14px/20px 'Roboto', sans-serif;
  cursor: pointer;
  white-space: nowrap;
}
.app-header__rewards:hover { background: rgba(242, 101, 34, .06); }
.app-header__rewards:active { background: rgba(242, 101, 34, .14); }
.app-header__rewards-icon { width: 18px; height: 18px; }
.app-header__rewards-icon :deep(svg) { display: block; width: 100%; height: 100%; }

.app-header__rewards-icon-btn {
  position: relative;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid #D44D0C;
  border-radius: 50%;
  background: transparent;
  color: #F26522;
  cursor: pointer;
  padding: 0;
}
.app-header__rewards-icon-btn:hover { background: rgba(212, 77, 12, .06); }
.app-header__rewards-icon-btn :deep(svg) { display: block; width: 20px; height: 20px; }

.app-header__tooltip {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 10px;
  border-radius: 4px;
  background: #1C1D1F;
  color: #F7F7F8;
  font: 400 12px/16px 'Roboto', sans-serif;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity .1s ease;
}
.app-header__rewards-icon-btn:hover .app-header__tooltip,
.app-header__rewards-icon-btn:focus-visible .app-header__tooltip {
  opacity: 1;
}

.app-header__icon-btn {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 0;
  background: transparent;
  border-radius: 50%;
  color: #212121;
  cursor: pointer;
  padding: 0;
}
.app-header__icon-btn:hover { background: #F5F5F5; }
.app-header__icon-btn:active { background: #E0E0E0; }
.app-header__icon-btn:focus-visible { outline: 2px solid #7B61FF; outline-offset: -2px; }
.app-header__icon-btn :deep(svg) { display: block; width: 22px; height: 22px; }

.app-header__profile {
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-header__avatar {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #F26522;
  color: #FFFFFF;
  font: 500 14px/20px 'Roboto', sans-serif;
  flex-shrink: 0;
}

.app-header__profile-text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
  white-space: nowrap;
}
.app-header__username { font-size: 14px; color: #55575C; }
.app-header__company { font-size: 12px; color: #55575C; }
</style>
