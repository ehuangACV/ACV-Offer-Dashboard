# ImageBadge — Notes

## 2026-09-02 新增:从 OfferCard 里抽出来的独立组件
你指出 OfferCard 图片左下角的三个徽标(In Negotiation / Make Offer /
dealer name)应该用同一个组件,不应该是三段各自手写的 `<span>` +
独立 CSS class。这次抽成 `fragments/ImageBadge/ImageBadge.vue`,颜色/
边框数值原样搬过去,没有改动任何视觉效果——只是把之前分散在
`OfferCard.vue` 里的 `.offer-card__type-badge--in-negotiation` /
`--make-offer` / `--in-negotiation-ring` / `.offer-card__lane-badge`
四条规则合并成一个组件的 `variant`('in-negotiation'/'make-offer'/
'dealer')+ `ring`(布尔,只在 `variant='in-negotiation'` 时生效)。

高度(24px)、圆角(4px)这两个几何属性是共用的基础样式
(`.image-badge`),只有背景/文字色/边框/水平 padding 按 variant 各自
不同——这两个数值本身是之前几轮改动逐步定下来的(以 Make Offer 高度为
基准统一、之后上下各减2px、圆角按你指出的"Make Offer 明显是4px"统一),
推导过程记录在 [OfferCard/notes.md](../OfferCard/notes.md) 里,这里不
重复。

`OfferCard.vue` 现在这样用:
```html
<ImageBadge v-if="offerType !== 'none'" :variant="offerType" :label="offerTypeLabel" :ring="offerType === 'in-negotiation' && badgeStyle === 'ring'" />
<ImageBadge v-if="dealerName" variant="dealer" :label="dealerName" />
```
`badgeStyle` 这个 prop 还是留在 `OfferCard.vue` 自己身上(不是
`ImageBadge` 的 prop)——`ImageBadge` 只关心"要不要画 ring"(`ring`
这个布尔值),不需要知道 `badgeStyle`/`OfferDashboard` 这些上层概念。

目前没有单独的表格版本对照——表格里的 `OfferTypeBadge` 组件(order 33)
是完全独立的另一个组件,数值本身就和这里不一样(圆角3px改4px、有白色
描边等历史记录见它自己的 notes.md),这次没有把两者合并,你也没有要求
合并,只是提醒一下这是两个不同的组件,不要混。

## 2026-09-02 追加:新增默认 slot,支持在标签文字后面插入内容
`InformationDialog.vue` 的 v2 需要在徽标里嵌一个 info 图标按钮(点开说明
弹层),给组件加了个最简单的默认 `<slot />`,渲染在 `{{ label }}` 后面。
`.image-badge` base class 顺带加了 `gap: 4px`(文字和 slot 内容之间留出
间距)和 `position: relative`(让 slot 里的绝对定位内容——比如
InformationDialog 那个说明弹层——能相对徽标自己定位,不用再包一层额外
容器)。这两条改动对没有传 slot 内容的现有用法(Card 图片上的三个徽标、
Dialog v1 的徽标)没有任何视觉影响——只有一个文字节点的时候,`gap`不会
产生任何效果,`position:relative` 本身也不改变布局。细节见
[InformationDialog/notes.md](../InformationDialog/notes.md) 的 v2 那条
记录。

## 2026-09-02 追加:圆角改 8px、ring 描边改成 outside(outline)
按你的要求:
1. `.image-badge` 的圆角从 4px 改成 8px,三个 variant(in-negotiation/
   make-offer/dealer)共用同一条基础规则,统一生效,不是只改了某一个。
2. `.image-badge--in-negotiation-ring` 的描边从 `border` 改成
   `outline`(`outline-offset: 0`)——`border` 是盒模型的一部分,会往内
   挤占空间,之前为了不让徽标看起来变大,特地把 padding 从默认的
   `3px 6px` 减到 `2px 5px` 去补偿描边占的空间;`outline` 只往外画、不
   参与盒模型计算,所以现在 padding 直接跟默认的 `.image-badge--
   in-negotiation` 保持一致(`3px 6px`),不需要再单独减。视觉上的效果
   变化:描边现在贴着徽标外缘往外扩一圈,不会再"吃掉"内部一点空间。

## 2026-09-02 追加:`.image-badge--in-negotiation-ring` 去掉投影
你反馈"Card 上 in negotiation badge 的 shadow 要去掉,stroke 保留"——
把这个共用 class 里的 `box-shadow: 0 1px 4px rgba(0, 0, 0, 0.45)` 删了,
只留 `border: 1px solid #FFFFFF`。因为 `InformationDialog.vue` 那边这次
干脆不传 `ring` 了(细节见
[InformationDialog/notes.md](../InformationDialog/notes.md)),这条 class
现在只有 Card 图片上的徽标在用,改动范围是安全的、不会影响到别处。

## 2026-09-09 去掉 Make Offer 徽标的边框

