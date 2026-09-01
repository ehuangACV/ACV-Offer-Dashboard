/*
  === 已核实数据(来自真实 Figma 实例,见 OfferTableRow.vue 顶部 METADATA
  的 source_of_truth)===
  下面 2 个 —— rowWithNewAndReceived / rowWithNoStatusChip —— 的
  dealerName/auctionId/offerType/StatusChip 都是对照真实 Figma 行实例核实
  过的,不是瞎编的占位数据。金额本身(sentAmount/receivedAmount/reserve
  等)在 2026-09-01 那次整批重新生成里被你明确要求"discard 掉,按数字规则
  重新生成"(见下面最后一段),不再是当初核实 Figma 截图时抄下来的原始
  数字——这是你在那次改动里明确认可的取舍,不是不小心覆盖了已核实数据。

  2026-08 第一批真实照片:你给了两张真实车辆照片(黑色 Ford Focus RS、
  2022 BMW X5),放在 assets/vehicle-photos/ 下。原来配 2022 BMW X5 照片
  的那一行(rowWithMakeOffer,买家 + Make Offer + Received)已经在
  2026-09-01 那次改动里删掉,见下面说明。

  === 2026-08 第二批:10 张新真实照片 + 扩充成 12 行 mockup 数据 ===
  你又给了 10 张新的真实车辆照片,要求"把 Dashboard 扩充成更大的列表"。
  除了上面已核实的行以外,新增的行(rowLexusES 开始往后)全部是【自编的
  mockup 数据】——车辆照片是真的,vehicleTitle 是根据照片外观推断的车型,
  dealerName 是从 DealershipFilterDropdown 已核实的经销商名单里挑的,
  auctionId/mileage/vin/金额/StatusChip/倒计时 全部是编的、内部自洽的
  演示数据,不对应任何 Figma 节点或真实业务记录。

  === 2026-09-01:按 "Offer States Logic for CC.md" 的 Number rules 整批
  重新生成金额,并删掉两行不存在的状态组合 ===
  背景:你截图指出 Information Dialog 里 "Highest Bid $26,000 / Seller
  Counter $7,000 / Reserve Price $27,000"、"Between $26,000 and $7,000"、
  split "$16,500" 这几个数字互相矛盾(卖家开价比买家已出的价还低,理论上
  这笔单子早就该直接成交)。逐行核对后发现不止这一处,而是这批数据从头
  就没有按"reserve > 卖家最新 > 买家最新"这条顺序、以及"6h/24h 倒计时
  上限"生成。你给了完整的生成流程 + 两轮修正(锚点只在存在时才生效、
  区间是严格区间不是闭区间)之后,这次是按这套规则从头整批重新生成的,
  不是逐个数字打补丁——补丁式修法正是"Between $26,000 and $7,000"这个
  bug的成因(改了一个数字,gap/split/区间这些派生值就跟着错)。

  规则摘要(逐行核对用,细节见 "Offer States Logic for CC.md" 的
  Number rules 一节):
  - reserve 先定,买家开盘价必须严格 < reserve(否则这笔单子在拍卖阶段就
    直接成交了,不会进入 negotiation)。
  - 卖家的 counter 必须严格落在"买家最新数字"和 reserve 之间;后续每一方
    新的 counter,必须严格比自己上一次更接近对方(不能反向、不能等于对方
    的数字——等于对方数字就是 Accept 本身,不是 counter)。
  - 买家出价(不管是开盘价还是 make-offer 的出价)相对 reserve 的比例
    收紧到 85%–97% 这个区间——价差太大在现实里根本到不了 negotiation
    环节,也会让 gap/split 这些数字失去意义。
  - In Negotiation 的 Time Remaining 必须 < 6h,Make Offer 必须 < 24h,
    没有例外。
  - In Negotiation 的起点是买家在拍卖里的真实 high bid,这个数字一定
    存在——不能用 '--' 占位再拿 acvEstimate 兜底去凑 gap/split(这本身
    就自相矛盾:既然是 In Negotiation,说明已经过了拍卖阶段,买家的号必然
    是真实存在的)。这次给 rowWithNoStatusChip / rowHyundaiKona /
    rowFordEscapeSE 三行补上了真实的 sentAmount/receivedAmount,不再依赖
    兜底逻辑推算这三行的协商数字(卡片上其它没有真实值的字段,比如某些
    Make Offer 行的 acvEstimate 兜底,不受这条规则约束,原样保留)。

  删掉的两行:
  - `rowWithMakeOffer`(买家 + Make Offer + Received):这个状态组合本身
    不存在——Make Offer 上卖家只能 accept/decline,不会 countered,买家
    没有"对方刚给了我一个数字"这件事可以 Received。之前只是在注释里
    标注了这个矛盾没有动数据,这次直接删掉这一行,不再保留一个标注了
    "不存在"却还渲染在界面上的例子。
  - `rowFiat500`(offerType: 'none'):你指出每笔 deal 必须是 In
    Negotiation 或 Make Offer 之一,没有第三种合法类型,'none' 这个值
    本身就不该存在(在严格区间规则下,这一行两个金额字段都靠 acvEstimate
    兜底、变成同一个数字,也不再是"合法"的了)。选择直接删除这一行,而不
    是给它硬指定一个类型再编数字——它当初存在的唯一目的就是演示"没有
    OfferTypeBadge 徽标"这个 UI 状态,指定成某个真实类型之后这个演示
    目的本身也没有了,删除比保留一个被强行赋予新身份的例子更干净。

  行数因此从 12 变成 10(Buying 5 / Selling 5),`OfferDashboard.vue` 的
  `rows` 数组和 buying/selling 的 slice 切分已经同步改过,细节见该文件
  自己的 notes.md。
*/

