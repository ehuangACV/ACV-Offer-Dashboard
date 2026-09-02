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
    - Accept按钮的"勾"最初从内嵌SVG改成过字面的"✓"文字字符(模板原文
      是`✓ Accept $4,500`这几个字符拼起来的,不是矢量图标)。
      【2026-09-02 你直接要求去掉】这个"✓"前缀已经删掉,按钮现在只是
      纯文字"Accept $4,500",不再带任何勾符号。按钮本身高度**36px**
      (气泡下面的Accept/Decline)或**40px**(Footer里的主提交按钮)——
      两种高度模板本身就不一样,不是我写错。
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

    【2026-09-02 新增:两侧 Previous/Next + 车辆信息行的类型徽标】对照
    Figma node 7597:112866("Offers"整页 + 打开的 Dialog + 两侧的
    Previous/Next)新增:
    1. 车辆信息行右上角新增 In Negotiation/Make Offer 徽标,复用
       fragments/ImageBadge(和 OfferCard 图片上的徽标是同一个组件)。
       In Negotiation 用 ring 样式(深色底+白色描边)——这正好是这个
       Figma 节点里量到的真实样式(#1C1D1F 底 + 白色1px描边),不是
       为了"统一"套用别处的样式,是这个节点本来就长这样。Make Offer
       这个节点没有真实实例,沿用 ImageBadge 已核实的白底样式。
    2. 新增 `hasPrev`/`hasNext` 两个布尔 prop + `prev`/`next` 两个
       emit——"根据是否有其他 deal 决定要不要显示"这条规则拆成两个独立
       的判断(排第一条时没有 Previous,排最后一条时没有 Next),不是
       "有列表就两个都显示、没列表就都不显示",这是常见 lightbox/邮件
       详情页 prev-next 导航的标准做法。默认都是 false,不传就是原来
       的样子,不影响任何已有用法。
    3. 按钮位置没有照抄 Figma 在1440px画布里量出来的绝对像素(那是
       针对574px宽对话框算的相对坐标),改成贴视口左右边缘
       (left/right:24px,垂直居中)——不管对话框多宽、屏幕多大,这两个
       按钮永远不会和对话框重叠,更稳妥。文字颜色也从 Figma 的白色改成
       深色 #212121——Figma 那个背板是60%黑,白字在上面清楚;我们这个
       背板只有25%黑(能看清背后页面内容),白字在这种浅背板上对比度
       不够。
    4. 这两个新按钮只在 `!inline` 时渲染——`inline` 是 Playground 专用的
       "不用弹层展示"模式(避免黑背板挡住 Controls 面板),固定定位的
       左右导航按钮在那个场景下同样会挡住面板,和整个弹层机制本身在
       inline 模式下被跳过是同一个道理。
    5. 实际的"点 Next 切到下一条 deal"这个跨行为的接线(OfferCard/
       OfferTableRow → OfferDashboard,算出 hasPrev/hasNext、处理
       prev/next 事件切换到相邻那一行的数据)记录在
       fragments/OfferDashboard/notes.md,这个文件本身只负责按钮的
       显示/隐藏和把点击事件 emit 出去,不知道"列表"这个概念。
  ═══════════════════════════════════════════════════════════
-->
<template>
  <Teleport to="body" :disabled="inline">
    <div v-if="modelValue" :class="inline ? 'info-dialog-inline-shell' : 'info-dialog-overlay'" @click.self="handleOverlayClick">
      <div class="info-dialog__stage">
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
          <ImageBadge
            v-if="offerType !== 'none' && dialogVersion !== 'v2'"
            :variant="offerType"
            :label="offerTypeLabel"
            class="info-dialog__type-badge"
          />
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
            <!-- 2026-09-02 v2 新增:徽标从车辆标题区挪到这里,排在状态chip
                 最前面,徽标内嵌一个 info 图标,点开的说明弹层和 dashboard
                 表格表头(OfferTableHeader.vue 的 "Type" 信息图标)完全
                 同一份内容/样式,细节见该文件旁边的注释。【2026-09-02
                 更正】info 图标本身没有照抄表头那个蓝底白"i"的画法——你
                 要求"用黑白的",改成一个纯描边圆圈+实心"i"的极简图标,
                 stroke/fill 都用 currentColor,跟着徽标自己的文字颜色走
                 (In Negotiation 徽标是白字,图标就是白色;Make Offer
                 徽标是深色字,图标跟着变深色),不需要为两种徽标背景单独
                 调颜色 -->
            <ImageBadge
              v-if="offerType !== 'none' && dialogVersion === 'v2'"
              :variant="offerType"
              :label="offerTypeLabel"
              class="info-dialog__type-badge-v2"
            >
              <button
                ref="typeInfoBtnRef"
                type="button"
                class="info-dialog__type-info-btn"
                aria-label="What does this mean?"
                @click.stop="showTypeGuide = !showTypeGuide"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6.25" stroke="currentColor" stroke-width="1.1"/>
                  <circle cx="7" cy="4.5" r="0.9" fill="currentColor"/>
                  <rect x="6.25" y="6.2" width="1.5" height="4.3" rx="0.5" fill="currentColor"/>
                </svg>
              </button>
              <div v-if="showTypeGuide" ref="typeGuideRef" class="info-dialog__type-guide">
                <div class="info-dialog__type-guide-arrow" />
                <div class="info-dialog__type-guide-head">
                  <span class="info-dialog__type-guide-title">Type</span>
                  <button type="button" class="info-dialog__type-guide-close" aria-label="Close" @click.stop="showTypeGuide = false">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#545454" stroke-width="1.7" stroke-linecap="round"/></svg>
                  </button>
                </div>
                <div class="info-dialog__type-guide-section">
                  <OfferTypeBadge type="in-negotiation" label="In Negotiation" />
                  <p class="info-dialog__type-guide-desc">(6h limit) High bidder from the auction.</p>
                  <p class="info-dialog__type-guide-desc"><strong>Actions:</strong> Accept, Decline, or Counter.</p>
                </div>
                <div class="info-dialog__type-guide-section">
                  <OfferTypeBadge type="make-offer" label="Make Offer" />
                  <p class="info-dialog__type-guide-desc">(24h limit) Post-auction offer from any buyer.</p>
                  <p class="info-dialog__type-guide-desc"><strong>Actions:</strong> Accept or Decline only.</p>
                </div>
                <div class="info-dialog__type-guide-footer">
                  <button type="button" class="info-dialog__type-guide-btn" @click.stop="showTypeGuide = false">Got it</button>
                </div>
              </div>
            </ImageBadge>
            <span v-if="showNewChip" class="info-dialog__chip info-dialog__chip--new" :class="{ 'info-dialog__chip--v2': dialogVersion === 'v2' }">New</span>
            <span v-if="hasStateChip" class="info-dialog__chip" :class="[`info-dialog__chip--${dealState}`, { 'info-dialog__chip--v2': dialogVersion === 'v2' }]">{{ stateChipLabel }}</span>
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
                  <button v-if="canAccept" type="button" class="info-dialog__btn info-dialog__btn--filled" @click="confirmingAccept = true">Accept {{ counterpartyAmount }}</button>
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

      <!-- 2026-09-02 按 Figma node 7597:112866 新增:两侧的
           Previous/Next,只在 !inline 时渲染(inline 是 Playground 专用的
           "不用弹层展示"模式,原地渲染没有铺满视口的黑背板,固定定位的
           左右导航按钮在那个场景下没有意义,也会挡住 Controls 面板,和
           整个弹层机制本身在 inline 模式下被跳过的道理一样)。位置没有照抄
           Figma 在1440px画布里量到的绝对像素(那是针对固定574px宽对话框
           算出来的相对坐标,换到我们真实网页里对话框宽度/视口宽度都会变)。
           【2026-09-02 更正】最初改成贴视口左右边缘(left/right固定
           24px),你反馈"距离dialog太远"——因为视口边缘锚定的按钮离对话框
           的距离取决于屏幕宽度,屏幕越宽这两个按钮离对话框越远,不是
           固定的视觉间距。改成贴 .info-dialog__stage(下面新加的、只包着
           对话框本身的定位容器)的左右边缘,用 right:100%/left:100% + 16px
           的 margin 让按钮永远紧贴对话框卡片边缘外 16px,不再受视口宽度
           影响。【2026-09-02 再次更正】文字颜色最初从 Figma 的白色改成了
           深色 #212121(当时背板只有 25% 黑,白字在这种浅背板上对比度
           不够)。后来背板 (`.info-dialog-overlay`) 加深到 50% 黑之后,
           你反馈文字"太深",改回白色——现在背板够深,白字对比度足够,
           和 Figma 原本的白色文字一致了。 -->
      <button
        v-if="!inline && hasPrev"
        type="button"
        class="info-dialog__nav info-dialog__nav--prev"
        aria-label="Previous deal"
        @click="$emit('prev')"
      >
        <span class="info-dialog__nav-circle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
        </span>
        <span class="info-dialog__nav-label">Previous</span>
      </button>
      <button
        v-if="!inline && hasNext"
        type="button"
        class="info-dialog__nav info-dialog__nav--next"
        aria-label="Next deal"
        @click="$emit('next')"
      >
        <span class="info-dialog__nav-circle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6" /></svg>
        </span>
        <span class="info-dialog__nav-label">Next</span>
      </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import ImageBadge from '../ImageBadge/ImageBadge.vue'
