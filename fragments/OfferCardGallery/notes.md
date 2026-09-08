# OfferCardGallery — Notes

## 2026-09-03 补齐 4 个漏掉的状态组合 + 修卡片对齐
你两个要求:1)"card and card align"(同一行卡片顶部对不齐);2)检查有没
有漏掉的状态、补上。

**漏掉的状态**:核对 "Offer States Logic for CC.md" 的业务规则(declined
永远是卖家的动作,但卡片可以是买家视角"你被拒绝了"或卖家视角"你拒绝了
对方",两种视角都要各有一份;In Negotiation 买卖双方都能到 received/
sent/declined/expired 四种状态;Make Offer 买家只有 sent/declined/
expired 三种(卖家在 Make Offer 上不会 counter,买家永远不会
received),卖家只有 received/declined/expired 三种(同理买家不会
sent))之后,发现原来每个角色只做了 5 种,漏了 4 种:
- In Negotiation · buyer · declined
- In Negotiation · seller · declined
- In Negotiation · seller · expired
- Make Offer · buyer · expired

在 [`fragments/OfferCard/mock.js`](../OfferCard/mock.js) 新增了对应的 4
个 mock(`buyerDeclinedNegotiationExample`/
`sellerDeclinedNegotiationExample`/`sellerExpiredNegotiationExample`/
`buyerExpiredMakeOfferExample`,金额延续文件头的 Number rules,车辆/
dealer 换了新的、没在这个文件里出现过的组合,不延用 Ford Focus RS/BMW
X5 已经在演别的状态的那两条协商链——唯一例外是买家视角 Make Offer
expired,继续用 BMW X5,因为这 5 个 Make Offer 例子本来就是同一个
listing 的"假设几种不同结局"的演示,不是一条真实时间线,细节见该文件
里这 4 个新 mock 旁边的注释)。现在每个角色是完整的 7 种(In
Negotiation 4 种 + Make Offer 3 种),不再是 5 种。

**卡片没对齐的根因**:每张卡片上方的说明文字(`.offer-card-gallery__
label`)长度不一样,有的换行有的没换行,导致下面的 `OfferCard` 在同一行
里起始高度不一样(标签换成2行的那张卡片被往下推,旁边标签只有1行的卡片
就顶到更靠上)。给 `.offer-card-gallery__label` 加了 `min-height:32px`
(按这批标签实测最多换到2行)+ `display:flex;align-items:flex-end`,不
管文字实际是1行还是2行,这块区域高度都固定,下面的卡片就能在同一行里
顶部对齐;`align-items:flex-end` 让文字贴这块固定高度区域的底部(贴着
卡片顶边),1行文字时视觉效果还是"文字紧贴在卡片上方",不会因为多出的
空白把文字推得离卡片很远。

**顺带发现,没有动**:做这次改动读真实 `.vue` 文件时发现,它的
`buyerItems`/`sellerItems` 里每张卡片的说明文字是中文短句,但
`index.html` 这个静态镜像里对应的说明文字其实是英文(不是同一句话的
翻译,措辞结构也不完全对应)——两个文件在这个"标签文案"上已经不是逐字
对应的镜像关系,是这次核对时才发现的既有偏差,不确定是什么时候开始
分叉的。这次新增的 4 个状态,`.vue` 文件里写的中文、`index.html` 里写
的英文,分别延续了各自文件原有的语言,没有强行统一——如果你想让两边
逐字对应(要么都中文要么都英文),请告知,现在只是先不动这个既有分叉,
不耽误这次"补状态+修对齐"的主要任务。

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

## 2026-09-02 追加：In Negotiation / Make Offer 分成两个独立分组
按你的要求："in negotiation 和make offer是2类型，要分开"——每个 item
新增 type 字段（值直接取自它自己 mock 里的 offerType，不是重新分类），
按 type 分成两个 activeGroups（In Negotiation 在前、Make Offer 在后），
每组一个小标题，组内顺序保留原来"进行中→已结束"的排法。Declined/
Expired 各自归到它自己 mock 原本的 offerType 对应的组（比如买家侧
Declined 例子本身 offerType 是 make-offer，归进 Make Offer 组，不是
凭状态名称猜的）。
