# InformationDialog — Notes

## 2026-09-14(第六次)Type 说明弹层去掉右上角关闭×图标

你要求把这个弹层右上角的关闭×图标也去掉。不影响任何关闭方式——"Got it"
按钮、点弹层外部、按 Escape 键这三种关闭方式全都还在,只是不再多一个
冗余的×图标(和上一条去掉标题/徽标是同一类"这条信息/交互已经有别的地方
提供了,这里不用再重复"的调整)。

新增 `TypeGuide` 的 `hideClose` prop(默认 false,不影响 `OfferTableHeader`
那边),这个文件传 `hide-close`。标题和关闭按钮都隐藏时(现在这个文件的
情况),`TypeGuide` 内部会连整个 `.type-guide__head` 容器都不渲染,不会
在卡片顶部留一条空白——细节见 [TypeGuide.vue](../TypeGuide/TypeGuide.vue)
文件头 METADATA 的 `hasHead` 说明。

## 2026-09-14(第五次)Type 说明弹层去掉"Type"标题和 OfferTypeBadge 徽标

你要求把这个弹层里的"Type"标题和 OfferTypeBadge 徽标都去掉。配合上一条
(第四次)已经做的 `offerType` 过滤,这个弹层现在只显示这条offer对应的
那一段——那一段里再画一次徽标("In Negotiation"/"Make Offer")、上面再
写一次"Type"标题,都是重复信息(状态行的徽标已经显示过这条offer是什么
类型了)。

新增 `TypeGuide` 的 `hideTitle`/`hideBadge` 两个 prop(都默认 false,不
影响 `OfferTableHeader` 那边),这个文件传 `hide-title hide-badge`。标题
没有直接删掉整个元素,只是文字内容留空——细节(为什么不能直接删,会导致
关闭按钮布局跳动)见 [TypeGuide.vue](../TypeGuide/TypeGuide.vue) 文件头
METADATA。

## 2026-09-14(第四次)Type 说明弹层只显示这条offer对应的那一种类型

你反馈截图里这条offer是 In Negotiation,弹开的"Type"说明卡片却把
In Negotiation 和 Make Offer 两段都列出来,多余——只想看这条offer
对应的那一段。

这个组件本身已经有 `offerType` prop(这条offer真实的类型),直接透传给
`TypeGuide`(新增 `:offer-type="offerType"`),不用新增任何 prop。
`TypeGuide` 那边加了一个同名的可选 prop,传了就只显示对应那一段,不传
还是两段都显示——因为 `OfferTableHeader` 那边点的是整个表格"Type"列的
图例,不对应具体某一行,不能只显示一种。接口设计和取舍细节见
[TypeGuide.vue](../TypeGuide/TypeGuide.vue) 文件头 METADATA。

## 2026-09-14(第三次)"Type" 说明弹层抽成独立的 TypeGuide 组件

你要求给这张"Type"说明卡片单独建一个 Shared Components 下的组件页面。
这张卡片之前在这个文件和 OfferTableHeader.vue 里各自复制了一份几乎
一字不差的 markup/CSS/交互逻辑,顺手把这次机会用来把重复代码合并成
一个真正复用的组件 [fragments/TypeGuide/TypeGuide.vue](../TypeGuide/TypeGuide.vue),
不是又复制一份出来给 Playground 用。

这个文件这边改动:`<ImageBadge>` 里原来那一整块 markup 换成
`<TypeGuide :viewer-role="viewerRole" :trigger-el="typeInfoBtnRef"
@close="showTypeGuide = false" />`;`typeGuideRef`/
`handleTypeGuideOutsideClick`/`handleTypeGuideEscapeKey` 这几个"点外部/
按 Escape 关闭"专用的 ref/函数/监听器全部删掉了(逻辑搬进了 TypeGuide
自己内部),`showTypeGuide`/`typeInfoBtnRef` 这两个"开关状态+触发按钮"
还留着,因为开关的决定权还是在这个文件里,不是 TypeGuide 自己的事。
之前踩过的"继承来的 white-space:nowrap 导致文字跑出框外"这个bug(上面
第二次那条记录)细节和修法都在 TypeGuide.vue 文件头 METADATA 里,这里
不重复。

