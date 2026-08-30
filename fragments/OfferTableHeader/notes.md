# OfferTableHeader — Notes

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

## 待你确认
1. 只有 Dealer Name 和 Time Remaining 两列在 Figma 里有排序图标的实例,
   其余列(Vehicle / ACV Estimate / Sent / Received / Update)是否也应该
   支持排序,没有对应实例,组件没有加。
2. 表头左侧发现两个 `hidden=true` 的备用列("Arbitration Policy" 配
   compare_arrows / meeting_room 图标),内容和位置都和当前可见列不重叠,
   看起来是旧版本,没有采用,如果这其实是要恢复的列请告知。
