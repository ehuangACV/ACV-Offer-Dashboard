# MobileBottomNav — Notes

## 2026-09-11 新增

Offer Dashboard mobile 版全局底部导航，细节和 Figma 核实数值见组件
自己的 METADATA。这里补充说明"为什么是新组件"：

桌面版的全局导航分散在两个地方——`AppHeader` 顶部的
Marketplace/My ACV/Market Report/More，和 `SidebarNav` 左侧栏的
My Inventory/Saved Auctions/Request Inspection/Active/Pending Proxy/
Negotiation。看了你给的 Figma mobile 页面（node 7765:16893）后，这些
都不存在于 mobile 版里——顶部只剩 `MobileTopBar` 的"← Offers"，取而
代之的是这条底部5格导航条。不是任何一个现有组件的响应式变体，是页面
级导航结构本身在 mobile 上完全重新组织了，所以新建独立组件。

## 关于第一格（ACV 小标）

Figma 里这个位置的 "Tab 1" 组件实例本身没有任何图标/文字子节点，是
个空的背景块——真正看到的那个 "ACV" 小标是叠在它上面的一个独立装饰
frame（节点 7765:16990），不属于这个组件实例，也没有任何点击交互标注。
按这个事实处理成纯装饰的 `<div>`（不是 `<button>`），不可点击。如果
实际产品里这一格其实应该是可点的（比如跳转首页），需要你确认。

## 待确认

1. Pricing/Auctions/Marketplace 三个可点击项的选中态样式——Figma 里
   没有找到对应的可见实例，目前这三个只是能点（emit `select`），视觉
   上不会像 "My ACV" 那样变色/加文字标签。
2. 渐变文字（"My ACV" 标签）是这个项目第一次出现的写法，用的是标准
   `background-clip:text`，如果以后发现别的地方也有渐变文字，可以
   直接复用这个模式，不用重新设计。
