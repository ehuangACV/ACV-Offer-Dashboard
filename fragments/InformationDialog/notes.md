# InformationDialog — Notes

## 2026-09-02 新增:两侧 Previous/Next + 车辆信息行的类型徽标
对照 Figma node 7597:112866("Offers"整页 + 打开的 Dialog + 两侧的
Previous/Next)新增两块内容,细节和取舍(为什么按钮贴视口边缘不是照抄
Figma 像素、为什么文字改深色、为什么徽标用 ring 样式)都写在
`InformationDialog.vue` 自己的 METADATA 和对应 CSS/computed 旁边的注释
里,这里只记接口设计:

- `hasPrev`/`hasNext`(布尔,默认 false)+ `prev`/`next` emit——"根据是否
  有其他 deal 决定要不要显示"拆成两个独立方向的判断,不是"有列表就都
  显示"。这个组件本身只负责"给了 true 就画按钮、点了就 emit",不知道
  "列表"这个概念——真正算"排第几个""点了切到哪一条"这些逻辑在
  [OfferDashboard](../OfferDashboard/notes.md),这个组件只是被动接收
  结果。
- 车辆信息行右上角新增类型徽标,复用 [ImageBadge](../ImageBadge/notes.md)
  (和 OfferCard 图片上的徽标同一个组件),In Negotiation 用 ring 样式——
  这正好是 Figma 这个节点里量到的真实样式(深色底+白色描边),不是为了
  "统一"硬套,是这个节点本来就长这样。
- 两个新按钮只在 `!inline` 时渲染,原因和整个弹层机制本身在 inline 模式
  下被跳过一样(inline 是 Playground 专用,避免固定定位的元素挡住
  Controls 面板)。

## 2026-09 整个组件按你给的参考模板重写(不再以 Figma 为准)
你给了 `Information Dialog Template.html`(手写静态参考页,不是 Figma
导出)+ `Offer States Logic for CC.md`(状态逻辑文档),原话:"Copy its
markup and geometry exactly — only swap the content ... Do not
restyle."——这次是把整个组件的几何数值、DOM 结构、颜色都换成这份模板
逐字量出来的值,内容(哪个状态显示什么)按状态文档算。完整的逐条对比
(宽度520px不是580px、chip改回手写不复用StatusChip、Decline只对卖家
渲染、Split三个可见条件、Time Remaining去掉"Left"尾巴等等)记在
`InformationDialog.vue` 自己的 METADATA 里,不在这里重复。

**顺带修的一个真实bug**:切换 Playground mock 示例时(对话框一直是打开
状态,`modelValue` 没有变成过 false 再变回 true),上一个场景里点了
Accept 留下的"确认面板+checkbox 勾选"状态会原样带到下一个场景——原来
只在 `modelValue` 变成 true 时才重置这些临时状态,组件在"一直开着,只是
底层数据换了"这种用法下是不健壮的。已经加了第二个 watch,只要
`dealState`/`counterpartyAmount`/`ownAmount`/`viewerRole`/`offerType`
这几个"这是哪笔deal"的字段变了,也会重置。真实场景(OfferCard 每次先关
再开)本来就不会触发这个bug,但组件本身不该依赖调用方"一定会先关再开"
这个约定。

**两处明确的逆转,需要你确认**:
1. 卡片宽度从你上一次明确要求的 580px 改回了模板写的 520px——这份模板
   的注释原话是"Fixed geometry, do not change: dialog width 520",和
   你更早的580px指示直接冲突,这次以最新的模板为准,但没有再问你一次
   就改了,如果580px仍然是你要的,请告知我改回去。
2. 状态chip从"复用StatusChip组件保证规则和card/table一致"改回了手写
   markup——因为这份模板的chip几何(高度22/padding4·8/字号12行高14)
   和StatusChip组件本身的几何不一样,"照模板抄不要重新设计"这条指示
   更新更明确,所以选了服从模板。这意味着**这个Dialog的chip视觉现在和
   card/table上的StatusChip不是同一份代码**,以后StatusChip改了颜色/
   圆角,这里不会跟着变,需要手动同步。

