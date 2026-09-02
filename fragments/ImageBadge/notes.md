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

## 2026-09-02 追加:`.image-badge--in-negotiation-ring` 去掉投影
你反馈"Card 上 in negotiation badge 的 shadow 要去掉,stroke 保留"——
把这个共用 class 里的 `box-shadow: 0 1px 4px rgba(0, 0, 0, 0.45)` 删了,
只留 `border: 1px solid #FFFFFF`。因为 `InformationDialog.vue` 那边这次
干脆不传 `ring` 了(细节见
[InformationDialog/notes.md](../InformationDialog/notes.md)),这条 class
现在只有 Card 图片上的徽标在用,改动范围是安全的、不会影响到别处。