import OfferTypeBadge from '../OfferTypeBadge/OfferTypeBadge.vue'

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
  inline: { type: Boolean, default: false },
  // 2026-09-02 按 Figma node 7597:112866 新增:对话框两侧的
  // Previous/Next——"根据是否有其他 deal 决定要不要显示"这条规则拆成两个
  // 独立的布尔值,不是一个"是否有列表"的开关:在一个多条 deal 的列表里,
  // 排在第一条时理应看不到 Previous、排在最后一条时理应看不到 Next,这是
  // 常见 lightbox/邮件详情页 prev-next 导航的标准做法,不是"要么两个都
  // 显示、要么都不显示"。这两个 prop 由外层(OfferCard/OfferTableRow →
  // OfferDashboard)按当前 deal 在可见列表里的位置算出来,默认都是
  // false——不传就等于"没有其他 deal 可以切",两个按钮都不显示,新增这个
  // 功能不会影响任何已有用法。
  hasPrev: { type: Boolean, default: false },
  hasNext: { type: Boolean, default: false },
  // 2026-09-02 按你的要求新增 v2:v1(默认)是徽标贴在车辆标题区右上角的
  // 现有样子;v2 把徽标挪到状态行(New/Received/...)最前面、配一个可以
  // 点开说明弹层的 info 图标,细节见下面徽标/状态行相关的注释和
  // fragments/InformationDialog/notes.md。由 OfferDashboard 的 Controls
  // 统一控制,不是这个组件自己默认切换的。
  dialogVersion: { type: String, default: 'v1' }
})
const emit = defineEmits(['update:modelValue', 'close', 'decline', 'accept', 'send-counter', 'send-offer', 'prev', 'next'])

