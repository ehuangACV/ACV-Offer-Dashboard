<!--
  ═══════════════════════════════════════════════════════════
  METADATA (Playground 读取用,不是最终页面渲染的一部分)
  name: Offer Card
  group: 卡片视图 (Card View)
  order: 40
  description: >
    Offers 页面"卡片/网格视图"(tile view)里的一张卡片,对应 ACV 通用
    Auction Card 结构(见 acv-auction-cards 技能):图片区(带经销商/
    lane 徽标 + OfferTypeBadge 状态徽标)+ Vehicle Detail 区(标题/里程·
    VIN/Auction ID)+ Flexible 区(倒计时 + New/Received StatusChip +
    分隔线 + 一句话消息)。之后会有不同 scenario 复用这个组件传不同数据,
    所以除了标题/里程/VIN/Auction ID 之外的字段都做成可选(v-if),不强
    制要求每张卡都有倒计时或消息文案。
  path: fragments/OfferCard/OfferCard.vue
  source_of_truth: >
    Figma 文件 "Offers - Negotiation" (fileKey 4z7FK34Fgit7Fi9UxZu0za),
    "tile version" 主帧 node-id 7432:68669,卡片节点
    6837:69394→7432:69394("Card/General Auction/Desktop",hidden=false)。
    get_design_context 核实:
    - 卡片容器:白底,边框 1px #E8E9EB,圆角 12px,内容 flex-col gap 12px,
      底部 padding 12px。
    - 图片区:高 210px,宽度撑满,object-fit cover(真实设计里是一张
      600px 素材裁切居中,组件简化成普通图片填充)。
    - 图片区左下角叠了两个徽标(同一行,y 几乎一致):
      1. OfferTypeBadge 状态徽标(In Negotiation / Make Offer)——
         【重要】这两个状态在卡片上的样式和表格里的 OfferTypeBadge
         **不完全一样**,是两套独立核实的数值,没有强行复用同一个组件:
         · In Negotiation(节点 7432:69450):背景 #1C1D1F,白字,圆角
           **8px**,**没有边框**,padding 6px/2px——表格版本是圆角3px
           带白色描边,这里明确不一样。
         · Make Offer(节点 7441:5248/5254):外层包裹框边框 1px
           #8D9199 圆角3px,内层白底芯片圆角3px padding6px/4px 文字
           #0E0E0F——这个和表格版本的 Make Offer 数值完全一致。
      2. 经销商/lane 徽标(节点 7432:69403,Figma 图层名叫 "lanes" 但
         实际内容是经销商名 "CarMax Boston"):背景
         rgba(0,0,0,0.4) + backdrop-blur(0.75px),白字 12px letter-
         spacing .4px,圆角 8px,padding 10px/2px。两个徽标间距按真实
         坐标算出来是 5px(18+93=111 到 116),用了文件里确认存在的
         Space/6(6px)token 代替,不是瞎猜的整数。
    - Vehicle Detail 区(节点 7432:69405,无额外 gap,靠各行本身的
      line-height 撑开):
      1. 车辆标题 16px Medium 色 #0E0E0F(注意:Figma 里这个示例的文字
         字面就是 "Year Make Model",看起来像是设计师忘记替换的占位
         文案,不是我编的,已经在 status 里标注,不要当成"真实车型名"。
      2. "{mileage} ・ VIN {vin} [复制图标]" 14px Regular 色 #55575C,
         VIN 后面跟一个复制图标(节点 7432:69414,已下载真实 SVG),
         点击会把 VIN 复制到剪贴板(图标本身的常规含义,不是我加的
         额外功能)。
      3. "Auction ID: {auctionId}" 14px Regular 色 #55575C。
    - Flexible 区(节点 7432:69434,gap 8px)——Figma 文件里有现成的
      "_block/Card-Auction Details" 库组件,但在这个实例里是 hidden=
      true 没有用上,实际可见的是一个自定义组合(符合 acv-auction-cards
      技能里"自定义 Flexible 区也可以,只要遵守间距/字号/颜色规范"的
      要求):
      1. 倒计时行:Clock 图标(16×16,已下载真实 SVG)+ "45m Left" 14px
         Medium 色 #CC433A(text/system/danger),右侧并排 New/Received
         两个小 chip——颜色数值(New 背景#F4FFF6 文字#006C4C,Received
         背景#F0F8FF 文字#0061A5)和已核实的 fragments/StatusChip 完全
         一致,直接复用该组件(New 这里没有 icon,所以传
         show-icon="false")。
      2. 分隔线,色 #EBEBEB,高 1px。
      3. 消息块:主消息 14px Medium 色 #0E0E0F(如"Seller countered
         $4,500"),副消息 14px Regular 色 #55575C(如"You offered
         $3,800 · Today, 08:45 AM")。
  status: >
    图片区右上角原本有一列 hidden=true 的 Controls 图标(watchlist /
    hide / note / more,4 个,节点 7432:69398),不是当前可见设计,没有
    实现,如果这些操作按钮其实需要显示,请指出来(acv-auction-cards
    技能里对这类图标按钮有"最多3个按钮/悬停要带tooltip"的规则,到时候
    要一并遵守)。
    车辆标题示例文案 "Year Make Model" 看起来是设计师留下的占位符,不是
    真实车型名,mock.js 里暂时原样保留,等你给真实 scenario 数据时再替换。
    "45m Left" 这个倒计时/New+Received 状态行、"Auction ID: xxx" 这一行、
    消息块,是否在所有卡片场景下都会出现,还是只在特定状态下才显示,
    目前只看到这一个例子,已经把它们做成可选(不传就不渲染),具体规则
    等你给不同 scenario 后再确认。

    【2026-08 新增 hover 按钮,V1/V2 两个版本】对照节点 7498:68345 核实
    的 V1:鼠标 hover 卡片时,INFO 区变模糊(该节点自己带了 blur-[2px]
    class,不是我加的),叠一层三个按钮(Primary Action / Secondary /
    Tertiary)。Tertiary 在这个 Figma 实例里 Code Connect 映射的也是
    secondary 样式的按钮组件,视觉上和 Secondary 一样,不是我漏做区分。
    按钮本身的具体 padding/字号在 Figma 里是外部 acv-shared-vuejs
    Button 组件,没有给出像素级样式——渐变色沿用了本项目已核实过的同一个
    Gradient/Button token 数值(DealershipFilterDropdown "Apply Filter"
    按钮那个渐变),不是重新单独核实的,其余 padding/圆角是合理估的药丸
    形状,待确认。新增 `buttonVersion` prop('v1'/'v2'/其它值都不渲染),
    Playground Controls 面板可以切换。

    【2026-08 V2 到货,对照节点 7499:69479 核实】和 V1 结构上完全不同,
    不只是"按钮数量不一样":
    - 按钮**不是** hover 才出现的绝对定位浮层,是正常排在 `.offer-card__
      info` 信息区最下面、一直可见的普通流内元素(Figma JSX 里这块在
      "INFO" 容器内部,是它的第三个子元素,没有任何 absolute/blur 相关
      class),所以 hover 卡片**不会**触发模糊——这是和 V1 最本质的区别,
      不是缺失了模糊效果,是这个版本本来就不需要。
    - 只有 **2 个**按钮(Primary Action + Secondary),没有 V1 的
      Tertiary。
    - 按钮上方多一条分隔线(#EBEBEB,复用了和消息块上方那条一样的
      `.offer-card__divider`,该节点里确实是这么排的,不是我多画的)。
    - 为了不让这条新按钮块被"卡片 hover → INFO 模糊"这条 V1 专属规则
      误伤(V2 按钮现在也在 `.offer-card__info` 里面),给卡片根节点加了
      `.offer-card--v1` 修饰类(`buttonVersion === 'v1'` 时才加),模糊
      规则改成只在 `.offer-card--v1:hover` 时生效,V2 模式下 hover 卡片
      按钮一直清晰可见。
    - 【待你确认】V2 这个 Figma 帧里 mileage/VIN/Auction ID 这几行文字
      量出来是 12px,V1 对应帧里是 14px——目前判断这大概率是设计稿复制
      出两个卡片帧时手滑改动的字号漂移,不是"V2 整张卡片都要改小字号"
      这种有意的设计变更,所以**没有**跟着改小,组件里两个版本共享同一套
      14px 的 Vehicle Detail 样式。如果 V2 其实真的要求整卡缩字号,请
      明确告知,目前只是没有主动去猜。

    【2026-08 V1 补充:按钮数量 1/2/3,对照节点 7501:69741 核实】你给的
    这个新节点是同一张 V1 卡片的两个真实实例(1 个按钮/2 个按钮),不是
    我猜的"按钮少了该显示哪个":
    - 1 按钮实例:只有 Primary Action。
    - 2 按钮实例:Primary Action + 一个描边按钮,这个描边按钮 Figma 里
      的 layer 名字/label 字面就是 "Tertiary"(不是 "Secondary"),视觉
      上和 Secondary 一样(都是描边药丸),所以组件里"2 按钮"时显示的是
      Primary + Tertiary,不是 Primary + Secondary——照抄 Figma 字面
      结果,不是我自己选的搭配。
    - 新增 `buttonCount` prop(1/2/3,默认 3,只在 buttonVersion==='v1'
      时生效),对应产生 3 个组合。
    - 【重要发现,不是我编的规则】hover 模糊的范围也跟着按钮数量变化,
      三个数量在 Figma 里各自标的 blur-[2px] 范围本来就不一样:
      1 按钮只模糊车辆信息(标题/里程/VIN/Auction ID);2 按钮车辆信息+
      倒计时/状态chip 那一行一起模糊,消息块不模糊;3 按钮(即之前
      7498:68345 核实的版本)连消息块也模糊,等于整个 info 区。推测原因
      是浮层按钮块本身的高度随按钮数量变化,盖住的信息区范围跟着变,不是
      设计师标错——已经把之前"V1 hover 统一模糊整个 info"的规则拆成按
      `buttonCount` 区分的三条规则,3 按钮时行为和之前完全一样(向后兼容
      默认值)。

    【2026-08 按你的要求:V1 hover 按钮改名 + 卡片图片进 VDP】
    - V1 hover 浮层的 Primary 按钮文案从占位的 "Primary Action" 改成
      "Manage Offer"——这是你直接给的业务命名,不是 Figma 核实到的文案
      (Figma 里这颗按钮字面就是占位符 "Primary Action"),只改了 V1
      (hover 才出现的这个按钮),V2 一直可见的 Primary 按钮文案没有动,
      按你的原话"hover on 的action"来看应该只针对 hover 触发的这个。
      Secondary/Tertiary 按钮文案也没有动。
    - 卡片图片(`.offer-card__image`)现在也包了一层
      `<a target="_blank">` 链去 VDP 占位页(`assets/vdp/vdp-page.html`),
      和表格视图 `OfferTableRow` 点缩略图的行为保持一致——细节/取舍(为
      什么是占位页不是真的 VDP 集成)见 fragments/OfferTableRow/notes.md,
      这里不重复。
  ═══════════════════════════════════════════════════════════
-->
<template>
  <div
    class="offer-card"
    :class="{
      'offer-card--v1': buttonVersion === 'v1',
      'offer-card--v1-btn-1': buttonVersion === 'v1' && v1ButtonCount === 1,
      'offer-card--v1-btn-2': buttonVersion === 'v1' && v1ButtonCount === 2,
      'offer-card--v1-btn-3': buttonVersion === 'v1' && v1ButtonCount === 3
    }"
  >
    <!-- 2026-08 按你的要求:点卡片图片也进 VDP,和表格视图
         (OfferTableRow)点缩略图的行为保持一致,同样是先用占位截图页
         (assets/vdp/vdp-page.html)示意这个交互位置,细节/取舍见
         fragments/OfferTableRow/notes.md,这里不重复贴一遍。 -->
    <a
      href="/assets/vdp/vdp-page.html"
      target="_blank"
      rel="noopener"
      class="offer-card__image"
    >
      <img v-if="photoUrl" :src="photoUrl" alt="" class="offer-card__photo">
      <div class="offer-card__image-badges">
        <span
          v-if="offerType !== 'none'"
          class="offer-card__type-badge"
          :class="`offer-card__type-badge--${offerType}`"
        >{{ offerTypeLabel }}</span>
        <span v-if="dealerName" class="offer-card__lane-badge">{{ dealerName }}</span>
      </div>
    </a>

    <div class="offer-card__info">
      <div class="offer-card__vehicle">
        <div class="offer-card__vehicle-title">{{ vehicleTitle }}</div>
        <div class="offer-card__vehicle-sub">
          <span>{{ mileage }}</span>
          <span>・</span>
          <span class="offer-card__vin">
            VIN {{ vin }}
            <button type="button" class="offer-card__copy-btn" aria-label="Copy VIN" @click="copyVin">
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.52941 9.6C3.20588 9.6 2.92902 9.4826 2.69882 9.2478C2.46824 9.0126 2.35294 8.73 2.35294 8.4V1.2C2.35294 0.87 2.46824 0.5874 2.69882 0.3522C2.92902 0.1174 3.20588 0 3.52941 0H8.82353C9.14706 0 9.42412 0.1174 9.65471 0.3522C9.8849 0.5874 10 0.87 10 1.2V8.4C10 8.73 9.8849 9.0126 9.65471 9.2478C9.42412 9.4826 9.14706 9.6 8.82353 9.6H3.52941ZM1.17647 12C0.852941 12 0.575882 11.8826 0.345294 11.6478C0.115098 11.4126 0 11.13 0 10.8V3C0 2.83 0.0564707 2.6874 0.169412 2.5722C0.281961 2.4574 0.421569 2.4 0.588235 2.4C0.754902 2.4 0.894706 2.4574 1.00765 2.5722C1.1202 2.6874 1.17647 2.83 1.17647 3V10.8H7.05882C7.22549 10.8 7.36529 10.8576 7.47824 10.9728C7.59078 11.0876 7.64706 11.23 7.64706 11.4C7.64706 11.57 7.59078 11.7124 7.47824 11.8272C7.36529 11.9424 7.22549 12 7.05882 12H1.17647Z" fill="#55575C"/>
              </svg>
            </button>
          </span>
        </div>
        <div v-if="auctionId" class="offer-card__auction-id">Auction ID: {{ auctionId }}</div>
      </div>

      <div v-if="timeLeft || statusNew || statusReceived || statusSent || statusDeclined || primaryMessage" class="offer-card__flex-section">
        <div v-if="timeLeft || statusNew || statusReceived || statusSent || statusDeclined" class="offer-card__flex-row">
          <div v-if="timeLeft" class="offer-card__time-left">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 13.3333C9.41449 13.3333 10.771 12.7714 11.7712 11.7712C12.7714 10.771 13.3333 9.41449 13.3333 8C13.3333 6.58551 12.7714 5.22896 11.7712 4.22876C10.771 3.22857 9.41449 2.66667 8 2.66667C6.58551 2.66667 5.22896 3.22857 4.22876 4.22876C3.22857 5.22896 2.66667 6.58551 2.66667 8C2.66667 9.41449 3.22857 10.771 4.22876 11.7712C5.22896 12.7714 6.58551 13.3333 8 13.3333ZM8 1.33333C8.87548 1.33333 9.74239 1.50577 10.5512 1.8408C11.3601 2.17583 12.095 2.6669 12.714 3.28595C13.3331 3.90501 13.8242 4.63994 14.1592 5.44878C14.4942 6.25761 14.6667 7.12452 14.6667 8C14.6667 9.76811 13.9643 11.4638 12.714 12.714C11.4638 13.9643 9.76811 14.6667 8 14.6667C4.31333 14.6667 1.33333 11.6667 1.33333 8C1.33333 6.23189 2.03571 4.5362 3.28595 3.28595C4.5362 2.03571 6.23189 1.33333 8 1.33333ZM8.33333 4.66667V8.16667L11.3333 9.94667L10.8333 10.7667L7.33333 8.66667V4.66667H8.33333Z" fill="#CC433A"/>
            </svg>
            {{ timeLeft }}
          </div>
          <div v-if="statusNew || statusReceived || statusSent || statusDeclined" class="offer-card__status-pills">
            <StatusChip v-if="statusNew" status="new" label="New" :show-icon="false" />
            <StatusChip v-if="statusReceived" status="received" label="Received" />
            <StatusChip v-if="statusSent" status="sent" label="Sent" />
            <StatusChip v-if="statusDeclined" status="declined" label="Declined" />
          </div>
        </div>

        <template v-if="primaryMessage">
          <div class="offer-card__divider" />
          <div class="offer-card__message">
            <div class="offer-card__message-primary">{{ primaryMessage }}</div>
            <div v-if="secondaryMessage" class="offer-card__message-secondary">{{ secondaryMessage }}</div>
          </div>
        </template>
      </div>

      <!-- 2026-08 按你的要求新增,对照节点 7499:69479 核实的 V2 版本:
           按钮不是 hover 才出现,是正常排在卡片信息区最下面,一直可见,
           没有模糊效果,只有 Primary + Secondary 两个按钮(没有V1那个
           Tertiary)。按钮上方多一条分隔线(#EBEBEB,该节点里确实是
           message 下面又加了一条,不是我多画的)。 -->
      <template v-if="buttonVersion === 'v2'">
        <div class="offer-card__divider" />
        <div class="offer-card__v2-buttons">
          <button type="button" class="offer-card__hover-btn offer-card__hover-btn--primary">Primary Action</button>
          <button type="button" class="offer-card__hover-btn offer-card__hover-btn--secondary">Secondary</button>
        </div>
      </template>
    </div>

    <!-- 2026-08 按你的要求新增,对照节点 7498:68345 核实的 V1 版本:鼠标
         hover 卡片时,信息区变模糊,叠一层按钮。
         【2026-08 补充,对照节点 7501:69741 核实】V1 不是只有 3 按钮
         一种效果,这个新节点里同一个 V1 卡片给了 1 按钮/2 按钮两个真实
         实例:1 按钮时只有 Primary Action;2 按钮时是 Primary Action +
         一个标签写着 "Tertiary" 的描边按钮(和 Secondary 视觉完全一样,
         这个实例里就是叫 Tertiary,不是我瞎猜按钮数量少了该保留哪个)。
         新增 `buttonCount` prop(1/2/3,默认 3)控制显示几个按钮。 -->
    <div v-if="buttonVersion === 'v1'" class="offer-card__hover-buttons">
      <button type="button" class="offer-card__hover-btn offer-card__hover-btn--primary">Manage Offer</button>
      <button v-if="v1ButtonCount === 3" type="button" class="offer-card__hover-btn offer-card__hover-btn--secondary">Secondary</button>
      <button v-if="v1ButtonCount >= 2" type="button" class="offer-card__hover-btn offer-card__hover-btn--tertiary">Tertiary</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import StatusChip from '../StatusChip/StatusChip.vue'

