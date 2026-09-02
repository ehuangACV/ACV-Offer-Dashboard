# OfferTableRow — Notes

## 2026-09-02(第三次)新增 hasPrevDeal/hasNextDeal,透传给 InformationDialog
配合 [InformationDialog](../InformationDialog/notes.md) 新增的两侧
Previous/Next(对照 Figma node 7597:112866)。做法和
[OfferCard](../OfferCard/notes.md) 那边完全一样:`hasPrevDeal`/
`hasNextDeal`(默认 false)原样传给 `hasPrev`/`hasNext`,`prev`/`next`
emit 转发成 `prev-deal`/`next-deal`,新增 `defineExpose({ openDialog,
closeDialog })` 给 [OfferDashboard](../OfferDashboard/notes.md) 一个
外部控制入口。真正算"排第几个""怎么切"的逻辑都在 OfferDashboard,这个
文件只是被动接收结果。

## 2026-09-02(第二次)三处小调整:hover背景色 / CTA右对齐 / 列改名
你看了上一条改动的实际效果后,给了三点修正:
1. **hover 背景色 #F0F8FF**:对照 Figma node 1:21166 核实,这个节点里
   hover 态那一整行(照片/dealer/vehicle/time/estimate/sent/received/
   update 每个 cell)背景都是 `#F0F8FF`,不是只有 Update 列。之前只做了
   Update 列内容切换,没有加这个背景色。直接在 `.offer-table-row:hover`
   这一级设置背景,不用逐个 cell 重复写。
2. **CTA 按钮组右对齐**:同一个 Figma 节点里,按钮组是
   `right:16px` 贴着列右边缘的,之前的实现是普通 flex 顺排、贴左。改成
   `.offer-table-row__ctas` 自己撑满整列宽度(`width:100%`)+
   `justify-content:flex-end`,只影响 CTA 这一块,不影响它旁边
   chips+日期(`.offer-table-row__update-default`)的对齐方式,两者互斥
   显示、各自独立布局。
3. **"ACV Estimate" 列改成 "Reserve Price"**:表头文案
   (`OfferTableHeader.vue`)和这一列显示的数字(原来绑定
   `acvEstimate`,改成绑定 `reservePrice`,这个 prop 本来就已经存在,是
   上一条改动里为 InformationDialog 新加的)都改了。`acvEstimate` 这个
   prop 本身**没有删除**——InformationDialog 弹窗里的 "ACV Estimate"
   那一行还在用它,只是表格这一列不再显示。CSS class 名字暂时还叫
   `--estimate`,是历史命名,不影响页面上显示的文字,以后如果要重命名
   class 再一起处理。

## 2026-09-02 新增 hover CTA + InformationDialog(对照 Figma node 1:21166)
你要求 table view 的 hover CTA "完全对应" card(OfferCard)hover 的 CTA
——点击后打开同一个 Information Dialog,因为 table/tile 是同一笔 deal 的
两种展示方式,数据和交互都该一样。你给了 Figma node `1:21166`(fileKey
`4z7FK34Fgit7Fi9UxZu0za`,"Offers - Negotiation" 文件)作为 CTA 具体样式
的参照——`get_design_context` 核实这个节点真实渲染出来是一条 hover 态的
表格行:Update 列的 StatusChip/日期被换成 "Counter"(outlined 小号
pill)+ "Accept $26,000"(filled 渐变 pill)+ 一条 1px 分割线 + 纯
文字链接 "More Info"(颜色 `#0061A5`,复用本项目已核实过的链接色,不是
Figma 原始 token 给的 `#004E7D`)。【2026-09-02 更正】filled 按钮最初带
字面的"✓"字符前缀(和 `InformationDialog` 的 Accept 按钮同一个写法),
你直接要求去掉,两处都改成纯文字,不再带勾。

实现上:
- 新增 `viewerRole`/`reservePrice`/`reportUrl`/`history` 4 个 prop——
  后三个字段本来就已经在 `mock.js` 每一行上了(之前只喂给 `rowsAsCards`
  转换成的 OfferCard props),这次补上声明才能真正传给这个组件里新增的
  `InformationDialog`;`viewerRole` 由 `OfferDashboard.vue` 按当前
  Buying/Selling tab 传进来(和 tile 视图的 OfferCard 拿的是同一个值,
  见该文件的 notes.md)。
