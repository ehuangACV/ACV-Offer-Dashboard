# SearchInput — Notes

## 已核实(hidden=false,节点 6837:16150)
| 元素 | 数值 |
|---|---|
| 背景 | #F7F7F8,顶部圆角 4px |
| 占位文案 | "Search by year, make, model, VIN",Roboto Regular 16px/24,letter-spacing 0.5px,色 rgba(0,0,0,0.67) |
| 搜索图标 | 20×20,已下载真实 SVG,填色黑色(fill-opacity 0.87) |

## 待你确认
1. 聚焦态没有找到对应 Figma 实例,组件里已输入文字的颜色是直接用了正常
   文本色(rgba(0,0,0,0.87)),没有单独的 Figma 数据核实过。
2. 输入框高度是根据 Figma 里 "Text Input" 节点整体 72px 高减去
   `inset-[0_0_16px_0]` 里留的 16px 底部空白得出的 56px,这 16px 空白具
   体是留给什么(帮助文案?下划线?)没有查到对应内容,待确认。

## 2026-09-11 新增:输入内容后真的能搜索 + 右侧清空按钮

你反馈搜索框输入后好像没有真的在搜索,还给了一张新截图(Frame
630266015)说明"已输入文字"这个状态右侧应该有个 × 清空按钮。两件事:

1. **真正接上搜索逻辑**:这个组件本身(`SearchInput.vue`)一直只是个
   受控输入框,`v-model` 接得没问题;问题在
   [OfferDashboard](../OfferDashboard/notes.md)那边——`searchValue`
   这个变量存在、也真的绑定了,但决定"表格/卡片实际显示哪些行"的
   `matchesFilters(row)` 函数从来没有读过它,纯粹是接了线没接上逻辑。
   已经在 `matchesFilters` 里加了一条:输入的文字(trim + 转小写)去
   匹配每行的 `vehicleTitle`("2018 Ford Focus RS" 这种年份+品牌+型号
   拼在一起的字段)和 `vin`,命中其一就算匹配,和其它筛选条件(dealer/
   chip)一样是 AND 组合、边打字边实时生效,不需要按 Enter。只搜索
   vehicleTitle + VIN 两个字段,不含 Auction ID/Dealer Name——因为占位
   文案写的就是 "Search by year, make, model, VIN",没提到别的字段。
   细节见 [OfferDashboard/notes.md](../OfferDashboard/notes.md)。

2. **清空按钮**:`modelValue` 有内容时,输入框最右侧显示一个 × 按钮,
   点击清空(`emit('update:modelValue', '')`)。图标复用项目里已经在用
   的同一个"×"描边路径(InformationDialog/RemoveFromListDialog/
   OfferTableHeader 说明弹层关闭按钮同款,viewBox 0 0 24 24,path
   "M6 6l12 12M18 6L6 18"),不是新画的,尺寸跟左边放大镜图标一样
   20×20,两端视觉对称。这不是重新核实的 Figma 数值(这个组件本身只有
   空态的可见实例),是照你这次给的新截图直接实现的。

浏览器实测:输入年份/型号/VIN 片段后表格/卡片只显示匹配的行;输入框
出现 × 按钮,点击清空文字且表格恢复显示全部行;无 console 报错。

## 2026-09-11（第二次）改成按 Enter 才搜索,不再是输入过程中就实时过滤

你反馈不希望"一输入还没打完就开始 search",要求改成按回车才真的执行
搜索。

组件本身还是纯展示的受控输入框——`update:modelValue` 照常在每次按键
后实时上报文字(这个不能停,清空按钮"有没有内容才显示"这个判断、以及
输入框显示的文字本身,都还是依赖这个实时值)。新增了一个 `search`
emit,只在两个时机触发:1)输入框按 Enter(`@keyup.enter`);2)点击
清空按钮(这次提交的是空字符串,相当于立刻清空筛选结果,不需要额外
按 Enter)。真正"要不要执行搜索"这个决定通过这个新 emit 交给父组件,
[OfferDashboard](../OfferDashboard/notes.md)只在收到 `search` 事件时
才更新用来过滤数据的那个值,其它任何时候(比如输入过程中)都不会触发
过滤逻辑重新计算。

浏览器实测:输入"Focus"但不按 Enter,表格不受影响,还是显示全部行;
按下 Enter 后立刻只显示 "2018 Ford Focus RS" 这一行;点击 × 清空按钮
文字消失且立即恢复显示全部行(不需要再按一次 Enter);无 console
报错。
