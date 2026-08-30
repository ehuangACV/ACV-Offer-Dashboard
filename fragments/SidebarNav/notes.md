# SidebarNav — Notes

## 2026-08 更新:去掉了展开/收起交互
之前版本给 Active / Negotiation / Billing 做了点击展开/收起,展开内容
来自 4 个 `hidden=true` 的 Figma "Sub menu" 节点,内容互相对不上、
归属不明确(这部分历史记录见下方旧版说明)。你已经明确说"这个不用管,
sidebar nav 不需要 interaction",所以现在直接去掉了这个功能——箭头
图标本身(已核实、hidden=false)还保留展示,只是纯装饰,不响应点击,
组件也不再暴露任何展开态的 props/controls。

## 已核实(hidden=false,实际可见)
| 元素 | Figma node id | 数值 |
|---|---|---|
| 容器 | 6903:21933 | 背景 #FFFFFF,flex-col,gap 4px,宽 260px |
| 普通项文字 | 例:6903:21934 / 21935 / 21936 / 21949 / 21958-21960 / 21962 | Roboto Regular 16px/24,letter-spacing 0.15px,色 #545454 |
| 选中项(Offers) | 6903:21951 | 背景 #EBF6FF,文字 Roboto Medium 16px/24,letter-spacing 0.15px,色 #004E7D |
| 数量徽标 | 6903:21965(叠在 Offers 行上) | 背景 #FF5449,文字色 #F7F7F8,14px/20,letter-spacing 0.1px,padding 8px/2px,rounded-full;示例数值"5"来自截图 |
| 展开箭头图标本身(纯展示) | Active(6903:21948)/ Negotiation(6903:21950)/ Billing(6903:21957)各自的 Navigation/expand-more 实例 | 24×24,填色 #545454,已下载真实 SVG |
| 分隔线 | 6903:21947 / 21956 / 21961 | 高 39px,内部线色 #DCDFE8,左右各留 16px |

## 已不需要确认(功能已移除)
Active / Negotiation / Billing 点击后应该展开什么内容——这个问题已经
不需要回答了,因为交互本身按你的要求被移除了。之前查到的 4 个 hidden
节点(6903:21938/21941/21943/21952)的内容对应关系不再相关,这里不再
重复列出。
