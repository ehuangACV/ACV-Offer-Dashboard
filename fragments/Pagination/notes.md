# Pagination — Notes

## 2026-08 重大更新:改用 Claude Design 项目里的 ACV Pagination 组件
按你的要求,通过 DesignSync(claude_design MCP)读取了 Claude Design
项目 "ACV Auctions Design System" 里的
`components/09c-pagination.card.html`,这是一份真实组件卡片(不是从
Figma 静态稿推断的),里面有 "ACV Pagination" 和 "MAX Pagination"
(AG-Grid 主题,完全不同的 token 体系)两套,这次用的是 **ACV
Pagination** 那一套,替换掉了之前基于 Figma 静态稿 + 原生 `<select>`
拼出来的版本。

### 主要变化
| 项目 | 之前(Figma 推断) | 现在(ACV Pagination 源文件) |
|---|---|---|
| "Rows per page" 字号/行高 | 14px/21,letter-spacing .1px | **14px/20px,无 letter-spacing** |
| 下拉实现方式 | 原生 `<select>`(展开态是浏览器原生渲染) | **自定义下拉菜单**(点开/点选项收起/点外部收起/Escape收起),菜单白底边框#DCDFE8圆角(仅下2角)4px,阴影`0 4px 10px rgba(0,0,0,.12)`,选中项背景**#1A73E8**文字白色,hover背景#F0F1F4 |
| 下拉箭头图标 | 实心三角形 path | **描边风格 chevron**(`M7 10l5 5 5-5`,stroke) |
| 下拉聚焦/打开态 | 无 | **`box-shadow: 0 0 0 3px #CFE3F5`** |
| 页码展示 | 单独页码数字"1" | 不再单独显示页码数字(这次没有恢复,只恢复了下面这一行) |
| "Viewing X out of Y results" | 有(底部专用) | [2026-08 已按你的要求恢复] 一度被换成源文件的 "{start}-{end} of {total}" 格式(比如"1-10 of 35"),你说这个文案"还是需要的",已经改回 **"Viewing X out of Y results"** 原文案+原样式(14px/21 letter-spacing .25px 色#212121),源文件的 range 格式没有采用 |
| 上一页/下一页图标 | 实心 path | **描边风格角括号**(prev `M14.5 5.5L8 12l6.5 6.5`,next `M9.5 5.5L16 12l-6.5 6.5`) |
| 箭头交互态 | 只有启用/禁用两种颜色 | 新增 hover(圆形背景#F0F1F4)、focus-visible(2px #0061A5 圆形描边) |
| 容器 | 无独立背景/padding | **白底 + padding 12px 16px + 圆角4px**,作为独立卡片样式 |
| Rows per page 选项 | 10/20/50/100 | 不变,还是 10/20/50/100 |

## 已核实(历史记录,顶部 6837:16183 / 底部 6837:16331,已被上面的新数据取代)
"Rows per page" 文案/下拉框/箭头等基础尺寸(70×36、24×24图标等)两边
数值一致,没有变化,只是图标画法、颜色细节、交互态、文案格式按新组件
源文件更正了。

## 待你确认
1. `showViewingText` 这个"顶部分页栏不显示、底部显示"的开关,是延续
   之前项目里"顶部/底部分页栏样式不同"的既有做法,如果顶部也应该显示,
   请告诉我。
2. 组件自带的白底+padding是作为独立卡片展示的样式,套进
   OfferDashboard 的表格顶部/底部行之后,已经在浏览器里视觉检查过一次,
   如果和周围已有的 padding 叠加显得空隙过大,可能还需要调整外层容器
   的 padding,请告诉我看起来是否正常。
3. 中间页(既有上一页又有下一页)时两个箭头的样式,组件卡片本身只给了
   两个静态示例,没有专门演示"中间页"状态,颜色/交互态按逻辑套用了
   ACV Pagination 卡片给的启用态样式,待你确认是否符合预期。
