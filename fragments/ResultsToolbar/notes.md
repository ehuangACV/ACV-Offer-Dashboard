# ResultsToolbar — Notes

## 2026-09-02(第二次)按 Figma node 7320:22065 重做 view mode 切换按钮
你指出切换按钮左右 padding 不够。对照这个节点(`get_design_context`,
"segmented button" 7330:79395/79396/79403)核实:之前的实现是写死
`width:32px; height:32px` 的正方形按钮,里面塞一个 18px 图标,左右只剩
约 7px 空隙。这个节点量出来每个按钮实际是 `padding: 10px 12px`(不是
固定宽高),图标本身还是 18×18px 没变,两个按钮拼起来的整组尺寸是
100×36px。改成 padding 驱动尺寸(删掉 width/height 固定值),圆角从
999px 改成这个节点标注的 111px(视觉效果一样,都是超过一半高度的全圆角
pill,只是换成 Figma 自己标的数值)。

## 2026-09-02 新增:从 OfferDashboard 里抽出来的独立组件
你给了两张截图(tile 视图的 "Viewing 5 results" + 切换按钮,table 视图的
"🔑 Private Lane" + Pagination + 切换按钮),指出这两条工具条应该做成
**同一个组件的两个 view**(card view / table view),不是分别散落在
`OfferDashboard.vue` 里各写一次。这个组件的名字("Results Toolbar")是
按你的要求自己起的——取 "Viewing N results" 这行文案的 "results" +
它本身是一条工具条,不是 Figma 图层自带的名字，如果你有更想用的名字随时
可以改。

这次是**纯粹的搬迁**,没有改动任何数值/行为——CSS class 名字从
`offer-dashboard__*` 统一改成了 `results-toolbar__*`,选择器本身没有变
(padding/颜色/尺寸全部照抄原值)。所有关于"为什么长这样"的 Figma
核实记录/取舍原因(切换按钮 pill 形状对照节点 7432:69595、Private Lane
标签抄自参照原型 `My-ACV--Dealer-filter-main`、"三个元素固定 76px 行高
保持居中对齐"的推导过程),都还留在
[OfferDashboard/notes.md](../OfferDashboard/notes.md) 里,没有重复搬过来
——这里只记录"抽成独立组件"这一步的接口设计:

- `viewMode`('tile'/'table')+ `update:viewMode` emit——用 v-model 的
  写法接,`OfferDashboard.vue` 现在是
  `<ResultsToolbar v-model:view-mode="viewMode" ... />`,点切换按钮不再
  是组件内部直接改一个只在 `OfferDashboard` 里存在的 ref,而是标准的
  emit-up 模式。
- `resultsCount`(tile 模式的 "Viewing N results" 数字)、`hasPrevPage`/
  `hasNextPage` + `prev`/`next` emit(table 模式顶部 Pagination 的两个
  箭头状态/点击事件)——`showViewingText`没有做成 prop,顶部 Pagination
  本来就固定不显示"Viewing X out of Y"文案(这是 OfferDashboard 原来的
  设定,只有底部 Pagination 才显示),目前只有这一种用法,没有必要为了
  "可能以后要配置"提前加一个用不到的 prop。
- `prev`/`next` 这两个 emit 目前 `OfferDashboard.vue` 没有监听(抽出来
  之前 `<Pagination v-bind="topPagination" />` 也没有监听过,顶部分页的
  上一页/下一页本来就还没接上真实翻页逻辑)——保持原样,不是这次遗漏。

## 2026-09-02 追加：view switcher 左右padding再加4px
按你的要求，`.results-toolbar__view-toggle-btn` 左右padding从12px改成
16px（上下10px不变）——不是重新核实的Figma数值，是你直接给的覆盖。

## 2026-09-08 修复真实bug：顶部 Pagination 的 rows-per-page 完全没反应

你反馈 table view 顶部/底部的 Pagination 点了都没反应，一页永远显示
全部。追查发现这个组件本身只透传了 `hasPrevPage`/`hasNextPage` 给内部
的 `<Pagination>`，从来没有透传 `rows-per-page`——内部 `<Pagination>`
的 `rowsPerPage` prop 一直落到它自己的默认值 10（从没被父组件的真实
状态覆盖过），选了下拉菜单里的选项之后 `update:rows-per-page` 事件
虽然会 emit，但这个组件没有监听、也没有再往上转发，等于这个事件从
父组件的角度完全"消失"了。上面 2026-09-02 那条注释里"`prev`/`next`
这两个 emit 目前没有监听，保持原样"现在已经不适用了——`OfferDashboard.
vue` 这次把这两个 emit 和新增的 `update:rows-per-page` 都接上了真实
翻页逻辑，细节见 `fragments/OfferDashboard/notes.md` 同名条目。

改法：新增 `rowsPerPage` prop（默认 10，和内部 `<Pagination>` 默认值
一致）+ `update:rowsPerPage` emit，模板里原样转发给内部 `<Pagination>`
的 `:rows-per-page`/`@update:rows-per-page`，纯粹的透传，这个组件自己
不维护任何分页状态（页码/rowsPerPage 的真实状态都在 `OfferDashboard`
那一层）。
