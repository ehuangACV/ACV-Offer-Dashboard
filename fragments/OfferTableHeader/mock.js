export const defaultExample = {
  isMultiDealer: true,
  sortColumn: null
}

export const sortedByDealerExample = {
  isMultiDealer: true,
  sortColumn: 'dealer-name'
}

// 单经销商账号:第二列变成 "Auction ID"(无排序),对应 Figma 帧 6837:16538
export const singleDealerExample = {
  isMultiDealer: false,
  sortColumn: null
}

export default {
  defaultExample,
  sortedByDealerExample,
  singleDealerExample
}
