/*
  === 已核实数据(来自真实 Figma 实例,见 OfferTableRow.vue 顶部 METADATA
  的 source_of_truth)===
  下面 3 个 —— rowWithNewAndReceived / rowWithMakeOffer / rowWithNoStatusChip
  —— 的 dealerName/auctionId/offerType/金额/StatusChip 都是对照三条真实
  Figma 行实例核实过的,不是瞎编的占位数据。

  2026-08 第一批真实照片:你给了两张真实车辆照片(黑色 Ford Focus RS、
  2022 BMW X5),放在 assets/vehicle-photos/ 下,分别配进了
  rowWithNewAndReceived / rowWithMakeOffer,vehicleTitle 也跟着改成真实
  车型。mileage/vin 是你说的"可以随意编"的字段,按车编了合理数值,不是
  核实来的。

  === 2026-08 第二批:10 张新真实照片 + 扩充成 12 行 mockup 数据 ===
  你又给了 10 张新的真实车辆照片。这一批不再只是"给已核实的行配照片",
  而是你明确要求"把 Dashboard 扩充成更大的列表"(12 行)。所以下面除了
  上面 3 个已核实的行以外,新增的 9 个(rowLexusES 开始往后)全部是
  【自编的 mockup 数据】——车辆照片是真的,vehicleTitle 是根据照片外观
  推断的车型(年份大多是目测估的,只有 rowJeepWrangler 那张照片挡风玻璃
  上贴的标签能看清写着"2021"),dealerName 是从 DealershipFilterDropdown
  已核实的经销商名单里挑的(不代表这些经销商真的挂过这些车),
  auctionId/mileage/vin/金额/StatusChip/倒计时 全部是编的、内部自洽的
  演示数据,不对应任何 Figma 节点或真实业务记录。这个"覆盖已核实数字改成
  和 mock 行数对上的自编数字"是你在扩充 Dashboard 时明确认可的取舍。
*/

// 第一行:CarMax Boston,New + Received 两个 StatusChip 叠加 —— 对应你给的
// 黑色 Ford Focus RS 照片(已核实的真实行数据)
export const rowWithNewAndReceived = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/2018-ford-focus-rs.jpg',
  dealerName: 'CarMax Boston',
  auctionId: '264578',
  offerType: 'in-negotiation',
  vehicleTitle: '2018 Ford Focus RS',
  mileage: '32,450 miles',
  vin: '884523',
  timeRemaining: '20h 45m',
  acvEstimate: '$25,000',
  sentAmount: '$26,000',
  receivedAmount: '$7,000',
  statusNew: true,
  statusReceived: true,
  statusSent: false,
  statusDeclined: false,
  updateDate: 'Today'
}

// 第二行:Asbury Automotive Group,Make Offer 徽标(带边框),仅 Received
// —— 对应你给的 2022 BMW X5 照片(已核实的真实行数据,年份/车型你自己确认的)
export const rowWithMakeOffer = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/2022-bmw-x5.jpg',
  dealerName: 'Asbury Automotive Group',
  auctionId: '876143',
  offerType: 'make-offer',
  vehicleTitle: '2022 BMW X5',
  mileage: '8,240 miles',
  vin: '410877',
  timeRemaining: '20h 45m',
  acvEstimate: '$5,000',
  sentAmount: '--',
  receivedAmount: '$4,000',
  statusNew: false,
  statusReceived: true,
  statusSent: false,
  statusDeclined: false,
  updateDate: 'Today'
}

// 第三行:Asbury Automotive Group,In Negotiation 徽标,Update 列没有任何
// StatusChip,只有日期(已核实的真实行数据)。照片用了第二批里的 Lexus
// RX300(第一批只给了 2 张照片时这一行暂时留空,现在补上)。
export const rowWithNoStatusChip = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/lexus-rx300.jpg',
  dealerName: 'Asbury Automotive Group',
  auctionId: '876413',
  offerType: 'in-negotiation',
  vehicleTitle: '2001 Lexus RX300',
  mileage: '168,900 miles',
  vin: '552091',
  timeRemaining: '20h 45m',
  acvEstimate: '$5,000',
  sentAmount: '--',
  receivedAmount: '$4,000',
  statusNew: false,
  statusReceived: false,
  statusSent: false,
  statusDeclined: false,
  updateDate: 'Today'
}