const props = defineProps({
  photoUrl: { type: String, default: '' },
  // in-negotiation | make-offer | none
  offerType: { type: String, default: 'in-negotiation' },
  dealerName: { type: String, default: 'CarMax Boston' },
  vehicleTitle: { type: String, default: 'Year Make Model' },
  mileage: { type: String, default: '250,000 miles' },
  vin: { type: String, default: '192211' },
  auctionId: { type: String, default: '452161' },
  timeLeft: { type: String, default: '45m Left' },
  statusNew: { type: Boolean, default: true },
  statusReceived: { type: Boolean, default: true },
  // 2026-08 按你的要求新增,业务逻辑说明见 fragments/OfferTableRow 的
  // METADATA(Sent=发出counter/offer,Declined=deal被拒绝,New可以和其他
  // 三个状态同时出现)
  statusSent: { type: Boolean, default: false },
  statusDeclined: { type: Boolean, default: false },
  primaryMessage: { type: String, default: 'Seller countered $4,500' },
  secondaryMessage: { type: String, default: 'You offered $3,800 · Today, 08:45 AM' },
  // 2026-08 按你的要求新增:卡片上的按钮有 V1/V2 两个版本,在 Playground
  // 的 Controls 面板切换看效果。none = 不显示按钮(之前的样子)。
  buttonVersion: { type: String, default: 'v1' },
  // 2026-08 按你的要求新增,对照节点 7501:69741 核实:V1 下按钮数量可以
  // 是 1/2/3 个,悬浮时模糊的范围也跟着按钮数量变化(见下面 CSS 注释),
  // 只在 buttonVersion==='v1' 时生效,V2 不受影响。
  buttonCount: { type: [String, Number], default: 3 }
})

