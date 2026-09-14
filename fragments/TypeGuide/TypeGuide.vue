<!--
  ═══════════════════════════════════════════════════════════
  METADATA (Playground 读取用,不是最终页面渲染的一部分)
  name: Type Guide
  group: Shared Components
  order: 27
  description: >
    "Type" 说明弹层——点开 In Negotiation/Make Offer 徽标旁边的 info
    图标会弹出的那张卡片,解释这两种 offer 类型各自的时限/能做什么。
  path: fragments/TypeGuide/TypeGuide.vue
  source_of_truth: >
    【2026-09-14 从 InformationDialog.vue 和 OfferTableHeader.vue 里
    抽出来的共用组件】这张卡片之前在这两个文件里各自复制了一份几乎
    一字不差的 markup/CSS/交互逻辑(背景#F5FBFF圆角16px三层阴影、标题
    "Type"、两段 OfferTypeBadge+文案、点外部/Escape 关闭这套惯例)——
    你要求给它单独建一个 Shared Components 下的组件页面,顺手把这份
    重复代码合并成一个真正复用的组件,不是又复制一份出来。

    这次顺带修了一个真实bug:之前(在 InformationDialog.vue 里)这张
    卡片是嵌套渲染在 `<ImageBadge>` 内部的,`ImageBadge` 自己的根元素给
    自己设了 `white-space:nowrap`(给一个短文字的徽标 pill 这么设很
    合理),但 `white-space` 会被子孙元素继承,这张卡片作为徽标的后代,
    不知不觉也继承到了 nowrap,里面的文字段落因此永远按"一行放完"渲染,
    超出卡片右边界(细节和踩坑记录见 InformationDialog/notes.md)。这个
    组件自己的根元素显式加了 `white-space:normal`,把继承链在这里截断
    重置,不管以后被嵌套在什么元素里面,文字都会正常换行,不会重新踩到
    同一个坑。

    **接口设计**:这张卡片本身没有"开/关"状态——是否显示由调用方的
    `v-if` 控制(和调用方原来的用法一样,不是这次新加的行为)。"点外部
    关闭 + Escape 关闭"这套之前在两个文件里各自复制了一份的监听器逻辑,
    这次整个搬进了这个组件自己的 onMounted/onBeforeUnmount 里,调用方
    不用再自己写这段——组件需要知道"触发它出现的那个按钮"(点这个按钮
    不该被当成"点了外部"），所以新增了 `triggerEl` prop,调用方把自己
    的 info 按钮的模板 ref 传进来即可。

    位置(弹层相对触发按钮的 top/left 偏移)和箭头的左偏移,两个文件
    原来核实过的数值不完全一样(InformationDialog 是 `top:calc(100%+
    10px);left:0`+箭头左偏移12px;OfferTableHeader 是 `top:calc(100%+
    14px);left:-12px`+箭头左偏移20px)——这不是我瞎猜的,是两处分别真实
    核实过的数值,合并组件时不能强行统一成一个数、抹掉任何一处已核实的
    结果。做法:组件自己的默认值用 InformationDialog 那一套(`top:
    calc(100% + 10px); left:0`,箭头12px),`arrowLeft` 做成 prop 可以
    单独覆盖;外层的 top/left 偏移则让调用方直接在组件标签上写
    `style`(Vue 会自动把这个 style 和组件自己内部的 style 合并,内联
    style 的优先级本来就比组件自己 scoped CSS 里的类选择器高,不需要
    再多加 top/left 这两个专门的 prop),OfferTableHeader 那边用这个
    方式覆盖成它自己核实过的数值。

    2026-09-14 新增 `offerType` prop(可选,不传就是原来的行为):你反馈
    在 InformationDialog 里点开这个卡片时,只想看"这条具体offer对应的
    那一种"的说明(比如截图里是 In Negotiation 的offer,tooltip 却把
    In Negotiation 和 Make Offer 两段都列出来,多余)。但 OfferTableHeader
    这边是整个表格"Type"这一列的图例,不对应具体某一行,表里可能同时有
    两种类型的offer,不能只显示一种——所以不能把"只显示一种"做成默认
    行为,只能是"调用方明确告诉我这条offer是哪种类型,我才只显示对应
    那段;不告诉我(不传这个 prop),就还是两段都显示,当图例用"。
    InformationDialog 自己已经有 `offerType` prop(这条offer的真实类型),
    直接传下来即可;OfferTableHeader 没有对应具体offer的概念,不传,
    维持两段都显示。

    2026-09-14(第二次)新增 `hideTitle`/`hideBadge` 两个可选 prop(都
    默认 false,不传就是原来的样子):你要求 InformationDialog 这边把
    "Type"这个标题和 OfferTypeBadge 徽标都去掉——现在配合上面的
    `offerType`,InformationDialog 已经只显示这条offer对应的那一段了,
    这一段里再重复画一个"In Negotiation"/"Make Offer"徽标 + 顶部再写一次
    "Type"标题,就是纯粹的重复信息(这条offer是什么类型,状态行的徽标
    已经显示过了)。OfferTableHeader 这边继续两段都显示、继续需要标题和
    徽标(标题说明"这是关于Type的说明",徽标区分两段各自对应哪一种),
    所以不传这两个 prop,维持原样。

    标题没有直接整个删掉 `<span>`(会导致 `.type-guide__head` 从两个
    flex子项变成一个,`justify-content:space-between` 就会把关闭按钮
    顶到左边去,布局跟着跳动)——做法是保留这个 `<span>` 占位,只是
    `hideTitle` 时文字内容留空,关闭按钮始终还是靠右对齐,不用额外加
    CSS class 去切换 justify-content。

    2026-09-14(第三次)新增 `hideClose` 可选 prop(默认 false):你要求
    InformationDialog 这边把右上角关闭×图标也去掉——不影响能不能关闭,
    "Got it"按钮、点外部、按 Escape 这几种关闭方式都还在,只是不再多一个
    冗余的×图标。InformationDialog 现在 `hideTitle`+`hideBadge`+
    `hideClose` 三个都传 true,`.type-guide__head` 这一整行(标题+关闭
    按钮)在这种组合下完全没内容了——这次没有只藏按钮留一个空的头部行
    占位置(那样会在卡片顶部留一条没用的空白+多余的20px gap),而是加了
    `hasHead` computed(`!hideTitle || !hideClose`),两者都隐藏时连
    `.type-guide__head` 这个容器本身都不渲染,卡片直接从"Actions"文字
    那一段开始。如果以后只隐藏其中一个(比如只隐藏标题、保留关闭按钮),
    `.type-guide__head` 还是会渲染,关闭按钮照常靠右对齐,不受影响。
  ═══════════════════════════════════════════════════════════