const isBuyer = computed(() => props.viewerRole === 'buyer')
const isMakeOffer = computed(() => props.offerType === 'make-offer')
// 2026-09-02 按 Figma node 7597:112866(In Negotiation 徽标出现在车辆信息
// 行右上角)新增,复用 fragments/ImageBadge——和 OfferCard 图片上的徽标
// 是同一个组件。这里不传 ring,走默认样式(深色底,无描边无投影)——
// 按你的要求,dialog 上的徽标不需要 ring 版本的描边/投影,和 Card 图片上
// 需要靠描边+投影提升可辨识度的场景不一样(dialog 里徽标本身就在浅灰底
// 卡片上,不存在"和图片背景混在一起看不清"的问题)。Make Offer 沿用
// ImageBadge 已核实的白底+灰描边样式,保持两种类型一致的视觉语言。
// 2026-09-02 新增 v2 之后,这个位置(车辆标题区右上角)的徽标只在
// dialogVersion==='v1' 时渲染——v2 把徽标挪到下面的状态行,两个位置
// 不会同时出现同一个徽标,细节见下面状态行附近的注释。
const offerTypeLabel = computed(() => (isMakeOffer.value ? 'Make Offer' : 'In Negotiation'))

// 2026-09-02 v2 徽标内 info 图标的说明弹层——点外部/按 Escape 关闭,照抄
// OfferTableHeader.vue "Type" 信息图标弹层的同一套惯例(这个项目里弹层
// 组件一贯的关闭方式,DealershipFilterDropdown/Pagination 下拉也是同一套)
const showTypeGuide = ref(false)
const typeInfoBtnRef = ref(null)
const typeGuideRef = ref(null)
function handleTypeGuideOutsideClick(event) {
  if (!showTypeGuide.value) return
  if (typeInfoBtnRef.value?.contains(event.target)) return
  if (typeGuideRef.value?.contains(event.target)) return
  showTypeGuide.value = false
}
function handleTypeGuideEscapeKey(event) {
  if (event.key === 'Escape') showTypeGuide.value = false
}
onMounted(() => {
  document.addEventListener('mousedown', handleTypeGuideOutsideClick)
  document.addEventListener('keydown', handleTypeGuideEscapeKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleTypeGuideOutsideClick)
  document.removeEventListener('keydown', handleTypeGuideEscapeKey)
})
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

