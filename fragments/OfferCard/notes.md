# OfferCard 核实记录

## 2026-09-02(第八次)新增 hasPrevDeal/hasNextDeal,透传给 InformationDialog
配合 [InformationDialog](../InformationDialog/notes.md) 新增的两侧
Previous/Next(对照 Figma node 7597:112866)。OfferCard 自己不知道"列表"
这件事,只是把 `hasPrevDeal`/`hasNextDeal`(默认都是 false)原样传给
`InformationDialog` 的 `hasPrev`/`hasNext`,把它的 `prev`/`next` emit
原样转发成自己的 `prev-deal`/`next-deal`——真正算"排第几个""怎么切"的
逻辑在 [OfferDashboard](../OfferDashboard/notes.md)。另外新增
`defineExpose({ openDialog, closeDialog })`,给 OfferDashboard 一个能
"关掉这张卡的对话框、打开相邻那张卡的对话框"的外部控制入口——`dialogOpen`
这个 ref 本身没有对外暴露,只能通过这两个方法间接控制。

## 2026-09-02(第七次)把图片上的三个徽标抽成独立组件 ImageBadge
你指出图片左下角的三个徽标(In Negotiation/Make Offer/dealer name)应该
用同一个组件,不应该是三段各自手写的 `<span>`+独立 class。已经抽成
[ImageBadge](../ImageBadge/notes.md),原来这里的
`.offer-card__type-badge*`/`.offer-card__lane-badge` 这几条 CSS 规则
删掉了,颜色/边框/高度/圆角数值原样搬过去,没有改动任何视觉效果。
`OfferCard.vue` 自己只留了 `badgeStyle` 这个 prop(决定要不要给
`ImageBadge` 传 `ring`),徽标本身的几何/颜色细节都交给 `ImageBadge`
自己维护。

## 2026-09-02(第六次)更正:统一圆角改成4px,不是8px
你指出 Make Offer 徽标看起来是4px圆角——核对了一下,代码里原来写的是
3px(当初核实 Figma 时记录的数值),和你看到的不是同一个数字。既然要
三个都统一,就以你说的4px为准:`--in-negotiation`(原8px)、
`--in-negotiation-ring`(上一条改成的8px)、`--make-offer`(原3px)
这次一起改成4px。这处更正覆盖了之前"Make Offer圆角3px"那条 Figma 核实
记录,是你直接指出的,不是重新核实的 Figma 数值——如果之后需要重新核实
Figma 上 Make Offer 徽标准确的圆角数值,这里先记一下这个矛盾。

