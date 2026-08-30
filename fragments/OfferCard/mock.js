// 与 Figma node 7432:69394("Card/General Auction/Desktop")布局/样式一致的
// 示例数据。2026-08 更新:换成了你给的真实车辆照片(黑色 Ford Focus RS),
// vehicleTitle 也跟着改成真实车型,不再是 Figma 原稿里那个像是没替换掉的
// 占位文案 "Year Make Model"(那个占位文案的推测记录见 notes.md)。
// mileage/vin 是你说的"可以随意编"的字段,按这辆车编了合理数值。
export const inNegotiationExample = {
  offerType: 'in-negotiation',
  photoUrl: '/assets/vehicle-photos/2018-ford-focus-rs.jpg',
  dealerName: 'CarMax Boston',
  vehicleTitle: '2018 Ford Focus RS',
  mileage: '32,450 miles',
  vin: '884523',
  auctionId: '452161',
  timeLeft: '45m Left',
  statusNew: true,
  statusReceived: true,
  primaryMessage: 'Seller countered $4,500',
  secondaryMessage: 'You offered $3,800 · Today, 08:45 AM'
}

// Make Offer 状态徽标核实自节点 7441:5248/7441:5254。换成你给的第二张真实
// 照片(2022 BMW X5,年份/车型是你自己确认的),对应表格里 Asbury
// Automotive Group 那一行的同一台车,auctionId 也保持一致(876143)。
export const makeOfferExample = {
  offerType: 'make-offer',
  photoUrl: '/assets/vehicle-photos/2022-bmw-x5.jpg',
  dealerName: 'Asbury Automotive Group',
  vehicleTitle: '2022 BMW X5',
  mileage: '8,240 miles',
  vin: '410877',
  auctionId: '876143',
  timeLeft: '45m Left',
  statusNew: false,
  statusReceived: true,
  primaryMessage: 'Seller countered $4,500',
  secondaryMessage: 'You offered $3,800 · Today, 08:45 AM'
}

// 演示"以后不同 scenario 卡片字段可以缺省"——没有倒计时/状态chip/消息文案,
// 只保留车辆信息区。目前没有对应的 Figma 节点,纯粹是为了验证组件的可选
// 字段(timeLeft/statusNew/statusReceived/primaryMessage)行为,标注清楚
// 不是 Figma 核实的示例。
export const vehicleOnlyExample = {
  offerType: 'none',
  dealerName: 'CarMax Boston',
  vehicleTitle: 'Year Make Model',
  mileage: '250,000 miles',
  vin: '192211',
  auctionId: '452161',
  timeLeft: '',
  statusNew: false,
  statusReceived: false,
  primaryMessage: '',
  secondaryMessage: ''
}

export default {
  inNegotiationExample,
  makeOfferExample,
  vehicleOnlyExample
}