- 新增的 `hoverButtons` computed 直接复用 `OfferCard.vue` 的
  `hoverButtons` 状态表(buyer/seller × received/sent/declined,同一套
  viewerRole+dealState 判断),只是多拆出一个 `infoLink` 字段——Figma 这
  个参照帧里 "More Info" 是分割线右边单独的链接,不是第三个和
  Counter/Accept 同等视觉权重的按钮,这一点和卡片版本(三个按钮堆成一排
  竖排大按钮,没有分割线+链接结构)不一样,但背后对应的还是同一组动作,
  不是新发明的交互。`declined` 这个组合两个按钮都不是"主操作",没有对应
  的分割线+链接结构可参照,保持原来两个平级按钮的样子。
- 点按钮组里任意一个(包括"More Info")都打开同一个
  InformationDialog,不按点了哪个区分内容——延续 OfferCard 那边"先这样
  做,之后会调整"的已知简化,不是这次新引入的。
- CSS 上没有照抄 OfferCard 那套"绝对定位 + backdrop-filter 模糊"的
  hover 机制——表格行只有 80px 高,Update 列背后本来就没有车辆信息挡着,
  直接用 `display:none`/`flex` 切换"chips+日期"和"CTA按钮组"两块内容。
- `component-playground.html` 的镜像里,`OfferTableRow` 这个
  defineComponent 整块挪到了 `InformationDialog` 定义之后(原来在它
  前面)——静态镜像文件里 `components: { InformationDialog:
  InformationDialog }` 是在 `defineComponent()` 调用那一刻就读取右边这
  个变量的值,如果还留在原来的位置会拿到 `undefined`,细节见那段代码
  自己的注释。

## 2026-09-01(第二次调整)三行的数字整体往下移,离 reserve 更远
你要求"个别 example 的 counter number 比之前更低一点",举了具体例子
reserve $5,500 / Highest Bid $4,500 / Seller Counter $5,000。这正好是
`rowWithNoStatusChip` 当时的 reserve(改之前是 $5,000/$5,300),照你给的
数字直接改了这一行;另外挑了 `rowChevyMalibu`/`rowFordEscapeSE` 两行做
同样的调整(reserve 不变,买家/卖家整体往下移一档,离 reserve 更远、
gap 保持不变),覆盖大/中/小三个金额量级。三行仍然满足严格区间(买家<
卖家<reserve,不相等)。具体新旧数字对比见 `mock.js` 各自字段旁的注释。

## 2026-09-01 按 "Offer States Logic for CC.md" 的 Number rules 整批重新生成金额,删掉两行
你截图指出 Information Dialog 里 "Highest Bid $26,000 / Seller Counter
$7,000 / Reserve $27,000"、"Between $26,000 and $7,000"、split "$16,500"
互相矛盾,逐行核对后发现不止这一处。你给了完整的生成规则(reserve 先定→
买家开盘价严格<reserve→卖家 counter 严格落在买家最新和 reserve 之间→
后续每一方新 counter 必须严格更接近对方,不能等于对方数字、不能反向)+
两轮修正(锚点只在存在时才生效、区间是严格区间不是闭区间、买家出价相对
reserve 收紧到 85%–97%、In Negotiation<6h/Make Offer<24h 没有例外),要求
**整批重新生成,不是逐个打补丁**——"Between $26,000 and $7,000" 这个 bug
正是补丁式修法(改一个数字,gap/split/区间这些派生值没跟着改)的直接后果。

这次的完整改动、每一行具体数字和理由,全部写在 `mock.js` 文件头的注释里
(不在这里重复),这里只记两条会影响这份 notes.md 之前记录的结构性变化:
- **删掉了两行**:`rowWithMakeOffer`(买家+Make Offer+Received,这个
  组合本身不存在,之前只在注释里标注矛盾没有删,这次直接删掉)、
  `rowFiat500`(`offerType:'none'` 不是合法类型,每笔 deal 必须是 In
  Negotiation 或 Make Offer 之一)。下面几条 2026-08 的历史记录里提到
  这两行的地方(比如"12行"、"3个已核实的行"里的第二个)保留原样不动,
  当作历史记录看,不代表现在还是这个数字。
- 行数从 12 变成 10,Buying/Selling 的 5+5 切分(原来 6+6)记录在
  `OfferDashboard/notes.md`。
- `rowWithNoStatusChip`/`rowHyundaiKona`/`rowFordEscapeSE` 三行之前用
  `sentAmount`(或 `receivedAmount`)='--' 靠 `acvEstimate` 兜底凑
  gap/split,这次补上了真实数字——In Negotiation 的起点必然有一个真实
  的买家 high bid,不该用兜底值代替。

