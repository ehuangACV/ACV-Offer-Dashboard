/*
  默认 mock 数据。
  Playground 打开这个组件时,如果 controls 面板还没被手动改动过,
  就用这里的默认值渲染预览。

  singleExamples: 单个 chip 各状态的展示(用于 controls 面板联动的那一个)
  stackedExample: 表格里同一格叠加多个 chip 的真实场景示例
    —— 对应 Figma "status pills" frame 里一格里叠了 New + Offer Received 的情况
*/
export const singleExamples = [
  { status: 'new', label: 'New' },
  { status: 'received', label: 'Received' },
  { status: 'sent', label: 'Sent' },
  { status: 'declined', label: 'Declined' },
  { status: 'overflow', label: '+1' }
]

// 对应 Figma 表格里一格叠加显示多个 chip 的场景(New + Received 是唯二
// 已核实的可见状态,可以确定会同时出现)
export const stackedExample = [
  { status: 'new', label: 'New' },
  { status: 'received', label: 'Received' }
]

export default {
  singleExamples,
  stackedExample
}