// ↓↓↓ 下面 9 行全部是自编的 mockup 演示数据,不是 Figma 核实数据 ↓↓↓

export const rowLexusES = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/lexus-es350-fsport.jpg',
  dealerName: 'Apple Chevrolet',
  auctionId: '730214',
  offerType: 'make-offer',
  vehicleTitle: '2022 Lexus ES 350 F Sport',
  mileage: '14,120 miles',
  vin: '730214',
  timeRemaining: '6h 10m',
  acvEstimate: '$32,000',
  sentAmount: '$33,500',
  receivedAmount: '$9,500',
  statusNew: true,
  statusReceived: false,
  statusSent: false,
  statusDeclined: false,
  updateDate: 'Today'
}

export const rowHyundaiKona = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/hyundai-kona.jpg',
  dealerName: 'Classic Honda',
  auctionId: '118845',
  offerType: 'in-negotiation',
  vehicleTitle: '2022 Hyundai Kona',
  mileage: '9,870 miles',
  vin: '118845',
  timeRemaining: '3h 55m',
  acvEstimate: '$19,500',
  sentAmount: '--',
  receivedAmount: '$2,000',
  statusNew: true,
  statusReceived: true,
  statusSent: false,
  statusDeclined: false,
  updateDate: 'Today'
}

export const rowJeepWrangler = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/jeep-wrangler-unlimited.jpg',
  dealerName: 'DriveTime A',
  auctionId: '902377',
  offerType: 'make-offer',
  vehicleTitle: '2021 Jeep Wrangler Unlimited',
  mileage: '41,300 miles',
  vin: '902377',
  timeRemaining: '1d 4h',
  acvEstimate: '$28,000',
  sentAmount: '$29,000',
  receivedAmount: '--',
  statusNew: false,
  statusReceived: true,
  statusSent: false,
  statusDeclined: false,
  updateDate: 'Today'
}

// offerType 用了 'none',演示徽标不显示的情况(组件本身支持,只是之前的
// 已核实行里都刚好用到了 in-negotiation/make-offer,没机会展示这个状态)
export const rowFiat500 = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/fiat-500-sport.jpg',
  dealerName: 'DriveTime Mall',
  auctionId: '264190',
  offerType: 'none',
  vehicleTitle: '2015 Fiat 500 Sport',
  mileage: '76,540 miles',
  vin: '264190',
  timeRemaining: '12h 30m',
  acvEstimate: '$6,200',
  sentAmount: '--',
  receivedAmount: '--',
  statusNew: false,
  statusReceived: false,
  // 2026-08 按你的要求新增:这行单独演示 Declined 状态(deal 被拒绝),
  // 是唯一一行 statusDeclined:true 的 mock,纯粹为了让这个状态至少
  // 出现一次,不对应任何真实业务记录
  statusSent: false,
  statusDeclined: true,
  updateDate: 'Today'
}

export const rowToyotaMatrix = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/toyota-matrix.jpg',
  dealerName: 'DriveTime Denver',
  auctionId: '348852',
  offerType: 'in-negotiation',
  vehicleTitle: '2010 Toyota Matrix',
  mileage: '121,760 miles',
  vin: '348852',
  // 2026-08 按你说明的业务规则更正:In Negotiation = 拍卖阶段的最高出价人,
  // 上限 6 小时,原来编的 "2d 2h" 不可能出现在这个状态下,改成 6h 以内的值
  timeRemaining: '4h 50m',
  acvEstimate: '$4,800',
  sentAmount: '$5,100',
  receivedAmount: '$1,200',
  statusNew: true,
  statusReceived: false,
  statusSent: false,
  statusDeclined: false,
  updateDate: 'Today'
}