以下是之前(按 Figma / 旧模板)记录的历史,现在的几何数值已经不适用,
保留是为了能看到"发生过什么改动"这条线索,不代表当前状态:

## 2026-09 卡片宽度改为580px
你直接给的数值,把 `.info-dialog` 宽度从 460px(Figma node 7581:111476
核实到的数值)改成 **580px**。这是你的直接指示,不是重新核实 Figma 得到
的——如果之后再去核实这个节点,遇到宽度对不上,以这次你给的580px为准,
不要因为看到Figma上还是460px就改回去。输入面板(`.info-dialog__input-panel`)
的 `max-width:385px` 没有跟着等比例放大,原样保留(Figma上这个面板本身
量出来就是固定385px,不是按对话框宽度算比例的,卡片变宽只是让面板右边
空出更多留白,不是面板本身也要变宽)。

## 2026-09 去掉卡片内部的滚动条
你贴了两张截图对比:设计稿里内容明明比一屏还高,但没有任何滚动条;我做的
那版却在白色圆角卡片内部裁出一条滚动条,你说"这个滚动条真的很丑"。

原因:`.info-dialog` 卡片本身之前有 `max-height:90vh` + `overflow-y:auto`
——内容超过 90vh 就会在卡片内部滚动,滚动条会直接切在圆角卡片的圆角
范围里,视觉上很突兀。这不是内容或布局本身有错,单纯是"该在哪一层滚动"
选错了。

修法:滚动挪到背板(overlay)那一层——`.info-dialog-overlay` 加
`overflow-y:auto` + `padding:40px 16px`,`.info-dialog` 卡片本身去掉
`max-height`/`overflow-y`,内容多高就长多高。这样如果内容比视口高,是
整个背板(包括卡片)一起上下滚动,卡片自己没有任何内部滚动条,和设计稿
的效果一致。Playground 的 inline 模式(不用背板,直接走页面正常滚动)
本来就没有这个问题,不用改。

## 2026-09 Playground 里单独建了一个页面
你明确要求"不改变其他的 component in playground,只是新建一个compent 页面
给 InformationDialog 类似card view"——所以只在 `component-playground.html`
里加了一个新的 REGISTRY 条目(`InformationDialog`,卡片视图分组,order
42,紧跟 Offer Card / Offer Card — All States 后面)+ 一条侧边栏导航项,
**没有改动** `OfferCard`/`OfferCardGallery` 或任何其它已有组件的 Controls/
Mock/行为。

因为这个组件本身靠 `v-model`(`modelValue`)控制显示/隐藏,不像其它组件
挂载了就直接可见,这个新页面把 `modelValue` 也做成了一个 boolean control
(默认 `true`,一进页面就能看到弹窗)。这带来一个通用性的小改动:Playground
渲染组件用的是纯 `v-bind`,不会自动接住组件 emit 出来的
`update:modelValue`(点弹窗自己的 Close/X/背板不会有任何反应,Controls
里的开关也不会跟着变)。给渲染层的 `componentProps` 计算属性加了一句
**通用**逻辑:只要某个组件的 controls 里声明了名叫 `modelValue` 的
control,就自动接上 `onUpdate:modelValue` 让开关跟着同步——这条逻辑对
没有 `modelValue` control 的组件(也就是其它所有组件)完全不生效,不算
"改动了其它组件"。

5 个 Mock(`buyerReceived`/`buyerMakeOfferSent`/`sellerReceivedNegotiation`/
`sellerMakeOfferReceived`/`declinedClosed`)是专门给这个独立页面新建的,
覆盖 buyer/seller × in-negotiation/make-offer 的几个关键组合,不是
`OfferCard/mock.js` 那 10 个例子的完整复刻——这个页面的重点是核对
Dialog 自己的内容/交互规则,不是复刻 OfferCard 的状态矩阵,如果需要补全
另外 5 种组合(没验证的 declined 之外的 seller 视角/expired 等),请告知。

