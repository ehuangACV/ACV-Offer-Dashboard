# RemoveFromListDialog — Notes

## 2026-09-15(第二次)Playground Auto 模式下拖到 mobile breakpoint 以下,mobile 弹层没跟着变

同一批一起修的 bug,跟上面刚新增的 mobile 版是同一套 `updateMobileOverlayRect`
机制,详细排查过程见 [OfferDashboard](../OfferDashboard/notes.md)、
具体改法见 [InformationDialog](../InformationDialog/notes.md)(两边代码
是照抄的同一套,这次的修法也一样):把模拟框的垂直范围和真实视口
(`window.innerHeight`)做交集裁剪,不让 Auto 模式下"跟着内容撑到几千
px 高"的模拟框把这个弹层也拉到屏幕外面看不见。

## 2026-09-15 新增 mobile 版(底部弹出面板)

你截图反馈手机上这个弹窗还是桌面那张560px宽的居中卡片硬套在窄屏里,
文字换行、"Yes, Remove" 按钮被顶出卡片右边界——排查确认这个组件之前
完全没做过 mobile 适配(`OfferCard.vue` 调用时也没传任何 mobile 相关的
prop),不是"适配错了",是压根没适配过。

新增 `mobile` prop(默认 false),同 `InformationDialog` 已经在用的同一个
约定,`OfferCard.vue` 跟着传 `:mobile="mobileActions"`(和它传给
`InformationDialog` 的是同一个变量)。`mobile=true` 时换成"底部弹出
面板"(bottom sheet):背板不变,卡片贴底、撑满屏幕宽度、只留顶部两个角
的圆角,顶部加了一条纯装饰的拖拽提示条;两个按钮从"并排靠右"改成
"上下堆叠、撑满宽度"("Yes, Remove" 在上,"No, Keep It" 在下,靠
`flex-direction: column-reverse` 翻转视觉顺序,DOM 顺序没变)。这个
组件本身没有对应的 mobile Figma 节点,这套设计是讨论后确认的方向,不是
照抄哪个节点。详细取舍记在 `RemoveFromListDialog.vue` 文件头 METADATA,
这里不重复。

## 2026-09-02 新增
按你的要求,把 Figma 节点 1:31040("Dialog","Remove From List?")做成独立
组件,点 OfferCard/OfferTableRow 上的 "Remove From List" 按钮(只在
Declined/Expired 这两个关闭状态出现)时弹出,"Yes, Remove" 才真的从列表
移除,"No, Keep It" 或右上角 × 都是取消。

## 这个按钮之前的行为
在这次改动之前,"Remove From List" 和卡片/表格行上其它所有 hover 按钮
(Accept/Decline/Counter/View Details/Manage Offer/Raise Your Offer)一样,
点了都是统一打开 InformationDialog(见
[OfferCard/notes.md](../OfferCard/notes.md)/
[OfferTableRow/notes.md](../OfferTableRow/notes.md)里"你明确说这不合理,
先这样做"那条记录)。这次是**唯一一个被单独拆出来的例外**——"Remove
From List" 现在改成打开这个新弹窗,不再打开 InformationDialog;其余
按钮的行为完全没变。

## 接线方式
`OfferCard.vue`/`OfferTableRow.vue` 各自新增一个 `removeDialogOpen` 本地
状态 + 一个 `remove-from-list` emit。点击 hover 按钮时按 `btn.label ===
'Remove From List'` 分支:是就打开 `removeDialogOpen`,不是就还走原来的
`dialogOpen = true`。这个新弹窗的 `@remove` 事件转发成组件自己的
`remove-from-list` emit,由 [OfferDashboard](../OfferDashboard/notes.md)
接住,真正把这一行从列表里过滤掉(细节见该文件)。

## Figma 核实细节 / 颜色取舍
见 `RemoveFromListDialog.vue` 自己的 METADATA 注释,这里不重复——包括
"No, Keep It" 为什么用项目已有的 #0061A5 而不是 Figma 给的 #004E7D,
背板为什么直接复用 InformationDialog 现有的 50% 黑背板而不是单独核实。

## 待确认
这个节点本身(1:31040)只截了对话框卡片,没有背板/触发场景的参考帧,
"黑背板 50% + 居中" 这套机制是直接照抄 InformationDialog 现有实现搬过来
的,不是针对这个组件单独核实过的数值——如果以后有专门给这个弹窗的
背板参照帧,需要回来对照检查是否一致。

## 2026-09-11 Playground 分组从 Card View 挪到新的 Shared Components

你指出这个组件不该待在 "Card View" 分组里——上面"接线方式"那条已经
记过,它是 `OfferCard.vue` 和 `OfferTableRow.vue` 两处共用的,放在
"Card View" 里不准确,容易让人以为只属于卡片视图。

新建了一个分组 "Shared Components"(共用组件),放在 "Nav & Filters"
和 "Offers Table" 之间(order 25),`RemoveFromListDialog` 从 "Card
View"(原 order 43)挪到这个新分组。纯 Playground 侧边栏/分组层面的
改动——`OfferCard.vue`/`OfferTableRow.vue` 实际怎么打开这个弹窗完全
没变。