const offerTypeLabel = computed(() =>
  props.offerType === 'make-offer' ? 'Make Offer' : 'In Negotiation'
)

const v1ButtonCount = computed(() => Number(props.buttonCount) || 3)

function copyVin() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(props.vin).catch(() => {})
  }
}
</script>

<style scoped>
/* 2026-08 按你的要求(Dashboard 全屏卡片视图要响应式,卡片间距永远固定
   16px):原来这里有个 max-width:400px,没有对应的 Figma 核实记录,是
   之前随手加的防御性上限。card-grid 从写死 repeat(3,1fr) 改成
   auto-fit+minmax(280px,1fr) 之后,这个 400px 上限会在网格算出的列宽
   超过 400px 时把卡片卡住不再撑满,导致卡片和卡片之间看起来空隙比
   16px 更大(卡片本身没填满格子,不是 grid gap 变大了)。既然
   auto-fit 本身就会在卡片快要变太宽的时候自动多开一列、有自限效果,
   这个额外的 400px 硬上限已经不需要,删掉让卡片始终 100% 填满格子。 */
.offer-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding-bottom: 12px;
  background: #FFFFFF;
  border: 1px solid #E8E9EB;
  border-radius: 12px;
  overflow: hidden;
  font-family: 'Roboto', sans-serif;
  box-sizing: border-box;
}