## 2026-09 按你的要求给 Buying tab 补状态多样性
你指出"offer dashboard buying tab 下要有不同的card 的不同状态"——之前
`OfferDashboard.vue` 的 `rowToDealState()` 只在 `statusDeclined`/
`statusSent` 为 true 时才不落到默认的 'received',而排在 Buying tab
(前6行)的 6 行数据里,**没有任何一行** `statusSent`/`statusDeclined`
是 true,所以 6 张卡片全部显示同一个 'received' 状态,看不出区别。改了
这两行自编的 mockup 数据(不是 Figma 核实数据,见下面"第二批照片"章节,
改这两行不影响任何已核实字段):
- `rowLexusES`:`statusDeclined` 改成 `true`。
- `rowJeepWrangler`:`statusReceived` 改成 `false`、`statusSent` 改成
  `true`——这一行本来 `receivedAmount` 就是 `'--'`(对方还没回复过),
  只有 `sentAmount`,标成 `statusReceived` 本身和数据矛盾,顺手修正。

现在 Buying tab 的 6 张卡片是 4 个 received + 1 个 sent(Jeep) + 1 个
declined(Lexus),不再是清一色的 received。**没有改** Selling tab(后
6行)——那边本来就已经有 `statusDeclined`(Fiat 500)和 `statusSent`
(Dodge Charger)分布,不缺多样性。

## 2026-08 你指出:Update 列的 New chip 不应该有星星图标
你之前发过截图指出这个位置的 New chip 是没有图标的,这次又发了一次截图
才发现之前一直没有生效(之前调整 `StatusChip` 组件的星星图标样式时,漏
把这里的用法一起改成 `show-icon="false"`)。已经补上,和 OfferCard 里
New chip 同样没有图标的处理保持一致。

## 2026-08 按你的要求:点最左边的图片打开 VDP
你给了一个别的团队做的独立 VDP 静态页面(`2023 Jeep Grand Cherokee
Overland — VDP.html`,Alpine.js 写的,不是我们项目的技术栈),明确说
"不需要做component,直接调用就行,不想花太多时间"。所以这里**没有**把
VDP 重新实现成 Vue 组件——原文件原样存进了 `assets/vdp/
2023-jeep-grand-cherokee-overland-vdp.html`,表格第一列(图片)包了一层
`<a target="_blank">` 链接过去,点了在新标签页打开这个静态文件,没有做
任何跳转前后的状态同步(比如"打开过的行的 New 状态应该消失"这条你之前
说过的逻辑,VDP 页面本身还没开始做,这次也没有实现)。
现在**所有行**点图片都打开同一个 VDP 文件——目前只有这一份示例文件,
不是每一行车都有各自对应的真实 VDP,不要误以为这是"点哪行就显示哪行
车的详情"这种真实的动态跳转。

## 2026-08 更正:上面那份 VDP html 已删除,换成一张截图占位
你反馈那份 html "信息都是破碎的"(大概是另一个团队页面里大量异步加载
的图片/脚本在静态另存时没能完整保留),决定先不用那个文件。已经把
`assets/vdp/2023-jeep-grand-cherokee-overland-vdp.html` 删掉,换成你在
对话里贴的一张真实 VDP 页面截图(存成
`assets/vdp/vdp-screenshot.webp`,从 ACV Marketplace VDP 页面
"2020 Land Rover Range Rover Sport HST" 截的图,Emily Huang 的账号)。

## 2026-08 你指出:要打开"页面",不是直接下载图片
上一步我把 `<a href>` 直接指向了图片文件本身(`vdp-screenshot.webp`),
你反馈这样点击有些情况下会变成"下载图片"而不是"打开页面查看",你要的
是点了跳一个页面、页面里放这张截图,"假装是VDP页面"就行。已经新建了
`assets/vdp/vdp-page.html`——一个只包了这张截图的最简单静态页面(纯
`<img>`,没有任何交互),把链接从图片文件改成指向这个页面。仍然只是
"点图片会跳去 VDP" 这个交互位置的占位示意,不是真的 VDP 集成,等真正的
VDP 页面/组件方案定下来了再换掉。