你反馈本地服务器(不是 Figma)上 Card 图片区的 Make Offer 徽标不该有
stroke,要求去掉。之前这条 `border: 1px solid #8D9199` 是对照真实 Figma
数据核实过的(见 `OfferCard/notes.md` 里 source_of_truth 那段,节点
7441:5248/5254,和表格版本 `OfferTypeBadge` 的 Make Offer 数值完全
一致)——不是这次改错的,是你现在明确要求推翻这条已核实的数值,已经
按你的要求去掉。

`.image-badge--make-offer` 删掉 `border` 那一行,`padding` 从
`2px 6px` 改成 `3px 6px`(上下各加1px,补偿去掉的1px边框,让总高度还是
24px,跟旁边的 dealer 徽标保持一致,不会因为去掉边框变矮2px)。

表格版本 `OfferTypeBadge` 的 Make Offer 同一条边框也一起去掉了,细节见
[OfferTypeBadge/notes.md](../OfferTypeBadge/notes.md)——你说"去掉stroke
for make offer badge"没有限定只改卡片,两处数值本来就是特意保持一致的,
只改一处会造成新的不一致。

## 2026-09-09（第二次）修正范围：只有 Card 不要边框，其它地方边框加回来

你反馈上一条改的范围错了——你原来的意思是**只有 Card 上**的 Make
Offer 徽标不要边框，表格和 Information Dialog 里应该保留原来的边框，
"两处数值特意保持一致"这个判断是错的。

发现一个结构上的复杂点：Information Dialog 弹层顶部主徽标（截图里
"Make Offer ⓘ"那个）用的**就是这个组件**（`ImageBadge`），跟卡片图片
上的徽标共用同一份 CSS——不是像我以为的那样只有卡片在用。这意味着
"卡片不要边框"和"Information Dialog 主徽标要边框"这两个要求，用同一个
`variant='make-offer'` 的 CSS 类没法同时满足。

改法：新增 `strokeMakeOffer` prop（默认 `false`），只在
`variant='make-offer'` 时生效，加一个 `.image-badge--make-offer-stroke`
class（`border:1px solid #8D9199` + `padding:2px 6px` 补偿边框占用的
空间，总高度还是24px）。`OfferCard.vue` 不传这个 prop，保持无边框；
`InformationDialog.vue` 的主徽标显式传 `stroke-make-offer`，恢复边框。

表格版本 `OfferTypeBadge` 的 Make Offer 边框也在同一批改动里加回来了
（不是这个组件的一部分，是独立组件，细节见
[OfferTypeBadge/notes.md](../OfferTypeBadge/notes.md)）。

浏览器实测三处：Card 图片上的 Make Offer 徽标——无边框；表格 Dealer
列的 Make Offer 徽标——边框 `#8D9199`；Information Dialog 顶部主
徽标——边框 `#8D9199`。三处都符合预期，无 console 报错。

## 2026-09-11 删除 ring 变体 + Playground 页面改成"所有徽标同时展示"

你提出两点：
1. `ring` 这个变体应该已经不存在了。查了一下：2026-08 就已经把 OfferCard
   里唯一的真实用法删掉了（`:ring` 不再传，见上面 2026-09-08 那条记录），
   之后 `ring` prop/`.image-badge--in-negotiation-ring` class 只在这个组件
   自己的 Playground 页面上留着做演示，没有任何真实页面在用了。现在按你
   的要求彻底删除：`ImageBadge.vue` 去掉 `ring` prop 和对应的 class 绑定/
   CSS 规则，`index.html` 同步删除。
2. Image Badge 的 Playground 页面希望把几个徽标同时展示出来，每个上方标
   名称，不要再靠 Controls 面板一个个切换 variant 才能看到。新增
   `ImageBadgeGallery.vue`（同一个文件夹下，照抄
   `OfferCardGallery`已经用过的"摆放+打标签"展示壳模式），把 3 个真实
   变体（In Negotiation/Make Offer/Dealer name）一次性铺出来，数值原样
   抄之前 Playground 页面的 3 个 Mock examples，没有重新编。`index.html`
   的 REGISTRY 里 `ImageBadge` 这个入口的 `def` 换成新的
   `ImageBadgeGallery`，`controls`/`mocks` 都改成空对象（照抄
   `OfferCardGallery` 入口已经用过的写法）——这个组件本身
   (`ImageBadge.vue`) 没有变成"多徽标"组件，`OfferCard.vue`/
   `InformationDialog.vue` 用到的还是原来那个只渲染单个徽标的组件，改动
   范围只限于 Playground 展示层。

   没有包含 `strokeMakeOffer`（InformationDialog 专用的边框版 Make
   Offer）——那是同一个 CSS 类基础上加一条边框，不是一个独立的"徽标
   类型"，细节见上面 2026-09-09（第二次）那条记录，如果你觉得也该在这
   个总览页里展示出来，告诉我加上。

浏览器实测：Image Badge 页面 Controls 面板不再有 variant/label/ring 三个
控件、Mock examples 那一行按钮也消失了（`controls`/`mocks` 都是空对象，
符合 Harness 已有的空控件兜底逻辑）；舞台里 3 个徽标同时显示，每个上方
都有对应名称；无 console 报错。