## 这个组件是什么
点击 `OfferCard` 上任意一个 hover CTA(Accept/Decline/Counter/View
Details/Manage Offer/Raise Your Offer/Remove From List)打开的居中
弹窗,展示完整的车辆信息、金额、协商历史,并承载 Accept/Decline/Counter
的真实交互(卡片本身只做摘要展示,不做这些交互)。

**你的原话,原样记录**:"这个是information dialog. 是点击card上所有CTA
打开的dialog. 无论是accept or delince. 我知道这不合理,先这样做,之后会
调整。" —— 所以现在 `OfferCard.vue` 里 `hoverButtons` 的每一个按钮点击
都只做同一件事:把 `dialogOpen` 设为 `true`,不区分点的是哪个按钮、不
把"点了 Accept"这个信息传给 dialog。这是已知的临时简化,不是本组件的
设计目标,以后要按钮区分动作时需要回来改 `OfferCard.vue` 的 click
handler,不需要改这个组件本身的逻辑。

## 打开方式
`<Teleport to="body">` + `position:fixed; inset:0` 的黑色 25% 透明度
背板(`.info-dialog-overlay`),点背板可关闭,卡片本身居中。这是你的
明确要求:"打开方式是当前页面居中overlay,有background黑色25%透明度"。

## 依据的文档
`C:\Users\Einphix\Downloads\Offer Dialog Rules for CC.md`(全文见该文件,
不复制到这里)。9 节结构:Header → Vehicle block → Money block → Status
row → Section header → History → Input panel → Footer,块的顺序"never
changes"是文档原话,组件模板严格按这个顺序写,没有按屏幕宽度或状态调整
顺序。

## 2026-09 你指出 UI 和 design file 对不上,换成正确节点重新核实
你给的链接对应节点 **`7581:111476`**,不是之前(2026-08)核实用的
`7560:89432`。回头看,`7560:89432` 其实就是文档第8节"当前有bug的例子"
本身,当时误以为只能拿它的结构/间距、内容按文档修正字面意思推——这次
拿正确节点重新核实,发现结构上也有两处真的推错了(不只是内容bug),
已经改正,见下面"Figma 核实情况"和"这次改正的两处结构性错误"。

## Figma 核实情况(node 7581:111476,fileKey 4z7FK34Fgit7Fi9UxZu0za)
已核实并直接采用的 token:
- 容器:白底、`border-radius:16px`、阴影
  `0px 24px 38px rgba(132,132,132,.14), 0px 9px 46px rgba(132,132,132,.12), 0px 11px 15px rgba(132,132,132,.2)`
- Header:高度54px,标题"Information" Roboto Medium 20px/30px letter-spacing
  .15px 颜色 #212121,关闭icon 24×24 右上角
- Vehicle block:背景 #F5F5F5,128×128缩略图(节点上明确 `size-[128px]`,
  之前误估成96×96,已改),gap24,标题16px Medium #212121,VIN/Odometer/
  Auction ID 14px Regular #757575
- Money block:背景 #FAFAFA,radius4,padding16,gap24;4组标签(Highest
  Bid/Seller Counter/Reserve Price/ACV Estimate)**全部**是12px Regular
  letter-spacing.4 #545454,没有例外(之前照旧节点记录过"Highest Bid
  这组标签也是Bold"是错的,这个正确节点上4组标签字重完全一致,已经在
  组件METADATA里更正这条说明——组件代码本身其实一直没有为它单独加粗,
  只是旧的注释写错了);值16px Bold letter-spacing.15;竖分割线1px
  #DCDFE8 self-stretch,在Reserve Price之前;"View Report"文字链接+
  外链icon,颜色复用项目里已有的 #004E7D token
- **状态行chip没有图标**,纯文字,圆角这个节点量出来是3px(和StatusChip
  组件本身核实到的4px不一致,选择跟着StatusChip组件的4px走,不为这一个
  Dialog开一个3px特例——理由见下面第1条)