## 2026-08 按你的要求:VDP 占位页加了"返回"点击区域
你截图指出截图左上角那个圆形 back 按钮要能点击返回 dashboard,明确说
"只需要有个 interaction 区域,不需要实际再做一个按钮"、"不要花太久时间"。
`assets/vdp/vdp-page.html` 加了一个透明的圆形 `<button>`,绝对定位在截图
里那个箭头按钮大致的位置(按截图比例估的,不是像素级核实,left 1.7%/
top 7.3%/宽1.7%/高3.6%,用 6x CSS transform 放大截图肉眼核对过大致对准
箭头,不是瞎猜的数字,但也没有花时间做到像素精确)。点击执行
`window.close()`——因为这个页面是从表格图片 `target="_blank"` 打开的
新标签页,关掉这个标签页就等于"回到 dashboard"(dashboard 本来的标签页
还在,没有被这次跳转替换掉)。已经实际测试过:点这个区域确实会关闭当前
标签页。没有画箭头图标本身,截图上已经有箭头图案了,只是叠了一个看不见
的可点击区域上去。

## 2026-08 你直接要求的两个样式改动(不是 Figma 数值,当时的记录)
1. **vehicle-title 太长要 truncate**,照抄 dealer-name 已有的截断样式。
2. **vehicle-title 改成左对齐**,覆盖父级继承下来的居中。mileage・VIN
   那一行当时保持居中不变,标着"待确认是否也要左对齐"。

## 2026-08 你指出对齐有问题,对照新节点核实:mileage 和 title 都应该左对齐
你给了新 Figma 节点 `7448:9966`(hidden=false 真实实例),核实结果:
Vehicle 列内容框自己写的是 `items-center`,但标题行和 mileage・VIN 行
两个子元素都是 `w-full`(撑满整个内容框),所以父级的 `items-center`
对它们没有任何视觉效果——真实渲染结果是两行都紧贴内容框左边界,即
**都是左对齐**,不是"标题左对齐、副标题居中"。上面第2点"mileage・VIN
待确认"现在有了确切答案:改成左对齐(`justify-content:flex-start`)。

顺带用这个新节点核实到 Vehicle 列内容框真实的内间距是 **left:14px /
right:35px**(不是其余列常见的左右各16px对称padding),内容宽度
195-14-35=**146px**——之前的 `max-width:163px`(按假设的对称16px
padding算出来的)已经改成这个真实数值。

## 已核实(hidden=false,对照了三条真实行实例)
| 列 | 宽度 | 样式要点 |
|---|---|---|
| 照片 | 80px(图 64×64) | 圆角数值未从 Figma 拿到具体像素,占位 8px |
| Dealer Name | 200px | 名称 14px/21 letter-spacing .25px 色 #0E0E0F;编号 12px/18 letter-spacing .4px 色 #55575C;下方可选叠加 OfferTypeBadge |
| Vehicle | 195px,居中 | 标题 14px/21 letter-spacing .25px 色 #212121;里程+VIN 12px/18 letter-spacing .4px 色 #757575,VIN 本身 Medium 色 #00558C |
| Time Remaining | 124px | 14px/21 letter-spacing .25px 色 #212121 |
| ACV Estimate | 123px | 同上,Regular 字重 |
| Sent | 85px | 14px/21,Medium 字重;真实值里出现过 "--" 表示未发起 |
| Received | 90px | 同 Sent |
| Update | flex-1 | StatusChip 堆叠(可 0~2 个)+ 日期 12px/18 letter-spacing .4px 色 #757575 |

## 2026-08 按你的要求:Dashboard 全屏 presentation 时表格列要跟着变宽
每列的 `width:Npx` 换成 `flex:N 1 Npx`(basis 还是原来核实过的像素值,
grow 用同一个数值),原理和 [OfferTableHeader/notes.md](../OfferTableHeader/notes.md)
里记的一样:表格容器正好 1122px 时数值完全不变,更宽时才会按比例一起
变宽。同时把 dealer-name(原 max-width:168px)和 vehicle-title(原
max-width:146px)两处单行截断的固定上限删掉了,改成让文字跟着所在
cell 的真实宽度截断——不删的话列变宽了、文字还卡在原来那个更窄的宽度
提前截断,达不到你要的效果。cell 自己的 padding(左右16px,或 vehicle
那一列的 14px/35px)没有变,截断宽度是靠这些 div 默认撑满 cell 内容框
的宽度自然算出来的,不是又写了一个新的固定数值。

