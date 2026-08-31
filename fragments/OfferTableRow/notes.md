# OfferTableRow — Notes

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