// 第一行:CarMax Boston,New + Received 两个 StatusChip 叠加 —— 对应你给的
// 黑色 Ford Focus RS 照片(dealerName/auctionId/offerType/StatusChip 已
// 核实的真实行数据;金额见文件头 2026-09-01 说明,按 Number rules 重新
// 生成)
export const rowWithNewAndReceived = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/2018-ford-focus-rs.jpg',
  dealerName: 'CarMax Boston',
  auctionId: '264578',
  offerType: 'in-negotiation',
  vehicleTitle: '2018 Ford Focus RS',
  mileage: '32,450 miles',
  vin: '884523',
  timeRemaining: '3h 15m',
  acvEstimate: '$25,000',
  sentAmount: '$26,000',
  receivedAmount: '$26,800',
  statusNew: true,
  statusReceived: true,
  statusSent: false,
  statusDeclined: false,
  updateDate: 'Today',
  // reserve $27,000 > 卖家 $26,800 > 买家 $26,000,严格区间。买家开盘价
  // 是 reserve 的 96.3%,落在 85%–97% 区间内。gap $800 / split $26,400。
  reservePrice: '$27,000',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'bid', amount: '$26,000', timestamp: 'Yesterday, 03:00 PM' },
    { speaker: 'seller', kind: 'counter', amount: '$26,800', timestamp: 'Today, 09:00 AM' }
  ]
}

// 第二行:Asbury Automotive Group,In Negotiation 徽标,Update 列没有任何
// StatusChip,只有日期(dealerName/auctionId/offerType/StatusChip 已核实
// 的真实行数据)。照片用了第二批里的 Lexus RX300。
export const rowWithNoStatusChip = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/lexus-rx300.jpg',
  dealerName: 'Asbury Automotive Group',
  auctionId: '876413',
  offerType: 'in-negotiation',
  vehicleTitle: '2001 Lexus RX300',
  mileage: '168,900 miles',
  vin: '552091',
  timeRemaining: '3h 40m',
  acvEstimate: '$4,700',
  // 2026-09-01:之前这里是 '--'(靠 acvEstimate 兜底当买家数字),但 In
  // Negotiation 的起点必然有一个真实的买家 high bid,不该用兜底值凑——
  // 补上真实数字。
  // 2026-09-01 第二次调整(你要求个别例子的数字比之前更低一点,离
  // reserve 更远):买家从 $5,000 降到 $4,500,卖家从 $5,300 降到
  // $5,000,reserve 不变——你给的原话例子就是这一行(reserve $5,500,
  // Highest Bid $4,500,Seller Counter $5,000)。
  sentAmount: '$4,500',
  receivedAmount: '$5,000',
  statusNew: false,
  statusReceived: false,
  statusSent: false,
  statusDeclined: false,
  updateDate: 'Today',
  // reserve $5,500 > 卖家 $5,000 > 买家 $4,500,严格区间。买家开盘价是
  // reserve 的 81.8%。gap $500 / split $4,750。
  reservePrice: '$5,500',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'bid', amount: '$4,500', timestamp: 'Yesterday, 10:00 AM' },
    { speaker: 'seller', kind: 'counter', amount: '$5,000', timestamp: 'Today, 08:00 AM' }
  ]
}