- History:own bubble 背景#0061A5白字,圆角bl/tl/tr(右下角不圆,无tail);
  对方 bubble 背景#F1F1F1 文字#212121,圆角br/tl/tr(左下角不圆);
  bubble文字14px Medium letter-spacing.25 line21;时间戳10px Regular
  #757575,在bubble外部;Accept按钮带一个白色勾选图标(节点上
  `hasLeftIcon={true}`,Code Connect映射的是check图标)
- 输入框:padding 20px(之前估的16px,已改),圆角tl/tr/bl有、br没有
  (和消息气泡同一种"缺一角"处理,不是四角统一8px,之前统一写的8px已改)
- **提交按钮不在Footer里**:紧跟在输入面板/确认面板下面,单独一个、
  整体右对齐,Footer那一行只有"Close"(见下面第2条)

## 这次改正的两处结构性错误(不是内容bug,是我之前推错的组件结构)
1. **状态行 chip 不该有图标**——之前(2026-08)按文档文字描述
   "envelope/paper-plane/⊘"自己配了一套内联SVG图标当作"这个Dialog专属
   的图标集",这是错的:文档那几个图标名描述的可能只是"这个状态大致
   是什么感觉",不代表真的要在chip上画图标。这个正确节点核实到 New/
   Received 都是纯文字chip,和 card/table 用的 `StatusChip` 组件
   ("New" 不带图标)完全一致。已经删掉全部自制图标 SVG,改成直接
   `<StatusChip>` 组件(New传`show-icon="false"`),不再自己维护一份
   "看起来像"的图标集——这样才真的做到"这个chip和card/table的规则
   完全一样",不是视觉上凑近似。
2. **提交按钮不在 Footer 里**——之前(2026-08)因为核实用的是那个"已知
   有bug"的节点,footer里"Send Counter"悬浮在输入面板下方这个现象,被
   当成"这一个具体帧的排版错误",选择改成按文档字面"Footer=Close+主按钮
   同一行"来实现。这次用正确节点核实,同样的排版(提交按钮紧跟输入面板/
   确认面板下面、不在Footer里)在这个"没有已知bug"的节点上依然存在——
   证明这**不是**那个旧节点的个别错误,是这个Dialog真实的设计结构,之前
   "文档字面优先于单帧"的判断在这一点上是错的。已经改回:Footer只有
   Close,Send Counter/Send Offer/最终确认的Accept $X 各自紧跟在自己的
   输入面板/确认面板下面(新建的 `.info-dialog__action-block` 包一层,
   面板+按钮整体右对齐)。

## 未逐一核实的部分
文档表格列出了 10 种"类型×viewer×状态"组合(§2 §5),但 Figma 里只有
**这一个**实际帧(In Negotiation · Buyer · Received)。其余 9 种组合的
布局是从这一个帧的结构 + 文档文字描述推出来的,不是每一种都单独在
Figma 里核实过存不存在对应帧、位置是否一致。如果之后发现其他状态在
Figma 里有单独的帧,需要回来对照检查。

## 待你确认(文档自己列出的 open questions,原样保留未解决)
1. `Between $floor and $ceiling` 的下限从哪来,文档说"不从任何已显示的
   数字推出",目前 `floorAmount`/`ceilingAmount` 是作为独立 prop 传入,
   由外部(OfferCard/mock 数据)决定,组件本身不计算。
2. 买家是否应该看到 Reserve Price(会暴露卖家的底价)——目前按文档表格
   字面意思,买家和卖家都显示。
3. Declined/Expired 的deal是否应该弹出这个dialog——目前因为你说"所有
   CTA都打开同一个dialog",Declined/Expired卡片上的按钮(如果有的话)
   也会打开,dialog内部按状态隐藏了input panel和多余按钮,只留Close。

## 依赖 OfferCard 的地方
按钮视觉(`.info-dialog__btn` / `--filled` / `--grey-outline`)是从
`OfferCard.vue` 的 `.offer-card__hover-btn*` **复制**过来的同一套颜色/
圆角/padding值,不是重新设计——因为 Vue SFC 的 `<style scoped>` 不会
跨组件文件生效,直接引用OfferCard的class名在这个组件里不会有任何样式,
所以必须在这个组件自己的 `<style>` 里重复一份。如果以后 OfferCard 的
按钮视觉改了,这里也要手动同步改一次。