/* 2026-08 按你的要求新增,对照节点 7498:68345 核实的 V1 hover 按钮。
   信息区 hover 时变模糊(节点里 INFO 区本身带了 blur-[2px] class)+
   浮层三个按钮(gradient primary/描边 secondary/tertiary,tertiary 在
   这个 Figma 实例里 Code Connect 映射的也是 secondary 样式的按钮组件,
   视觉上和 secondary 一样,不是我少做了区分)。按钮本身的具体
   padding/字号在 Figma 里通过 Code Connect 换成了项目外部的
   acv-shared-vuejs Button 组件,没有给出像素级样式——渐变色沿用了
   本项目里已经核实过的同一个 Gradient/Button token 数值(DealershipFilterDropdown
   的 "Apply Filter" 按钮:160deg,#F26522 13.86% → #FC4243 86.14%),
   不是重新单独核实这颗按钮量出来的,其余 padding/圆角是合理估的药丸
   形状,待确认。 */
/* 只在 V1 模式下 hover 才模糊——V2 的按钮也在 .offer-card__info 里面,
   如果这条规则不限定 .offer-card--v1,V2 模式下 hover 卡片也会把它自己
   一直可见的按钮跟着模糊掉,那是不对的,两个版本是完全独立的交互 */
/* 2026-08 对照节点 7501:69741 核实:模糊范围不是固定"整个 info 区",
   是随按钮数量变化的——按钮越少,浮层按钮块本身越矮,盖住的信息区范围
   越小,Figma 里三个按钮数量的真实实例各自标注的 blur-[2px] 范围本来
   就不一样(不是设计师漏标,是这几个实例分别核实到的真实数值):
   - 1 个按钮(7501:69741 下面那张卡):只模糊车辆信息(标题/里程/VIN/
     Auction ID)。
   - 2 个按钮(7501:69741 上面那张卡):车辆信息 + 倒计时/状态chip 那一
     行都模糊,消息块不模糊。
   - 3 个按钮(7498:68345):连最下面的消息块也一起模糊,等于整个 info
     区。 */