// 2026-09-02 按你的要求更正:In Negotiation 里买卖双方可以连续出价——
// 不用等对方回复,只要遵守价格规则(自己这次的出价要比自己上一次更靠近
// 对方,即买家更高/卖家更低),就可以在 dealState==='sent' 时(还在等对方
// 回复)再发一次 counter,不是只能在 dealState==='received'(轮到你)时
// 才能出价。这个价格规则不需要单独写新的校验逻辑——"Between
// {{buyerAmount}} and {{sellerAmount}}"这条已有的范围本来就是"买家最新
// 数字到卖家最新数字之间"(buyerAmount/sellerAmount 只看当前买卖双方各自
// 最新的数字,不关心 dealState 是 received 还是 sent),连续出价时这个
// 范围天然就等价于"比自己上一次出价更靠近对方",不用额外判断。
// Make Offer 不受这条影响,规则不变:Received(卖家视角)只能
// Accept/Decline,没有输入面板;Sent 只有 buyer 才能再抬价("Raise Your
// Offer"),seller 在 Make Offer 上没有 Sent 状态。
const inputPanel = computed(() => {
  if (isClosed.value || confirmingAccept.value) return null
  if (props.dealState !== 'received' && props.dealState !== 'sent') return null
  if (!isMakeOffer.value) return 'counter'
  if (props.dealState === 'sent' && isBuyer.value) return 'offer'
  return null
})

// "Offer States Logic for CC.md" Split The Difference 一节,原本三个条件
// 缺一不可:1. 类型是 In Negotiation(Make Offer 永远没有);2. 双方都有
// 数字;3. 轮到你(dealState==='received')。【2026-09-02 更正】第3条
// 跟着上面 inputPanel 的改动放宽——In Negotiation 现在 sent 状态下也能
// 发 counter,Split The Difference 这个输入面板内的快捷选项理应跟着
// 输入面板一起出现,不再限定只有 received 才显示,改成直接复用
// inputPanel==='counter' 这个判断(等价于"是 In Negotiation 并且当前在
// 走 counter 流程",不用再单独重复 !isMakeOffer 这个条件)。
const showSplitDifference = computed(() =>
  inputPanel.value === 'counter' && !!props.counterpartyAmount && !!props.ownAmount
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  padding: 40px 16px;
  box-sizing: border-box;
  z-index: 1000;
}

/* 2026-09-02 新增,包住 .info-dialog 本身(不包 overlay 的内边距),让下面
   两个按钮可以用 right:100%/left:100% 相对"对话框卡片的边缘"定位,而不是
   相对整个视口——否则视口越宽,按钮离对话框实际的视觉距离就越远,和
   "16px 间距"这个诉求矛盾。display:inline-flex 让这个容器收缩到刚好包住
   .info-dialog(52px 圆形导航按钮本身用 position:absolute 不占布局空间,
   不会撑大这个容器)。 */
.info-dialog__stage {
  position: relative;
  display: inline-flex;
}
/* 细节(为什么文字是深色不是白色)见模板里这两个按钮旁边的注释。
   right:100%/left:100% 贴 stage(= 对话框卡片)的左右边缘,margin 16px
   撑出和对话框的固定间距——你反馈"距离dialog太远"(原来是贴视口边缘
   固定24px,屏幕越宽实际间距越大),改成这样贴对话框卡片本身。 */
