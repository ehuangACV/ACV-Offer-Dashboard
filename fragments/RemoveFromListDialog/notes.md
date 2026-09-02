# RemoveFromListDialog — Notes

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