.offer-card--v1-btn-1:hover .offer-card__vehicle {
  filter: blur(2px);
}
.offer-card--v1-btn-2:hover .offer-card__vehicle,
.offer-card--v1-btn-2:hover .offer-card__flex-row {
  filter: blur(2px);
}
.offer-card--v1-btn-3:hover .offer-card__info {
  filter: blur(2px);
}

/* V2(节点 7499:69479):按钮正常排在信息区最下面,一直可见,不需要
   hover/blur 效果,和 V1 的 hover 浮层是两套完全不同的实现 */
.offer-card__v2-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

/* 2026-08 你指出按钮位置要按截图调整:之前用 top:222px + bottom:12px +
   justify-content:center 把按钮块拉伸铺满卡片下半部分再居中,对3个按钮
   的情况凑巧看起来还行(内容差不多正好填满这段空间),但1个/2个按钮时
   按钮就会被居中显示在下半部分中间,跟截图里"按钮紧贴在车辆信息下面"
   的位置完全不对。改成不再拉伸铺满、不再居中——直接照 Figma 三个按钮
   数量各自核实到的数值(top 215~224px,取中间值 220px;水平边距
   ~11px,不是之前沿用车辆信息区的16px padding)定位,按钮块自己的高度
   完全由内容撑开(pt8px+按钮+gap8px+pb16px),1个按钮时块矮、紧贴在
   车辆信息下面,2/3个按钮时块跟着变高,不再需要手动居中。 */