.info-dialog__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
}
.info-dialog__nav--prev {
  right: 100%;
  margin-right: 16px;
}
.info-dialog__nav--next {
  left: 100%;
  margin-left: 16px;
}
.info-dialog__nav-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #FFFFFF;
  color: #212121;
}
.info-dialog__nav-label {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0.15px;
  color: #FFFFFF;
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
  position: relative;
  display: flex;
  gap: 16px;
  padding: 14px;
  border-radius: 4px;
  background: #F7F7F8;
}

/* 2026-09-02 按 Figma node 7597:112866 新增,徽标贴着这一块的右上角,
   数值(top/right)是照这个节点量出来的比例估的,不是像素级核实——那个
   节点的车辆信息行是574px宽对话框里的一个固定尺寸块,和我们520px宽
   对话框、14px padding 不是同一套坐标,直接照抄像素反而会对不上 */
.info-dialog__type-badge {
  position: absolute;
  top: 14px;
  right: 14px;
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

/* 2026-09-02 v2 新增:你要求"status chip match to type badge 的高度"——
   type badge(ImageBadge)高度是 24px,这几个状态 chip 原来是 22px(见上面
   .info-dialog__chip 的 height:22px)。只在 v2 时加 1px 上下 padding
   (4px→5px,水平 padding 不变),22px + 2px = 24px,刚好和徽标对齐,不
   直接改 .info-dialog__chip 本身的高度(v1 还是原来的 22px,不受影响)。 */
.info-dialog__chip--v2 {
  height: 24px;
  padding: 5px 8px;
}

/* 2026-09-02 v2 新增:徽标从车辆标题区挪到状态行最前面,复用同一个
   ImageBadge 组件(样式跟 v1 的徽标完全一样,深色底/白底两种颜色不变),
   只是这次多传了一个 slot(info 图标按钮 + 说明弹层),ImageBadge 本身
   已经加了 gap:4px,图标会自动跟文字之间空出一点距离,不需要在这里
   单独设 margin。position:relative 让下面的说明弹层可以用 position:
   absolute 相对徽标自己定位,不用再包一层额外的容器。 */
.info-dialog__type-badge-v2 {
  flex-shrink: 0;
}

.info-dialog__type-info-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  /* <button> 默认不继承祖先的 color(浏览器 UA 样式表给了它自己的默认
     文字色),显式 inherit 才能让图标的 currentColor 真的拿到徽标的
     文字色(白色/深色),不然会一直是浏览器默认的黑色 */
  color: inherit;
}

/* 2026-09-02 v2 新增:说明弹层,内容/结构/样式跟 OfferTableHeader.vue 里
   "Type" 信息图标弹出的那张卡片完全一样(你要求"用dashboard table上的
   同样的tooltip")——因为 Vue SFC 的 <style scoped> 不会跨组件文件生效,
   这里必须重复一份同样数值的 CSS,不是重新设计。定位从"贴表头单元格
   左下方"改成"贴徽标左下方"(top: calc(100% + 10px); left: 0),因为
   这次的锚点(徽标本身,24px高)比表头那个信息图标(20×20)矮一些、
   出现的位置也不一样,箭头/间距的绝对数值跟着调整,不是照抄表头那份
   数值,但卡片本身(背景/圆角/阴影/字号/两个section的结构/Got it按钮)
   和表头一模一样。 */
.info-dialog__type-guide {
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
}

.info-dialog__type-guide-arrow {
  position: absolute;
  top: -8px;
  left: 12px;
  width: 16px;
  height: 8px;
  background: #F5FBFF;
  clip-path: polygon(50% 0, 0 100%, 100% 100%);
}

.info-dialog__type-guide-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.info-dialog__type-guide-title {
  font-size: 20px;
  font-weight: 500;
  line-height: 30px;
  letter-spacing: 0.15px;
  color: #0E0E0F;
}

.info-dialog__type-guide-close {
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

.info-dialog__type-guide-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.info-dialog__type-guide-desc {
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0.1px;
  color: #0E0E0F;
}

.info-dialog__type-guide-desc strong {
  font-weight: 500;
}

.info-dialog__type-guide-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.info-dialog__type-guide-btn {
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