## 2026-09-14 "Type" 说明弹层文字跑出白色圆角框外(真实bug,和 mobile 无关)

你截图反馈这个弹层里的文字跑到白色圆角边框外面了。排查确认这**不是
mobile 才有的问题**——用 JS 直接量过,即使在正常宽度的桌面版里,
`.info-dialog__type-guide` 这个盒子本身精确是声明的320px宽,但里面
`<p>` 文字的实际渲染宽度早就到了500~1000px+,一直超出盒子,只是桌面
宽屏下周围空白够多,超出的部分没有明显撞到别的内容,没人注意到,你
这次是在 mobile 窄屏幕context 下用截图才把这个早就存在的问题暴露出来。

根因:`.info-dialog__type-guide-section` 设了 `align-items:flex-start`
(覆盖了外层 flex 默认的 stretch),这会让它内部的 flex 子项(这几个
`<p>`)在交叉轴上按"内容一行需要多宽就多宽"(fit-content/max-content)
算尺寸,不会被压到父容器实际可用的宽度——文字因此不会在盒子边界处
换行,超出去的部分就一直"跑到外面"。

修法:给 `.info-dialog__type-guide-desc` 加 `width:100%`,强制这几个
`<p>` 撑满 section 的可用宽度(`OfferTypeBadge` 徽标本身没加这条,不
受影响,还是维持自己的徽标大小,不会被拉成通栏)。浏览器实测:改之前
量出来文字盒子 right 到 1006px,盒子本身 right 只有 783.5px(超出
222.5px);改之后四段文字全部精确是 280px 宽(=320px盒子-左右各16px
padding),right 都是 763.5px,严格落在盒子 783.5px 边界以内;无
console 报错。

**2026-09-14(第二次)上面这次改完你反馈从 OfferDashboard 打开还是有
问题,文字还是跑出框了**——排查发现上面那次只解决了一半:盒子宽度
(width:100%)确实生效了,但文字死活不换行、按"一行放完"的宽度硬渲染,
超出盒子右边界。用 JS 顺着这个元素的父节点链一层层量
`getComputedStyle(...).whiteSpace`,精确定位到问题:`<div
class="info-dialog__type-guide">` 是嵌套在 `<ImageBadge>` 里面渲染的
(模板结构本来就是这样,徽标内嵌一个 info 图标,点开的说明弹层也在
徽标标签内部),而 `ImageBadge` 自己的根元素 `.image-badge` 给自己设了
`white-space:nowrap`(给一个短文字的徽标 pill 这么设很合理,不是
bug)。但 `white-space` 是会继承的 CSS 属性,这个弹层作为徽标的后代,
不知不觉也继承到了 `nowrap`,里面的文字段落因此永远按"一行放完"渲染,
`width:100%` 只是让盒子和段落的宽度都对了,但 nowrap 还在,自然不会
换行,超出的部分直接溢出盒子(`overflow:visible`,不会被裁切,是
"跑出来"而不是"被切掉")。

修法:给 `.info-dialog__type-guide` 自己加一条 `white-space: normal`,
把从 `.image-badge` 继承下来的 `nowrap` 在这一层截断重置,内部所有
文字(包括 `<p>` 段落)都恢复正常换行。浏览器实测:改之前那段"(24h
limit)..."文字量出来 `white-space` 计算值精确是 `nowrap`,渲染高度只有
20px(=一行);改之后 `white-space` 变成 `normal`,渲染高度变成 40px
(=两行,正常换行了),文字右边界 799px 严格落在盒子右边界以内;从
OfferDashboard 表格/卡片视图两条路径打开都验证过;无 console 报错。

## 2026-09-13 新增 mobile 版(对照 Figma node 7780:68649),只做 Negotiation History tab

