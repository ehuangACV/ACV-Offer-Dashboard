<!--
  ═══════════════════════════════════════════════════════════
  METADATA
  name: Remove From List Dialog
  group: 共用组件 (Shared Components)
  order: 25
  description: >
    点 OfferCard/OfferTableRow 上 "Remove From List" 按钮(只在 Declined/
    Expired 这两个关闭状态出现)弹出的二次确认弹窗——"Yes, Remove" 才真的
    从列表里移除,"No, Keep It" 或右上角 × 都是取消,列表不变。
  path: fragments/RemoveFromListDialog/RemoveFromListDialog.vue
  source_of_truth: >
    Figma 文件 "Offers - Negotiation"(fileKey 4z7FK34Fgit7Fi9UxZu0za),
    节点 1:31040("Dialog")。get_design_context 核实:
    - 容器 560×188(高度是内容撑出来的,不是固定值)、白底、圆角16px、
      三层阴影(Shadow Elevation/24-dp-shadow:
      0 11px 15px rgba(132,132,132,.2)、0 9px 46px rgba(132,132,132,.12)、
      0 24px 38px rgba(132,132,132,.14))——这三个数值和
      InformationDialog/OfferTableHeader 的说明弹层用的是同一个 Figma
      阴影 token,数值上完全一致,不是巧合凑出来的。
    - Header 高度54px,标题"Remove From List?" Roboto Medium 20px/30px
      letter-spacing .15px 颜色 #212121(这个节点标注的是
      Global/text/primary,不是 InformationDialog 标题用的 #0E0E0F——
      两个是不同节点各自核实到的颜色,没有强行统一);右上角 24×24 的
      Navigation/close 关闭图标。
    - Body:padding-top 16px,左右 24px;正文"You will no longer see this
      auction in your list." Roboto Medium 16px/24px letter-spacing .15px
      颜色 #545454。
    - Footer:padding 24px,gap 8px,右对齐。"No, Keep It" 是
      style=tertiary 的文字按钮(Secondary Action,102×34);"Yes, Remove"
      是 style=destructive 的红色实心按钮(Primary Action,114×46,颜色
      Global/status/error/dark #BA1A1A)。
  status: >
    关闭图标复用了 InformationDialog 已有的同一个 "M6 6l12 12M18 6L6 18"
    描边 X 路径(viewBox 0 0 24 24),只是这里尺寸是 24×24(Figma 这个
    节点标注的图标容器尺寸),不是 InformationDialog 的 20×20——两处
    图形完全一样,只有尺寸不同。

    "No, Keep It" 的文字颜色没有用 Figma 给的 token
    Global/text/link-on-light(#004E7D),改用了本项目其它链接/文字按钮
    (View Report、Close 等)已经统一核实/覆盖过的 #0061A5——这是延续
    本项目一贯的做法(之前多处都遇到过同样的 Figma token vs 项目实际
    链接色不一致,选择跟着项目已有颜色走,不是重新核实出的 Figma 数值),
    不是这次新做的决定。

    背板(overlay)没有用 Figma 这个节点本身的样式(这个节点截出来的画布
    只有卡片本身,没有背板参考),直接复用了 InformationDialog 当前的
    黑色 50% 透明背板(`rgba(0,0,0,0.5)`)+ 居中 + `overflow-y:auto` 的
    同一套机制,保持全站弹窗背板视觉一致,不是分别核实出两套不同的背板
    数值。

    2026-09-15 新增 mobile 版:你截图反馈手机上这个弹窗还是桌面那张
    560px 宽的居中卡片硬套在窄屏里,文字换行、"Yes, Remove" 按钮被顶出
    卡片右边界。这个组件之前完全没做过 mobile 适配(`OfferCard.vue` 调用
    时也没传任何 mobile 相关的 prop),不是"适配错了",是压根没适配过。

    新增 `mobile` prop(默认 false,不传就是原来桌面的样子),同
    `InformationDialog` 已经在用的同一个约定——`OfferCard.vue` 跟着传
    `:mobile="mobileActions"`(和它传给 `InformationDialog` 的是同一个
    变量)。`mobile=true` 时不是简单把桌面卡片等比缩小,是换成手机上更
    常见的"底部弹出面板"(bottom sheet):背板不变(同一个黑色50%透明
    背板),卡片本身贴在屏幕底部(不再居中),撑满屏幕宽度(不再是固定
    560px),只有顶部两个角保留圆角,顶部加了一条常见的拖拽提示条
    (纯装饰,不是真的可以拖拽关闭,只是视觉上提示"这是个可以从底部滑出
    的面板")。两个按钮从桌面"次要文字按钮+主要实心按钮并排靠右"改成
    上下堆叠、撑满宽度——手机上并排放两个按钮容易点错,堆叠撑满更符合
    大拇指操作习惯;顺序是"Yes, Remove"(红色实心,强调操作)在上,
    "No, Keep It"(文字按钮)在下,这是我的判断,不是照抄哪个 Figma
    节点(这个组件本身没有对应的 mobile Figma 节点,按你确认过的方向做的
    合理设计)。DOM 顺序没有变(还是先 keep-btn 后 remove-btn,和桌面版
    共用同一段 markup),视觉顺序靠 `flex-direction: column-reverse`
    翻转,不是复制一份倒序的 markup。

    2026-09-15(第二次)你反馈 Playground 里 Mobile view 模拟框内打开时,
    这个面板宽度不对——铺满的是真实浏览器窗口的宽度,不是模拟框(比如
    390px)那个窄宽度,背板也盖住了整个真实页面(包括右边的 Controls
    面板)。根因和 InformationDialog 之前踩过的一模一样:背板是
    `position:fixed`+Teleport 到 body,天然是相对"真实浏览器视口"铺满
    的,不知道 Playground 只是在页面中间画了一个盒子模拟"这是个手机屏幕"
    ——`inset:0` 只会铺满真正的浏览器窗口,不会自动收缩进模拟框里。

    修法完全照抄 `InformationDialog.vue` 已经验证过的同一套机制,不是
    重新发明:`inject('mobileDeviceFrameEl', null)` 拿到 Harness 在渲染
    Mobile view 模拟框时才会 provide 的真实 DOM 节点(生产环境/这个组件
    自己的 Playground 页面拿到的都是 null,不受影响),用
    `getBoundingClientRect()` 量出模拟框在屏幕上的真实位置,换算成
    `top/left/width/height` 四个具体数值(不是 `inset:0`)当 inline style
    绑给背板——弹层因此贴合的是模拟框的真实屏幕位置,不是整个浏览器
    视口。窗口 resize、每次重新打开(`modelValue` 变成 true)都会重新
    量一次,同 InformationDialog 一样。
  ═══════════════════════════════════════════════════════════
-->
<template>
  <Teleport to="body" :disabled="inline">
    <div
      v-if="modelValue"
      :class="inline ? 'remove-list-dialog-inline-shell' : ['remove-list-dialog-overlay', { 'remove-list-dialog-overlay--mobile': mobile }]"
      :style="inline ? null : mobileOverlayStyle"
      @click.self="handleOverlayClick"
    >
      <div class="remove-list-dialog" :class="{ 'remove-list-dialog--mobile': mobile }" role="dialog" aria-label="Remove From List">
        <div v-if="mobile" class="remove-list-dialog__drag-handle" />
        <div class="remove-list-dialog__header">
          <span class="remove-list-dialog__title">Remove From List?</span>
          <button type="button" class="remove-list-dialog__close" aria-label="Close" @click="handleClose">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <div class="remove-list-dialog__body">
          <p class="remove-list-dialog__desc">You will no longer see this auction in your list.</p>
        </div>
        <div class="remove-list-dialog__footer" :class="{ 'remove-list-dialog__footer--mobile': mobile }">
          <button type="button" class="remove-list-dialog__keep-btn" @click="handleKeep">No, Keep It</button>
          <button type="button" class="remove-list-dialog__remove-btn" @click="handleRemove">Yes, Remove</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { inject, ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  // 2026-09 Playground 专用:同 InformationDialog 的 inline,原地渲染不用
  // 黑背板,方便这个组件自己的 Playground 页面能点到 Controls 面板。真实
  // 用法(OfferCard/OfferTableRow 点 Remove From List 打开)不传这个 prop。
  inline: { type: Boolean, default: false },
  // 2026-09-15 新增,同 InformationDialog 已有的同一个约定:默认 false,
  // 不传就是原来桌面居中卡片的样子。true 时换成底部弹出面板(bottom
  // sheet),细节和取舍见文件头 METADATA。
  mobile: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue', 'close', 'keep', 'remove'])

// 2026-09-15(第二次)照抄 InformationDialog.vue 已经验证过的同一套机制,
// 让背板贴合 Playground Mobile view 模拟框的真实屏幕位置,不是铺满整个
// 真实浏览器视口——细节见文件头 METADATA。inject 到的默认值是 null(生产
// 环境、这个组件自己的 Playground 页面都是这样),那种情况下走
// mobileOverlayStyle 下面"铺满真实视口"这条分支,行为和没做这次改动一样。
const mobileDeviceFrameEl = inject('mobileDeviceFrameEl', null)
const mobileOverlayRect = ref(null)
function updateMobileOverlayRect() {
  var el = mobileDeviceFrameEl && mobileDeviceFrameEl.value
  if (!props.mobile || props.inline || !el) {
    mobileOverlayRect.value = null
    return
  }
  var r = el.getBoundingClientRect()
  mobileOverlayRect.value = { top: r.top, left: r.left, width: r.width, height: r.height }
}
const mobileOverlayStyle = computed(() => {
  if (mobileOverlayRect.value) {
    var r = mobileOverlayRect.value
    return { position: 'fixed', top: r.top + 'px', left: r.left + 'px', width: r.width + 'px', height: r.height + 'px' }
  }
  return { position: 'fixed', top: '0', left: '0', right: '0', bottom: '0' }
})
onMounted(() => {
  window.addEventListener('resize', updateMobileOverlayRect)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateMobileOverlayRect)
})
watch(() => props.modelValue, (open) => {
  if (open) nextTick(updateMobileOverlayRect)
})

function handleClose() {
  emit('update:modelValue', false)
  emit('close')
}
function handleOverlayClick() {
  if (!props.inline) handleClose()
}
function handleKeep() {
  emit('update:modelValue', false)
  emit('keep')
}
function handleRemove() {
  emit('update:modelValue', false)
  emit('remove')
}
</script>

<style scoped>
.remove-list-dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  padding: 40px 16px;
  box-sizing: border-box;
  z-index: 1000;
}

/* mobile 时背板不再把卡片居中,改成贴底(align-items:flex-end),
   padding 也清零——卡片自己撑满屏幕宽度、贴屏幕底边,不需要背板留白。 */
.remove-list-dialog-overlay--mobile {
  align-items: flex-end;
  padding: 0;
}

.remove-list-dialog-inline-shell {
  display: flex;
  justify-content: center;
  padding: 24px 0;
}

.remove-list-dialog {
  display: flex;
  flex-direction: column;
  width: 560px;
  flex-shrink: 0;
  border-radius: 16px;
  background: #FFFFFF;
  box-shadow: 0 11px 15px rgba(132, 132, 132, 0.2), 0 9px 46px rgba(132, 132, 132, 0.12), 0 24px 38px rgba(132, 132, 132, 0.14);
  font-family: 'Roboto', sans-serif;
  box-sizing: border-box;
}

/* mobile:不再是固定560px的居中卡片,改成撑满宽度、贴底的面板,只有
   顶部两个角保留圆角(常见的 bottom sheet 样式)。 */
.remove-list-dialog--mobile {
  width: 100%;
  max-width: 100%;
  border-radius: 16px 16px 0 0;
}

.remove-list-dialog__drag-handle {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: #DCDFE8;
  margin: 10px auto 0;
  flex-shrink: 0;
}

.remove-list-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 54px;
  padding: 0 24px;
  box-sizing: border-box;
}

.remove-list-dialog__title {
  font-size: 20px;
  font-weight: 500;
  line-height: 30px;
  letter-spacing: 0.15px;
  color: #212121;
}

.remove-list-dialog__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: none;
  color: #212121;
  cursor: pointer;
}

