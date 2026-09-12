# OfferTabs — Notes

## 已核实(hidden=false,来自节点 6903:23020)
| 状态 | Figma node id | 数值 |
|---|---|---|
| Buying(选中) | 6903:23023 | 背景 #FEF9F6,文字 #F26522 Medium 16px/24 |
| Buying 数量徽标 | 6903:23026 | 背景 #F26522,文字白色 Bold 12px/18 |
| Buying 指示条 | 6903:23028 | 高 2px,色 #F26522 |
| Selling(未选中) | 6903:23029 | 无背景,文字 #757575 Regular 16px/24 |
| Selling 数量徽标 | 6903:23032 | 背景 #D1D3D6,文字 #55575C Bold 12px/18 |
| 底部通用分隔线 | 6903:23021 | #DCDFE8 |

## [2026-08 已解决] Selling 选中态
之前 Figma 里没有找到 "Selling 选中" 的可见实例,组件直接照搬 Buying
选中态的数值(背景/文字/指示条颜色对调),标注过待确认。重新核实节点
`7487:63045`(hidden=false)后,找到了真实的 "Selling 选中 / Buying
未选中" 实例,数值和之前互换猜测的完全一致,不需要改动。

## 2026-08 新增点击交互 + Buying/Selling 数据联动
之前这个组件是纯展示的"哑"组件,两个 tab 按钮没有任何点击反应。按你的
要求加了 `@click` + `emit('select', 'buying'/'selling')`,组件本身不
持有状态,只上报"用户点了哪个"。[OfferDashboard](../OfferDashboard/notes.md)
接住这个事件后,真正切换显示哪一批车辆——12 条 mock 行按顺序切成前 6
条(Buying)/ 后 6 条(Selling),点 Selling 会真的把表格/卡片换成后
6 条数据,不再是摆设。这个"前6后6"的切分是纯粹为了满足"总共12个,
buying 6个 selling 6个"这个数量要求做的分组,不对应任何 Figma 数据或
真实业务规则(比如没有哪个字段真的标记了"这行是在卖还是在买"),细节见
OfferDashboard notes.md。

## 2026-08 修复:底部分割线实际渲染不可见
你截图对比指出灰色分隔线基本看不见。排查发现颜色/宽度/位置全部量得对
(`position:absolute` + `z-index:-1` + 1px高度的写法),但这种做法在实际
渲染里很容易被浏览器"抗锯齿"掉,是已知的 CSS 坑。已经改成直接在
`.offer-tabs` 容器本身加 `border-bottom:1px solid #DCDFE8` + 
`box-sizing:border-box`(后者是为了不让这条线多占1px、影响
OfferDashboard 里已经核实过的间距)。视觉效果不变,只是换了个更稳妥的
实现方式。

## 2026-09-11 按你的要求:文字/数字和下面分隔线的间距加4px

你要求"Buying/Selling 和数字距离下面的横线增加4px"。文字/数字徽标和
下面那条分隔线(`.offer-tabs` 的 `border-bottom`)、以及选中态橙色
指示条(`.offer-tabs__indicator`,`position:absolute;bottom:0`)都是
贴着 `.offer-tabs__tab` 这个盒子的底边算位置的,`.offer-tabs` 又是
`align-items:stretch`——只需要把 `.offer-tabs__tab` 自己的下 padding
从1px改成5px,按钮整体变高4px,分隔线/指示条的位置跟着(它们是相对这个
变高的盒子算的)一起往下移4px,文字本身位置不变,间距就精确多了4px,
不用分别改分隔线和指示条各自的坐标。

浏览器实测:`.offer-tabs__tab` 的 `padding-bottom` computed style 精确
等于 `5px`,截图对比确认文字/数字和下面横线的间距明显变大,无 console
报错。

## 待你确认
1. 发现两个 `hidden=true` 的备用 tab 变体(6903:23035 带 "sell" 图标 /
   6903:23041 带 "shopping_cart" 图标),看起来是带图标的旧设计,当前
   组件没有采用,如果这其实才是"当前设计"请告知。

## 2026-09-11 新增 mobile prop,配合 Offer Dashboard 的 mobile 版设计

看了你给的 Figma mobile 页面(node 7765:16893)里的 tabs(7765:16901,
Code Connect 组件 `Default Tabs`,`size: Small` 变体),核实到跟桌面版
真实的差异(不是同一套数值缩小,是这个尺寸变体本身就长得不一样):
- 不显示数量徽标(`buyingCount`/`sellingCount` 完全不渲染,不是隐藏)。
- 字号 16px→14px,letter-spacing 0.15px→0.1px。
- 选中态不再是橙色描边的 pill 背景(`#FEF9F6` + `border-radius:8px`)+
  橙色字,改成纯色蓝(`#004E7D`,ACV/Secondary/base)文字 + 蓝色底部
  指示条,没有背景色块。
- 两个 tab 各占 50% 宽度(`flex:1`),不是桌面版按内容自适应宽度贴左
  排列。

新增 `mobile` prop(默认 false,不影响任何已有用法)。padding 数值是
这个 Code Connect 组件没有暴露具体像素、按 tabs 容器整体高度 39px +
14px/20 行高文字反推的近似值,不是逐像素核实的 Figma 数值,如果实际
渲染出来间距不对,需要你发截图核对。