// ↓↓↓ 下面全部是自编的 mockup 演示数据,不是 Figma 核实数据 ↓↓↓

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
  // 2026-09-01:买家出价相对 reserve 的比例之前是 98.5%(超过 97% 上限),
  // 收紧到 $32,500(95.6%)。
  sentAmount: '$32,500',
  receivedAmount: '$9,500',
  statusNew: true,
  statusReceived: false,
  statusSent: false,
  statusDeclined: true,
  updateDate: 'Today',
  reservePrice: '$34,000',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'offer', amount: '$32,500', timestamp: 'Mon, Aug 24, 11:00 AM' },
    { speaker: 'seller', kind: 'declined', timestamp: 'Mon, Aug 24, 04:00 PM' }
  ]
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
  acvEstimate: '$19,600',
  // 2026-09-01:之前是 '--'(靠 acvEstimate 兜底),补上真实买家数字,
  // 同时把比例收紧到 96%(reserve 的 85%–97% 区间内)。
  sentAmount: '$19,200',
  receivedAmount: '$19,800',
  statusNew: true,
  statusReceived: true,
  statusSent: false,
  statusDeclined: false,
  updateDate: 'Today',
  // reserve $20,000 > 卖家 $19,800 > 买家 $19,200,严格区间。gap $600 /
  // split $19,500。
  reservePrice: '$20,000',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'bid', amount: '$19,200', timestamp: 'Yesterday, 09:00 AM' },
    { speaker: 'seller', kind: 'counter', amount: '$19,800', timestamp: 'Today, 07:00 AM' }
  ]
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
  // 2026-09-01:之前是 '1d 4h'(=28h),超过 Make Offer 24h 上限,改成
  // 24h 以内的值。
  timeRemaining: '19h 30m',
  acvEstimate: '$28,000',
  // 2026-09-01:买家出价相对 reserve 的比例之前是 98.3%(超过 97% 上限),
  // 收紧到 $28,300(95.9%)。
  sentAmount: '$28,300',
  receivedAmount: '--',
  statusNew: false,
  statusReceived: false,
  statusSent: true,
  statusDeclined: false,
  updateDate: 'Today',
  reservePrice: '$29,500',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'offer', amount: '$28,300', timestamp: 'Today, 11:00 AM' }
  ]
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
  timeRemaining: '4h 50m',
  acvEstimate: '$4,800',
  // 2026-09-01:这一行是 Selling tab(卖家视角),sentAmount 是卖家自己的
  // counter,receivedAmount 是卖家收到的买家出价。之前 sentAmount
  // ($5,100) 和 receivedAmount($1,200)方向反了(卖家的号比买家的号高
  // 太多、且看不出协商链路)。改成一条完整的三步链路:买家开价 $4,800→
  // 卖家还价 $5,200→买家还价 $5,000,轮到卖家(dealState 默认 'received'
  // 和这条链路对得上)。reserve $5,400 > 卖家最新 $5,200 > 买家最新
  // $5,000,严格区间,gap $200 / split $5,100。
  sentAmount: '$5,200',
  receivedAmount: '$5,000',
  statusNew: true,
  statusReceived: false,
  statusSent: false,
  statusDeclined: false,
  updateDate: 'Today',
  reservePrice: '$5,400',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'bid', amount: '$4,800', timestamp: 'Yesterday, 08:00 AM' },
    { speaker: 'seller', kind: 'counter', amount: '$5,200', timestamp: 'Today, 06:30 AM' },
    { speaker: 'buyer', kind: 'counter', amount: '$5,000', timestamp: 'Today, 07:00 AM' }
  ]
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
  // reservePrice 和 acvEstimate 保持同一个数字(卡片 line2 "Your reserve"
  // 显示的就是这个,ownAmount 在 sentAmount='--' 时也会兜底成 acvEstimate)。
  acvEstimate: '$11,000',
  sentAmount: '--',
  // 2026-09-01:买家出价相对 reserve 的比例之前只有 31%(现实里根本到不了
  // negotiation 环节),收紧到 $10,200(92.7%)。
  receivedAmount: '$10,200',
  statusNew: false,
  statusReceived: true,
  statusSent: false,
  statusDeclined: false,
  updateDate: 'Today',
  reservePrice: '$11,000',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'offer', amount: '$10,200', timestamp: 'Today, 06:00 AM' }
  ]
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
  acvEstimate: '$15,200',
  // 2026-09-01:买家出价之前是 $5,000,对卖家 $17,000 来说价差太大、到不了
  // negotiation 环节。reserve 从 $17,500 提到 $18,000,买家出价收紧到
  // $16,000(88.9%,reserve 85%–97% 区间内)。
  // 2026-09-01 第二次调整(你要求个别例子的数字比之前更低一点):买家/
  // 卖家整体再往下移一档——卖家从 $17,000 降到 $15,500,买家从 $16,000
  // 降到 $14,500,reserve 不变,gap 还是 $1,000 但整体离 reserve 更远。
  sentAmount: '$15,500',
  receivedAmount: '$14,500',
  statusNew: true,
  statusReceived: true,
  statusSent: true,
  statusDeclined: false,
  updateDate: 'Today',
  // reserve $18,000 > 卖家 $15,500 > 买家 $14,500,严格区间。买家开盘价
  // 是 reserve 的 80.6%。gap $1,000 / split $15,000。
  reservePrice: '$18,000',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'bid', amount: '$14,500', timestamp: 'Yesterday, 02:00 PM' },
    { speaker: 'seller', kind: 'counter', amount: '$15,500', timestamp: 'Today, 08:00 AM' }
  ]
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
  // 2026-09-01:买家出价相对 reserve 的比例之前只有 23%,收紧到 $11,400
  // (91.2%)。
  receivedAmount: '$11,400',
  statusNew: false,
  statusReceived: false,
  statusSent: false,
  statusDeclined: false,
  updateDate: 'Today',
  reservePrice: '$12,500',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'offer', amount: '$11,400', timestamp: 'Today, 05:00 AM' }
  ]
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
  timeRemaining: '2h 15m',
  acvEstimate: '$8,300',
  // 2026-09-01:之前是 '--'——In Negotiation 的起点必然有一个真实的买家
  // high bid,补上真实数字。
  // 2026-09-01 第二次调整(你要求个别例子的数字比之前更低一点):卖家从
  // $9,000 降到 $8,700,买家从 $8,700 降到 $8,000,reserve 不变,整体
  // 离 reserve 更远。
  sentAmount: '$8,700',
  receivedAmount: '$8,000',
  statusNew: true,
  statusReceived: false,
  statusSent: true,
  statusDeclined: false,
  updateDate: 'Today',
  // reserve $9,500 > 卖家(自己)$8,700 > 买家 $8,000,严格区间。买家
  // 开盘价是 reserve 的 84.2%。gap $700 / split $8,350。
  reservePrice: '$9,500',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'bid', amount: '$8,000', timestamp: 'Yesterday, 03:00 PM' },
    { speaker: 'seller', kind: 'counter', amount: '$8,700', timestamp: 'Today, 08:00 AM' }
  ]
}