.remove-list-dialog__body {
  padding: 16px 24px 0;
}

.remove-list-dialog__desc {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: #545454;
}

.remove-list-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 24px;
}

.remove-list-dialog__keep-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  padding: 0 16px;
  border: none;
  background: none;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.1px;
  color: #0061A5;
  white-space: nowrap;
  cursor: pointer;
}

.remove-list-dialog__remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 46px;
  padding: 0 20px;
  border: none;
  border-radius: 100px;
  background: #BA1A1A;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.1px;
  color: #FFFFFF;
  white-space: nowrap;
  cursor: pointer;
}

/* mobile:两个按钮从"并排靠右"改成"上下堆叠、撑满宽度"——手机上并排放
   两个按钮容易点错,堆叠撑满更符合大拇指操作习惯。DOM 顺序没有变(还是
   先 keep-btn 后 remove-btn),用 column-reverse 把 remove-btn 翻到视觉
   上的第一个(上面),keep-btn 翻到第二个(下面),不用复制一份倒序的
   markup。 */
.remove-list-dialog__footer--mobile {
  flex-direction: column-reverse;
  align-items: stretch;
  gap: 8px;
  padding: 12px 20px 24px;
}
.remove-list-dialog__footer--mobile .remove-list-dialog__keep-btn {
  width: 100%;
  height: 44px;
}
.remove-list-dialog__footer--mobile .remove-list-dialog__remove-btn {
  width: 100%;
  height: 48px;
}
</style>
