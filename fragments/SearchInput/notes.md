# SearchInput — Notes

## 已核实(hidden=false,节点 6837:16150)
| 元素 | 数值 |
|---|---|
| 背景 | #F7F7F8,顶部圆角 4px |
| 占位文案 | "Search by year, make, model, VIN",Roboto Regular 16px/24,letter-spacing 0.5px,色 rgba(0,0,0,0.67) |
| 搜索图标 | 20×20,已下载真实 SVG,填色黑色(fill-opacity 0.87) |

## 待你确认
1. 只找到空态(占位文案)的实例,聚焦态 / 已输入文字态 / 清除按钮等交互
   状态没有找到对应实例,组件里已输入文字的颜色是直接用了正常文本色
   (rgba(0,0,0,0.87)),没有单独的 Figma 数据核实过。
2. 输入框高度是根据 Figma 里 "Text Input" 节点整体 72px 高减去
   `inset-[0_0_16px_0]` 里留的 16px 底部空白得出的 56px,这 16px 空白具
   体是留给什么(帮助文案?下划线?)没有查到对应内容,待确认。