你给的 Figma 链接(node 7780:68649,mobile "Offers" 详情页)展示了 web 版
这个弹层在 mobile 上的样子:不再是居中的黑背板卡片,变成一个全屏页面——
顶部 MobileTopBar(标题是车辆名,不是"Information")+ 两个 tab
("Negotiation History"/"Info")。你明确说"逻辑什么的和web一样,只是展示
方式不同",而且这次只做 Negotiation History,Info tab 的内容先不管。

**接口**:新增 `mobile` prop(默认 false,不影响任何已有用法)。`mobile=
true` 时整个渲染分支切换成全屏页面结构,不再渲染桌面版那一整套(黑背板/
居中卡片/车辆图/金额区/状态chip/Previous-Next两侧按钮——这些在这次的
Figma mock 里 Negotiation History tab 都不显示,大概率被挪到了 Info
tab,但那部分内容你说先不管,所以这里没有去猜/去实现)。

**逻辑复用,一个字没改**:气泡历史(`history`/`viewerRole`/
`lastCounterpartyIndex`/`declineProseText`)、Accept/Decline
(`canDecline`/`canAccept`/`confirmingAccept`)、输入面板
(`inputPanel`/`showSplitDifference`/`splitAmount`/`enteredAmount`/
`useSplit`)、提交(`footerButton`/`footerButtonEnabled`/
`handleFooterCommit`)全部是桌面版已有的同一批 computed/ref/function,
mobile 分支的模板只是换了一套 markup/class 去渲染同一份数据,没有新写
任何一条业务规则——这正是你说的"逻辑和web一样,只是展示方式不同"。

