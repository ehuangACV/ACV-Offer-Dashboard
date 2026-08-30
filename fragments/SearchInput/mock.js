// 对应 Figma 截图里的空态(占位文案)
export const emptyExample = {
  modelValue: '',
  placeholder: 'Search by year, make, model, VIN'
}

// 自定义的已输入示例,用于查看有文字时的样子(该状态没有对应的 Figma
// 实例,样式沿用输入框本身已核实的数值)
export const filledExample = {
  modelValue: '2018 Ford',
  placeholder: 'Search by year, make, model, VIN'
}

export default {
  emptyExample,
  filledExample
}
