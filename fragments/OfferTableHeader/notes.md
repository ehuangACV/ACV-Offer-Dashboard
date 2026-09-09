# OfferTableHeader — Notes

## 2026-09-02 按你的要求:"ACV Estimate" 列改名 "Reserve Price"
这一列的表头文案从 "ACV Estimate" 改成 "Reserve Price"——`OfferTableRow`
那一列显示的数字也跟着从 `acvEstimate` 改成 `reservePrice`,细节和原因
见 [OfferTableRow/notes.md](../OfferTableRow/notes.md)。下面"已核实"表格
里"ACV Estimate"这一行是当时 Figma 核实到的原始列名记录,保留不改,当
历史记录看。

## 已核实(hidden=false,节点 6837:16185)
| 列 | 宽度 | Figma node id | 内容 |
|---|---|---|---|
| 图片占位 | 78px | 6837:16186 | 无文字 |
| Dealer Name | 200px | 6847:50859 | 标题 + "Auction ID・Type" 副标题 + 信息图标 + 排序图标 |
| Vehicle | 197px | 6837:16191 | 标题 + "Mileage・VIN" 副标题 |
| Time Remaining | 124px | 6837:16195 | 两行标题 + 排序图标 |
| ACV Estimate | 123px | 6837:16200 | 单行标题 |
| Sent | 85px | 6837:16201 | 单行标题 |
| Received | 90px | 6837:16202 | 单行标题 |
| Update | flex-1 | 6837:16209 | 单行标题 |

统一样式:高 50px,背景 #FAFAFA,底部描边 #DCDFE8;标题 Roboto Medium
14px/20 letter-spacing .1px 色 #212121;副标题 Roboto Regular 12px/18
letter-spacing .4px 色 #757575;排序图标 16×16 色 #757575;信息图标
20×20 蓝底 #2196F5 白色"i"。

## 2026-08 更正:上下 padding 改成 12px,高度不再是固定 50px
你直接要求每个表头 cell 上下 padding 改成 12px——不是重新核实的 Figma
数值,覆盖掉了上表里"高 50px"这条已核实的记录。原来是
`padding:5px 16px 0` 配固定 `height:50px`;如果保留固定高度,新的
12px+12px=24px padding 会比原来的5px挤更多,两行文字(标题+副标题)的
列会被压得放不下。所以把固定 `height:50px` 去掉,改成 `auto`,行高交给
"内容+padding"自己撑出来(两行文字42px+padding24px≈66px),单行文字的
列(ACV Estimate/Sent/Received/Update 等)靠 `.offer-table-header` 本身
已有的 `align-items:stretch` 一起拉伸到同一行高,`justify-content:
center` 让它们的文字仍然居中,不会看起来矮一块或位置错位。图片占位列
(`.offer-table-header__cell--photo`)单独 `padding:0` 没有变,不受
影响。

## 2026-08 新增 isMultiDealer
对照你给的单经销商参照帧(6837:16538 → 表头 6837:16636,hidden=false):
第二列标题从 "Dealer Name" 变成 "Auction ID",副标题从 "Auction ID・
Type" 变成只有 "Type",并且**没有排序图标**(单经销商版本节点树里根本
没有 Actions/Descending 这个子节点,不是隐藏)。已加 `isMultiDealer`
prop 控制这些。

## 2026-08 按你的要求:Dashboard 全屏 presentation 时表格列要跟着变宽
之前每列是写死的 `width:Npx`。现在改成 `flex:N 1 Npx`(grow/basis 都用
同一个已核实的像素值)——表格容器正好 1122px 宽时(现在默认就是这样),
flex 算出来的最终宽度和原来固定 px 完全一样,不影响任何已核实数值;只有
容器比 1122px 更宽时,每一列才会按各自宽度的同一个比例一起变宽,不是
Update 一列单独吃掉多余空间。Update 列原来是裸 `flex:1`,也一起换成了
`flex:225 1 225px`(225 = 1122 减掉其余列宽度之和),纳入同一套比例逻辑。

## 2026-08 新增 Type 信息图标弹窗交互
之前信息图标只是装饰,没有任何交互。对照节点 `7487:65180`(Guide
Component/Announcement/MiddleImage,hidden=false)新增了点击弹出说明卡片
的交互——具体样式/文案取舍见 `.vue` 文件顶部 METADATA 的对应记录,这里
不重复贴一遍。

## 2026-09-08 修复真实bug：窄屏下表头和数据行的列错位