## 2026-09-02 追加:徽标去 ring、Previous/Next 改成贴对话框卡片本身

**徽标不再传 `ring`。** 你反馈"in negotiation badge 在 dialog 上不需要
shadow 和 stroke",而 `ring`(见 [ImageBadge](../ImageBadge/ImageBadge.vue))
本身就是"深色底+白色描边"+ Card 场景下额外带投影的那个变体——直接不传
`ring`(默认 `false`)就是最简单的做法,徽标退回默认的纯深色底样式,
没有描边也没有投影,不需要在 `ImageBadge` 里加新变体。

**Previous/Next 改成相对对话框卡片本身定位。** 最初(见上面
"Previous/Next 按钮"那条记录)按钮是贴**视口**左右边缘(`left/right:
24px`,在 `.info-dialog-overlay` 这个铺满全屏的容器上),理由是"不管
对话框多宽、屏幕多大都不会跟对话框重叠"。你反馈"距离dialog太远",
问题就出在这——视口边缘锚定的按钮离对话框卡片本身的距离取决于屏幕宽度,
屏幕越宽,实际看到的间距越大,不是一个稳定的视觉间距。

改法:新加一层 `.info-dialog__stage`(`position:relative;
display:inline-flex`),只包住 `.info-dialog` 卡片本身(不包 overlay 的
padding),把两个 nav 按钮也挪进这层里。按钮定位从 `left/right:24px`
(相对 overlay/视口)改成 `right:100%`/`left:100%` + `margin-right:16px`/
`margin-left:16px`(相对 `.info-dialog__stage`,因为 stage 收缩到刚好
包住对话框卡片,`100%` 就等于卡片的左右边缘)——这样按钮永远紧贴对话框
卡片外侧 16px,不再受视口宽度影响,也不用再单独担心"够不够宽不会撞到
对话框"(反正就是贴着卡片边缘往外扩)。

## 2026-09-02 追加:圆形底色改白、文字改 14px
按你的要求:`.info-dialog__nav-circle` 背景从 `#E8E9EB`(浅灰)改成
`#FFFFFF`(纯白);`.info-dialog__nav-label` 的 `font-size` 从 16px 改成
14px。顺带把这行文字的 `line-height` 从 24px 调成 20px——保持和字号
大致同一个比例(原来 24/16=1.5),不是你提的要求,是字号变小后行高
跟着等比例收一点,纯排版上的顺手调整,如果不需要这个联动可以告诉我
单独改回 24px。

## 2026-09-02 追加:overlay 背板加深
按你的要求,`.info-dialog-overlay` 的 `background` 从
`rgba(0, 0, 0, 0.25)` 改成 `rgba(0, 0, 0, 0.5)`——只改了这一个数值,没有
连带改别的东西。之前选 25% 是"背后页面内容大部分还看得见"这个考虑(见
上面 Previous/Next 按钮那条记录里的说明),这次你直接要求加深,没有再
纠结这个取舍,50% 只是一个"明显更深但还没到完全遮住背后内容"的居中
数值,不是照抄哪个 Figma 帧量出来的精确值——如果你有具体想要的深浅
程度,告诉我可以再调。

## 2026-09-02 新增 dialogVersion('v1'/'v2'):徽标挪到状态行 + info 图标 + 说明弹层

按你的要求新增一个 `dialogVersion` prop(默认 `'v1'`,不影响任何现有
用法),由 `OfferDashboard` 的 Controls 统一切换,往下透传给
`OfferCard.vue`/`OfferTableRow.vue`(它们自己不关心这个版本,只是转手
传给各自嵌的 `InformationDialog`)。

**v1(默认,现有样子不变)**:徽标(In Negotiation/Make Offer)贴在车辆
标题区右上角(`.info-dialog__type-badge`),状态行(New/Received/...)
维持原样,没有 info 图标。

**v2**:
1. 车辆标题区右上角**不再**渲染徽标(`v-if` 加了 `dialogVersion !== 'v2'`
   这个条件)。
