# DealershipFilterDropdown — Notes

## 2026-08 重大更新:改参照真实原型重做(不再以 Figma 静态稿为准)
你提供了本地文件 `C:\Users\Einphix\Desktop\My-ACV--Dealer-filter-main\
index.html`(配套 `style.css`),明确说"只参照里面 V1 web 版本的
dealership filter 部分,其他大部分是老旧的错误内容"。这是一个真实可
运行的原型(`#dealer-popover` + 配套 JS 交互逻辑),比之前只能从 Figma
静态稿推断的内容更权威,所以整个组件对照这份原型重做了一遍。

### 数值层面的更正(以原型 CSS 为准,不再是 Figma 推断值)
| 项目 | 之前(Figma 推断/占位) | 现在(原型核实) |
|---|---|---|
| "{n} selected" 文字色 | #0E0E0F | **#757575** |
| 搜索框占位文案 | "Search dealer name" | **"Search by dealer name or ID..."** |
| checkbox 画法 | 21×21/22×22 SVG 资源 | **18×18 CSS 方框圆角3 + `::after` 画勾**(选中态背景/边框 #004E7D,和 Figma 版本核实到的颜色一致,只是画法变了) |
| 经销商名单 | 9个,"Apple Chevrolet"重复两次(一直标着"疑似设计稿错误,待确认") | **10个真实名字,无重复**:Asbury Automotive Group / Apple Chevrolet / Baxter Auto Mall / CarMax Boston / Classic Honda / DriveTime A / DriveTime Mall / DriveTime Denver / Enterprise Car Sales / Hendrick Automotive。**这条"待确认"现在关闭**——原型证实了之前的重复确实是 Figma 稿的遗留错误。 |
| Apply Filter 渐变 | 自己拼的近似值 `linear-gradient(90deg,#F26522,#FC4243)` | **`linear-gradient(160deg, #F26522 13.86%, #FC4243 86.14%)`**,原型 CSS 里的确切数值 |
| "Select all" 交互 | 永远是"全选" | **"Select all" ⇄ "Deselect all" 切换**,只针对当前搜索可见的经销商生效 |
| 弹出方式 | 在文档流里紧贴筛选行往下顶开布局 | **真正的 `position:fixed` 浮层**,悬浮在触发按钮下方(定位逻辑在 OfferDashboard,见其 notes.md) |

### 关于弹出对齐方向的调整
原型里这个浮层对齐触发按钮的右边缘展开(`align:'right'`)。我们项目里
"Dealership" chip 是筛选行最靠左的第一个按钮,如果也对齐右边缘,浮层
大概率会超出视口左边界。改成了对齐触发按钮左边缘展开(浮层向右铺开),
这是因为我们的按钮位置和原型不同做的合理调整,不是原型本身的对齐方式
变了。

### 关于原型里"点击摘要小 chip 的 × 会连带清空搜索框"的行为
原型的 `clearFilter()` 是一个"全部清空"的合并逻辑,点小 chip 的 ×
会连带清空文本搜索和多选搜索 chip。我们项目里没有等价的"搜索框过滤"
概念绑在这颗经销商 chip 上,所以我们的版本里这颗 chip 的关闭按钮**只
清空经销商筛选**,不会牵连 In negotiation/Make Offer/New 等其他
filter chip——这是刻意收窄过的范围,细节见
[OfferDashboard notes.md](../OfferDashboard/notes.md)。

## 已核实(历史记录,大部分数值和原型吻合,仅供参考)
容器圆角12阴影 `0px 25px 50px -12px rgba(0,0,0,.2)`、头部标题 "Select
Dealerships" Roboto Medium 16px/24 色 #0E0E0F、搜索框圆角8、列表行高
44、底部按钮结构——这些在 Figma 稿和这次的原型里数值一致,没有变化。

## 待你确认
1. 弹出对齐方向从"右对齐"改成"左对齐"是否符合预期(见上面的调整说明)。
2. 摘要小 chip 的关闭按钮范围收窄(只清经销商,不清其他 chip)是否符合
   预期。
3. 原型本身的其余部分(V2/V3/mobile/搜索 chip lane 等)按你的要求完全
   没有参照,如果之后需要用到那些,需要你再单独指出来。