## 2026-09-02(第五次)Current 和 Ring 两个版本的圆角统一
你要求 current(`--in-negotiation`)和 ring(`--in-negotiation-ring`)两个
badgeStyle 版本用同样的高度和圆角。高度之前就已经一致(都是24px);圆角
原来 ring 是6px(比 current 的8px小,当时是"白色描边贴着8px圆角在这么小
尺寸下显得太圆"的临时判断),这次改成和 current 一样的8px,padding不变。

## 2026-09-02(第四次)Ring 样式的字重改成 Regular
你要求 Ring 样式("In Negotiation" + 白色描边)的字重改成 Regular,和其它
徽标(默认样式的 In Negotiation/Make Offer/lane-badge,都没有单独设
font-weight,继承的是普通字重)保持一致。之前加的 `font-weight: 700` 已
删掉。

## 2026-09-02(第三次)图片上的徽标整体上下再减2px
你要求卡片图片上的徽标(In Negotiation/Make Offer/Ring 样式/dealer name
lane-badge,一共四条 CSS 规则)整体上下 padding 各再减 2px,其它地方的
badge/chip(表格里的 StatusChip/OfferTypeBadge)不动。四个之前统一凑到
28px,这次一起往下调,减完还是互相对得上:
- `--in-negotiation`:5px→3px,高度 28→24。
- `--make-offer`:4px→2px(还有 1px 描边×2),高度 28→24。
- `--in-negotiation-ring`:4px→2px(还有 1px 描边×2),高度 28→24。
- `.offer-card__lane-badge`:5px→3px,高度 28→24。
水平方向的 padding 都没有变。

## 2026-09-02(第二次)新增 badgeStyle:In Negotiation 徽标的"Ring"样式
PM 反馈 In Negotiation 徽标不够明显(Make Offer 有描边、对比更强)。先在
Playground(component-playground.html)里做了两个概念稿给你挑,没有动这个
真实文件——一个是换成品牌橙色渐变,一个是保留深色底加一圈白色描边+投影。
你选定了后者("Ring"),这次正式加进真实组件:

- 新增 prop `badgeStyle`('default'/'ring',默认 'default'),只影响
  `offerType==='in-negotiation'` 时的徽标,Make Offer 徽标不受影响。
- 新增 CSS class `.offer-card__type-badge--in-negotiation-ring`,和基础的
  `--in-negotiation` class 一起叠加在同一个元素上(不是替换)——只覆盖
  border/border-radius/padding/font-weight/box-shadow,background/color
  继续从基础 class 继承,不重复声明。border(1px)是新加的,同步把
  padding 从 5px/6px 减到 4px/5px、border-radius 从 8px 收到 6px,让最终
  外框尺寸仍然是 28px(和上面那条"统一三个徽标高度"的基准一致),不会
  看起来变大。
- `OfferDashboard.vue` 新增 `cardBadgeStyle` prop,透传给 tile 视图的每
  张 `OfferCard`(`rowsAsCards` 里的 `badgeStyle: props.cardBadgeStyle`),
  Controls 面板新增了对应的 "In Negotiation badge style" 分段控件
  (Current/Ring)。table 视图(`OfferTableRow`)不受影响——PM 反馈针对的
  是卡片视图上的徽标,没有提到表格里的 `OfferTypeBadge`,这次没有动那个
  组件。

## 2026-09-02 按你的要求:统一图片区三个徽标的高度
你截图指出图片左下角的 "Make Offer" 徽标和 "In Negotiation"/dealer name
(lane badge)徽标高度不一样,要求以 Make Offer 的高度为基准统一。算了一下:
Make Offer 是 18px 行高 + 上下 4px padding + 1px 描边×2 = 28px;
In Negotiation / lane badge 都没有描边,只把上下 padding 从 2px 改成 5px
(18+5+5=28)就能凑到同样的 28px,水平方向的 padding(6px/10px)没有动。
不是重新核实的 Figma 数值,是你直接要求"以 Make Offer 为基准统一高度"。

## 2026-09-01 按 "Offer States Logic for CC.md" 的 Number rules 整批重新生成 mock.js 金额
你截图指出 Information Dialog 金额区几个数字互相矛盾(卖家开价比买家已
出的价还低,split 落在自己的区间之外),要求整批重新生成而不是逐个打
补丁,并给了严格的生成规则(reserve 先定→买家开盘价严格<reserve→卖家
counter 严格落在买家和 reserve 之间,每一方新 counter 必须严格更接近
对方、不能等于对方数字→In Negotiation<6h/Make Offer<24h)。

具体改了两组:
- **Ford Focus RS 5 个 In Negotiation 例子**(buyerReceivedExample/
  buyerSentNegotiationExample/sellerReceivedNegotiationExample/
  sellerSentExample/buyerExpiredExample):这 5 个本来就是同一段协商的 5
  个连续快照(同一 vin/auctionId),这次按一条完整的链路重新生成——
  $3,800→$4,500→$4,100→$4,300,reserve 全程 $4,800 不变,acvEstimate
  统一 $4,600。每一步都验证过严格落在"自己上一次"和"对方最新"之间。
- **BMW X5 5 个 Make Offer 例子**:之前 5 个例子的 reserve 各不相同
  ($23,000/$21,000/$32,000/$29,000),同一辆车 reserve 却不一样,统一成
  $28,000、acvEstimate 统一 $27,500;买家出价相对 reserve 的比例也收紧到
  85%–97% 区间内。
完整的最终数字和逐条理由写在 `mock.js` 文件头注释里,不在这里重复。

## 2026-09 三处布局微调(你直接给的截图指示)
1. **line1 的时间挪到行末右对齐**:v2 的 received 状态 line1("Seller
   countered $4,500")后面那个时间("Today, 08:45 AM")之前是拼进同一个
   字符串里紧跟在金额后面,现在拆成独立的 `messageLine1Timestamp`
   computed + 独立的 `.offer-card__message-timestamp` 元素,和 line1
   文字放进同一个 `.offer-card__message-row`(flex,
   justify-content:space-between)——文字贴左,时间贴最右。sent/
   declined/expired 这几个状态本来就没有这个时间,继续是空字符串不渲染。
2. **状态chip永远贴右,不管有没有倒计时**:之前贴右靠的是
   `.offer-card__flex-row` 的 `justify-content:space-between`,配合"倒计时贴左
   +chip贴右"两个孩子才成立——declined/expired 这类没有倒计时的卡片,
   这一行只剩chip一个孩子,`space-between` 对单个孩子不生效,退回默认
   贴左,这是个真实的布局bug。给 `.offer-card__status-pills` 加了
   `margin-left:auto`,自己就会贴右,不依赖倒计时那个兄弟节点陪着。
3. **消息块两行之间补 2px 间距**:`.offer-card__message` 加了
   `gap:2px`,之前 line1 所在行和 line2 是紧贴的0间距。
4. **分隔线上下间距从8px改成12px**:`.offer-card__flex-section` 的
   `gap` 从8px改成12px——这一个gap数值同时控制"倒计时/状态chip那一行"
   到分隔线、分隔线到消息块这两段间距(flex column的gap对所有孩子间距
   一视同仁),所以分隔线上下间距是一起变大的,不是分别设置的两个数字。

## 2026-09 v2 车辆信息行补上 "Auction ID" 标签(+ 补回冒号)
上一版 v2 只把裸数字放进那一行("452161 ・ VIN 884523"),你指出
"auction ID 要加到ID number前面上去"——加上了标签,但当时为了跟同一行
VIN 那半边("VIN {vin}",不带冒号)保持一致,写成了"Auction ID
{auctionId}"(不带冒号)。你又追问"auction ID 的‘:’呢",所以改回带
冒号:"Auction ID: {auctionId} ・ VIN {vin}"——和 v1 里那行独立的
"Auction ID: {auctionId}"用的是完全一样的写法,只是从单独一行合并进了
车辆信息的第二行。

## 2026-09 新增 card 内容 v2(不是 Figma 核实,是你直接给的文字规则)
新增 `cardVersion` prop('v1'/'v2',默认'v1'),用字符串枚举不用布尔值,
是因为你说了"之后会有新的version"——以后再加 v3/v4 不需要再破坏性改这个
prop 的类型。v1 是之前所有已经核实/验证过的内容规则,一个字没动;v2 是
这次新给的规则,只改了"车辆信息行"和"两行文案"这两处内容,没有动 hover
机制/倒计时颜色规则/按钮组这些交互层面的东西(你也没提到要改这些)。

**1. 车辆信息行**:v2 把"{mileage} ・ VIN {vin}"改成"{auctionId} ・
VIN {vin}",同时不再单独渲染下面那行"Auction ID: xxx"——原来是
mileage+VIN 一行、Auction ID 单独一行(共2行),v2 合并成1行,你原话
"这样减少一行字"。`mileage` prop 本身没删(数据源可能还需要这个字段),
只是 v2 卡片不显示它。

**2. 两行文案**:新增 `messageLine1V2`/`messageLine2V2`(v1 原来的逻辑
原样保留在 `messageLine1V1`/`messageLine2V1`,靠 `cardVersion` 在最终
`messageLine1`/`messageLine2` 里二选一)。规则:
- `sent`(轮到对方,你在等):line1 只说"Waiting on the {对方}",不带
  时间——你原话"因为等待没有时间节点";line2 是"你自己最后一个动作 +
  时间"。这条和 v1 的措辞/结构完全一样,你给的例子"Your counter $4,200
  · Today, 09:10 AM"本来就和已有实现一致,没有改的地方。
- `received`(轮到你,对方刚发过来):line1 变成"对方刚做的动作 + 金额 +
  **那次动作的时间点**"(v1 原来不带时间,v2 新增,需要新 prop
  `counterpartyTimestamp`——对方最近一次动作的时间);line2 从"你自己
  金额 + 你自己的时间"改成"你自己金额 + **和对方差多少**"(新增
  `gapBetween()` 函数,直接从 `counterpartyAmount`/`ownAmount` 两个已有
  金额算差值,不再需要像 v1 的 `showGap`+`gapAmount` 那样另外单独维护
  一个字符串——不存在"金额改了但 gapAmount 忘记同步"这种数据不一致的
  风险)。买家这一侧的措辞按你截图给的例子"Your offer $3,800 · $700
  apart"写死用"offer"这个词(不是"counter")——卖家这一侧你没给对应
  例子,沿用它原来就在用的"Your counter"/"Your reserve"措辞,只是结构
  上加了差额,没有像买家那样改动词,这是我自己按对称推的,不是你给的
  例子,**待你确认**卖家侧是否也要统一改成别的词。
