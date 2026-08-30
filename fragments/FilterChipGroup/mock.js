// 对应 Figma 截图里的真实数量组合(Sent / Declined 都是 0,disabled 灰色态)
export const defaultExample = {
  isMultiDealer: true,
  dealershipOpen: false,
  negotiationCount: 2,
  makeOfferCount: 1,
  newCount: 1,
  receivedCount: 1,
  sentCount: 0,
  declinedCount: 0
}

// 自定义示例:所有筛选项都有数量,用于对比 disabled 态和正常态的区别
export const allActiveExample = {
  isMultiDealer: true,
  dealershipOpen: false,
  negotiationCount: 4,
  makeOfferCount: 2,
  newCount: 3,
  receivedCount: 5,
  sentCount: 2,
  declinedCount: 1
}

// 单经销商账号:没有 Dealership chip(对应 Figma 帧 6837:16538)
export const singleDealerExample = {
  isMultiDealer: false,
  dealershipOpen: false,
  negotiationCount: 2,
  makeOfferCount: 1,
  newCount: 1,
  receivedCount: 1,
  sentCount: 0,
  declinedCount: 0
}

export default {
  defaultExample,
  allActiveExample,
  singleDealerExample
}
