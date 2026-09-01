# InformationDialog — Notes

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
