// 对应 Figma 截图里的默认状态:0 selected,没有搜索关键字
export const defaultExample = {
  isMultiDealer: true,
  preSelected: ''
}

// 自定义示例:预选两个经销商,查看选中态占位样式(checkbox 选中态颜色未
// 经 Figma 核实,见 notes.md)
export const preSelectedExample = {
  isMultiDealer: true,
  preSelected: 'Apple Chevrolet,CarMax Boston'
}

// isMultiDealer=false 时组件不渲染(单经销商账号不需要这个下拉)
export const singleDealerExample = {
  isMultiDealer: false,
  preSelected: ''
}

export default {
  defaultExample,
  preSelectedExample,
  singleDealerExample
}
