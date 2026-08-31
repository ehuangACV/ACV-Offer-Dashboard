/*
  2026-08 按你给的 "Offer card — content & interaction spec" 重写:原来
  只有 3 个例子(inNegotiationExample/makeOfferExample/vehicleOnlyExample),
  自由文本 primaryMessage/secondaryMessage 手写,容易写出不符合规范的
  措辞。现在改成 viewerRole + dealState 驱动,文案由组件自己按规范表格
  算,这里只提供每一行"角色×类型×状态"组合需要的数值型 prop
  (counterpartyAmount/ownAmount/ownTimestamp 等)。10 个例子对应规范
  第2/4节两张表(buyer 5 行 + seller 5 行)里的每一行,车辆照片/车型是
  之前已经用过的两张真实照片,不是新素材;金额/时间戳是延用规范文档里
  给的示例数值,不是重新核实的真实业务数据。
*/

// ── Buyer 视角 ──────────────────────────────────────────────

export const buyerReceivedExample = {
  offerType: 'in-negotiation',
  viewerRole: 'buyer',
  dealState: 'received',
  photoUrl: '/assets/vehicle-photos/2018-ford-focus-rs.jpg',
  dealerName: 'CarMax Boston',
  vehicleTitle: '2018 Ford Focus RS',
  mileage: '32,450 miles',
  vin: '884523',
  auctionId: '452161',
  timeLeft: '45m Left',
  timeLeftUrgent: false,
  isNew: true,
  counterpartyAmount: '$4,500',
  ownAmount: '$3,800',
  ownTimestamp: 'Today, 08:45 AM'
}

export const buyerSentNegotiationExample = {
  offerType: 'in-negotiation',
  viewerRole: 'buyer',
  dealState: 'sent',
  photoUrl: '/assets/vehicle-photos/2018-ford-focus-rs.jpg',
  dealerName: 'CarMax Boston',
  vehicleTitle: '2018 Ford Focus RS',
  mileage: '32,450 miles',
  vin: '884523',
  auctionId: '452161',
  timeLeft: '2h 40m Left',
  timeLeftUrgent: false,
  isNew: false,
  ownAmount: '$4,200',
  ownTimestamp: 'Today, 09:10 AM'
}

export const buyerSentMakeOfferExample = {
  offerType: 'make-offer',
  viewerRole: 'buyer',
  dealState: 'sent',
  photoUrl: '/assets/vehicle-photos/2022-bmw-x5.jpg',
  dealerName: 'Asbury Automotive Group',
  vehicleTitle: '2022 BMW X5',
  mileage: '8,240 miles',
  vin: '410877',
  auctionId: '876143',
  timeLeft: '18h Left',
  timeLeftUrgent: false,
  isNew: false,
  ownAmount: '$22,000',
  ownTimestamp: 'Today, 10:49 AM'
}

export const buyerDeclinedExample = {
  offerType: 'make-offer',
  viewerRole: 'buyer',
  dealState: 'declined',
  photoUrl: '/assets/vehicle-photos/2022-bmw-x5.jpg',
  dealerName: 'Asbury Automotive Group',
  vehicleTitle: '2022 BMW X5',
  mileage: '8,240 miles',
  vin: '410877',
  auctionId: '876143',
  isNew: false,
  ownAmount: '$20,000'
}

export const buyerExpiredExample = {
  offerType: 'in-negotiation',
  viewerRole: 'buyer',
  dealState: 'expired',
  photoUrl: '/assets/vehicle-photos/2018-ford-focus-rs.jpg',
  dealerName: 'CarMax Boston',
  vehicleTitle: '2018 Ford Focus RS',
  mileage: '32,450 miles',
  vin: '884523',
  auctionId: '452161',
  isNew: false,
  ownAmount: '$4,200',
  expiredAt: ''
}

// ── Seller 视角 ─────────────────────────────────────────────

export const sellerReceivedNegotiationExample = {
  offerType: 'in-negotiation',
  viewerRole: 'seller',
  dealState: 'received',
  photoUrl: '/assets/vehicle-photos/2018-ford-focus-rs.jpg',
  dealerName: 'CarMax Boston',
  vehicleTitle: '2018 Ford Focus RS',
  mileage: '32,450 miles',
  vin: '884523',
  auctionId: '452161',
  timeLeft: '45m Left',
  timeLeftUrgent: true,
  isNew: true,
  counterpartyAmount: '$4,200',
  ownAmount: '$4,500',
  ownTimestamp: 'Today, 08:29 AM'
}

export const sellerSentExample = {
  offerType: 'in-negotiation',
  viewerRole: 'seller',
  dealState: 'sent',
  photoUrl: '/assets/vehicle-photos/2018-ford-focus-rs.jpg',
  dealerName: 'CarMax Boston',
  vehicleTitle: '2018 Ford Focus RS',
  mileage: '32,450 miles',
  vin: '884523',
  auctionId: '452161',
  timeLeft: '3h 20m Left',
  timeLeftUrgent: false,
  isNew: false,
  ownAmount: '$30,000',
  ownTimestamp: 'Yesterday, 11:39 PM'
}

export const sellerReceivedMakeOfferExample = {
  offerType: 'make-offer',
  viewerRole: 'seller',
  dealState: 'received',
  photoUrl: '/assets/vehicle-photos/2022-bmw-x5.jpg',
  dealerName: 'Asbury Automotive Group',
  vehicleTitle: '2022 BMW X5',
  mileage: '8,240 miles',
  vin: '410877',
  auctionId: '876143',
  timeLeft: '18h Left',
  timeLeftUrgent: false,
  isNew: true,
  counterpartyAmount: '$30,000',
  ownAmount: '$32,000'
}

export const sellerDeclinedExample = {
  offerType: 'make-offer',
  viewerRole: 'seller',
  dealState: 'declined',
  photoUrl: '/assets/vehicle-photos/2022-bmw-x5.jpg',
  dealerName: 'Asbury Automotive Group',
  vehicleTitle: '2022 BMW X5',
  mileage: '8,240 miles',
  vin: '410877',
  auctionId: '876143',
  isNew: false,
  counterpartyAmount: '$26,500'
}

export const sellerExpiredExample = {
  offerType: 'make-offer',
  viewerRole: 'seller',
  dealState: 'expired',
  photoUrl: '/assets/vehicle-photos/2022-bmw-x5.jpg',
  dealerName: 'Asbury Automotive Group',
  vehicleTitle: '2022 BMW X5',
  mileage: '8,240 miles',
  vin: '410877',
  auctionId: '876143',
  isNew: false,
  counterpartyAmount: '$26,500',
  expiredAt: ''
}

export default {
  buyerReceivedExample,
  buyerSentNegotiationExample,
  buyerSentMakeOfferExample,
  buyerDeclinedExample,
  buyerExpiredExample,
  sellerReceivedNegotiationExample,
  sellerSentExample,
  sellerReceivedMakeOfferExample,
  sellerDeclinedExample,
  sellerExpiredExample
}
