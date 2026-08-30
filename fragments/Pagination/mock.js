// 表格顶部的分页(不带 "Viewing..." 文案)
export const topExample = {
  showViewingText: false,
  rowsPerPage: '10',
  hasPrevPage: false,
  hasNextPage: true
}

// 表格底部的分页(带 "Viewing 6 out of 6 results"),按你的要求恢复成
// 之前的文案格式,不是 ACV Pagination 卡片给的 "1-10 of 35" 格式
export const bottomExample = {
  showViewingText: true,
  viewingCount: 6,
  totalCount: 6,
  rowsPerPage: '10',
  hasPrevPage: false,
  hasNextPage: true
}

export default {
  topExample,
  bottomExample
}