-->
<template>
  <div class="type-guide">
    <div class="type-guide__arrow" :style="{ left: arrowLeft }" />
    <div v-if="hasHead" class="type-guide__head">
      <span class="type-guide__title">{{ hideTitle ? '' : 'Type' }}</span>
      <button v-if="!hideClose" type="button" class="type-guide__close" aria-label="Close" @click.stop="$emit('close')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#545454" stroke-width="1.7" stroke-linecap="round"/></svg>
      </button>
    </div>
    <div v-if="showInNegotiation" class="type-guide__section">
      <OfferTypeBadge v-if="!hideBadge" type="in-negotiation" label="In Negotiation" />
      <template v-if="isBuyer">
        <p class="type-guide__desc">(6h limit) You were the high bidder in the auction.</p>
        <p class="type-guide__desc"><strong>Actions:</strong> Accept or counter.</p>
      </template>
      <template v-else>
        <p class="type-guide__desc">(6h limit) High bidder from the auction.</p>
        <p class="type-guide__desc"><strong>Actions:</strong> Accept, Decline, or Counter.</p>
      </template>
    </div>
    <div v-if="showMakeOffer" class="type-guide__section">
      <OfferTypeBadge v-if="!hideBadge" type="make-offer" label="Make Offer" />
      <template v-if="isBuyer">
        <p class="type-guide__desc">(24h limit) You placed an offer on a vehicle that went unsold in it's previous run.</p>
        <p class="type-guide__desc"><strong>Actions:</strong> Chat with dealmakers at 1800-553-4070 Opt. 2</p>
      </template>
      <template v-else>
        <p class="type-guide__desc">(24h limit) Post-auction offer from any buyer.</p>
        <p class="type-guide__desc"><strong>Actions:</strong> Accept or Decline only.</p>
      </template>
    </div>
    <div class="type-guide__footer">
      <button type="button" class="type-guide__btn" @click.stop="$emit('close')">Got it</button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import OfferTypeBadge from '../OfferTypeBadge/OfferTypeBadge.vue'