你反馈窄屏下 table view 内容都乱掉，而且表头文字要和数据行内容左对齐，
现在完全没对上。

根因:每一列原来是 `flex: N 1 Npx`(shrink=1),表头和数据行是两个各自
独立的 flex 容器，各自按自己内容的最小宽度收缩——表头的图片格是空
`<div>`（几乎没有最小宽度），数据行的图片格里是一张真实64px图片（有
实际的最小宽度下限），两边收缩的幅度天然不一样，越窄越对不上；另外
之前图片列表头是78px、数据行是80px，Vehicle列表头是197px、数据行是
195px，这两处本来就有几像素的历史遗留差异（在不收缩时刚好被
padding数值抵消，一收缩就暴露出来）。

改法:
- 所有列的 shrink 改成0（`flex: N 0 Npx`），不再靠挤宽度"适应"窄屏，
  改成外层 `fragments/OfferDashboard/OfferDashboard.vue` 新增的
  `.offer-dashboard__table-scroll` 容器横向滚动，细节见该文件
  notes.md 同名条目。
- 图片列宽度改成80px（对齐数据行），Vehicle列宽度改成195px（对齐
  数据行）。
- Vehicle列补了 `padding-left:14px`（之前默认16px，数据行那边是核实
  过的非对称14px/35px，见 OfferTableRow.vue 同一处注释），Update列
  补了 `padding-left:24px`（之前默认16px，数据行那边是2026-09-02就有
  的既有值24px）——这两列之前表头和数据行的左padding不一致，文字对不
  齐，现在都改成和数据行一致。
- 用浏览器里量 `getBoundingClientRect()` 逐列核对过表头文字和数据行
  内容的左边缘,现在7列全部像素级对齐(之前只有 Dealer/Time/Estimate/
  Sent/Received 5列碰巧对齐,Vehicle/Update 2列一直没对齐)。

## 2026-09-08（第二次）宽屏又对不齐 + Dealer/Auction ID 列太宽

上一条只把 shrink 改成0,没动 flex-grow——宽屏时每列还是会按比例被
拉宽,浮点比例分配在这里和 `OfferTableRow.vue` 两个独立的flex容器里
未必算出完全一致的像素值,又出现对不齐;拉宽本身也让 Auction-ID-only
模式(isMultiDealer=false,只有ID+Type徽标)显得太宽。完整根因分析和
改法见 `fragments/OfferDashboard/notes.md` 同名条目,这里只记录这个
文件自己的改动:grow 全部归零(`flex: 0 0 Npx`);Dealer/Auction ID
这一列新增 `--dealer--wide` 修饰类,`isMultiDealer` 为真时才叠加上去
把宽度从140px覆盖回200px（`OfferTableRow.vue` 也做了同样的切换，判断
条件是同一个prop，不会出现两边不同步的情况）。

## 2026-09-08（第三次）改成 CSS Grid，不再自己独立算 flex 宽度

上一条的根因分析还是不完整——即使 grow/basis 数值两边完全一样，这个
组件和 `OfferTableRow.vue` 仍然是两个各自独立的 flex 容器,各自单独
算一次"该变多宽",算出来的浮点像素值在某些宽度下可能有细微差异,这才
是反复对不齐的真正原因；而且上一条把 grow 归零也带来一个副作用——宽屏
下表格不再跟着变宽了，这其实是之前明确要过的功能。完整根因分析和
改法见 `fragments/OfferDashboard/notes.md` 同名条目，这里只记录这个
文件自己的改动：新增 `gridLayout` prop（默认 false，不影响这个组件
自己独立的 Playground 预览页，那边还是走原来的 flex 布局）；为 true
时给根元素加 `--grid` 修饰类，`display: contents`，把 8 个 `__cell`
交给外层 `OfferDashboard.vue` 的 grid 摆放，不再是自己的 flex 子项。
下面每个 `__cell--*` 的 `flex:` 声明留着没删——对 grid item 完全不
生效（浏览器直接忽略），只服务于独立预览时的 flex 模式，两套逻辑互不
干扰。

## 待你确认
1. 只有 Dealer Name 和 Time Remaining 两列在 Figma 里有排序图标的实例,
   其余列(Vehicle / ACV Estimate / Sent / Received / Update)是否也应该
   支持排序,没有对应实例,组件没有加。
2. 表头左侧发现两个 `hidden=true` 的备用列("Arbitration Policy" 配
   compare_arrows / meeting_room 图标),内容和位置都和当前可见列不重叠,
   看起来是旧版本,没有采用,如果这其实是要恢复的列请告知。
