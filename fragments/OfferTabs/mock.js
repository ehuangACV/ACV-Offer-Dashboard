// 对应 Figma 截图里的真实状态:Buying 选中,计数 3 / 2
export const defaultExample = {
  activeTab: 'buying',
  buyingCount: 3,
  sellingCount: 2
}

// Selling 选中态没有对应的 Figma 可见实例,样式是照搬 Buying 选中态换色,
// 这个示例仅用于查看该占位样式,不代表已核实设计
export const sellingSelectedExample = {
  activeTab: 'selling',
  buyingCount: 3,
  sellingCount: 2
}

export default {
  defaultExample,
  sellingSelectedExample
}