## 2026-08 更正:Auction ID 和 OfferTypeBadge 要在同一行
之前版本把 Dealer Name / Auction ID / OfferTypeBadge 竖着堆成三行,你
指出 Auction ID 应该在徽标旁边。对照你给的新 Figma 帧(node 7403:4653,
结构和之前核实过的 6837:16215/16256/16296 一致)重新量了坐标,确认
Auction ID 文案和 OfferTypeBadge 确实在同一行、水平并排,间距约 8px
(从两行数据换算坐标得出,不是估的)。已经把模板改成 flex 行容器,不再
是竖排三行。

## 重要发现:更正了 OfferTypeBadge 的 "Make Offer" 边框结论
做这个组件时对照第二行真实数据,发现 "Make Offer" 徽标在真实使用场景里
被包在一个带边框(#8D9199,1px,圆角 3px)的父容器(node 6837:16269)
里,而之前 `fragments/OfferTypeBadge` 只单独查询了芯片本身节点
(6837:16275)就得出"无边框"的结论。已经回头更正了
[OfferTypeBadge/notes.md](../OfferTypeBadge/notes.md) 和对应的
`.vue` 样式,这里不重复贴数值,只记录这个交叉验证的过程。

## 2026-08 新增 isMultiDealer
对照单经销商参照帧(6837:16538 → 表格行 6837:16674,hidden=false):
第二列不再显示 dealerName,而是把 auctionId 直接当主标题显示(用原来
dealer-name 的字号字色,不是原来 auctionId 的小灰字),下面第二行只有
OfferTypeBadge、单独贴左对齐,auctionId 不会重复出现在第二行。数据本身
和多经销商版本的第一行完全一样(264578 / 2018 Ford Somemodel / New+
Received),只是展示方式不同,所以 mock 里的 `rowSingleDealer` 数值和
`rowWithNewAndReceived` 是一样的,只是 `isMultiDealer` 不同。

## 2026-08 补充:真实车辆照片
你提供了两张真实车辆照片(存在 `assets/vehicle-photos/` 下:
`2018-ford-focus-rs.jpg` 黑色 Ford Focus RS 掀背车、`2022-bmw-x5.jpg`
2022 BMW X5,车型/年份你自己确认的)。`rowWithNewAndReceived`(以及数值
相同的 `rowSingleDealer`)用了 Focus RS 的照片,`vehicleTitle` 也从占位
文案 "2018 Ford Somemodel" 改成真实车型 "2018 Ford Focus RS";
`rowWithMakeOffer` 用了 BMW X5 的照片,`vehicleTitle` 改成 "2022 BMW
X5"。`mileage`/`vin` 是你说的"可以随意编"的字段,按车重新编了合理数值,
不是任何真实数据源核实来的,`auctionId`/dealer/金额这些原本已核实的字段
没有改动。只拿到 2 张真实照片,`rowWithNoStatusChip` 这一行暂时没有对应
照片,`photoUrl` 留空、`vehicleTitle` 保持原来的占位文案,等你再给照片
补上。

## 2026-08 第二批照片:扩充成 12 行 mockup 数据(明确不是 Figma 核实数据)
你又给了 10 张新真实车辆照片,并明确要求"把 Dashboard 扩充成更大的
列表"。`mock.js` 里新增的 9 个导出(`rowLexusES`/`rowHyundaiKona`/
`rowJeepWrangler`/`rowFiat500`/`rowToyotaMatrix`/`rowFordEscapeTitanium`/
`rowChevyMalibu`/`rowDodgeCharger`/`rowFordEscapeSE`)**全部是自编的
mockup 演示数据**,和文件最上面 3 个已核实的行(`rowWithNewAndReceived`/
`rowWithMakeOffer`/`rowWithNoStatusChip`)性质不一样,别混为一谈:
- 照片是真的,vehicleTitle 是我根据照片外观目测猜的车型,年份基本靠
  目测估计,只有 Jeep Wrangler 那张照片挡风玻璃贴纸上能看清写着
  "2021",这个年份是确认的,其余年份都不是。
- dealerName 是从 `DealershipFilterDropdown` 已核实的经销商名单里挑的
  (Apple Chevrolet / Classic Honda / DriveTime A / DriveTime Mall /
  DriveTime Denver / Baxter Auto Mall,以及重复使用了 CarMax Boston /
  Asbury Automotive Group),不代表这些经销商真的挂过这些车。
