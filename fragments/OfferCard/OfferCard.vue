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

    【2026-08 按你给的 "Offer card — content & interaction spec" 重写内容
    模型】你明确说"card 的 layout 和 hover 的 interaction 都不需要调整,
    只需要改 copy,和应该对应显示的状态"——这次改动没有动卡片的整体结构
    (图片区/Vehicle Detail 区/Flexible 区/hover 浮层这套 DOM 骨架不变),
    也没有动 hover 时"模糊+按钮块浮出"这套底层机制,改的是:
    1. 用 `dealState`('received'/'sent'/'declined'/'expired')+ `isNew`
       两个 prop 取代原来 4 个互相独立的布尔值
       (statusNew/statusReceived/statusSent/statusDeclined)——原来的写法
       可以传出"同时 Received+Sent"这种规范里明确禁止的非法组合,新的写法
       从结构上就不可能选出两个状态芯片。`isNew` 只在 `dealState` 是
       received/declined 时才会真的渲染(规范:"New 从不和 Sent 一起
       出现")。
    2. 新增 `viewerRole`('buyer'/'seller')prop——这是这份规范第一次把
       "谁在看这张卡"变成一个需要感知的维度,之前组件完全不区分买家/卖家
       视角。
    3. 原来 `primaryMessage`/`secondaryMessage` 两个自由文本 prop 删掉了,
       改成由 `viewerRole` + `offerType` + `dealState` + 几个数值/时间戳
       prop(`counterpartyAmount`/`ownAmount`/`ownTimestamp`/`expiredAt`/
       `gapAmount`+`showGap`)在组件内部按规范里两张表(buyer/seller)逐条
       算出来——这样这两行文案不可能被手写成不符合规范的措辞(比如在芯片
       文字里重复"Received"这种规范明确禁止的写法)。9 种"角色×类型×状态"
       组合的文案是**逐条照抄规范表格**,不是套一个通用公式生成的——因为
       规范里同样是"关闭状态"的 declined/expired,buyer 侧 line2 用的是
       "你自己"的金额,seller 侧 line2 用的却是"对方"的金额,两边不对称,
       没法用一个公式覆盖,只能按行抄。
    4. hover 按钮的文案/个数/顺序也不再是写死的"Manage Offer/Secondary/
       Tertiary",改成按 `viewerRole`+`offerType`+`dealState` 从规范第4节
       两张表里查出来的按钮组(见下面 `hoverButtons` computed)。规范里
       "Remove From List" 是"grey outlined"、和 "View Details" 的橙色
       outline 视觉上不一样,新增了 `.offer-card__hover-btn--grey-outline`
       这个 CSS 变体(之前没有这个按钮样式)。
    5. 【这是唯一一处真正动到"hover 机制"数值的地方,不是纯 copy】规范
       第4节的表格写明"1个按钮"和"2个按钮"两种情况的模糊覆盖范围是一样的
       ("identity + status dimmed, message stays readable"),但组件原来
       1按钮只模糊车辆信息、2按钮才连倒计时/状态chip那一行一起模糊,两者
       不一致。已经把 1 按钮的模糊范围也扩大到和 2 按钮一样(vehicle +
       flex-row),3按钮模糊整个info区不变。这个改动是这份新规范自己明确
       写出来的规则,不是我顺便调整的。
    6. 倒计时新增 `timeLeftUrgent` prop(< 1小时 =true,红色;否则灰色)
       ——因为这是 mock 数据不是真的实时倒计时,没法在组件里自己算"是否
       小于1小时",这个判断交给传值的人(mock/Dashboard)。`dealState` 是
       declined/expired 时倒计时整块都不渲染(规范:"closed deals remove
       the whole countdown")。
    7. 【规范第2节"可选:the gap",规范自己标了是 open question】新增
       `showGap`+`gapAmount` 两个 prop,默认 `showGap:false`。只在
       `dealState==='received'` 时,打开后会把 line2 的时间戳换成
       "· {gapAmount} apart",不会用在 sent 状态(规范:"不能在等待的
       状态下对一个还没实现的差额采取行动")。这个功能默认关闭,因为规范
       第7节把它列为待产品确认的问题,不是已经拍板的设计。

    【2026-08 按你的要求:点任意 hover 按钮打开 Information Dialog】
    你明确说"我知道这不合理,先这样做,之后会调整"——所以现在不区分点了
    Accept/Decline/Counter/View Details/Manage Offer/Raise Your Offer/
    Remove From List 里的哪一个,`hoverButtons` 数组里每个按钮的
    `@click` 统一只做一件事:把内部的 `dialogOpen` ref 设成 true。
    `<InformationDialog>` 用 `v-model="dialogOpen"` 挂在卡片模板最后,
    组件内部用 `<Teleport to="body">` 渲染,不会被 `.offer-card` 自己的
    `overflow:hidden` 裁掉。Dialog 需要卡片本身没有的几个字段
    (`reservePrice`/`acvEstimate`/`reportUrl`/`history`——原来还有个
    `openingBidAmount`/`floorAmount`/`ceilingAmount`,2026-09 发现是多余
    的、用错位置的字段,已删掉,见下面2026-09条目),已经作为新 prop 加在
    OfferCard 上,默认值给了合理的占位数字,细节和内容规则见
    fragments/InformationDialog/notes.md,这里不重复。

    【2026-09 按你的要求新增 card 内容 v2,不是 Figma 核实,是你直接给的
    文字规则】新增 `cardVersion` prop('v1'/'v2',默认 'v1',不传就是原来
    一直在用的行为,完全不影响任何现有页面/mock),为以后还会有更多版本
    预留了字符串枚举而不是布尔值。v2 改了两处内容(没有动 hover 机制/
    倒计时颜色规则/按钮组这些交互层面的东西,你也没有要求改这些):
    1. 车辆信息区第二行从"{mileage} ・ VIN {vin}"改成"Auction ID
       {auctionId} ・ VIN {vin}",同时不再单独渲染下面那行"Auction ID:
       xxx"(本来就是同一个 auctionId,v1 分两行显示,v2 合并成一行,
       原话"这样减少一行字")。`mileage` prop 在 v2 下还是存在(没删,
       数据源可能还需要),只是卡片不再显示它。【2026-09 补充】刚开始
       只放了裸数字("452161 ・ VIN 884523"),你指出"auction ID 要加到
       ID number 前面上去"——现在改成"Auction ID {auctionId}"(照
       VIN 那半边"VIN {vin}"不带冒号的格式,不是"Auction ID:
       {auctionId}"那种带冒号的写法,和同一行内 VIN 那半边保持一致)。
    2. 两行文案的规则彻底不一样,新增 `messageLine1V2`/`messageLine2V2`
       两个 computed(v1 原来的逻辑原样保留在 `messageLine1V1`/
       `messageLine2V1`,一个字没动),按 `cardVersion` 选择用哪一套:
       - `sent`(轮到对方,你在等):line1 只说"Waiting on the
         {对方}",不带时间——你原话"因为等待没有时间节点";line2 是
         "你自己最后一个动作 + 时间"(这条和 v1 的措辞、结构完全一样,
         你给的例子"Your counter $4,200 · Today, 09:10 AM"本来就和已有
         实现一致,没有需要改的地方)。
       - `received`(轮到你,对方刚发过来):line1 变成"对方刚做的动作 +
         金额 + **那次动作的时间点**"(v1 原来 line1 不带时间,v2 新增,
         需要新 prop `counterpartyTimestamp`);line2 从"你自己金额 + 你
         自己的时间"改成"你自己金额 + **和对方差多少**"(新增
         `gapBetween()` 函数,直接从 `counterpartyAmount`/`ownAmount`
         两个已有金额算差值,不需要像 v1 的 `gapAmount` 那样另外单独传
         一个字符串,不存在两边数字对不上的风险)。买家这一侧的措辞按你
         截图给的例子"Your offer $3,800 · $700 apart"写死用"offer"这个
         词(不是"counter")——卖家这一侧你没给对应例子,沿用它原来就在
         用的"Your counter"/"Your reserve"措辞,只是结构上加了差额,
         没有像买家那样改动词。
       - `declined`/`expired`:你没提到要改,v2 原样复用 v1 的文案,一个
         字没变。
    3. 新增 prop `counterpartyTimestamp`(对方最近一次动作的时间点),
       只有 v2 的 `received` 状态 line1 会用到,默认空字符串——不传就是
       "对方 动作 金额"不带时间,不会渲染出多余的分隔符。
    【2026-09 三处 v2 布局微调,你直接给的截图指示】
    1. line1 的时间(v2 received 状态才有,比如"Seller countered
       $4,500"后面的"Today, 08:45 AM")不再拼进文案字符串里跟着金额,
       改成单独一个元素 `messageLine1Timestamp`,和 line1 文字放在同
       一个 flex 行里两端对齐——文字贴左,时间永远贴最右边。sent/
       declined/expired 这几个没有这个时间的状态,这个值是空字符串,
       不会渲染出多余的行。
    2. 状态chip(New/Received/Sent/Declined/Expired 那一排)不管这张
       卡有没有倒计时都要贴在最右边——之前 `.offer-card__flex-row` 靠
       `justify-content:space-between` 让倒计时贴左、chip贴右,但
       declined/expired 这类没有倒计时的卡片这一行只剩chip一个孩子,
       `space-between` 对单个孩子不生效,会退回默认贴左。给
       `.offer-card__status-pills` 加了 `margin-left:auto`,不依赖
       倒计时那个兄弟节点陪着,自己就会贴右。
    3. 消息块最下面两行(line1所在行 + line2)之间补了2px的间距,之前
       是紧贴的0间距。
    【待你确认】倒计时"<1小时=红色"这条规则你在这条消息里也提了一遍,
    组件里这条规则本来就已经实现(靠 `timeLeftUrgent` prop 决定颜色),
    v1/v2 共用同一段倒计时markup,没有改动——如果你的意思是这个颜色应该
    由卡片自己去解析 `timeLeft` 文本里到底有没有"h"来自动判断,而不是靠
    外部传的 `timeLeftUrgent` 布尔值,请明确说一下,现在没有做这个改动
    (担心猜错方向,搞出一个你没要求的新机制)。
  ═══════════════════════════════════════════════════════════
-->
<template>
  <div
    class="offer-card"
    :class="{
      'offer-card--v1': hoverButtons.length > 0,
      'offer-card--v1-btn-1': hoverButtons.length === 1,
      'offer-card--v1-btn-2': hoverButtons.length === 2,
      'offer-card--v1-btn-3': hoverButtons.length === 3
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
      @click="$emit('viewed')"
    >
      <img v-if="photoUrl" :src="photoUrl" alt="" class="offer-card__photo">
      <div class="offer-card__image-badges">
        <ImageBadge
          v-if="offerType !== 'none'"
          :variant="offerType"
          :label="offerTypeLabel"
          :ring="offerType === 'in-negotiation' && badgeStyle === 'ring'"
        />
        <ImageBadge v-if="dealerName && isMultiDealer" variant="dealer" :label="dealerName" />
      </div>
    </a>

    <div class="offer-card__info">
      <div class="offer-card__vehicle">
        <div class="offer-card__vehicle-title">{{ vehicleTitle }}</div>
        <div class="offer-card__vehicle-sub">
          <span>{{ cardVersion === 'v2' ? ('Auction ID: ' + auctionId) : mileage }}</span>
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
        <div v-if="auctionId && cardVersion !== 'v2'" class="offer-card__auction-id">Auction ID: {{ auctionId }}</div>
      </div>

      <div v-if="hasCountdown || hasStateChip || messageLine1" class="offer-card__flex-section">
        <div v-if="hasCountdown || hasStateChip" class="offer-card__flex-row">
          <div v-if="hasCountdown" class="offer-card__time-left" :class="{ 'offer-card__time-left--grey': !timeLeftUrgent }">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 13.3333C9.41449 13.3333 10.771 12.7714 11.7712 11.7712C12.7714 10.771 13.3333 9.41449 13.3333 8C13.3333 6.58551 12.7714 5.22896 11.7712 4.22876C10.771 3.22857 9.41449 2.66667 8 2.66667C6.58551 2.66667 5.22896 3.22857 4.22876 4.22876C3.22857 5.22896 2.66667 6.58551 2.66667 8C2.66667 9.41449 3.22857 10.771 4.22876 11.7712C5.22896 12.7714 6.58551 13.3333 8 13.3333ZM8 1.33333C8.87548 1.33333 9.74239 1.50577 10.5512 1.8408C11.3601 2.17583 12.095 2.6669 12.714 3.28595C13.3331 3.90501 13.8242 4.63994 14.1592 5.44878C14.4942 6.25761 14.6667 7.12452 14.6667 8C14.6667 9.76811 13.9643 11.4638 12.714 12.714C11.4638 13.9643 9.76811 14.6667 8 14.6667C4.31333 14.6667 1.33333 11.6667 1.33333 8C1.33333 6.23189 2.03571 4.5362 3.28595 3.28595C4.5362 2.03571 6.23189 1.33333 8 1.33333ZM8.33333 4.66667V8.16667L11.3333 9.94667L10.8333 10.7667L7.33333 8.66667V4.66667H8.33333Z" :fill="timeLeftUrgent ? '#CC433A' : '#55575C'"/>
            </svg>
            {{ timeLeft }}
          </div>
          <div v-if="hasStateChip" class="offer-card__status-pills">
            <StatusChip v-if="showNewChip" status="new" label="New" :show-icon="false" />
            <StatusChip :status="dealState" :label="stateChipLabel" />
          </div>
        </div>

        <template v-if="messageLine1">
          <div class="offer-card__divider" />
          <div class="offer-card__message">
            <div class="offer-card__message-row">
              <div class="offer-card__message-primary">{{ messageLine1 }}</div>
              <div v-if="messageLine1Timestamp" class="offer-card__message-timestamp">{{ messageLine1Timestamp }}</div>
            </div>
            <div v-if="messageLine2" class="offer-card__message-secondary">{{ messageLine2 }}</div>
          </div>
        </template>
      </div>
    </div>

    <!-- 2026-08 按你给的 "Offer card — content & interaction spec" 重写:
         按钮的文案/个数/顺序不再写死,改成按 viewerRole+offerType+
         dealState 从 hoverButtons computed 查出来的按钮组渲染,细节和
         "这是唯一动到 hover 机制数值的地方"那条说明见上面 METADATA。
         hover 时信息区变模糊、按钮块浮出这套底层机制本身没有变。 -->
    <div v-if="hoverButtons.length" class="offer-card__hover-buttons">
      <button
        v-for="(btn, i) in hoverButtons"
        :key="i"
        type="button"
        class="offer-card__hover-btn"
        :class="`offer-card__hover-btn--${btn.style}`"
        @click="handleHoverButtonClick(btn.label)"
      >{{ btn.label }}</button>
    </div>

    <!-- 2026-08 按你的要求:点卡片上任意一个 hover 按钮(不管是 Accept/
         Decline/Counter/View Details/Manage Offer/Raise Your Offer)都
         打开这同一个 Information Dialog——你明确说"我知道这不合理,先这样
         做,之后会调整",所以这里没有按点了哪个按钮去区分打开不同内容,
         统一用 dialogOpen 这一个开关。Dialog 内容(金额区/历史/输入面板/
         按钮)另外按 viewerRole+offerType+dealState 算,和卡片是同一套
         模型,细节见 fragments/InformationDialog/notes.md。
         【2026-09-02 例外】"Remove From List" 已经从这条统一规则里单独
         拆出来,不再打开这个 Dialog,细节见
         fragments/RemoveFromListDialog/notes.md。 -->
    <InformationDialog
      v-model="dialogOpen"
      :photo-url="photoUrl"
      :vehicle-title="vehicleTitle"
      :vin="vin"
      :mileage="mileage"
      :auction-id="auctionId"
      :offer-type="offerType"
      :viewer-role="viewerRole"
      :deal-state="dealState"
      :is-new="isNew"
      :counterparty-amount="counterpartyAmount"
      :own-amount="ownAmount"
      :reserve-price="reservePrice"
      :acv-estimate="acvEstimate"
      :report-url="reportUrl"
      :time-left="timeLeft"
      :time-left-urgent="timeLeftUrgent"
      :history="history"
      :has-prev="hasPrevDeal"
      :has-next="hasNextDeal"
      :dialog-version="dialogVersion"
      @prev="$emit('prev-deal')"
      @next="$emit('next-deal')"
    />
    <RemoveFromListDialog v-model="removeDialogOpen" @remove="$emit('remove-from-list')" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import StatusChip from '../StatusChip/StatusChip.vue'
import InformationDialog from '../InformationDialog/InformationDialog.vue'
import ImageBadge from '../ImageBadge/ImageBadge.vue'
import RemoveFromListDialog from '../RemoveFromListDialog/RemoveFromListDialog.vue'

const dialogOpen = ref(false)
// 2026-09-02 新增,配合 "Remove From List" 按钮的二次确认框,细节见
// fragments/RemoveFromListDialog/notes.md
const removeDialogOpen = ref(false)
// 2026-09-02 按你的要求:点 VDP 图片链接、或点任何一个会打开
// InformationDialog 的 hover 按钮,都算"看过这笔 deal"了,emit 一个
// viewed 事件,让 OfferDashboard 把这一行的 New 标记清掉(细节见
// fragments/OfferDashboard/notes.md)。"Remove From List" 走的是另一个
// 确认框,不算"看过",不 emit viewed。
function handleHoverButtonClick(label) {
  if (label === 'Remove From List') {
    removeDialogOpen.value = true
  } else {
    dialogOpen.value = true
    emit('viewed')
  }
}
// 2026-09-02 按 Figma node 7597:112866 新增:配合 InformationDialog 的
// Previous/Next,OfferDashboard 需要能"关掉这张卡的对话框、打开相邻那张
// 卡的对话框",但 dialogOpen 这个 ref 本身没有对外暴露(只在这个组件内部
// 用),所以露出这两个方法作为唯一的外部控制入口,不直接暴露 ref 本身。
defineExpose({
  openDialog: () => { dialogOpen.value = true },
  closeDialog: () => { dialogOpen.value = false }
})

const props = defineProps({
  photoUrl: { type: String, default: '' },
  // in-negotiation | make-offer —— 每笔 deal 必然是这两种之一,这是
  // deal 的"类型"(固定不变),不是会变化的"状态"。'none' 只作为防御性
  // 兜底保留(徽标就不渲染),规范里不存在这个值。
  offerType: { type: String, default: 'in-negotiation' },
  dealerName: { type: String, default: 'CarMax Boston' },
  // 2026-09-02 按你的要求新增:图片上的 dealer/lane 徽标只在 Buying/
  // Selling 都是"有意义要区分多个经销商"的场景才显示——Buying tab 不
  // 显示(不管账号本身是不是多经销商),Selling tab 只在账号是多经销商
  // 时显示。这个判断在 OfferDashboard 那一层算好(effectiveMultiDealer),
  // 这里只是被动接收结果,不自己判断"当前是哪个 tab",细节见
  // fragments/OfferDashboard/notes.md。默认 true 不影响任何已有用法
  // (没有传这个 prop 的场景,比如各自的 Playground 页面,行为不变)。
  isMultiDealer: { type: Boolean, default: true },
  vehicleTitle: { type: String, default: 'Year Make Model' },
  mileage: { type: String, default: '250,000 miles' },
  vin: { type: String, default: '192211' },
  auctionId: { type: String, default: '452161' },
  timeLeft: { type: String, default: '45m Left' },
  // 2026-08 按你给的 card 内容规范新增:< 1小时 = 红色,否则灰色。因为
  // 这里是 mock 数据不是真的实时倒计时,没法自己算"是否小于1小时",这个
  // 判断交给传值的人。
  timeLeftUrgent: { type: Boolean, default: false },
  // 2026-08 按你给的 "Offer card — content & interaction spec" 重写:
  // 谁在看这张卡——buyer 还是 seller,决定文案的措辞和 hover 按钮的行为
  viewerRole: { type: String, default: 'seller' },
  // received | sent | declined | expired —— 5 个状态里"New"是独立的
  // 标记(见下面 isNew),不算这 4 个互斥状态之一
  dealState: { type: String, default: 'received' },
  // New 是"未读"标记,不是一个独立状态,只在 dealState 是
  // received/declined 时才会真的渲染(规范:New 从不和 Sent 一起出现)
  isNew: { type: Boolean, default: true },
  // 对方最近的金额(Received 时对方刚出的价;Declined/Expired 时是"桌上
  // 最后那个数字")
  counterpartyAmount: { type: String, default: '$4,500' },
  // 你自己最近的金额(offer/counter/reserve,视 role+state 而定)
  ownAmount: { type: String, default: '$3,800' },
  // 你自己那个金额发出的时间,只在 received/sent 这种"进行中"的状态下
  // 显示在 line2(Declined/Expired 不显示时间,规范:deal 已经结束,
  // 什么时候结束不重要)
  ownTimestamp: { type: String, default: 'Today, 08:45 AM' },
  // Expired 状态下可选的结束时间,拼在 line1 "Time ran out" 后面
  // (规范:"if the timeout moment matters"),不传就只显示 "Time ran out"
  expiredAt: { type: String, default: '' },
  // 2026-08 规范第2节"可选:the gap",规范自己标了是待产品确认的问题,
  // 默认关闭。打开后只在 dealState==='received' 时把 line2 的时间戳换成
  // "· {gapAmount} apart"
  showGap: { type: Boolean, default: false },
  gapAmount: { type: String, default: '$700 apart' },
  // 2026-08 按你的要求新增:点任意 hover 按钮都会打开 Information
  // Dialog,这几个 prop 是卡片本身用不到、但 Dialog 需要的额外数据——
  // 见 fragments/InformationDialog/notes.md。
  // 【2026-09】原来这里还有一个 openingBidAmount,已经删掉——Dialog 的
  // "Highest Bid"/"Buyer High Bid" 那个数字应该直接用 ownAmount/
  // counterpartyAmount 算(和卡片上是同一个数字,"永远显示最新的数字,
  // 不是开盘价"),之前多出来一个不相关的静态prop是一个真实bug,细节见
  // fragments/InformationDialog/notes.md。
  // 2026-09-01:默认值原来是 $26,000/$25,000,和上面 ownAmount/
  // counterpartyAmount 的默认值($3,800/$4,500)不是同一条协商链路——
  // 按 "Offer States Logic for CC.md" 的 Number rules 改成和这两个默认值
  // 一致的 $4,800/$4,600,细节见 mock.js 文件头注释。
  reservePrice: { type: String, default: '$4,800' },
  acvEstimate: { type: String, default: '$4,600' },
  reportUrl: { type: String, default: '#' },
  history: { type: Array, default: () => [] },
  // 2026-09 按你的要求新增 "card 版本" 概念——v1 是之前所有已经核实/验证过
  // 的内容规则(原样不动),v2 是这次新给的规则(去掉mileage行,用
  // auctionId顶替;message两行的逻辑也不同,见下面 messageLine1V2/
  // messageLine2V2)。以后如果还有更多版本,往这个 'v1'/'v2'/... 的字符串
  // 集合里加新值即可,不用再破坏性改已有版本。默认 'v1',不传就完全是老
  // 行为——只有 OfferDashboard.vue 明确传 'v2'。
  // 2026-09-02 按你的要求把默认值从 v1 改成 v2——v2 是"最新"的正确行为
  // (received 状态 line1 带对方最新动作的时间、右对齐;sent 状态时间在
  // line2,这条本来就没变),v1 只是保留下来对比用的旧版本,不该是默认值。
  // OfferDashboard 本来就显式传 'v2' 不受影响;这次真正受益的是没有单独
  // 传 cardVersion 的场景——standalone 的 Offer Card Playground 页面和
  // OfferCardGallery("Offer Card — All States"),它们之前会落到旧默认值
  // v1,显示的时间位置是错的,细节见 notes.md。
  cardVersion: { type: String, default: 'v2' },
  // 2026-09 v2 专用:对方最近一次动作的时间点(比如"卖家countered"是什么
  // 时候发生的)。v1 没有这个字段的显示位置,只有v2 message line1 在
  // dealState 是 received 时会用到。默认空字符串,不传就不在line1追加
  // 时间。
  counterpartyTimestamp: { type: String, default: '' },
  // 2026-09-02 按 PM 反馈新增:'default'(原样)/'ring'——In Negotiation
  // 徽标之前 PM 觉得不够明显(Make Offer 有描边、对比更强),在 Playground
  // 里先做了两个概念稿给你挑,你选定了"ring"这个方向(深色底不变,加一圈
  // 白色描边+投影,靠"有清晰边缘"这个 Make Offer 本来就有的优势提升
  // 可辨识度),这次正式放进真实组件。只影响 offerType==='in-negotiation'
  // 时的徽标,Make Offer 徽标本身不受影响。默认 'default',不传就是原来
  // 的纯色徽标,只有 OfferDashboard.vue 新增的 cardBadgeStyle 这个 prop
  // 会传 'ring' 进来。
  badgeStyle: { type: String, default: 'default' },
  // 2026-09-02 按 Figma node 7597:112866 新增,透传给 InformationDialog
  // 的 hasPrev/hasNext——这两个值本身"这张卡是不是列表里第一/最后一张"
  // 这件事,OfferCard 自己不知道(它只认识自己这一张卡),要由外层
  // (OfferDashboard 的 rowsAsCards)按当前卡片在可见列表里的位置算好了
  // 传进来。默认都是 false,不传就是"没有其他 deal 可以切",两个按钮都
  // 不显示,不影响任何已有用法。
  hasPrevDeal: { type: Boolean, default: false },
  hasNextDeal: { type: Boolean, default: false },
  // 2026-09-02 按你的要求新增,原样透传给 InformationDialog 的
  // dialogVersion——OfferCard 自己不关心这个版本切换,只是转手传下去,
  // 由 OfferDashboard 的 Controls 统一控制,细节见
  // fragments/InformationDialog/notes.md。
  dialogVersion: { type: String, default: 'v1' }
})
// 2026-09-02 新增,配合上面两个 prop——点了 InformationDialog 的
// Previous/Next 之后,OfferCard 自己不知道"上一张/下一张是哪张卡",只是
// 把这个意图原样往上 emit,交给真正维护列表的 OfferDashboard 处理
// 2026-09-02 新增 remove-from-list:"Remove From List" 这个 hover 按钮
// 不再和其它按钮一样打开 InformationDialog,改成先弹这个二次确认框,
// 点 "Yes, Remove" 才 emit 这个事件,由 OfferDashboard 接住真正做移除,
// 细节见 fragments/RemoveFromListDialog/notes.md
const emit = defineEmits(['prev-deal', 'next-deal', 'remove-from-list', 'viewed'])

const offerTypeLabel = computed(() =>
  props.offerType === 'make-offer' ? 'Make Offer' : 'In Negotiation'
)

const isBuyer = computed(() => props.viewerRole === 'buyer')
const isMakeOffer = computed(() => props.offerType === 'make-offer')

// 2026-08 按你给的规范:倒计时/状态chip在 declined/expired 时整块消失
const isClosed = computed(() => props.dealState === 'declined' || props.dealState === 'expired')
const hasCountdown = computed(() => !!props.timeLeft && !isClosed.value)
const hasStateChip = computed(() => !!props.dealState)

// New 只能和 received/declined 搭配,从不和 sent 一起出现——这里直接
// 从结构上挡掉非法组合,不是靠调用方自己记得别传错
const showNewChip = computed(() =>
  props.isNew && (props.dealState === 'received' || props.dealState === 'declined')
)

const stateChipLabel = computed(() => {
  const labels = { received: 'Received', sent: 'Sent', declined: 'Declined', expired: 'Expired' }
  return labels[props.dealState] || ''
})

// 2026-08 按你给的 "Offer card — content & interaction spec" 第2节两张
// 表(buyer/seller)逐条抄的文案——不是套一个通用公式生成的,因为
// declined/expired 这两个"关闭状态"在 buyer 侧 line2 用的是自己的金额,
// seller 侧用的却是对方的金额,两边不对称,没法用一个公式覆盖。
// 【2026-09】这是 v1 的文案逻辑,原样保留、完全没有改动——v2 的新规则在
// 下面 messageLine1V2/messageLine2V2 里单独实现,两套逻辑互不影响。
const messageLine1V1 = computed(() => {
  const s = props.dealState
  if (s === 'declined') return isBuyer.value ? 'Seller declined your offer' : 'You declined the offer'
  if (s === 'expired') return `Time ran out${props.expiredAt ? ' · ' + props.expiredAt : ''}`
  if (isBuyer.value) {
    if (s === 'received') return `Seller countered ${props.counterpartyAmount}`
    if (s === 'sent') return 'Waiting on the seller'
  } else {
    if (s === 'received') return isMakeOffer.value ? `Buyer offered ${props.counterpartyAmount}` : `Buyer countered ${props.counterpartyAmount}`
    if (s === 'sent') return 'Waiting on the buyer'
  }
  return ''
})

const messageLine2V1 = computed(() => {
  const s = props.dealState
  if (s === 'declined' || s === 'expired') {
    // 关闭状态:buyer 侧显示自己的金额,seller 侧显示对方的金额——两边
    // 不对称,是规范表格里逐条给的,不是我推出来的公式
    return isBuyer.value
      ? `Your offer ${props.ownAmount}`
      : `Buyer offered ${props.counterpartyAmount}`
  }
  if (isBuyer.value) {
    if (s === 'received') {
      const tail = props.showGap ? `${props.gapAmount}` : props.ownTimestamp
      return `You offered ${props.ownAmount} · ${tail}`
    }
    if (s === 'sent') {
      const verb = isMakeOffer.value ? 'offer' : 'counter'
      return `Your ${verb} ${props.ownAmount} · ${props.ownTimestamp}`
    }
  } else {
    if (s === 'received') {
      if (isMakeOffer.value) return `Your reserve ${props.ownAmount}`
      const tail = props.showGap ? `${props.gapAmount}` : props.ownTimestamp
      return `Your counter ${props.ownAmount} · ${tail}`
    }
    if (s === 'sent') return `Your counter ${props.ownAmount} · ${props.ownTimestamp}`
  }
  return ''
})

// 2026-09 按你的要求新增 v2 文案规则,原话:"Latest move first显示在卡
// 底部的第一行,Waiting on the seller时间显示在第二行,因为等待没有时间
// 节点。就显示买家最后一个行为在第二行。" + "如果收到counter没有counter
// back,买家显示时间在第一行对应买家counter时间点...卖家则会显示waiting
// on the buyer"。归纳成一条统一规则(buyer/seller对称):
// - dealState 是 sent(轮到对方,你在等):line1 只说"Waiting on the
//   {对方}",不带时间(等待本身没有时间点);line2 显示"你自己最后一个
//   动作 + 它的时间点"——这条和 v1 的 sent 分支文案完全一样,没有变化,
//   因为你给的例子("Your counter $4,200 · Today, 09:10 AM")本来就和
//   已有实现一致。
// - dealState 是 received(轮到你,对方刚动作完):line1 变成"对方刚做的
//   动作 + 金额 + 那个动作的时间点"(v1 原来没有时间);line2 从"你自己
//   金额 + 你自己的时间"改成"你自己金额 + 和对方差多少"(v1 的
//   showGap/gapAmount 是可选、默认关闭的,v2 里这个差额规则默认开启,
//   直接从 counterpartyAmount/ownAmount 算,不需要外部再传一个
//   gapAmount)。买家这一侧的措辞按你截图给的例子写死成"Your offer"
//   (不是"Your counter")——卖家这一侧没有对应例子,沿用它本来就在用的
//   "Your counter"/"Your reserve"措辞,只是结构上加了差额。
// - declined/expired 这两个关闭状态你没有提到要改,原样复用 v1 的文案。
// 2026-09-02 按你的要求更正:In Negotiation 的 sent(等对方回复)状态
// 不再显示"Waiting on the seller/buyer",改成和 received(轮到你)状态
// 同一套结构——line1 永远是"最后一个动作"(不管是你自己还是对方做的)+
// 右侧时间,line2 是"对方最近一次的数字"+差额。原因(你的原话):In
// Negotiation 里买卖双方可以无限次连续 counter,只要比自己上一次更靠近
// 对方(不能等于或反向,否则对方直接接受就好,不需要继续还价);Make
// Offer 买家只能出一次价,之后只能等卖家回应,不能连续出价——所以这条
// 改动只影响 In Negotiation,Make Offer 的"Waiting on the seller"原样
// 保留,没有变。
// - sent + In Negotiation:line1 = "{你自己的角色} countered {你自己
//   最新的金额}"(是你刚发的这个counter让你进入"等待"状态,所以"最后
//   一个动作"就是你自己的);line1 时间用 ownTimestamp。
// - sent + Make Offer:不变,还是 "Waiting on the seller/buyer",没有
//   时间(等待本身没有时间点)。
// - received:不变,line1 还是对方刚做的动作 + counterpartyTimestamp。
const messageLine1V2 = computed(() => {
  const s = props.dealState
  if (s === 'declined') return isBuyer.value ? 'Seller declined your offer' : 'You declined the offer'
  if (s === 'expired') return `Time ran out${props.expiredAt ? ' · ' + props.expiredAt : ''}`
  if (s === 'sent') {
    if (isMakeOffer.value) return isBuyer.value ? 'Waiting on the seller' : 'Waiting on the buyer'
    const who = isBuyer.value ? 'Buyer' : 'Seller'
    return `${who} countered ${props.ownAmount}`
  }
  if (s === 'received') {
    const who = isBuyer.value ? 'Seller' : 'Buyer'
    const verb = isBuyer.value ? 'countered' : (isMakeOffer.value ? 'offered' : 'countered')
    return `${who} ${verb} ${props.counterpartyAmount}`
  }
  return ''
})

// 2026-09 按你的要求:line1 的时间不再拼进文案字符串里挤在金额后面,改成
// 单独一个元素,和 line1 文字同一行、靠最右边对齐(截图里"Seller
// countered $4,500"和"Today, 08:45 AM"分别贴在这一行的左右两端)。
// 【2026-09-02 更正】sent 状态原来整体没有这个时间(因为line1整体是
// "Waiting on..."没有时间点)——现在 In Negotiation 的 sent 状态 line1
// 变成"你自己的最后一个动作",对应的时间(ownTimestamp)也要跟着显示在
// 右侧,和 received 状态是同一个位置/同一套视觉。Make Offer 的 sent
// 状态没有变,还是没有时间。declined/expired 也没有,v1 从来没有过这个
// 时间。
const messageLine1Timestamp = computed(() => {
  if (props.cardVersion !== 'v2') return ''
  if (props.dealState === 'received') return props.counterpartyTimestamp || ''
  if (props.dealState === 'sent' && !isMakeOffer.value) return props.ownTimestamp || ''
  return ''
})

// 差额只在双方都有具体金额时才算得出来(和 InformationDialog 的
// splitAmount 计算方式一致,同样的"字符串转数字"写法,没有再造一个新规则)
function gapBetween(a, b) {
  const na = Number(String(a).replace(/[^0-9.]/g, ''))
  const nb = Number(String(b).replace(/[^0-9.]/g, ''))
  if (!na || !nb) return ''
  return '$' + Math.abs(na - nb).toLocaleString('en-US')
}

const messageLine2V2 = computed(() => {
  const s = props.dealState
  if (s === 'declined' || s === 'expired') {
    return isBuyer.value ? `Your offer ${props.ownAmount}` : `Buyer offered ${props.counterpartyAmount}`
  }
  if (s === 'sent') {
    // Make Offer:不变,原来的"Your offer/counter + 你自己的时间"。
    // In Negotiation:line1 已经把"你自己的最后一个动作+时间"说完了,
    // line2 换成"对方最近一次的数字+差额"——和 received 状态的 line2
    // 结构对称(那边是"你自己的数字+差额"),只是这次换成对方的数字。
    if (isMakeOffer.value) return `Your offer ${props.ownAmount} · ${props.ownTimestamp}`
    const who = isBuyer.value ? 'Seller' : 'Buyer'
    const gap = gapBetween(props.counterpartyAmount, props.ownAmount)
    return gap ? `${who} countered ${props.counterpartyAmount} · ${gap} apart` : `${who} countered ${props.counterpartyAmount}`
  }
  if (s === 'received') {
    if (!isBuyer.value && isMakeOffer.value) return `Your reserve ${props.ownAmount}`
    const ownVerb = isBuyer.value ? 'offer' : 'counter'
    const gap = gapBetween(props.counterpartyAmount, props.ownAmount)
    return gap ? `Your ${ownVerb} ${props.ownAmount} · ${gap} apart` : `Your ${ownVerb} ${props.ownAmount}`
  }
  return ''
})

const messageLine1 = computed(() => (props.cardVersion === 'v2' ? messageLine1V2.value : messageLine1V1.value))
const messageLine2 = computed(() => (props.cardVersion === 'v2' ? messageLine2V2.value : messageLine2V1.value))

// 2026-08 按规范第4节两张表(buyer/seller)查出来的 hover 按钮组——
// label + style('filled'/'outlined'/'grey-outline'),数组长度决定
// hover 时模糊覆盖范围(1/2/3 按钮对应 .offer-card--v1-btn-N,见 CSS)
// 2026-09-03 按你的要求简化:除了 declined/expired(维持原来两个按钮
// View Details + Remove From List 不变)之外,不管 buyer/seller、
// received/sent 哪种组合,统一只显示一个按钮 "Manage Offer"——点击行为
// 没变,还是走下面同一个 handleHoverButtonClick,打开同一个
// InformationDialog。之前 buyer received 三个按钮(Accept/Counter/View
// Details)、buyer sent 一到两个按钮、seller sent 的 View Details 这些
// 区分全部去掉,不再按 role/dealState 拆分出不同的按钮组合。
const hoverButtons = computed(() => {
  const s = props.dealState
  if (s === 'declined' || s === 'expired') {
    return [
      { label: 'View Details', style: 'outlined' },
      { label: 'Remove From List', style: 'grey-outline' }
    ]
  }
  return [{ label: 'Manage Offer', style: 'filled' }]
})

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
   - 1 个按钮(7501:69741 下面那张卡):Figma 里只模糊车辆信息(标题/
     里程/VIN/Auction ID)。
   - 2 个按钮(7501:69741 上面那张卡):车辆信息 + 倒计时/状态chip 那一
     行都模糊,消息块不模糊。
   - 3 个按钮(7498:68345):连最下面的消息块也一起模糊,等于整个 info
     区。
   【2026-08 按你给的 "Offer card — content & interaction spec" 第4节
   更正 1 按钮的模糊范围】规范表格明确写 1 按钮和 2 按钮的覆盖范围应该是
   一样的("identity + status dimmed, message stays readable"),不是
   1按钮更小范围。已经把 1 按钮也扩大到和 2 按钮一样同时模糊车辆信息+
   倒计时/状态chip那一行,不再只模糊车辆信息。这是规范自己明确写出来的
   规则,不是我顺便调整的。 */
.offer-card--v1-btn-1:hover .offer-card__vehicle,
.offer-card--v1-btn-1:hover .offer-card__flex-row,
.offer-card--v1-btn-2:hover .offer-card__vehicle,
.offer-card--v1-btn-2:hover .offer-card__flex-row {
  filter: blur(2px);
}
.offer-card--v1-btn-3:hover .offer-card__info {
  filter: blur(2px);
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

/* 2026-08 按新的 content & interaction spec 重命名:原来的
   --primary/--secondary/--tertiary(对应 Figma "Primary/Secondary/
   Tertiary Button" 图层名)改成规范里的 --filled/--outlined,视觉数值
   完全没变,只是类名换成规范自己用的词("filled"/"outlined") */
.offer-card__hover-btn--filled {
  border: none;
  background: linear-gradient(160deg, #F26522 13.86%, #FC4243 86.14%);
  color: #FFFFFF;
}

.offer-card__hover-btn--outlined {
  border: 1px solid #F26522;
  background: #FFFFFF;
  color: #F26522;
}

/* 2026-08 新增,规范里 "Remove From List" 是"grey outlined",和上面
   "View Details" 的橙色 outline 是两种不同视觉,之前没有这个按钮样式。
   灰色数值不是 Figma 核实的,是照项目里已有的灰色系(#D1D3D6 边框/
   #55575C 文字,和 Pagination/表格里用的灰色描边按钮一致)估的,待确认 */
.offer-card__hover-btn--grey-outline {
  border: 1px solid #D1D3D6;
  background: #FFFFFF;
  color: #55575C;
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

/* 2026-09-02(第七次)你指出图片上这三个徽标(In Negotiation/Make
   Offer/dealer name)应该用同一个组件——原来这里各自的
   offer-card__type-badge 和 offer-card__lane-badge 这几条规则已经抽成
   独立组件 fragments/ImageBadge/ImageBadge.vue(颜色/边框数值原样搬过
   去,没有变),这里不再重复定义。之前几轮"统一高度/圆角/字重"的推导
   过程记录在 ImageBadge.vue 自己的注释和 OfferCard/notes.md 里。
   【2026-09-02 事故记录】上面这段注释原来把两个 class 名字写在一起时,
   中间意外拼出了 CSS 注释的结束符(星号紧跟着斜杠那两个字符),导致这条
   注释提前在这里结束,后面本来该是注释内容的中文说明被当成了真的 CSS
   代码(语法错误),连带把下面 .offer-card__info 那条设置左右16px
   padding 的规则也吃掉了——这就是"改了徽标之后卡片下半部分 padding
   消失"这个 bug 的真正原因,和 ImageBadge 本身的样式无关,纯粹是这条
   注释写法的失误。教训:CSS 注释里不要把两个 class 名字紧贴着写,中间
   至少留一个空格或用别的词分隔,否则容易再犯同样的错(这条注释自己
   刚刚就犯了一次,已经改写成现在这样)。 */

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
  gap: 12px;
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

/* 2026-08 你指出:倒计时不管紧急不紧急,字体都保持 14px medium,只有
   颜色跟着变(<1小时红色#CC433A,>=1小时灰色#55575C)——之前按规范文档
   字面"1 hour or more: grey, 14px regular"把字重也一起降成了regular,
   你说不对,已经改成只换颜色不换字重,字重统一沿用
   .offer-card__time-left 本身的 500(medium)。图标颜色在模板里用
   :fill 联动同一个判断。 */
.offer-card__time-left--grey {
  color: #55575C;
}

/* 2026-09 按你的要求:不管有没有倒计时(比如 declined/expired 没有倒计时,
   .offer-card__flex-row 里只剩这一个孩子),这些状态chip都要贴在最右边——
   justify-content:space-between 只在有两个孩子时才会把单独一个推到最
   右边,只有一个孩子时会退回默认的靠左。加 margin-left:auto 让它自己
   会占满并靠右,不依赖是否有倒计时那个兄弟节点陪着。 */
.offer-card__status-pills {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
}

.offer-card__divider {
  height: 1px;
  background: #EBEBEB;
}

/* 2026-09 按你的要求:最下面第一行(message-row)和第二行(message-
   secondary)之间留 2px 空隙,之前是紧贴着的0间距 */
.offer-card__message {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* 2026-09 按你的要求新增:line1 的时间(v2 received 状态才有)不再拼进
   文案字符串里,改成单独一个元素,和 line1 文字同一行两端对齐——如果
   这一行有时间,时间永远贴在最右边 */
.offer-card__message-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.offer-card__message-primary {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0.1px;
  color: #0E0E0F;
}

.offer-card__message-timestamp {
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.1px;
  color: #55575C;
  white-space: nowrap;
  flex-shrink: 0;
}

.offer-card__message-secondary {
  font-size: 14px;
  line-height: 21px;
  letter-spacing: 0.25px;
  color: #55575C;
}
</style>