// 单经销商账号示例:对应 Figma 帧 6837:16538 里的行(6837:16674),和
// rowWithNewAndReceived 是同一辆车(264578 / Ford Focus RS / 同一张照片),
// 只是 isMultiDealer=false 时不显示 dealerName,第二列主标题直接显示 264578
// (已核实的真实行数据,不算前面说的 mockup 行,单独用于 isMultiDealer=false
// 的演示)。金额/倒计时同步成 rowWithNewAndReceived 2026-09-01 重新生成后
// 的数字——同一笔单子,两处不该显示不一样的钱。
export const rowSingleDealer = {
  isMultiDealer: false,
  photoUrl: '/assets/vehicle-photos/2018-ford-focus-rs.jpg',
  dealerName: 'CarMax Boston',
  auctionId: '264578',
  offerType: 'in-negotiation',
  vehicleTitle: '2018 Ford Focus RS',
  mileage: '32,450 miles',
  vin: '884523',
  timeRemaining: '3h 15m',
  acvEstimate: '$25,000',
  sentAmount: '$26,000',
  receivedAmount: '$26,800',
  statusNew: true,
  statusReceived: true,
  statusSent: false,
  statusDeclined: false,
  updateDate: 'Today'
}

export default {
  rowWithNewAndReceived,
  rowWithNoStatusChip,
  rowLexusES,
  rowHyundaiKona,
  rowJeepWrangler,
  rowToyotaMatrix,
  rowFordEscapeTitanium,
  rowChevyMalibu,
  rowDodgeCharger,
  rowFordEscapeSE,
  rowSingleDealer
}
