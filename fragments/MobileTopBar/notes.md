# MobileTopBar — Notes

## 2026-09-11 新增

Offer Dashboard mobile 版顶部条,细节和 Figma 核实数值见组件自己的
METADATA。这里补充说明"为什么是新组件,不是改 AppHeader"：

桌面版顶部是两个组件叠在一起——`AppHeader`(logo + Marketplace/My ACV
等导航链接 + 通知/头像)和 `Breadcrumb`("My ACV > Offers")。看了你给
的 Figma mobile 页面(node 7765:16893)后，这两个组件在 mobile 版里
**都不存在**——顶部只有一条"← Offers"，logo/导航链接全部收进了新增的
`MobileBottomNav`(细节见该组件 notes.md）。这不是 AppHeader 的响应式
变体，是两个完全不同的组件在这个页面里各自负责不同的职责，所以新建了
独立组件，没有在 AppHeader.vue 里加 mobile prop。

`title` 做成 prop 而不是写死 "Offers"，是为了这个组件以后可能被别的
mobile 页面复用；`back` 只是 emit 出去，具体"返回去哪"由使用方决定，
这个组件自己不知道页面导航栈。