- auctionId / mileage / vin / 金额 / StatusChip / 倒计时全部是编的、
  内部自洽的演示数值,不对应任何 Figma 节点或真实业务记录。
- `rowFiat500` 特意把 `offerType` 设成 `'none'`,演示徽标不显示的情况
  (组件本身一直支持这个值,只是之前已核实的行都刚好用到了
  in-negotiation/make-offer,没机会展示)。

`OfferDashboard.vue` 用这 12 行(3 个已核实 + 9 个自编)替换了原来只有
3 行的列表,SidebarNav 的 "Offers" 数量、OfferTabs 的 Buying 数量、
FilterChipGroup 各 chip 的数量也全部改成了从这 12 行数据里动态算出来的
(不再是之前 Figma 截图核实过的静态数字)——这是你在扩充 Dashboard 时
明确认可的取舍,细节记录在 `OfferDashboard` 的 METADATA/notes.md 里。

## 2026-08 按你说明的业务规则,更正了两行 mock 数据的倒计时
你说明了(不是 Figma 数据,是你直接告诉我的业务逻辑,记录下来避免以后
再编出不合理的数值):
- **In Negotiation** = 拍卖阶段的最高出价人(High bidder from the
  auction),倒计时上限 **6 小时**,seller 能做的操作是 Accept/
  Decline/Counter。
- **Make Offer** = 拍卖结束后任意买家发的报价(Post-auction offer),
  倒计时上限 **24 小时**,seller 只能 Accept/Decline,不能 Counter。

按这条规则检查了 12 行 mock 数据(细节见 `OfferDashboard.vue` 的
`sellingRows`/`buyingRows` 分组),发现 Selling 那 6 行里有两行的倒计时
是自编时没考虑这条规则、超出了 In Negotiation 的 6 小时上限:
- `rowToyotaMatrix`:`2d 2h` → 改成 `4h 50m`。
- `rowFordEscapeSE`:`14h 20m` → 改成 `2h 15m`。
Selling 里另外两个 Make Offer 状态的行(`rowFordEscapeTitanium` 9h15m /
`rowDodgeCharger` 18h5m)本来就在 24 小时以内,没有改。这次检查范围只是
你要求的 Selling 那 6 行,Buying 那 6 行还没按这条规则核对过,待你确认
是否要一并检查(Buying 侧的对应业务规则你还没说明)。

## 待你确认
1. 车辆缩略图的圆角具体数值——Figma 用的是 mask SVG,没有直接给出
   border-radius 像素值,组件先用 8px 占位。
2. 三行示例里,照片资源(imgImage1 + imgImage2)看起来是同一张图片的
   两层重叠导出,组件只用了一个 `photoUrl`,如果实际设计确实需要叠加
   两张图(比如车辆图 + 角标),需要你说明具体用途。
3. 只见过 Update 列 0 个 / 1 个(仅 Received)/ 2 个(New+Received)
   StatusChip 叠加的情况,StatusChip 本身"+N 溢出"逻辑的触发阈值(第几个
   开始收纳)在这三行数据里都没有触发,继续沿用 StatusChip 自己
   notes.md 里的待确认状态。

## 2026-09-02 追加:新增 dialogVersion prop 透传
同 OfferCard,原样透传给内部嵌的 InformationDialog,细节见
[InformationDialog/notes.md](../InformationDialog/notes.md)。

## 2026-09-02 追加：所有 Today 都补上具体时间
按你的要求，"Today"旁边都要写具体时间。把 mock.js 里 9 行
updateDate:'Today'（原来是裸的日期，没有时间）改成对应那一行
history 数组最后一条事件的时间（比如 rowWithNewAndReceived 用卖家
还价的 09:00 AM），不是随便配的数字。组件本身的 prop 默认值
（OfferTableRow.vue）和 controls.js 的默认值也一起从 'Today' 改成
'Today, 08:45 AM'（跟 OfferCard 那边 ownTimestamp 的默认值保持一致）。

**有一行没有改，需要你确认**：rowLexusES 的 updateDate 还是裸的
'Today'——它的 history 最后一条事件时间戳是"Mon, Aug 24, 04:00 PM"，
不是今天，直接在"Today"后面补时间会变成一个错误的日期（比如
"Today, 04:00 PM"，但实际上这笔单子是上个月的事，不是今天）。这不是
这次改动本身要处理的问题，是这一行数据本来就有的日期不一致，需要你
确认 updateDate 到底该写"Mon, Aug 24"还是别的值，我没有擅自改。
