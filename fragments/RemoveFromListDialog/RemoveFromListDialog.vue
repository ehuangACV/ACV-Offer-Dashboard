<!--
  ═══════════════════════════════════════════════════════════
  METADATA
  name: Remove From List Dialog
  group: 卡片视图 (Card View)
  order: 43
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
  ═══════════════════════════════════════════════════════════
-->
<template>
  <Teleport to="body" :disabled="inline">
    <div v-if="modelValue" :class="inline ? 'remove-list-dialog-inline-shell' : 'remove-list-dialog-overlay'" @click.self="handleOverlayClick">
      <div class="remove-list-dialog" role="dialog" aria-label="Remove From List">
        <div class="remove-list-dialog__header">
          <span class="remove-list-dialog__title">Remove From List?</span>
          <button type="button" class="remove-list-dialog__close" aria-label="Close" @click="handleClose">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <div class="remove-list-dialog__body">
          <p class="remove-list-dialog__desc">You will no longer see this auction in your list.</p>
        </div>
        <div class="remove-list-dialog__footer">
          <button type="button" class="remove-list-dialog__keep-btn" @click="handleKeep">No, Keep It</button>
          <button type="button" class="remove-list-dialog__remove-btn" @click="handleRemove">Yes, Remove</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  // 2026-09 Playground 专用:同 InformationDialog 的 inline,原地渲染不用
  // 黑背板,方便这个组件自己的 Playground 页面能点到 Controls 面板。真实
  // 用法(OfferCard/OfferTableRow 点 Remove From List 打开)不传这个 prop。
  inline: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue', 'close', 'keep', 'remove'])

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
</style>