export const rowFordEscapeTitanium = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/ford-escape-titanium-red.jpg',
  dealerName: 'Baxter Auto Mall',
  auctionId: '615729',
  offerType: 'make-offer',
  vehicleTitle: '2014 Ford Escape Titanium',
  mileage: '88,410 miles',
  vin: '615729',
  timeRemaining: '9h 15m',
  acvEstimate: '$11,000',
  sentAmount: '--',
  receivedAmount: '$3,400',
  statusNew: false,
  statusReceived: true,
  statusSent: false,
  statusDeclined: false,
  updateDate: 'Today'
}

export const rowChevyMalibu = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/chevrolet-malibu-rs.jpg',
  dealerName: 'CarMax Boston',
  auctionId: '471306',
  offerType: 'in-negotiation',
  vehicleTitle: '2020 Chevrolet Malibu RS',
  mileage: '45,980 miles',
  vin: '471306',
  timeRemaining: '5h 40m',
  acvEstimate: '$16,300',
  sentAmount: '$17,000',
  receivedAmount: '$5,000',
  statusNew: true,
  statusReceived: true,
  // 2026-08 按你的要求新增:这行单独演示 New/Received/Sent 三个状态
  // 同时出现(你说明"New 可以和其他三个状态同时出现"这条逻辑),纯粹
  // 为了让 Sent 状态至少出现一次,不对应任何真实业务记录
  statusSent: true,
  statusDeclined: false,
  updateDate: 'Today'
}

export const rowDodgeCharger = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/dodge-charger-sxt.jpg',
  dealerName: 'Asbury Automotive Group',
  auctionId: '837465',
  offerType: 'make-offer',
  vehicleTitle: '2016 Dodge Charger SXT',
  mileage: '96,200 miles',
  vin: '837465',
  timeRemaining: '18h 5m',
  acvEstimate: '$12,500',
  sentAmount: '--',
  receivedAmount: '$2,900',
  statusNew: false,
  statusReceived: false,
  statusSent: false,
  statusDeclined: false,
  updateDate: 'Today'
}

export const rowFordEscapeSE = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/ford-escape-se-blue.jpg',
  dealerName: 'Classic Honda',
  auctionId: '259017',
  offerType: 'in-negotiation',
  vehicleTitle: '2014 Ford Escape SE',
  mileage: '103,650 miles',
  vin: '259017',
  // 2026-08 按你说明的业务规则更正:In Negotiation 上限 6 小时,原来编的
  // "14h 20m" 不可能出现在这个状态下,改成 6h 以内的值
  timeRemaining: '2h 15m',
  acvEstimate: '$8,700',
  sentAmount: '$9,000',
  receivedAmount: '--',
  statusNew: true,
  statusReceived: false,
  statusSent: false,
  statusDeclined: false,
  updateDate: 'Today'
}

// 单经销商账号示例:对应 Figma 帧 6837:16538 里的行(6837:16674),和
// rowWithNewAndReceived 是同一辆车(264578 / Ford Focus RS / 同一张照片),
// 只是 isMultiDealer=false 时不显示 dealerName,第二列主标题直接显示 264578
// (已核实的真实行数据,不算前面说的"12 行 mockup"里的一员,单独用于
// isMultiDealer=false 的演示)
export const rowSingleDealer = {
  isMultiDealer: false,
  photoUrl: '/assets/vehicle-photos/2018-ford-focus-rs.jpg',
  dealerName: 'CarMax Boston',
  auctionId: '264578',
  offerType: 'in-negotiation',
  vehicleTitle: '2018 Ford Focus RS',
  mileage: '32,450 miles',
  vin: '884523',
  timeRemaining: '20h 45m',
  acvEstimate: '$25,000',
  sentAmount: '$26,000',
  receivedAmount: '$7,000',
  statusNew: true,
  statusReceived: true,
  statusSent: false,
  statusDeclined: false,
  updateDate: 'Today'
}

export default {
  rowWithNewAndReceived,
  rowWithMakeOffer,
  rowWithNoStatusChip,
  rowLexusES,
  rowHyundaiKona,
  rowJeepWrangler,
  rowFiat500,
  rowToyotaMatrix,
  rowFordEscapeTitanium,
  rowChevyMalibu,
  rowDodgeCharger,
  rowFordEscapeSE,
  rowSingleDealer
}