- `declined`/`expired`:你没提到要改,v2 原样复用 v1 的文案。

**3. 新增 prop `counterpartyTimestamp`**:只有 v2 的 `received` 状态
line1 会用到,默认空字符串,不传就是"对方 动作 金额"不带时间,不会多渲染
一个孤立的分隔符。mock.js 里 3 个 `received` 例子(buyerReceivedExample/
sellerReceivedNegotiationExample/sellerReceivedMakeOfferExample)补了这
个值,直接取自各自 `history` 数组里最新一条(对方发的那条)的
`timestamp`,和 Dialog 显示的时间保持一致。顺带发现并修正了
`buyerReceivedExample`/`sellerReceivedNegotiationExample` 两个例子的
`ownTimestamp`——之前误写成了对方最新那条动作的时间,已按 `history`
改成"自己那笔金额"实际发出的时间。

**【待你确认】倒计时颜色**:你这条消息里也重申了"所有小于1小时的time
left用红色"——组件里这条规则本来就已经实现(`timeLeftUrgent` prop 决定
颜色,<1小时=红/#CC433A,否则灰/#55575C),v1/v2 共用同一段倒计时
markup,这次没有改动。如果你的意思是这个颜色应该由卡片自己解析
`timeLeft` 文本里有没有"h"来自动判断,不再依赖外部传的 `timeLeftUrgent`
布尔值,请明确说一下——现在没有做这个改动,担心猜错方向做出一个你没
要求的新机制。