2. 同一个徽标(还是复用 `ImageBadge`,颜色/变体逻辑完全不变)搬到状态行
   `.info-dialog__chips` 最前面,排在 New/Received 等状态 chip 之前。
3. 徽标内新增一个 info 图标按钮——`ImageBadge` 组件为此加了一个默认
   `<slot />`(见 [ImageBadge/notes.md](../ImageBadge/notes.md)),点这个
   图标(`@click.stop`,不会连带触发别的点击)会展开一张说明卡片
   (`.info-dialog__type-guide`)。
4. **说明卡片内容/样式和 dashboard 表格表头完全一样**(你明确要求"用
   dashboard table 上的同样的tooltip")——参照的是
   `OfferTableHeader.vue` 里点"Type"信息图标弹出的那张卡片:标题
   "Type"、两个 section 各配一个 `OfferTypeBadge`(In Negotiation/Make
   Offer)+ 两段说明文字("(6h limit) High bidder..."/"(24h limit)
   Post-auction offer..."各自配一行 **Actions:** 文案)、右下角一个
   "Got it" 按钮。因为 Vue SFC 的 `<style scoped>` 不会跨组件文件生效,
   这里把 `.offer-table-header__guide*` 那套 CSS(背景 `#F5FBFF`、圆角
   16px、三层阴影、20px padding/gap 等)原样复制成了
   `.info-dialog__type-guide*`,不是重新设计——唯一变的是定位的绝对
   数值(`top:calc(100% + 10px)`/箭头 `left:12px`),因为这次贴的锚点
   (24px 高的徽标)和表头那个 20×20 的信息图标尺寸、出现位置不一样,
   贴合到新锚点需要重新算,不代表卡片本身设计变了。点外部/按 Escape 关闭
   的逻辑也是照抄 `OfferTableHeader.vue` 同一套 `mousedown`+`keydown`
   监听惯例。
5. **状态 chip 高度改成和徽标一致**——你要求"status chip match to type
   badge 的高度",徽标(`ImageBadge`)高度是 24px,这几个状态 chip 原来
   是 22px(`.info-dialog__chip` 的 `height:22px`)。新增了一个只在 v2
   生效的 `.info-dialog__chip--v2` 修饰类,把 padding 从 `4px 8px` 改成
   `5px 8px`(22px + 2px = 24px),不是直接改 `.info-dialog__chip` 本身
   ——v1 的状态 chip 还是原来的 22px,不受影响。

`.info-dialog__type-guide` 用的两段"Actions"说明文字和图标颜色数值都是
从 `OfferTableHeader.vue` 已核实的真实文案照抄的(细节见该文件自己的
METADATA),这里没有重新核实,只是换了个容器复用。

**2026-09-02 追加:info 图标改成黑白**——最初直接照抄了
`OfferTableHeader.vue` 那个蓝底白"i"的图标画法,你反馈"用黑白的,用你
觉得合适的"。没有照搬"黑白"字面意思做纯黑/纯白两色,而是画了一个更简单
的纯描边圆圈+实心"i"(一个小圆点当"i"的点,一个小圆角矩形当"i"的
竖),`stroke`/`fill` 都用 `currentColor`——好处是图标颜色自动跟着徽标
自己的文字颜色走:In Negotiation 徽标文字是白色,图标就是白色;Make
Offer 徽标文字是深色,图标跟着变深色,不需要为两种徽标背景各自写一份
颜色。这是我自己的设计判断,不是照抄哪个 Figma 节点的图标。

实测发现 `currentColor` 一开始没生效,图标一直是黑色而不是徽标的白色/
深色文字——原因是 `<button>` 元素浏览器默认不继承祖先的 `color`(有自己
的 UA 默认文字色),给 `.info-dialog__type-info-btn` 补了一条显式
`color: inherit`,实测确认之后图标颜色正确跟着徽标文字色变化了。

## 2026-09-02 追加:Accept 按钮去掉"✓"、核实按钮字号
按你的要求"把 Accept button 前面的 check 去掉":`.info-dialog__btn--filled`
那个 Accept 按钮模板文字从 `✓ Accept {{ counterpartyAmount }}` 改成
`Accept {{ counterpartyAmount }}`,不再带字面的"✓"字符。因为
`OfferTableRow.vue` 的表格 hover CTA 里同一个 Accept 按钮当初是刻意
照抄这里的"✓"写法(见该文件自己的注释),这次一并改掉,保持两处同步,
不是只改了一半。`OfferCard.vue` 的 Accept 按钮本来就没有"✓"前缀,不用动。

你还要求"所有 button 里的 font size 是 14px"——检查了这个组件里全部
`<button>`(顶部关闭 ×、气泡下的 Accept/Decline、Footer 的 Close/Send
Counter、新增的 Previous/Next、v2 徽标里的 info 图标按钮和说明弹层的
Got it/关闭按钮),凡是有文字的都已经是 `font-size: 14px`,没有需要改的
地方;图标按钮(顶部 ×、说明弹层的关闭 ×、v2 徽标内的 info 图标)本身
没有文字,不受这条影响。同时确认了 `OfferCard.vue`/`OfferTableRow.vue`
的 hover CTA 按钮也都已经是 14px。如果你看到某个具体按钮渲染出来不是
14px,麻烦告诉我具体是哪一个,我再单独查。

## 2026-09-02 追加:Previous/Next 文字颜色改回白色
背板加深之后你反馈"previous 和 next font 太深,颜色也是白色"——
`.info-dialog__nav-label` 的 `color` 从 `#212121` 改回 `#FFFFFF`。这正好
和 Figma node 7597:112866 原本的白色文字一致,之前改成深色纯粹是因为
当时背板只有 25% 黑、白字对比度不够(见上面第一次加 Previous/Next 按钮
那条记录),现在背板已经加深到 50% 黑,白字不再有这个问题,所以直接
改回去,不是重新核实 Figma 才改的。圆形按钮本身(`.info-dialog__nav-circle`)
背景还是白色、图标还是深色 `#212121`,这两个没有变——用户这次反馈的
"字体颜色"指的是圆形下方的文字标签("Previous"/"Next"这两个词),
不是圆形按钮或箭头图标本身。

## 2026-09-02 更正：In Negotiation 允许连续出价（不用等对方回复）
你发了一张截图（卖家视角，dealState=sent，Buyer High Bid $14,500 /
Seller Counter $15,500，历史里只有一条自己刚发的 Counter: $15,500
气泡，没有输入面板），指出 In Negotiation 里买卖双方应该可以连续出多次
price，只要遵守price rule（price rule就是"自己这次的出价要比自己上一次
更靠近对方"——买家更高、卖家更低），不需要等对方先回复。之前的实现
（inputPanel computed）只在 dealState==='received'（轮到你响应）时才显示
Counter 输入面板，dealState==='sent'（等对方回复）时 In Negotiation
完全没有输入面板——这是一个业务规则理解错误，不是这次改动之前的Figma
核实差异。

改法：inputPanel 简化成"只要不是 Make Offer，received/sent 都返回
'counter'"。之所以不需要另外写一套"连续出价"的价格校验逻辑——
"Between {{buyerAmount}} and {{sellerAmount}}"这条提示本来就是取"买家
当前最新数字"到"卖家当前最新数字"之间，这两个 computed 只看
viewerRole+ownAmount/counterpartyAmount，不看dealState是received还是
sent，所以连续出价时这个范围天然就是"比自己上一次更靠近对方"，是同一套
逻辑，不用重复写。Make Offer 完全不受影响：Received（卖家视角）还是
只能Accept/Decline，Sent只有buyer能再抬价（"Raise Your Offer"），规则
没有变。

Split The Difference（showSplitDifference）跟着放宽：原来第3个条件是
"dealState==='received'"，现在改成直接复用`inputPanel.value==='counter'`
（等价于"是 In Negotiation 并且当前在走 counter 流程"，覆盖了新增的
sent 场景），不再单独判断dealState。