const props = defineProps({
  viewerRole: { type: String, default: 'buyer' },
  // 弹层箭头(三角形)相对卡片左边缘的偏移,两处调用方核实过不同的值
  // (12px / 20px),细节见上面 METADATA。
  arrowLeft: { type: String, default: '12px' },
  // 触发这个弹层出现的按钮(调用方自己的 info 图标)——"点外部关闭"这条
  // 判断需要排除掉点这个按钮本身,不然按钮自己的 click 和这里的
  // mousedown 会抢跑,刚打开又立刻被判定成"点了外部"关掉。
  triggerEl: { type: [Object, null], default: null },
  // 可选:调用方明确知道"这次是哪一种offer"时传进来,只显示对应那一段
  // (比如 InformationDialog 对应一条具体offer)。不传(默认)就还是两段
  // 都显示,当图例用(比如 OfferTableHeader,不对应具体某一行)。
  offerType: { type: String, default: null },
  // 可选,两个都默认 false(不影响原有行为)。InformationDialog 配合上面
  // 的 offerType 只显示一段之后,这一段里的"Type"标题+OfferTypeBadge就是
  // 重复信息(这条offer是什么类型,状态行的徽标已经显示过了),所以传
  // true 隐藏。OfferTableHeader 继续两段都显示,标题/徽标都还需要,不传。
  hideTitle: { type: Boolean, default: false },
  hideBadge: { type: Boolean, default: false },
  // 可选,默认 false。InformationDialog 那边"Got it"/点外部/Escape 都能
  // 关闭,右上角的×是多余的,传 true 去掉。两者都隐藏时 hasHead 会连
  // 整个 .type-guide__head 都不渲染,不留一条空白的头部行。
  hideClose: { type: Boolean, default: false }
})
const emit = defineEmits(['close'])

const isBuyer = computed(() => props.viewerRole === 'buyer')
const showInNegotiation = computed(() => props.offerType === null || props.offerType === 'in-negotiation')
const showMakeOffer = computed(() => props.offerType === null || props.offerType === 'make-offer')
const hasHead = computed(() => !props.hideTitle || !props.hideClose)

function handleOutsideClick(event) {
  const el = document.querySelector('.type-guide')
  if (el?.contains(event.target)) return
  if (props.triggerEl?.contains(event.target)) return
  emit('close')
}
function handleEscapeKey(event) {
  if (event.key === 'Escape') emit('close')
}
onMounted(() => {
  document.addEventListener('mousedown', handleOutsideClick)
  document.addEventListener('keydown', handleEscapeKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleOutsideClick)
  document.removeEventListener('keydown', handleEscapeKey)
})
</script>

<style scoped>
.type-guide {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  z-index: 20;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: #F5FBFF;
  border-radius: 16px;
  box-shadow: 0 11px 15px rgba(132, 132, 132, 0.2), 0 9px 46px rgba(132, 132, 132, 0.12), 0 24px 38px rgba(132, 132, 132, 0.14);
  font-family: 'Roboto', sans-serif;
  cursor: default;
  /* 细节见文件头 METADATA:这个组件常被嵌套渲染在别的元素(比如
     ImageBadge)内部,那些元素可能给自己设了 white-space:nowrap,会被
     子孙继承——这里显式重置,不管嵌套在什么里面,文字都能正常换行。 */
  white-space: normal;
}

.type-guide__arrow {
  position: absolute;
  top: -8px;
  width: 16px;
  height: 8px;
  background: #F5FBFF;
  clip-path: polygon(50% 0, 0 100%, 100% 100%);
}

.type-guide__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.type-guide__title {
  font-size: 20px;
  font-weight: 500;
  line-height: 30px;
  letter-spacing: 0.15px;
  color: #0E0E0F;
}

.type-guide__close {
  display: inline-flex;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  flex-shrink: 0;
}

.type-guide__section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.type-guide__desc {
  width: 100%;
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0.1px;
  color: #0E0E0F;
}

.type-guide__desc strong {
  font-weight: 500;
}

.type-guide__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.type-guide__btn {
  border: none;
  background: #0077D8;
  color: #FFFFFF;
  padding: 8px 16px;
  border-radius: 100px;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 14px;
  letter-spacing: 0.1px;
  white-space: nowrap;
  cursor: pointer;
}
</style>
