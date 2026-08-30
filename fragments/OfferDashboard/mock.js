// 多经销商账号(默认):点击 Dealership chip 会展开完整的
// DealershipFilterDropdown(搜索 + checkbox 列表 + Reset/Apply)
export const defaultExample = {
  isMultiDealer: true
}

// 单经销商账号:DealershipFilterDropdown 自己的逻辑决定了
// isMultiDealer=false 时什么都不渲染,点击 Dealership chip 也不会
// 弹出任何内容
export const singleDealerExample = {
  isMultiDealer: false
}

export default {
  defaultExample,
  singleDealerExample
}