**Playground / Dashboard 接入**:OfferCard 自己的 Playground 页面
Controls 面板新增了"Card version (cardVersion)"下拉(v1/v2),默认 v1,
不影响之前任何验证过的截图/效果。`OfferDashboard.vue` 的卡片视图
(`rowsAsCards`→`OfferCard`)按你的要求显式传 `card-version="v2"`,
新增的 `counterpartyTimestamp` 借用了已有的 `updateDate` 字段(和
`ownTimestamp` 的映射方式一样,是尽力而为的映射,不是逐行核实过的真实
业务数据,待你确认)。`OfferCardGallery`(总览页)**没有**跟着加版本
切换控制,还是固定用组件默认的 v1——不确定你是否想要它也能切换,已在它
自己的 notes.md 标注待确认。

## 2026-08 按你的要求:所有 hover CTA 打开同一个 Information Dialog
你的原话:"这个是information dialog. 是点击card上所有CTA打开的dialog.
无论是accept or delince. 我知道这不合理,先这样做,之后会调整。" ——所以
`hoverButtons` 里每个按钮(不管是 Accept/Decline/Counter/View Details/
Manage Offer/Raise Your Offer/Remove From List 哪一个)的 `@click` 都
只做同一件事:把新增的 `dialogOpen` ref 设为 `true`,不区分点的是哪个
按钮。这是已知的临时简化,不是最终设计,以后要按钮区分动作时要回来改这里
的 click handler。

新组件 [`InformationDialog`](../InformationDialog/notes.md)(细节、Figma
核实、文档依据都记在它自己的 notes.md,这里不重复)挂在
`.offer-card__hover-buttons` 后面,用 `v-model="dialogOpen"`。为了让
dialog 有内容,新增了 7 个纯"传给 dialog 用,卡片自己不显示"的 prop:
`openingBidAmount`/`reservePrice`/`acvEstimate`/`reportUrl`/`history`/
`floorAmount`/`ceilingAmount`,10 个已有 mock 示例都补上了对应的值(见
下方 mock.js 变更)。

## 2026-08 按你给的 "Offer card — content & interaction spec" 重写内容模型
你明确说"card 的 layout 和 hover 的 interaction 都不需要调整,只需要改
copy,和应该对应显示的状态"。这次没有动卡片的 DOM 骨架或 hover 模糊+
按钮浮出的底层机制,改的是驱动内容的 prop 模型和文案/按钮的生成逻辑:

- **删掉的 prop**:`statusNew`/`statusReceived`/`statusSent`/
  `statusDeclined`(4个独立布尔值,能拼出"同时Received+Sent"这种规范
  禁止的非法组合)、`primaryMessage`/`secondaryMessage`(自由文本,容易
  写出不符合规范措辞的文案)、`buttonVersion`/`buttonCount`(V1/V2 概念
  在这份新规范里完全没提到,已经废弃)。