.offer-card__hover-buttons {
  position: absolute;
  left: 11px;
  right: 11px;
  top: 220px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 16px 16px;
  box-sizing: border-box;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s ease;
  backdrop-filter: blur(2px);
}

.offer-card:hover .offer-card__hover-buttons {
  opacity: 1;
  visibility: visible;
}

.offer-card__hover-btn {
  width: 100%;
  padding: 10px 16px;
  border-radius: 100px;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  box-sizing: border-box;
}

.offer-card__hover-btn--primary {
  border: none;
  background: linear-gradient(160deg, #F26522 13.86%, #FC4243 86.14%);
  color: #FFFFFF;
}

.offer-card__hover-btn--secondary,
.offer-card__hover-btn--tertiary {
  border: 1px solid #F26522;
  background: #FFFFFF;
  color: #F26522;
}

.offer-card__image {
  display: block;
  position: relative;
  width: 100%;
  height: 210px;
  background: #DCDFE8;
  flex-shrink: 0;
}

.offer-card__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.offer-card__image-badges {
  position: absolute;
  left: 16px;
  bottom: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Card 上的状态徽标,和表格里的 OfferTypeBadge 数值不完全一样,见 METADATA */
.offer-card__type-badge {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.4px;
  white-space: nowrap;
}
.offer-card__type-badge--in-negotiation {
  background: #1C1D1F;
  color: #FFFFFF;
  border-radius: 8px;
  padding: 2px 6px;
}
.offer-card__type-badge--make-offer {
  background: #FFFFFF;
  color: #0E0E0F;
  border: 1px solid #8D9199;
  border-radius: 3px;
  padding: 4px 6px;
}

.offer-card__lane-badge {
  display: inline-flex;
  align-items: center;
  backdrop-filter: blur(0.75px);
  background: rgba(0, 0, 0, 0.4);
  color: #FFFFFF;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.4px;
  text-align: right;
  white-space: nowrap;
  border-radius: 8px;
  padding: 2px 10px;
}

.offer-card__info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 16px;
}

.offer-card__vehicle {
  display: flex;
  flex-direction: column;
}

.offer-card__vehicle-title {
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: #0E0E0F;
}

.offer-card__vehicle-sub {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 14px;
  line-height: 21px;
  letter-spacing: 0.25px;
  color: #55575C;
}

.offer-card__vin {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.offer-card__copy-btn {
  display: inline-flex;
  align-items: center;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
}

.offer-card__auction-id {
  font-size: 14px;
  line-height: 21px;
  letter-spacing: 0.25px;
  color: #55575C;
}

.offer-card__flex-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.offer-card__flex-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.offer-card__time-left {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0.1px;
  color: #CC433A;
}

.offer-card__status-pills {
  display: flex;
  align-items: center;
  gap: 6px;
}

.offer-card__divider {
  height: 1px;
  background: #EBEBEB;
}

.offer-card__message {
  display: flex;
  flex-direction: column;
}

.offer-card__message-primary {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0.1px;
  color: #0E0E0F;
}

.offer-card__message-secondary {
  font-size: 14px;
  line-height: 21px;
  letter-spacing: 0.25px;
  color: #55575C;
}
</style>
