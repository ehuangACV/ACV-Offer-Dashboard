<!--
  ═══════════════════════════════════════════════════════════
  METADATA (Playground 读取用,不是最终页面渲染的一部分)
  name: Information Dialog
  group: 卡片视图 (Card View)
  order: 42
  description: >
    点 OfferCard 上任意 hover 按钮(Accept/Decline/Counter/View Details/
    Manage Offer/Raise Your Offer/Remove From List)都会打开的这一个
    Dialog——你明确说过"我知道这不合理,先这样做,之后会调整",所以现在
    不区分点了哪个按钮,统一打开这同一个 Information Dialog,内容按
    viewerRole+offerType+dealState 算,和 OfferCard 用的是同一套模型。
    打开方式:当前页面居中的 overlay,背景黑色 25% 透明度,用
    `<Teleport to="body">` 挂载,避免被 OfferCard 自己的
    `overflow:hidden` 裁掉。
  path: fragments/InformationDialog/InformationDialog.vue
  source_of_truth: >
    【2026-09 按你发的 "Offer States Logic for CC.md" 删掉了两个冗余
    prop】`floorAmount`/`ceilingAmount` 已经删掉——文档第5条明确写
    "The counter range shown to either side is exactly Between
    <buyer's live number> and <seller's live number>"(下限永远是买家
    的实时数字、上限永远是卖家的实时数字,不看是谁在看),这两个数字
    组件里已经有(`buyerAmount`/`sellerAmount` computed,金额区本来就在
    用),不需要再单独传一份可能不同步的 `floorAmount`/`ceilingAmount`。
    这也顺带回答了 InformationDialog/notes.md 里记的一条"待你确认"
    open question("Between $floor and $ceiling 的下限从哪来")——现在
    有了明确答案,不再是开放问题。Split 的中点计算(`splitAmount`)和
    "Greater than $X"(Make Offer 买家再出价的下限)也都改成直接用
    `buyerAmount`/`sellerAmount`/`ownAmount`,同一个道理。
    【2026-09 修了一个真实bug:金额区第一个数字用错了字段】你发截图指出
    "info dialog上没有显示对应card上的内容",根因是金额区("Highest
    Bid"/"Buyer High Bid"这个位置)一直显示的是 `openingBidAmount` 这个
    独立的静态 prop,不是根据 viewerRole 从 `ownAmount`/
    `counterpartyAmount` 算出来的 `buyerAmount`——而"Offer Dialog Rules
    for CC.md"第2节原话是"Always the **latest** figure per side. History
    carries the sequence; this block never repeats it."(金额区永远显示
    每一方最新的数字,不是开盘价)。之前这个位置从一开始写的时候就该用
    `buyerAmount`(已经有这个computed,给"卡片上方summary"用的字段是一样
    的),但手误接错了一个没人在别处用到的旧prop `openingBidAmount`——
    这也是为什么从 OfferDashboard 真实数据打开的dialog,金额区数字和
    卡片/history完全对不上(那个prop从来没有被 OfferDashboard.vue
    赋过真实值,一直落到组件自己的默认值 $20,000)。已经把这个位置改成
    `buyerAmount`,`openingBidAmount` 这个prop本身也删掉了(删掉之后
    没有任何地方还需要它,不是"删了但留着没用的代码")。
    【2026-09 换成你直接给的参考模板,不再以 Figma 为准】你给了
    `Information Dialog Template.html`(一个手写的静态参考页面,不是从
    Figma 导出的)+ `Offer States Logic for CC.md`(逻辑文档,决定每个
    状态该显示什么/能做什么),原话:"Copy its markup and geometry
    exactly — only swap the content ... Do not restyle."——这次不是照
    Figma 核实,是照这个模板 1:1 抄几何数值,内容按状态文档算。这次改动
    的都是"照抄模板,不是我自己选的"的具体数值,列出来方便你核对:
    - 容器宽度 **520px**(不是上一版按你指示改的580px——这次模板的注释
      明确写"Fixed geometry, do not change: dialog width 520",和你更早
      给的580px指示冲突,这次以这份最新的模板为准,**待你确认**是否
      认可这个覆盖)。padding 20px 22px 18px(不是24px),整体圆角12px
      (不是16px),block 之间统一 gap 14px(不是16px)。
    - 阴影从"纯投影"变成"1px描边+投影"组合:
      `0 0 0 1px rgb(232,233,235), 0 8px 10px rgba(0,0,0,.14),
      0 3px 14px rgba(0,0,0,.12), 0 5px 5px rgba(0,0,0,.20)`。
    - 整个卡片是**一列打平的 flex 布局**,没有像上一版那样再套一层
      "body"/"history"分组容器——Header/车辆区/金额区/状态行/分割线/
      "Negotiation History"标题/气泡列/输入面板/Footer 全部是同一个
      flex column 的直接子元素,靠统一的14px gap 分隔,不是分层嵌套的
      padding。
    - 标题20px/28行高(不是30),关闭图标从24×24缩小到20×20描边风格
      (stroke,不是填色)。
    - 车辆区:灰底`#F7F7F8`(不是`#F5F5F5`),padding统一14px(不是16),
      缩略图**116×84圆角3px**(不是128×128圆角4px),文字用15px(标题)/
      13px(VIN/Odometer/Auction ID),颜色`#55575C`(不是`#757575`)。
    - 金额区:padding **14px 16px**、gap **16px**(不是16px统一/24px),
      标签12px/行高18/字色`#55575C`,值**15px Medium**(不是16px
      Bold)、颜色`#0E0E0F`;"View Report"链接现在**嵌在金额值同一个
      flex行里**(不是单独包一层`.money-value-row`),颜色`#0061A5`
      (不是`#004E7D`);分割线颜色`#DCDFE8`不变。
    - 状态chip**不再复用 StatusChip 组件**——这是刻意的回退:上一版
      (按 Figma node 7581:111476)选择复用 StatusChip 保证"规则和
      card/table完全一样",但这次模板给的chip几何(高度22px、padding
      4px 8px、圆角4px、字号12px/行高14px)和 StatusChip 组件本身的
      几何(padding4px 6px、行高12px)不一样,你这次的指示是"照这个
      模板抄,不要重新设计样式"——两条指示互相矛盾时,以**这次更新、
      更明确**的指示为准,所以改回手写这几个chip的markup,不再引用
      StatusChip组件。颜色沿用已核实的New(`#F4FFF6`/`#006C4C`)和
      Received(`#F0F8FF`/`#0061A5`)——这两个模板里直接给了。Sent/
      Declined/Expired 三个模板没给,颜色继续沿用之前定的
      `#E0E0E0`/`#212121`(Sent)、`#FFEFBF`/`#402D00`(Declined)、
      `#E0E0E0`/`#55575C`(Expired),只是套上这次的新几何,**待你
      确认**这三个颜色是否还适用。
    - Time Remaining:标签13px颜色`#55575C`,数值**14px Medium**(不是
      16px Bold),同一行用`align-items:baseline`(不是之前的普通
      对齐)。数值文本去掉了"Left"后缀——模板字面就是"45m"不是
      "45m Left"(卡片上的倒计时徽标不受影响,仍然是"45m Left",这个
      对话框自己内部把" Left"这个尾巴去掉,靠一个新的
      `timeRemainingDisplay` computed 做字符串处理,不改 `timeLeft`
      这个 prop 本身的值)。
    - 分割线现在是**普通实心div**,不再需要负margin"出血"到卡片边缘
      的写法——因为整卡已经是打平的flex column,分割线本身就是这一列
      里普通的一个子元素,天然对齐其它内容的左右边界,不用再计算负
      margin。
    - 气泡:圆角统一**4px**(不再是"缺一角"的8px组合),padding
      **10px 14px**,字号**13px**(不是14px),max-width **74%**
      (不是80%),own用`rgb(0,97,165)`(和之前的`#0061A5`是同一个
      颜色,只是写法不同)。时间戳**11px**颜色`#75747A`(不是10px/
      `#757575`)。
    - Accept按钮的"勾"从内嵌SVG改成**字面的"✓"文字字符**(模板原文
      就是`✓ Accept $4,500`这几个字符拼起来的,不是矢量图标),按钮
      本身高度**36px**(气泡下面的Accept/Decline)或**40px**
      (Footer里的主提交按钮)——两种高度模板本身就不一样,不是我
      写错。
    - **Decline 只对卖家渲染**——之前(上一版)`canDecline` 只判断
      `dealState==='received'`,没分买家/卖家,状态文档明确写"The
      buyer cannot decline, ever. Declining is the seller's action
      only."——这是一处真正的逻辑bug,这次改正为
      `!isBuyer && dealState==='received'`。
    - **Split The Difference 的可见条件收紧**——之前只判断"双方都有
      金额"就显示,状态文档明确列了三个条件都要满足才显示:1. 类型是
      In Negotiation(Make Offer从来没有);2. 双方都有数字;3. 轮到你
      (`dealState==='received'`)。已经按这三条改。
    - **Decline 的历史气泡文案按角色区分**——之前不管买家卖家的
      dialog,都硬编码"Your offer was declined by the seller."(买家
      视角的措辞),这次改成买家看"Your offer was declined by the
      seller.",卖家看"You declined the offer."(和 OfferCard 卡片上
      declined 状态 line1 的措辞逻辑保持一致)。
    - 输入框("Counter offer"面板)的"border"用**inset box-shadow**
      实现(不是真的border),照模板字面抄的写法,视觉上是同一条1px线,
      只是CSS实现方式不同;宽度**74%**(不是固定385px上限)。
    - Footer:Close文字链接颜色改成`#0061A5`(不是`#004E7D`),padding-top
      4px(不是包在24px的padding里)。
  status: >
    这份模板只演示了"In Negotiation·Buyer·Received"一种状态的像素;
    其余9种状态的具体排布是照这一个模板的结构 + `Offer States Logic
    for CC.md` 的文字规则推出来的,不是逐个状态单独给了参考图。
    `Offer States Logic for CC.md` 里买家 In Negotiation·Received 的
    卡片文案描述是"`Your bid $3,800` on the first round, `Your
    counter $X` once the buyer has countered"——这是**卡片**(不是这个
    dialog)的文案规则,和 `OfferCard.vue` 当前 v2 的"Your offer
    {ownAmount}"写法不完全一致(没有区分"第一轮/countered过")。这次
    任务范围只是这个 Dialog,没有动 OfferCard 的文案逻辑,这个差异
    **待你确认**要不要回头也把 OfferCard 改成同样区分首轮/countered过
    的写法。
  ═══════════════════════════════════════════════════════════
-->
<template>
  <Teleport to="body" :disabled="inline">
    <div v-if="modelValue" :class="inline ? 'info-dialog-inline-shell' : 'info-dialog-overlay'" @click.self="handleOverlayClick">
      <div class="info-dialog" role="dialog" aria-label="Information">
        <div class="info-dialog__header">
          <span class="info-dialog__title">Information</span>
          <button type="button" class="info-dialog__close" aria-label="Close" @click="handleClose">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        <div class="info-dialog__vehicle">
          <div class="info-dialog__vehicle-photo">
            <img v-if="photoUrl" :src="photoUrl" alt="">
          </div>
          <div class="info-dialog__vehicle-text">
            <span class="info-dialog__vehicle-title">{{ vehicleTitle }}</span>
            <span class="info-dialog__vehicle-line">VIN: {{ vin }}</span>
            <span class="info-dialog__vehicle-line">Odometer: {{ mileage }}</span>
            <span class="info-dialog__vehicle-line">Auction ID: {{ auctionId }}</span>
          </div>
        </div>

        <div class="info-dialog__money">
          <div v-if="isMakeOffer" class="info-dialog__money-figure">
            <span class="info-dialog__money-label">Buyer Offer</span>
            <span class="info-dialog__money-value">{{ buyerAmount }}</span>
          </div>
          <template v-else>
            <div class="info-dialog__money-figure">
              <span class="info-dialog__money-label">{{ isBuyer ? 'Highest Bid' : 'Buyer High Bid' }}</span>
              <span class="info-dialog__money-value">{{ buyerAmount }}</span>
            </div>
            <div class="info-dialog__money-figure">
              <span class="info-dialog__money-label">Seller Counter</span>
              <span class="info-dialog__money-value">{{ sellerAmount }}</span>
            </div>
          </template>
          <span class="info-dialog__money-divider" />
          <div class="info-dialog__money-figure">
            <span class="info-dialog__money-label">Reserve Price</span>
            <span class="info-dialog__money-value">{{ reservePrice }}</span>
          </div>
          <div class="info-dialog__money-figure">
            <span class="info-dialog__money-label">ACV Estimate</span>
            <span class="info-dialog__money-value">
              {{ acvEstimate }}
              <a :href="reportUrl" target="_blank" rel="noopener" class="info-dialog__report-link">View Report</a>
            </span>
          </div>
        </div>

        <div class="info-dialog__status-row">
          <span class="info-dialog__chips">
            <span v-if="showNewChip" class="info-dialog__chip info-dialog__chip--new">New</span>
            <span v-if="hasStateChip" class="info-dialog__chip" :class="`info-dialog__chip--${dealState}`">{{ stateChipLabel }}</span>
          </span>
          <span v-if="hasCountdown" class="info-dialog__time-remaining">
            Time Remaining
            <span class="info-dialog__time-remaining-value" :class="{ 'info-dialog__time-remaining-value--urgent': timeLeftUrgent }">{{ timeRemainingDisplay }}</span>
          </span>
        </div>

        <div class="info-dialog__divider" />

        <span class="info-dialog__history-header">{{ sectionHeader }}</span>

        <div class="info-dialog__bubbles">
          <div
            v-for="(msg, i) in history"
            :key="i"
            class="info-dialog__bubble-row"
            :class="msg.speaker === viewerRole ? 'info-dialog__bubble-row--own' : 'info-dialog__bubble-row--other'"
          >
            <template v-if="msg.kind === 'declined'">
              <span class="info-dialog__bubble info-dialog__bubble--other info-dialog__bubble--prose">{{ declineProseText }}</span>
              <span class="info-dialog__bubble-time">{{ msg.timestamp }}</span>
            </template>
            <template v-else>
              <span class="info-dialog__bubble" :class="msg.speaker === viewerRole ? 'info-dialog__bubble--own' : 'info-dialog__bubble--other'">
                {{ bubbleLabels[msg.kind] }}: {{ msg.amount }}
              </span>
              <span class="info-dialog__bubble-time">{{ msg.timestamp }}</span>
              <div v-if="i === lastCounterpartyIndex && !isClosed" class="info-dialog__bubble-actions">
                <template v-if="!confirmingAccept">
                  <button v-if="canDecline" type="button" class="info-dialog__btn info-dialog__btn--grey-outline" @click="$emit('decline')">Decline</button>
                  <button v-if="canAccept" type="button" class="info-dialog__btn info-dialog__btn--filled" @click="confirmingAccept = true">✓ Accept {{ counterpartyAmount }}</button>
                </template>
                <button v-else-if="canDecline" type="button" class="info-dialog__btn info-dialog__btn--grey-outline" @click="$emit('decline')">Decline</button>
              </div>
            </template>
          </div>
        </div>

        <div v-if="confirmingAccept" class="info-dialog__action-block">
          <div class="info-dialog__input-panel">
            <span class="info-dialog__accept-confirm-text">Accept {{ counterpartyAmount }} for the {{ vehicleTitle }}?</span>
            <label class="info-dialog__split">
              <input type="checkbox" v-model="acceptChecked">
              <span>Accept Offer</span>
            </label>
          </div>
        </div>

        <div v-else-if="inputPanel === 'counter' || inputPanel === 'offer'" class="info-dialog__action-block">
          <div class="info-dialog__input-panel">
            <span class="info-dialog__input-panel-title">{{ inputPanel === 'counter' ? 'Counter offer' : 'New offer' }}</span>
            <div class="info-dialog__input-field">
              <span class="info-dialog__input-dollar">$</span>
              <input
                v-model="enteredAmount"
                type="text"
                class="info-dialog__input-native"
                :placeholder="inputPanel === 'counter' ? 'Enter counter' : 'Enter offer'"
              >
            </div>
            <span class="info-dialog__input-helper">
              {{ inputPanel === 'counter' ? `Between ${buyerAmount} and ${sellerAmount}` : `Greater than ${ownAmount}` }}
            </span>
            <template v-if="inputPanel === 'counter' && showSplitDifference">
              <div class="info-dialog__input-or"><span /> or <span /></div>
              <label class="info-dialog__split">
                <input type="checkbox" v-model="useSplit">
                <span>Split The Difference: <strong>{{ splitAmount }}</strong></span>
              </label>
            </template>
          </div>
        </div>

        <div class="info-dialog__footer">
          <button type="button" class="info-dialog__close-link" @click="handleClose">Close</button>
          <button
            v-if="footerButton"
            type="button"
            class="info-dialog__commit-btn"
            :disabled="!footerButtonEnabled"
            @click="handleFooterCommit"
          >{{ footerButton }}</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  photoUrl: { type: String, default: '' },
  vehicleTitle: { type: String, default: 'Year Make Model' },
  vin: { type: String, default: '192211' },
  mileage: { type: String, default: '250,000 miles' },
  auctionId: { type: String, default: '452161' },
  offerType: { type: String, default: 'in-negotiation' },
  viewerRole: { type: String, default: 'buyer' },
  dealState: { type: String, default: 'received' },
  isNew: { type: Boolean, default: false },
  counterpartyAmount: { type: String, default: '$4,500' },
  ownAmount: { type: String, default: '$3,800' },
  // 2026-09-01:默认值原来是 $26,000/$25,000,和上面 ownAmount/
  // counterpartyAmount 的默认值不是同一条协商链路,改成一致的
  // $4,800/$4,600,细节见 fragments/OfferCard/mock.js 文件头注释。
  reservePrice: { type: String, default: '$4,800' },
  acvEstimate: { type: String, default: '$4,600' },
  reportUrl: { type: String, default: '#' },
  timeLeft: { type: String, default: '45m Left' },
  timeLeftUrgent: { type: Boolean, default: false },
  // 历史消息:[{ speaker: 'buyer'|'seller', kind: 'bid'|'counter'|'offer'|'declined', amount, timestamp }]
  history: { type: Array, default: () => [] },
  // 2026-09 按你的要求:Playground 里给这个组件单独建的页面不要用弹层
  // overlay 展示(背板会盖住 Controls 面板,点不到任何控制项)——加这个
  // prop,true 时不用 Teleport 挪到 body、不铺黑色背板,直接在原地渲染
  // 卡片本身。默认 false,真实场景(OfferCard 点 hover 按钮打开)完全不受
  // 影响,还是原来的居中 overlay + 25% 黑背板。
  inline: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue', 'close', 'decline', 'accept', 'send-counter', 'send-offer'])

const isBuyer = computed(() => props.viewerRole === 'buyer')
const isMakeOffer = computed(() => props.offerType === 'make-offer')
const isClosed = computed(() => props.dealState === 'declined' || props.dealState === 'expired')
const hasCountdown = computed(() => !!props.timeLeft && !isClosed.value)
// 模板字面是"45m",没有"Left"这个尾巴("Time Remaining"这个标签已经说明
// 是剩余时间,不用再重复"Left")——卡片上的倒计时徽标是另一个组件、另一套
// 文案,不受这里影响,timeLeft 这个 prop 本身的值不变,只在这里显示时去掉
// 尾巴
const timeRemainingDisplay = computed(() => props.timeLeft.replace(/\s*Left\s*$/i, ''))
const hasStateChip = computed(() => !!props.dealState)
const showNewChip = computed(() => props.isNew && (props.dealState === 'received' || props.dealState === 'declined'))
const stateChipLabel = computed(() => ({ received: 'Received', sent: 'Sent', declined: 'Declined', expired: 'Expired' }[props.dealState] || ''))

const buyerAmount = computed(() => (isBuyer.value ? props.ownAmount : props.counterpartyAmount))
const sellerAmount = computed(() => (!isBuyer.value ? props.ownAmount : props.counterpartyAmount))

const sectionHeader = computed(() => {
  if (isClosed.value) return 'Negotiation History'
  const hasCounter = props.history.some((m) => m.kind === 'counter')
  return hasCounter ? 'Negotiation History' : 'Pending Offer'
})

const bubbleLabels = { bid: 'Highest Bid', counter: 'Counter', offer: 'Offer' }
// "Offer States Logic for CC.md":这句只出现在买家看到的历史里(卖家
// declined 是卖家自己做的动作,措辞不同)——和 OfferCard 卡片上
// declined 状态 line1 的买家/卖家措辞区分逻辑一致
const declineProseText = computed(() => (isBuyer.value ? 'Your offer was declined by the seller.' : 'You declined the offer.'))

const lastCounterpartyIndex = computed(() => {
  for (let i = props.history.length - 1; i >= 0; i--) {
    if (props.history[i].speaker !== props.viewerRole) return i
  }
  return -1
})

// "Offer States Logic for CC.md":"The buyer cannot decline, ever.
// Declining is the seller's action only." —— 之前这里没分买家/卖家,
// 是个真的逻辑bug,已经改正
const canDecline = computed(() => !isBuyer.value && props.dealState === 'received')
const canAccept = computed(() => props.dealState === 'received')

const confirmingAccept = ref(false)
const acceptChecked = ref(false)
const enteredAmount = ref('')
const useSplit = ref(false)
function resetTransientState() {
  confirmingAccept.value = false
  acceptChecked.value = false
  enteredAmount.value = ''
  useSplit.value = false
}
watch(() => props.modelValue, (open) => { if (open) resetTransientState() })
// 2026-09 修复:Playground 里切换 mock 示例时 modelValue 一直是 true(对话
// 框没有真的关闭再打开过),上面那个 watch 不会触发,导致上一个场景点了
// Accept 留下的确认面板/checkbox 状态原样带到下一个场景里——这在真实用法
// (OfferCard 每次都是先关再开)不会发生,但作为一个组件本身应该更健壮:
// 只要"这是哪笔 deal"这几个字段变了,就该重置,不该依赖"先关再开"这个
// 调用方约定
watch(() => [props.dealState, props.counterpartyAmount, props.ownAmount, props.viewerRole, props.offerType], resetTransientState)

const inputPanel = computed(() => {
  if (isClosed.value || confirmingAccept.value) return null
  if (props.dealState !== 'received' && props.dealState !== 'sent') return null
  if (props.dealState === 'received') {
    // Received:只有 In Negotiation 才有 Counter offer 面板;Make Offer·
    // Received(卖家视角)是 Accept/Decline only,没有输入面板
    return isMakeOffer.value ? null : 'counter'
  }
  // Sent:In Negotiation 的 Sent 没有输入面板(等对方回复);Make Offer 的
  // Sent 只有 buyer 才有"New offer"面板(可以再抬价),seller 在 Make
  // Offer 上没有 Sent 状态
  if (isMakeOffer.value && isBuyer.value) return 'offer'
  return null
})

// "Offer States Logic for CC.md" Split The Difference 一节,三个条件
// 缺一不可:1. 类型是 In Negotiation(Make Offer 永远没有);2. 双方都有
// 数字;3. 轮到你(dealState==='received')。之前只判断了第2条,已经
// 补上第1/3条
const showSplitDifference = computed(() =>
  !isMakeOffer.value && props.dealState === 'received' && !!props.counterpartyAmount && !!props.ownAmount
)
function midpointAmount(a, b) {
  const na = Number(String(a).replace(/[^0-9.]/g, ''))
  const nb = Number(String(b).replace(/[^0-9.]/g, ''))
  if (!na || !nb) return '$0'
  return '$' + Math.round((na + nb) / 2).toLocaleString('en-US')
}
// "Offer States Logic for CC.md" 第5条:counter range 的下限永远是买家
// 的实时数字,上限永远是卖家的实时数字,不看是谁在看——`buyerAmount`/
// `sellerAmount` 已经是这两个数字了,不需要再单独传 floorAmount/
// ceilingAmount 这两个可能和它们不同步的字段(之前"Highest Bid用错字段"
// 就是这类冗余字段导致的bug,这次直接用同一份数据源,不留第二份)
const splitAmount = computed(() => midpointAmount(buyerAmount.value, sellerAmount.value))

const footerButtonEnabled = computed(() => {
  if (confirmingAccept.value) return acceptChecked.value
  if (inputPanel.value === 'counter') return useSplit.value || !!enteredAmount.value
  if (inputPanel.value === 'offer') return !!enteredAmount.value
  return false
})
// "Offer States Logic for CC.md" — "No disabled buttons. If an action
// is impossible in a state, do not render it." Footer 主按钮只在真的
// 有事可做时才出现(不是渲染出来再灰掉)
const footerButton = computed(() => {
  if (confirmingAccept.value) return `Accept ${props.counterpartyAmount}`
  if (inputPanel.value === 'counter') return 'Send Counter'
  if (inputPanel.value === 'offer') return 'Send Offer'
  return ''
})

function handleClose() {
  emit('update:modelValue', false)
  emit('close')
}
function handleOverlayClick() {
  if (!props.inline) handleClose()
}
function handleFooterCommit() {
  if (!footerButtonEnabled.value) return
  if (confirmingAccept.value) { emit('accept'); return }
  if (inputPanel.value === 'counter') { emit('send-counter', useSplit.value ? splitAmount.value : enteredAmount.value); return }
  if (inputPanel.value === 'offer') { emit('send-offer', enteredAmount.value) }
}
</script>

<style scoped>
/* 滚动放在背板(overlay)这一层,卡片本身不设 max-height/overflow,
   避免在圆角卡片内部裁出一条滚动条(见 notes.md 更早的记录) */
.info-dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  padding: 40px 16px;
  box-sizing: border-box;
  z-index: 1000;
}

/* inline 模式(Playground 专用,见 script 里的注释):不铺背板、不
   position:fixed,原地占一块普通流内空间 */
.info-dialog-inline-shell {
  display: flex;
  justify-content: center;
  padding: 24px 0;
}

/* 2026-09 按 "Information Dialog Template.html" 逐字抄的几何数值——
   520px 宽、12px 圆角、20/22/18 padding、14px 统一 gap,整卡是打平的
   flex column(不再分 header/body/history 好几层容器),细节见上面
   METADATA 的逐条对比 */
.info-dialog {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 520px;
  flex-shrink: 0;
  padding: 20px 22px 18px;
  border-radius: 12px;
  background: #FFFFFF;
  box-shadow: 0 0 0 1px #E8E9EB, 0 8px 10px rgba(0, 0, 0, 0.14), 0 3px 14px rgba(0, 0, 0, 0.12), 0 5px 5px rgba(0, 0, 0, 0.20);
  font-family: 'Roboto', sans-serif;
  box-sizing: border-box;
}

.info-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.info-dialog__title {
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  letter-spacing: 0.1px;
  color: #0E0E0F;
}

.info-dialog__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: none;
  color: #0E0E0F;
  cursor: pointer;
}

.info-dialog__vehicle {
  display: flex;
  gap: 16px;
  padding: 14px;
  border-radius: 4px;
  background: #F7F7F8;
}

.info-dialog__vehicle-photo {
  position: relative;
  width: 116px;
  height: 84px;
  flex: none;
  border-radius: 3px;
  overflow: hidden;
  background: #E6E9EF;
}
.info-dialog__vehicle-photo img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-dialog__vehicle-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.info-dialog__vehicle-title {
  font-size: 15px;
  font-weight: 500;
  line-height: 22px;
  letter-spacing: 0.1px;
  color: #0E0E0F;
}

.info-dialog__vehicle-line {
  font-size: 13px;
  line-height: 19px;
  letter-spacing: 0.1px;
  color: #55575C;
}

.info-dialog__money {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 14px 16px;
  border-radius: 4px;
  background: #F7F7F8;
}

.info-dialog__money-figure {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.info-dialog__money-label {
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.4px;
  color: #55575C;
  white-space: nowrap;
}

.info-dialog__money-value {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 15px;
  font-weight: 500;
  line-height: 22px;
  letter-spacing: 0.1px;
  color: #0E0E0F;
}

.info-dialog__money-divider {
  width: 1px;
  align-self: stretch;
  background: #DCDFE8;
}

.info-dialog__report-link {
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.4px;
  white-space: nowrap;
  color: #0061A5;
  text-decoration: none;
}

.info-dialog__status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

/* 2026-09 按模板要求"照抄几何,不要重新设计样式",这几个chip改回手写
   markup,不再引用 StatusChip 组件——细节和取舍见上面 METADATA */
.info-dialog__chips {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-dialog__chip {
  display: flex;
  align-items: center;
  height: 22px;
  padding: 4px 8px;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.4px;
  white-space: nowrap;
}
.info-dialog__chip--new { background: #F4FFF6; color: #006C4C; }
.info-dialog__chip--received { background: #F0F8FF; color: #0061A5; }
.info-dialog__chip--sent { background: #E0E0E0; color: #212121; }
.info-dialog__chip--declined { background: #FFEFBF; color: #402D00; }
.info-dialog__chip--expired { background: #E0E0E0; color: #55575C; }

.info-dialog__time-remaining {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 13px;
  letter-spacing: 0.1px;
  color: #55575C;
  white-space: nowrap;
}

.info-dialog__time-remaining-value {
  font-size: 14px;
  font-weight: 500;
  color: #55575C;
}
.info-dialog__time-remaining-value--urgent {
  color: #CC433A;
}

.info-dialog__divider {
  height: 1px;
  background: #EBEBEB;
}

.info-dialog__history-header {
  font-size: 13px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0.1px;
  color: #0E0E0F;
}

.info-dialog__bubbles {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-dialog__bubble-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.info-dialog__bubble-row--own { align-items: flex-end; }
.info-dialog__bubble-row--other { align-items: flex-start; }

.info-dialog__bubble {
  max-width: 74%;
  padding: 10px 14px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0.1px;
}
.info-dialog__bubble--own {
  background: #0061A5;
  color: #FFFFFF;
}
.info-dialog__bubble--other {
  background: #F0F1F3;
  color: #0E0E0F;
}
.info-dialog__bubble--prose {
  font-weight: 400;
}

.info-dialog__bubble-time {
  font-size: 11px;
  line-height: 16px;
  letter-spacing: 0.4px;
  color: #75747A;
}

.info-dialog__bubble-actions {
  display: flex;
  gap: 10px;
}

.info-dialog__btn {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 16px;
  border: none;
  border-radius: 100px;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.1px;
  white-space: nowrap;
  cursor: pointer;
  box-sizing: border-box;
}
.info-dialog__btn--filled {
  background: linear-gradient(99.496deg, #F26522 8.67%, #FC4243 91.33%);
  color: #FFFFFF;
}
.info-dialog__btn--grey-outline {
  border: 1px solid #D1D3D6;
  background: #FFFFFF;
  color: #55575C;
}

.info-dialog__action-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

.info-dialog__input-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 74%;
  box-shadow: inset 0 0 0 1px #E8E9EB;
  border-radius: 4px;
  box-sizing: border-box;
}

.info-dialog__input-panel-title,
.info-dialog__accept-confirm-text {
  display: block;
  padding: 12px 14px 0;
  font-size: 13px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0.1px;
  color: #0E0E0F;
}

.info-dialog__input-field {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 14px;
  padding: 10px 12px;
  background: #F7F7F8;
  border-bottom: 1px solid #8D9199;
  box-sizing: border-box;
}

.info-dialog__input-dollar {
  font-size: 14px;
  color: #55575C;
}

.info-dialog__input-native {
  flex: 1;
  border: none;
  background: none;
  outline: none;
  font-size: 14px;
  font-family: 'Roboto', sans-serif;
  letter-spacing: 0.1px;
  color: #0E0E0F;
}
.info-dialog__input-native::placeholder {
  color: #75747A;
}

.info-dialog__input-helper {
  display: block;
  padding: 0 14px;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.4px;
  color: #55575C;
}

.info-dialog__input-or {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 14px 14px;
  font-size: 12px;
  letter-spacing: 0.4px;
  color: #55575C;
}
.info-dialog__input-or span {
  width: 1px;
  flex: 1;
  height: 1px;
  background: #EBEBEB;
}

.info-dialog__split {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 14px 14px;
  font-size: 13px;
  letter-spacing: 0.1px;
  color: #0E0E0F;
  cursor: pointer;
}
.info-dialog__split input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin: 0;
  accent-color: #0061A5;
}
.info-dialog__split strong {
  font-weight: 500;
  color: #0061A5;
}

.info-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 4px;
}

.info-dialog__close-link {
  padding: 0;
  border: none;
  background: none;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.1px;
  color: #0061A5;
  cursor: pointer;
}

.info-dialog__commit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 20px;
  border: none;
  border-radius: 100px;
  background: linear-gradient(99.496deg, #F26522 8.67%, #FC4243 91.33%);
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.1px;
  color: #FFFFFF;
  white-space: nowrap;
  cursor: pointer;
  box-sizing: border-box;
}
.info-dialog__commit-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
