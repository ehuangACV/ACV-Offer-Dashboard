# OfferCardGallery — Notes

## 这个组件是什么,不是什么
- **是**:你直接要求的一个 QA/文档用途"总览页"——把 `OfferCard` 在
  buyer/seller 两种视角下各自 5 种合法的"类型×状态"组合同时铺出来,每张
  卡片上方标一句话说明这是什么状态,顶部有 Buyer/Seller 切换。方便一次性
  对照检查所有状态的文案/芯片/按钮是否符合
  [OfferCard 的 "content & interaction spec"](../OfferCard/notes.md),
  不用在 OfferCard 自己的 Playground 页面里一个个切换 Mock 示例来看。
- **不是**:Figma 来源的组件,没有对应的节点,不是最终会上线给用户看的
  真实页面。

## 数据来源
5×2=10 个场景直接复用 `fragments/OfferCard/mock.js` 里已经建好的
`buyerReceivedExample`/`buyerSentNegotiationExample`/
`buyerSentMakeOfferExample`/`buyerDeclinedExample`/`buyerExpiredExample`/
`sellerReceivedNegotiationExample`/`sellerSentExample`/
`sellerReceivedMakeOfferExample`/`sellerDeclinedExample`/
`sellerExpiredExample`,没有重新编数据、没有复制粘贴一份新的 mock——改了
`OfferCard/mock.js` 里任何一个,这里会自动跟着变。

## 每张卡片上方的说明文字
是照你举的例子("买家刚发offer等待卖家回复")这个思路写的中文短句,不是
"Offer card — content & interaction spec" 文档里的原文措辞,纯粹是给
看这个总览页的人快速识别"这张卡是哪个场景"用的注释性文字。

## 顶部 Buyer/Seller 切换的样式
复用了 `OfferDashboard` 视图切换按钮(table/tile)已经验证过的同一套 pill
分段控件视觉(圆角999px两端全圆、描边#D1D3D6、active态背景#F5F5F5),不是
新发明一套切换样式——项目里已经有这个视觉语言,没必要再造一个。

## 每张卡片上方"小灰字标签"的样式
照你发的截图(白色示例卡片上方一行小灰字"Lable"/"Search & Filter")目测
估的(12px/16px,色#757575),不是 Figma 核实数值,也不是那张截图本身
的组件——那张截图只是用来说明"标签贴在示例上方"这个排版方式,不是要
照抄那个具体的设计系统。

## 待你确认
0. 【2026-09 新增】`OfferCard` 加了 `cardVersion`('v1'/'v2')prop 之后,
   这个总览页 10 张卡片**没有**跟着传这个值,还是走组件默认的 'v1'——
   不确定你是否想要这个总览页也能像 `OfferDashboard` 一样切到 v2,或者
   干脆也加一个 Buyer/Seller 那样的顶部切换按钮。细节见
   [OfferCard/notes.md](../OfferCard/notes.md)。
1. 5 种状态的排列顺序按"进行中→已结束"(Received→Sent→Declined→
   Expired,Make Offer 类型的那个状态插在对应位置)排的,不是规范文档
   规定的顺序(规范只列了表格,没规定展示顺序),如果你想要别的顺序请
   告知。
2. 这个组件目前只在 `fragments/` 目录建了文件,还没有决定要不要在
   Playground 侧边栏给它单独建一个导航项——如果需要请告知具体要放在
   "卡片视图 (Card View)" 分组里的什么位置。

## 2026-09-02 mirror sync fix: added missing counterpartyTimestamp
While fixing OfferCard's cardVersion default (see OfferCard/notes.md), found that component-playground.html's hand-duplicated buyerItems/sellerItems arrays for this gallery were missing the counterpartyTimestamp field on all three "Received" entries (the real .vue file does not have this gap since it spreads the actual mock objects directly via props: buyerReceivedExample etc.). Added the matching values from fragments/OfferCard/mock.js so the v2 line1-timestamp now renders correctly here too.