**视觉几何(照 Figma 这个 mobile 节点单独量的,和桌面版的 .info-dialog__*
不是同一套数值)**:
- 顶部栏:直接复用已有的 `MobileTopBar` 组件,`:title="vehicleTitle"`
  (车辆名当标题,不是"Information"),`@back="handleClose"`(点返回箭头
  = 关闭对话框)——量出来的几何(20px/30行高/500字重/#545454,底部1px
  #DCDFE8描边)和 MobileTopBar 已有的样式完全一样,不用改这个组件本身。
- Tabs:375px 平分两个各187.5px,39px高,选中态文字/底部2px下划线都是
  `#0061A5`(这个颜色同时也是桌面版 own 气泡的颜色,Figma 里两处用的是
  同一个 token,不是我瞎配的)。
- 聊天气泡:mobile 版是"缺一角"的聊天泡形状(other缺左下角、own缺右下角,
  尖角指向发言方),不是桌面版统一4px圆角的矩形——padding 8px 16px、
  14px/21行高/0.25字距,other底色`#F1F1F1`字色`#212121`,own底色
  `#0061A5`字色白(own的底色和桌面版一样,other的底色/字色和桌面版
  `#F0F1F3`/`#0E0E0F`不是同一个值,是Figma这个节点自己的数值)。时间戳
  10px/18/0.4/`#757575`。
- Accept/Decline 按钮:**直接复用桌面版已有的 `.info-dialog__btn`/
  `--grey-outline`/`--filled`**,没有新写一套 class——Figma 量出来是
  34px 高,桌面版是36px,2px 的差异不值得为此单独维护一套几乎一样的
  按钮样式,算合理的简化,不是漏看。
- 输入面板("Counter offer"/"New offer"):外层一条1px `#D1D3D6` 描边+
  "缺右下角"圆角(呼应聊天气泡同一个视觉语言),内部输入区背景
  `#FAFAFA`+下划线`#E0E0E0`+"Between X and Y"/"Greater than X"这行
  helper文字排在下划线下方——Figma 原始节点是一个完整的设计系统 Text
  Field 组件(自带 surface+indicator+helper 三层),这次没有照抄那个
  组件的完整实现,用等效的简化 markup(输入行+下划线+helper文字三个
  独立元素)还原出同样的视觉效果,细节和取舍见 `InformationDialog.vue`
  同名 CSS 注释。金额符号沿用桌面版的字面"$"字符,没有换成 Figma 那个
  单独的 dollar-icon svg 资源(视觉上几乎无法分辨,不值得多引入一个
  图片资源)。
- Send Counter/Send Offer/Accept 主按钮:**待你确认的一处**——Figma
  这次的 mock 只截图了"禁用态"(没填金额时):描边+文字都是浅橙色轮廓,
  不是桌面版"同一个实心按钮调透明度"的做法,这次照截图实测颜色抄了
  (`rgba(242,101,34,0.5)`,这个透明度是估的,不是精确核实的数值)。
  **启用态**这次的 mock 没有给对应截图,沿用了桌面版已核实的渐变实心
  样式(`.info-dialog__commit-btn` 同款渐变),是合理推断,不是照抄
  Figma——如果启用态实际截图给的样子不一样,需要回头改。

**2026-09-13(第二~三次,已撤销/rewind)"让弹层贴合模拟手机框" 这个
尝试最终搞坏了整个 Playground,已经整体回退**——你反馈从 OfferDashboard
Mobile view 点卡片按钮打开这个弹层,会铺满整个 Playground 浏览器窗口
宽度,不会被约束在模拟的 390px 手机框里。先后试了两轮修法(provide/
inject 换 teleport 目标;后来发现那样会导致"点 Manage Offer 没反应"
又加了一层拆分),第二轮上线后你反馈"问题更严重了"——连 Web view 切换、
Screen width 滑块都跟着失灵,整个 Playground 卡死。排查确认这两轮改动
会触发 Vue 内部一个 Teleport 相关的报错,一旦抛出会打断整个应用的响应式
渲染循环。**已经把这两轮改动全部撤销**,`<Teleport>` 改回原来无条件的
`to="body"`,回到 mobile 弹层逻辑本身完全正常(能打开、能操作)、只是
在这个 Playground 预览时会铺满整个桌面窗口宽度(纯视觉瑕疵,不影响真实
逻辑)的状态。撤销细节记在 [PLAYGROUND_NOTES.md](../../PLAYGROUND_NOTES.md)
同名条目,这里不重复。以后如果还想解决这个视觉瑕疵,需要先确认清楚不会
影响主应用的响应式稳定性,不能再这样直接改、边改边测。

**2026-09-13(第三次,已上线)换一套完全不碰 Teleport 目标的思路,重新
解决了这个问题**——`<Teleport>` 还是永远 `to="body"`,不再动它。新增
`mobileDeviceFrameEl = inject('mobileDeviceFrameEl', null)`(生产环境
inject 到的默认值是 null,不影响真实用法;只有 Playground 的 Harness
在渲染 Mobile view 模拟框时才会 provide 这个真实 DOM 节点),配合新的
`mobileOverlayRect`/`mobileOverlayStyle`:对话框打开时用
`getBoundingClientRect()` 量一次这个模拟框在屏幕上的实际像素位置,换算
成 `top/left/width/height` 当 inline style 绑定给 `.info-dialog-mobile
--overlay`(不再用 `inset:0`),窗口 resize 时也会重新量一次。这是最
基础的 Vue style 响应式绑定,不涉及 Teleport 内部机制,和前两次真正
出问题的地方(动态改 `<Teleport :to>`)是两回事。浏览器实测(逐步、
每一步单独查 console,不是全部操作完再查):Mobile view/全屏 Mobile
view 下点 "Manage Offer",对话框位置和模拟框精确重合;把模拟框滚动过
再开对话框(复现最早那个 bug 的场景)依然精确重合;连续切换
Mobile⇄Web⇄Mobile view 并重新开关对话框、Web view 下打开桌面版对话框、
拖 Screen width 滑块——每一步都确认无 console 报错,没有再出现 Teleport
内部报错。细节见 [PLAYGROUND_NOTES.md](../../PLAYGROUND_NOTES.md) 同名
条目("第九次")。

## 2026-09-03 去掉 V1,只保留 V2 行为(不再是可切换的版本)
你确认"去掉 information dialog version V1，已确认使用V2版本"——V1/V2 从
"两套可切换的版本"变成"只有一套行为",不再是一个 prop。

删掉的东西:
- `dialogVersion` prop 本身,以及所有透传它的地方——
  [OfferCard.vue](../OfferCard/notes.md)、
  [OfferTableRow.vue](../OfferTableRow/notes.md)、
  `OfferDashboard.vue`(prop 本身 + 两处 `:dialog-version="dialogVersion"`
  绑定)、`OfferDashboard/controls.js` 里的 "Information Dialog version"
  Controls 分段控件,四个文件一起删,不再有任何地方能切换版本。
- 车辆信息区右上角那个"v1 专属"的徽标(`v-if="offerType !== 'none' &&
  dialogVersion !== 'v2'"`,配套的 `.info-dialog__type-badge` 定位
  CSS)——这是 v1 独有的徽标位置,v2 把徽标挪到了状态行,两个位置本来就
  不会同时出现,删掉 v1 分支后车辆信息区右上角不再渲染任何徽标。
- 状态行徽标/状态chip 上原来只在 `dialogVersion==='v2'` 时才生效的条件
  全部去掉,改成无条件渲染/无条件应用——徽标 `v-if="offerType !== 'none'"`
  (不再判断版本),New/状态chip 的高度直接改成 24px/padding 5px 8px
  (原来的 `.info-dialog__chip--v2` 修饰类,只在 v2 时把 22px 的
  `.info-dialog__chip` 撑到 24px 去对齐旁边的 type badge,现在既然永远
  是这套行为,直接合并进 `.info-dialog__chip` 本身,不再需要单独一个
  修饰类)。

没有变的:所有其它逻辑、几何、文案都是原来 v2 的样子,一个字没动——这次
纯粹是"删掉 v1 分支和切换开关",不是重新设计 v2。

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

## 2026-09-09 修复真实bug：declineProseText / Accept确认框 In Negotiation 里写死用了"offer"

跟 `OfferCard.vue` 那次同一批修的（细节见
[OfferCard/notes.md](../OfferCard/notes.md) 同名条目），你在 Offer
Card 卡片上发现 In Negotiation 不该说"offer"该说"counter"之后，我检查
了这个文件里所有生成文案的地方，确认有两处同一类bug：

1. `declineProseText`——原来不管 `offerType` 都写死"Your offer was
   declined by the seller."/"You declined the offer."，改成按
   `isMakeOffer` 分支：In Negotiation 时是"...your counter was
   declined..."/"...declined the counter."。
2. Accept 确认框里的复选框文案"Accept Offer"——同样没判断类型，改成
   `{{ isMakeOffer ? 'Accept Offer' : 'Accept Counter' }}`。

浏览器实测：In Negotiation 的 declined 状态弹层显示"Your counter was
declined..."，点 Accept 后复选框显示"Accept Counter"；Make Offer 的
对应文案一个字没变，无 console 报错。

## 2026-09-09 顶部主徽标恢复 Make Offer 边框

你反馈"去掉Make Offer badge的stroke"这个要求原本只针对Card，弹层顶部
的主徽标（车辆信息行那个"Make Offer ⓘ"，[InformationDialog.vue:240](../InformationDialog/InformationDialog.vue:240)）应该保留边框，跟以前一样。这个主徽标用的是
`ImageBadge`（跟卡片图片上的徽标同一个组件），给它加了新增的
`stroke-make-offer` 这个 prop（细节见
[ImageBadge/notes.md](../ImageBadge/notes.md)），让这个用法恢复
`#8D9199` 边框，卡片那边继续保持无边框。

点 info 图标弹出的"Type"说明弹层里的示例徽标（[InformationDialog.vue:268-274](../InformationDialog/InformationDialog.vue:268)）用的是另一个组件
`OfferTypeBadge`（跟表格同一个），边框跟着表格那边一起恢复，这个文件
没有单独改。

浏览器实测：顶部主徽标边框 `#8D9199`、padding `2px 6px`，无 console
报错。

**这次特意没改的（你说先不动）：** 输入面板标题"Counter offer"（固定
搭配词组）、历史记录区兜底标题"Pending Offer"（泛指名词）。