- **新增的 prop**:`viewerRole`('buyer'/'seller',这份规范第一次要求
  组件感知"谁在看这张卡")、`dealState`('received'/'sent'/'declined'/
  'expired',单值,结构上不可能选出两个状态芯片)、`isNew`(只在
  received/declined 时真的渲染,从不和 sent 一起出现)、
  `counterpartyAmount`/`ownAmount`/`ownTimestamp`/`expiredAt`/
  `gapAmount`+`showGap`、`timeLeftUrgent`。
- 两行文案(`messageLine1`/`messageLine2`)和 hover 按钮组
  (`hoverButtons`)现在都是组件内部按规范文档第2/4节两张表(buyer 5行+
  seller 5行)**逐条照抄**算出来的,不是套一个通用公式生成——因为
  declined/expired 这两个"关闭状态",buyer 侧 line2 显示自己的金额
  (`ownAmount`),seller 侧却显示对方的金额(`counterpartyAmount`),两边
  不对称,没法用一个公式覆盖。10 个"角色×类型×状态"组合详见下面新建的
  10 个 mock 示例(`buyerReceivedExample` 等),每个都能在 Playground 里
  点开核对文案/芯片/按钮是否和规范表格一致。
- **唯一真正动到"hover 机制"数值的地方**(不是纯 copy):规范第4节表格
  写明 1 个按钮和 2 个按钮的模糊覆盖范围应该一样("identity + status
  dimmed, message stays readable"),但组件原来 1 按钮只模糊车辆信息、
  2 按钮才连倒计时/状态chip 一起模糊,两者不一致。已经把 1 按钮的模糊
  范围也扩大到和 2 按钮一样。这是规范自己明确写出来的规则,不是我顺便
  调整的。
- Expired 是新状态,StatusChip 组件跟着加了 `status="expired"` 的样式
  (灰底 #E0E0E0 深灰字 #55575C,不是 Figma 核实数值,照现有灰色系估的,
  待确认真实设计稿)。
- 倒计时:`dealState` 是 declined/expired 时整块不渲染(规范:"closed
  deals remove the whole countdown")。< 1小时=红色/medium,否则=灰色/
  regular,由 `timeLeftUrgent` 决定——因为这是 mock 数据不是真的实时
  倒计时,没法自己算,这个判断交给传值的人。
- 规范第2节"可选:the gap"(`showGap`+`gapAmount`)已经实现了功能,但
  默认关闭——规范第7节自己把这个列为待产品确认的问题,不是已经拍板的
  设计。
- `OfferDashboard.vue` 的 `rowsAsCards` 也同步改了:`viewerRole` 按当前
  Buying/Selling tab 决定,`dealState` 由表格行原有的4个布尔值折算
  (declined优先/再sent/再received),`counterpartyAmount`/`ownAmount`
  借用了已有的 `receivedAmount`/`sentAmount` 字段——这是**尽力而为的
  映射**,不是逐行按这份新规范重新核实过的真实业务数据,`ownTimestamp`
  也只是借用了粗粒度的 `updateDate` 字段。已经在 Playground 里实测切换
  Buying/Selling tab,卡片的措辞和按钮确实跟着 viewerRole 变了。

## 2026-08 新增 hover 按钮(V1/V2 两个版本)
对照节点 `7498:68345` 核实的 V1:鼠标 hover 卡片时 INFO 区变模糊(该节点
自己带 blur-[2px] class)+ 叠一层三个按钮(Primary Action 渐变 / 
Secondary 描边 / Tertiary,Tertiary 在这个 Figma 实例里 Code Connect
映射的也是 secondary 样式,视觉上和 Secondary 一样,不是我漏做区分)。
新增 `buttonVersion` prop(none/v1/v2),Controls 面板可以切换,默认v1。
按钮本身的具体 padding/字号 Figma 里是外部 acv-shared-vuejs Button
组件,没给像素级样式——渐变色沿用了本项目已核实过的同一个
Gradient/Button token(DealershipFilterDropdown "Apply Filter" 按钮的
那个渐变),不是重新单独核实的,其余细节待确认。

### V2(节点 7499:69479)—— 和 V1 是两套完全不同的实现,不只是按钮数量差异
- 按钮**一直可见**,正常排在 `.offer-card__info` 信息区最下面(在 Figma
  JSX 里就是 "INFO" 容器的第三个子元素),不是 hover 才浮出来的绝对定位
  层——hover 卡片**不会**触发模糊,这是本来的设计,不是没做完。
- 只有 **2 个**按钮:Primary Action + Secondary,没有 V1 的 Tertiary。
- 按钮上方多一条 `#EBEBEB` 分隔线(复用消息块上方那条同款分隔线,节点
  里确实这么排的)。
- 因为 V2 按钮也挂在 `.offer-card__info` 下面,如果不做区分,V1 那条
  "卡片 hover → info 模糊" 的规则会连带把 V2 的按钮也模糊掉。已经给卡片
  根节点加 `.offer-card--v1` 修饰类(只在 `buttonVersion==='v1'` 时加),
  模糊规则改成只在 `.offer-card--v1:hover` 生效,V2 不受影响。
- **待你确认**:V2 这个 Figma 帧量出来 mileage/VIN/Auction ID 是
  12px,V1 对应帧是 14px。判断是设计稿复制帧时的手滑字号漂移,不是有意
  要求"V2 整卡缩小字号",所以**没有**照着改,两个版本共享同一套 14px
  Vehicle Detail 样式。如果这其实是有意的设计差异,请告知。

### V1 补充:按钮数量 1/2/3(节点 7501:69741)
你给的这个新节点是同一张 V1 卡片的两个真实实例(1 按钮/2 按钮),不是我
猜的"按钮少了该保留哪个":
- **1 按钮**:只有 Primary Action。
- **2 按钮**:Primary Action + 一个描边按钮,Figma 里这个描边按钮字面
  label 就是 **"Tertiary"**(不是 "Secondary"),视觉上两者一样(都是
  描边药丸),照抄 Figma 字面结果,不是我自己挑的搭配。
- **3 按钮**(原来核实的 7498:68345):Primary + Secondary + Tertiary。
- 新增 `buttonCount` prop(1/2/3,默认 3),只在 `buttonVersion==='v1'`
  时生效。
- **重要发现,不是拼凑的规则**:hover 模糊的范围随按钮数量一起变化——
  Figma 里这三个数量各自标的 `blur-[2px]` 范围本来就不一样:1 按钮只
  模糊车辆信息(标题/里程/VIN/Auction ID);2 按钮车辆信息+倒计时/状态
  chip 那一行一起模糊,消息块不模糊;3 按钮连消息块也模糊(等于整个
  info 区,和之前核实的行为一致)。推测原因是浮层按钮块的实际高度随
  按钮数量变化,盖住的信息区范围跟着变。已经把原来"V1 hover 统一模糊
  整个 info"这一条规则拆成按 `buttonCount` 区分的三条规则
  (`.offer-card--v1-btn-1/2/3`),3 按钮时的行为和之前完全一样,默认值
  也还是 3,不影响任何已有效果。

### V1 补充:按钮位置修正(你截图指出位置不对)
之前按钮浮层 `.offer-card__hover-buttons` 用的是 `top:222px + bottom:
12px + justify-content:center`,把按钮块拉伸铺满卡片下半部分再垂直居中
——对 3 个按钮凑巧看起来没问题(内容差不多正好填满这段空间),但 1
个/2 个按钮时,按钮就会被居中显示在下半部分中间,而不是紧贴在车辆信息
下面,跟 Figma 截图对不上。已经改成不拉伸、不居中,直接按 Figma 三个
按钮数量各自核实到的数值定位:`top:220px`(Figma 三个实例分别是
215/221/224px,取中间值)、水平边距 `11px`(Figma 是 ~11-11.67px,不是
之前沿用车辆信息区的 16px padding),高度完全由内容撑开(按钮块自己的
padding 改成 `8px 16px 16px` 对应 Figma 的 pt8/px16/pb16)。现在 1 个
按钮时块矮、紧贴车辆信息下方,2/3 个按钮时块跟着变高,不再需要居中
凑数字。

### V1 补充:hover 按钮改名 "Manage Offer"
Primary 按钮文案从占位的 "Primary Action" 改成你直接给的 "Manage
Offer"——这是业务命名,不是 Figma 数值(Figma 里就是占位符文案)。只改
了 V1(hover 才出现的)这颗按钮,V2 一直可见的 Primary 按钮文案没有动
(按你说的"hover on 的action"理解只针对 hover 触发的这个)。

## 2026-08 按你的要求:卡片图片也进 VDP
`.offer-card__image` 现在包了一层 `<a target="_blank">` 链去 VDP 占位页
(`assets/vdp/vdp-page.html`),和表格视图 `OfferTableRow` 点缩略图的
行为保持一致(同一个占位页,不是各自的真实 VDP)。为什么是这个占位页、
不是真的 VDP 集成,细节见 [OfferTableRow/notes.md](../OfferTableRow/notes.md),
这里不重复。原来 `.offer-card__image` 是 `<div>`,现在换成 `<a>` 后补了
`display:block`(`<a>` 默认是 inline,不加这个的话 `position:relative`/
`width:100%`/`height:210px` 这些原有样式不会正常生效)。

## 2026-08 删掉了 max-width:400px
之前根组件 `.offer-card` 有个 `max-width:400px`,没有对应的 Figma 核实
记录,是之前随手加的防御性上限,不是来自这里"来源"列的任何节点。按你
的要求让 [OfferDashboard](../OfferDashboard/notes.md) 里的卡片网格
(card-grid)全屏时响应式伸缩之后,这个上限会在网格列宽超过400px时把
卡片卡住不再撑满格子,看起来像卡片间距变大了(其实 grid 的 gap 还是
16px,是卡片自己没填满格子)。已经删掉,让 `width:100%` 单独生效,始终
填满 grid 分配给它的那一列。

## 来源
- Figma 主帧(tile version):node `7432:68669`
- 卡片实例(General Auction Card,hidden=false):node `7432:69394`
- Make Offer 徽标变体核实:node `7441:5248` / `7441:5254`
- 结构规则参考:`acv-auction-cards` 技能(General Auction Card 的 Image
  Section / Action Area / Vehicle Detail Section / Flexible Section 划分,
  以及"最多3个按钮""图标要有hover tooltip""同一时间只显示一个状态chip"等
  规则)。

## 已核实的数值(全部来自 `get_design_context`,hidden=false)
- 卡片容器:白底 `#FFFFFF`,边框 `1px solid #E8E9EB`,圆角 `12px`,
  `overflow: hidden`,底部 padding `12px`。
- 图片区高度 `210px`。
- 图片左下角两个徽标:
  - **状态徽标(In Negotiation)**:背景 `#1C1D1F`,白字,圆角 **8px**,
    **无边框**,padding `2px 6px`。→ 和表格版本(`OfferTypeBadge` 组件,
    圆角3px + 白色1px描边)明确不一样,**没有强行复用同一份 CSS**,是card
    专属的一套样式(`.offer-card__type-badge--in-negotiation`)。
  - **状态徽标(Make Offer)**:外层描边 `1px solid #8D9199` 圆角 `3px`,
    内层白底,padding `4px 6px`,文字 `#0E0E0F`。→ 和表格版本数值**完全
    一致**,不是巧合,是同一套设计规范在两个场景里被分别核实到的结果。
  - **经销商/lane 徽标**:背景 `rgba(0,0,0,0.4)` + `backdrop-filter:
    blur(0.75px)`,白字,圆角 `8px`,padding `2px 10px`,字号12px
    letter-spacing 0.4px。
  - 两个徽标间距:按坐标算出来是 `5px`(第一个徽标右边缘 x=111,第二个
    左边缘 x=116),实现时用了文件里已确认存在的 `Space/6`(6px)token,
    没有拿一个瞎猜的数字。
- Vehicle Detail 区(字段顺序严格保留,符合 acv-auction-cards 规则):
  1. 车辆标题 `16px/24px` Medium,letter-spacing `0.15px`,色 `#0E0E0F`。
  2. 里程 + "・" + "VIN {vin}" + 复制图标,`14px/21px` Regular,色
     `#55575C`。复制图标是真实下载的 SVG(节点 `7432:69414`),点击复制
     VIN 到剪贴板 —— 这是图标本身明摆着的功能,不是额外加的特性。
  3. "Auction ID: {auctionId}",同上字号/颜色。
- Flexible 区(自定义组合,不是库里的 `_block/Card-Auction Details`——那个
  在这个实例里是 `hidden=true`,没有被实际使用):
  - 倒计时:16×16 Clock 图标(真实下载,填色 `#CC433A`)+ "45m Left"
    `14px/20px` Medium letter-spacing `0.1px` 色 `#CC433A`。
  - 同一行右侧 New / Received 两个 `StatusChip`,颜色和已核实的
    `fragments/StatusChip` 组件完全一致,直接复用,New 没有icon
    (`show-icon="false"`)。
  - 分隔线 `1px #EBEBEB`。
  - 消息块:主消息 `14px/20px` Medium 色 `#0E0E0F`,副消息
    `14px/21px` Regular 色 `#55575C`。

## 明确标注的"待确认" / 设计稿疑点
1. **`vehicleTitle` 示例文案字面是 "Year Make Model"**——这看起来是设计师
   没替换掉的占位符文案(类似之前在 `DealershipFilterDropdown` 里发现的
   重复经销商名 "Apple Chevrolet" 那种情况),不是我编的假数据,原样保留
   在 `mock.js` 里,等真实数据或下一轮 scenario 指示时再替换,**不要**
   当成这就是"正确的车型显示格式"。
2. **图片区右上角的操作图标列(watchlist / hide / note / more,共4个,
   节点 `7432:69398`)在这个实例里 `hidden=true`**,不是当前可见设计,
   **没有实现**。如果实际需要展示这些操作按钮,请明确告知,到时候要
   同时遵守 acv-auction-cards 技能里"图标按钮要配hover tooltip""最多3个
   按钮"的规则。
3. [2026-08 消息块部分已确认] 你对照节点 `7485:41392` 明确说"每个 card
   都有 message at bottom",这个疑点关于消息块的部分已解决——[OfferDashboard](../OfferDashboard/notes.md)
   现在不再显式传空字符串覆盖掉这两个 prop,让 tile 视图 12 张卡片都走
   OfferCard 自己核实过的默认文案。倒计时行/New+Received 状态chip/
   Auction ID 行是否在所有场景都出现,仍然待确认(还是只看到这一个
   In Negotiation 例子),已经做成可选 prop 不受影响。
4. 图片本身在 Figma 里是一张固定素材裁切,组件里简化成普通 `<img
   object-fit: cover>` 填充 210px 高的容器,没有还原素材本身的具体尺寸/
   裁切位置(那属于内容素材,不是组件结构)。

## 与表格版本的关键差异对比(明确记录,避免以后误合并成一套CSS)
| | 表格 OfferTypeBadge | 卡片 In Negotiation 徽标 |
|---|---|---|
| 圆角 | 3px(用户手动改为4px,见 OfferTypeBadge/notes.md) | 8px(Figma核实) |
| 边框 | 有(白色1px,来自父容器) | 无 |

Make Offer 徽标两边数值一致,未发现差异。

## 组件宽度说明
Figma 里这张卡片的实际宽度是 `363.33px`(来自 1122px 内容区、3 列、
列间距16px 反推:`(1122-32)/3=363.33`)。组件本身把宽度写成 `width:
100%`,交给外层网格容器(`OfferDashboard` 里的 `.offer-dashboard__card-
grid`,`grid-template-columns: repeat(3, 1fr)` + `gap: 16px`)决定实际
像素宽度——在 1122px 内容区下算出来的宽度和 Figma 的 363px 是一致的,
不是放弃了这个数值,只是换成响应式的方式实现,方便这个组件将来在其他
宽度的容器里(比如 Playground 单独预览)也能正常撑满,不用硬编码
固定宽度。

## 2026-08 补充:真实车辆照片
你提供了两张真实车辆照片(存在 `assets/vehicle-photos/` 下):
- `2018-ford-focus-rs.jpg` —— 黑色 Ford Focus RS 掀背车(车头有 "RS" 标)。
- `2022-bmw-x5.jpg` —— 深橄榄绿 2022 BMW X5(年份/车型你自己确认的)。

`inNegotiationExample` / `makeOfferExample` 这两个 mock 现在用的就是这两张
真实照片,`vehicleTitle` 也跟着改成真实车型名,不再是 Figma 原稿里那个疑似
占位的 "Year Make Model"(仍然怀疑那是设计师没替换的占位文案,推测记录见
上面)。`mileage`/`vin` 是你说的"可以随意编"的字段,按车重新编了合理数值,
不是任何真实数据源核实来的。`vehicleOnlyExample` 保持没有照片,专门用来
测试"没有照片"这个边界情况(不是遗漏)。

## 待办 / 下一步
- 用户已明确表示接下来会给"不同 scenario 的卡片展示"，**这次先不要**
  提前设计更多状态变体，等实际的 Figma/说明来了再做。
- Tile view 的整体页面接入(视图切换按钮 + "Viewing N results" 文案 +
  卡片网格)记录在 `fragments/OfferDashboard/notes.md`，不在这个组件
  笔记里重复。

## 2026-09-02 追加:新增 dialogVersion prop 透传
按你的要求新增 InformationDialog 的 v1/v2 切换,OfferCard 自己不关心这个
版本,只是原样透传给内部嵌的 InformationDialog,由 OfferDashboard 的
Controls 统一控制。细节见
[InformationDialog/notes.md](../InformationDialog/notes.md)。
