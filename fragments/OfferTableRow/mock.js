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

  === 2026-09-03:Buying/Selling 各从 5 行扩到 15 行,新增20行状态覆盖表 ===
  见下面这批新增行前面的注释块,这里只记结论:原有10行(前5 Buying/后5
  Selling)原样保留、位置不变,新增的20行(10 Buying + 10 Selling)全部
  是自编 mockup 数据,车图复用 assets/vehicle-photos/ 下已有的12张真实
  照片(每张最多复用3次),没有新增照片素材。`OfferDashboard.vue` 的
  `rows`/`buyingRows`/`sellingRows` 和 `buyingVehicleCount`/
  `sellingVehicleCount` 的默认值/上限已经同步改到 15,细节见该文件自己
  的 notes.md。
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
  // 2026-09-02 按你的要求,所有"Today"旁边都要写具体时间——用这一行
  // history 最后一条事件的时间(卖家还价 09:00 AM),不是凑的数字
  updateDate: 'Today, 09:00 AM',
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
  // 2026-09-02:同上,用 history 最后一条(卖家还价 08:00 AM)
  updateDate: 'Today, 08:00 AM',
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
  // 2026-09-02:同上,用 history 最后一条(卖家还价 07:00 AM)
  updateDate: 'Today, 07:00 AM',
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
  // 2026-09-02:同上,用 history 最后一条(买家发 offer 11:00 AM)
  updateDate: 'Today, 11:00 AM',
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
  // 2026-09-02:同上,用 history 最后一条(买家还价 07:00 AM)
  updateDate: 'Today, 07:00 AM',
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
  // 2026-09-02:同上,用 history 最后一条(买家发 offer 06:00 AM)
  updateDate: 'Today, 06:00 AM',
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
  // 2026-09-02:同上,用 history 最后一条(卖家还价 08:00 AM)
  updateDate: 'Today, 08:00 AM',
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
  // 2026-09-02:同上,用 history 最后一条(买家发 offer 05:00 AM)
  updateDate: 'Today, 05:00 AM',
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
  // 2026-09-02:同上,用 history 最后一条(卖家还价 08:00 AM)
  updateDate: 'Today, 08:00 AM',
  // reserve $9,500 > 卖家(自己)$8,700 > 买家 $8,000,严格区间。买家
  // 开盘价是 reserve 的 84.2%。gap $700 / split $8,350。
  reservePrice: '$9,500',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'bid', amount: '$8,000', timestamp: 'Yesterday, 03:00 PM' },
    { speaker: 'seller', kind: 'counter', amount: '$8,700', timestamp: 'Today, 08:00 AM' }
  ]
}

// ── 2026-09-03 扩充:Buying/Selling 各从 5 行扩到 15 行 ──────────────
// 你要求把 "Vehicles shown on Buying/Selling" 两个控件各增加到15个,并且
// 要求这批新数据要把所有合法状态都用上,不要只堆同一种状态。问你要不要
// 补新车图后,你选了"复用现有12张真实照片(推荐)"——assets/vehicle-
// photos/ 下只有12张真实图,10张已经在原来的10行里用过,这次30行里
// 每张照片最多复用3次(换年份/里程/VIN/dealer,当作"同款车的另一台"),
// 12张照片在30行里全部至少用过一次,没有哪张完全没用上。
//
// 下面20行(buying新增10行 + selling新增10行)全部是自编的 mockup 数据,
// 和"第二批照片"那批一样不对应任何 Figma 节点或真实业务记录,但严格照
// 文件头 Number rules 生成(reserve先定→买家开盘价严格85%–97% of
// reserve→卖家counter严格落在买家和reserve之间→后续每次counter必须
// 严格更接近对方,In Negotiation<6h/Make Offer<24h)。
//
// 状态覆盖表(dealState 只有 received/sent/declined 三种,表格没有
// expired 这个概念——只在 OfferCard 演示过,细节见该组件 notes.md):
// Buying(买家视角)15行 = 原有5行(received×2 + make-offer sent×1 +
//   make-offer declined×1)+ 新增10行,补齐 in-negotiation sent/declined
//   各2个(New/无New各一)、make-offer sent/declined各补1个,剩下几行是
//   已有组合的额外数量(不同车辆/金额,增加体量,不是重复同一行)。
// Selling(卖家视角)15行 = 原有5行(in-negotiation received×1 +
//   make-offer received×2 + in-negotiation sent×2)+ 新增10行,补齐
//   in-negotiation declined、make-offer received/declined 各New/无New
//   都有例子——之前 Selling 侧一行 declined 都没有(FilterChipGroup 的
//   Declined chip 本来就按你更早的要求在 Selling tab 隐藏,但那是"不给
//   筛选入口",不代表数据里不该存在 declined 的卖家行,Update 列一样要
//   能显示 Declined 这个真实会发生的结局)。买家永远不会在 Make Offer
//   上出现 received(卖家在 Make Offer 上不会 counter),卖家永远不会在
//   Make Offer 上出现 sent——同一条规则,这次新增的10个 Selling 行也
//   没有违反。

export const rowToyotaMatrixSent = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/toyota-matrix.jpg',
  dealerName: 'DriveTime Mall',
  auctionId: '481205',
  offerType: 'in-negotiation',
  vehicleTitle: '2011 Toyota Matrix',
  mileage: '132,400 miles',
  vin: '481205',
  // 2026-09-08 按你的要求改成 <1小时(纯分钟、不带"h"),这一行是自编
  // mockup 数据,不是核实过的真实数据,细节见 OfferDashboard/notes.md
  // 同名条目——OfferTableRow.vue 的 timeLeftUrgent 是从这个字符串自动
  // 判断的(没有"h"/"d"、只有"m" 就算 urgent,变红色),不需要额外传
  // 别的字段。
  timeRemaining: '35m',
  acvEstimate: '$6,000',
  sentAmount: '$5,700',
  receivedAmount: '$5,900',
  statusNew: true,
  statusReceived: false,
  statusSent: true,
  statusDeclined: false,
  updateDate: 'Today, 09:20 AM',
  reservePrice: '$6,200',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'bid', amount: '$5,500', timestamp: 'Yesterday, 02:00 PM' },
    { speaker: 'seller', kind: 'counter', amount: '$5,900', timestamp: 'Today, 08:10 AM' },
    { speaker: 'buyer', kind: 'counter', amount: '$5,700', timestamp: 'Today, 09:20 AM' }
  ]
}

export const rowMalibuSent = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/chevrolet-malibu-rs.jpg',
  dealerName: 'Apple Chevrolet',
  auctionId: '552071',
  offerType: 'in-negotiation',
  vehicleTitle: '2019 Chevrolet Malibu RS',
  mileage: '52,300 miles',
  vin: '552071',
  timeRemaining: '4h 45m',
  acvEstimate: '$15,400',
  sentAmount: '$14,600',
  receivedAmount: '$15,200',
  statusNew: false,
  statusReceived: false,
  statusSent: true,
  statusDeclined: false,
  updateDate: 'Today, 07:50 AM',
  reservePrice: '$16,000',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'bid', amount: '$14,000', timestamp: 'Yesterday, 11:00 AM' },
    { speaker: 'seller', kind: 'counter', amount: '$15,200', timestamp: 'Today, 06:40 AM' },
    { speaker: 'buyer', kind: 'counter', amount: '$14,600', timestamp: 'Today, 07:50 AM' }
  ]
}

export const rowEscapeTitaniumDeclined = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/ford-escape-titanium-red.jpg',
  dealerName: 'Baxter Auto Mall',
  auctionId: '693214',
  offerType: 'in-negotiation',
  vehicleTitle: '2015 Ford Escape Titanium',
  mileage: '95,600 miles',
  vin: '693214',
  timeRemaining: '4h 00m',
  acvEstimate: '$10,100',
  sentAmount: '$9,200',
  receivedAmount: '--',
  statusNew: true,
  statusReceived: false,
  statusSent: false,
  statusDeclined: true,
  updateDate: 'Mon, Aug 24, 02:15 PM',
  reservePrice: '$10,500',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'bid', amount: '$9,200', timestamp: 'Mon, Aug 24, 09:30 AM' },
    { speaker: 'seller', kind: 'declined', timestamp: 'Mon, Aug 24, 02:15 PM' }
  ]
}

export const rowEscapeSEDeclined = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/ford-escape-se-blue.jpg',
  dealerName: 'Classic Honda',
  auctionId: '271556',
  offerType: 'in-negotiation',
  vehicleTitle: '2013 Ford Escape SE',
  mileage: '118,900 miles',
  vin: '271556',
  timeRemaining: '2h 50m',
  acvEstimate: '$8,300',
  sentAmount: '$7,600',
  receivedAmount: '--',
  statusNew: false,
  statusReceived: false,
  statusSent: false,
  statusDeclined: true,
  updateDate: 'Tue, Aug 25, 10:05 AM',
  reservePrice: '$8,600',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'bid', amount: '$7,600', timestamp: 'Tue, Aug 25, 08:00 AM' },
    { speaker: 'seller', kind: 'declined', timestamp: 'Tue, Aug 25, 10:05 AM' }
  ]
}

export const rowChargerSentBuyer = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/dodge-charger-sxt.jpg',
  dealerName: 'Asbury Automotive Group',
  auctionId: '384720',
  offerType: 'make-offer',
  vehicleTitle: '2017 Dodge Charger SXT',
  mileage: '80,150 miles',
  vin: '384720',
  timeRemaining: '12h 30m',
  acvEstimate: '$14,000',
  sentAmount: '$13,300',
  receivedAmount: '--',
  statusNew: true,
  statusReceived: false,
  statusSent: true,
  statusDeclined: false,
  updateDate: 'Today, 08:15 AM',
  reservePrice: '$14,500',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'offer', amount: '$13,300', timestamp: 'Today, 08:15 AM' }
  ]
}

export const rowBmwX5DeclinedBuyer = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/2022-bmw-x5.jpg',
  dealerName: 'Asbury Automotive Group',
  auctionId: '905612',
  offerType: 'make-offer',
  vehicleTitle: '2021 BMW X5',
  mileage: '22,700 miles',
  vin: '905612',
  timeRemaining: '16h 00m',
  acvEstimate: '$28,200',
  sentAmount: '$26,800',
  receivedAmount: '--',
  statusNew: false,
  statusReceived: false,
  statusSent: false,
  statusDeclined: true,
  updateDate: 'Sun, Aug 23, 06:40 PM',
  reservePrice: '$29,000',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'offer', amount: '$26,800', timestamp: 'Sun, Aug 23, 01:10 PM' },
    { speaker: 'seller', kind: 'declined', timestamp: 'Sun, Aug 23, 06:40 PM' }
  ]
}

export const rowKonaReceived2 = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/hyundai-kona.jpg',
  dealerName: 'DriveTime A',
  auctionId: '760348',
  offerType: 'in-negotiation',
  vehicleTitle: '2020 Hyundai Kona',
  mileage: '61,200 miles',
  vin: '760348',
  // 2026-09-08 按你的要求改成 <1小时,细节见同一处 rowToyotaMatrixSent
  // 的注释,原因一样。
  timeRemaining: '20m',
  acvEstimate: '$16,500',
  sentAmount: '$15,000',
  receivedAmount: '$16,200',
  statusNew: false,
  statusReceived: true,
  statusSent: false,
  statusDeclined: false,
  updateDate: 'Today, 06:05 AM',
  reservePrice: '$17,000',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'bid', amount: '$15,000', timestamp: 'Yesterday, 07:30 AM' },
    { speaker: 'seller', kind: 'counter', amount: '$16,200', timestamp: 'Today, 06:05 AM' }
  ]
}

export const rowRx300Sent = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/lexus-rx300.jpg',
  dealerName: 'Baxter Auto Mall',
  auctionId: '812934',
  offerType: 'in-negotiation',
  vehicleTitle: '2005 Lexus RX300',
  mileage: '145,700 miles',
  vin: '812934',
  timeRemaining: '1h 55m',
  acvEstimate: '$7,100',
  sentAmount: '$6,700',
  receivedAmount: '$7,000',
  statusNew: false,
  statusReceived: false,
  statusSent: true,
  statusDeclined: false,
  updateDate: 'Today, 10:40 AM',
  reservePrice: '$7,400',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'bid', amount: '$6,500', timestamp: 'Yesterday, 09:00 AM' },
    { speaker: 'seller', kind: 'counter', amount: '$7,000', timestamp: 'Today, 09:20 AM' },
    { speaker: 'buyer', kind: 'counter', amount: '$6,700', timestamp: 'Today, 10:40 AM' }
  ]
}

export const rowFiat500SentBuyer = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/fiat-500-sport.jpg',
  dealerName: 'DriveTime Mall',
  auctionId: '223019',
  offerType: 'make-offer',
  vehicleTitle: '2019 Fiat 500 Sport',
  mileage: '38,450 miles',
  vin: '223019',
  timeRemaining: '20h 10m',
  acvEstimate: '$9,500',
  sentAmount: '$8,900',
  receivedAmount: '--',
  statusNew: false,
  statusReceived: false,
  statusSent: true,
  statusDeclined: false,
  updateDate: 'Today, 05:30 AM',
  reservePrice: '$9,800',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'offer', amount: '$8,900', timestamp: 'Today, 05:30 AM' }
  ]
}

export const rowMalibuReceived2 = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/chevrolet-malibu-rs.jpg',
  dealerName: 'CarMax Boston',
  auctionId: '447982',
  offerType: 'in-negotiation',
  vehicleTitle: '2021 Chevrolet Malibu RS',
  mileage: '29,800 miles',
  vin: '447982',
  timeRemaining: '4h 25m',
  acvEstimate: '$18,900',
  sentAmount: '$17,200',
  receivedAmount: '$18,600',
  statusNew: true,
  statusReceived: true,
  statusSent: false,
  statusDeclined: false,
  updateDate: 'Today, 07:15 AM',
  reservePrice: '$19,500',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'bid', amount: '$17,200', timestamp: 'Yesterday, 01:00 PM' },
    { speaker: 'seller', kind: 'counter', amount: '$18,600', timestamp: 'Today, 07:15 AM' }
  ]
}

// ── Selling(卖家视角)新增10行 ──────────────────────────────────
// 卖家视角下 sentAmount 是卖家自己发出的那个数字(自己的 counter),
// receivedAmount 是卖家收到的买家的数字——和 rowToyotaMatrix/
// rowChevyMalibu 等原有5行的字段方向一致,不是重新发明的规则。

export const rowFocusRsReceivedSeller = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/2018-ford-focus-rs.jpg',
  dealerName: 'CarMax Boston',
  auctionId: '518734',
  offerType: 'in-negotiation',
  vehicleTitle: '2017 Ford Focus RS',
  mileage: '41,300 miles',
  vin: '518734',
  // 2026-09-08 按你的要求改成 <1小时,细节见 rowToyotaMatrixSent 同一处
  // 注释,原因一样。
  timeRemaining: '50m',
  acvEstimate: '$20,200',
  sentAmount: '$19,800',
  receivedAmount: '$19,000',
  statusNew: true,
  statusReceived: true,
  statusSent: false,
  statusDeclined: false,
  updateDate: 'Today, 08:00 AM',
  reservePrice: '$21,000',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'bid', amount: '$18,300', timestamp: 'Yesterday, 09:00 AM' },
    { speaker: 'seller', kind: 'counter', amount: '$19,800', timestamp: 'Yesterday, 05:00 PM' },
    { speaker: 'buyer', kind: 'counter', amount: '$19,000', timestamp: 'Today, 08:00 AM' }
  ]
}

export const rowRx300SentSeller = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/lexus-rx300.jpg',
  dealerName: 'Asbury Automotive Group',
  auctionId: '629480',
  offerType: 'in-negotiation',
  vehicleTitle: '2003 Lexus RX300',
  mileage: '162,300 miles',
  vin: '629480',
  // 2026-09-08 按你的要求改成 <1小时,细节见 rowToyotaMatrixSent 同一处
  // 注释,原因一样。
  timeRemaining: '40m',
  acvEstimate: '$6,500',
  sentAmount: '$6,400',
  receivedAmount: '$5,900',
  statusNew: false,
  statusReceived: false,
  statusSent: true,
  statusDeclined: false,
  updateDate: 'Today, 09:05 AM',
  reservePrice: '$6,800',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'bid', amount: '$5,900', timestamp: 'Yesterday, 03:00 PM' },
    { speaker: 'seller', kind: 'counter', amount: '$6,400', timestamp: 'Today, 09:05 AM' }
  ]
}

export const rowFiat500SentSeller = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/fiat-500-sport.jpg',
  dealerName: 'Apple Chevrolet',
  auctionId: '740125',
  offerType: 'in-negotiation',
  vehicleTitle: '2020 Fiat 500 Sport',
  mileage: '19,600 miles',
  vin: '740125',
  timeRemaining: '5h 20m',
  acvEstimate: '$10,800',
  sentAmount: '$10,700',
  receivedAmount: '$9,800',
  statusNew: false,
  statusReceived: false,
  statusSent: true,
  statusDeclined: false,
  updateDate: 'Today, 06:50 AM',
  reservePrice: '$11,200',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'bid', amount: '$9,800', timestamp: 'Yesterday, 08:20 AM' },
    { speaker: 'seller', kind: 'counter', amount: '$10,700', timestamp: 'Today, 06:50 AM' }
  ]
}

export const rowKonaDeclinedSeller = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/hyundai-kona.jpg',
  dealerName: 'Classic Honda',
  auctionId: '835201',
  offerType: 'in-negotiation',
  vehicleTitle: '2019 Hyundai Kona',
  mileage: '54,900 miles',
  vin: '835201',
  timeRemaining: '2h 30m',
  acvEstimate: '$14,500',
  sentAmount: '$14,200',
  receivedAmount: '$13,500',
  statusNew: true,
  statusReceived: false,
  statusSent: false,
  statusDeclined: true,
  updateDate: 'Wed, Aug 26, 11:15 AM',
  reservePrice: '$15,000',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'bid', amount: '$13,000', timestamp: 'Wed, Aug 26, 08:00 AM' },
    { speaker: 'seller', kind: 'counter', amount: '$14,200', timestamp: 'Wed, Aug 26, 09:10 AM' },
    { speaker: 'buyer', kind: 'counter', amount: '$13,500', timestamp: 'Wed, Aug 26, 10:30 AM' },
    { speaker: 'seller', kind: 'declined', timestamp: 'Wed, Aug 26, 11:15 AM' }
  ]
}

export const rowWranglerDeclinedSeller = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/jeep-wrangler-unlimited.jpg',
  dealerName: 'DriveTime A',
  auctionId: '918460',
  offerType: 'in-negotiation',
  vehicleTitle: '2019 Jeep Wrangler Unlimited',
  mileage: '58,300 miles',
  vin: '918460',
  timeRemaining: '5h 55m',
  acvEstimate: '$23,200',
  sentAmount: '--',
  receivedAmount: '$21,000',
  statusNew: false,
  statusReceived: false,
  statusSent: false,
  statusDeclined: true,
  updateDate: 'Thu, Aug 27, 01:20 PM',
  reservePrice: '$24,000',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'bid', amount: '$21,000', timestamp: 'Thu, Aug 27, 09:00 AM' },
    { speaker: 'seller', kind: 'declined', timestamp: 'Thu, Aug 27, 01:20 PM' }
  ]
}

export const rowLexusEsReceivedSeller = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/lexus-es350-fsport.jpg',
  dealerName: 'Apple Chevrolet',
  auctionId: '602847',
  offerType: 'make-offer',
  vehicleTitle: '2020 Lexus ES 350 F Sport',
  mileage: '25,400 miles',
  vin: '602847',
  timeRemaining: '18h 40m',
  acvEstimate: '$30,200',
  sentAmount: '--',
  receivedAmount: '$28,600',
  statusNew: true,
  statusReceived: true,
  statusSent: false,
  statusDeclined: false,
  updateDate: 'Today, 07:00 AM',
  reservePrice: '$31,000',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'offer', amount: '$28,600', timestamp: 'Today, 07:00 AM' }
  ]
}

export const rowEscapeSeReceivedSeller = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/ford-escape-se-blue.jpg',
  dealerName: 'Baxter Auto Mall',
  auctionId: '374690',
  offerType: 'make-offer',
  vehicleTitle: '2016 Ford Escape SE',
  mileage: '88,700 miles',
  vin: '374690',
  timeRemaining: '22h 05m',
  acvEstimate: '$8,900',
  sentAmount: '--',
  receivedAmount: '$8,300',
  statusNew: false,
  statusReceived: true,
  statusSent: false,
  statusDeclined: false,
  updateDate: 'Today, 04:45 AM',
  reservePrice: '$9,200',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'offer', amount: '$8,300', timestamp: 'Today, 04:45 AM' }
  ]
}

export const rowBmwX5DeclinedSeller = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/2022-bmw-x5.jpg',
  dealerName: 'Asbury Automotive Group',
  auctionId: '460193',
  offerType: 'make-offer',
  vehicleTitle: '2019 BMW X5',
  mileage: '48,100 miles',
  vin: '460193',
  timeRemaining: '9h 30m',
  acvEstimate: '$24,700',
  sentAmount: '--',
  receivedAmount: '$23,400',
  statusNew: true,
  statusReceived: false,
  statusSent: false,
  statusDeclined: true,
  updateDate: 'Fri, Aug 28, 03:50 PM',
  reservePrice: '$25,500',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'offer', amount: '$23,400', timestamp: 'Fri, Aug 28, 10:00 AM' },
    { speaker: 'seller', kind: 'declined', timestamp: 'Fri, Aug 28, 03:50 PM' }
  ]
}

export const rowEscapeTitaniumDeclinedSeller = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/ford-escape-titanium-red.jpg',
  dealerName: 'Baxter Auto Mall',
  auctionId: '857031',
  offerType: 'make-offer',
  vehicleTitle: '2016 Ford Escape Titanium',
  mileage: '102,500 miles',
  vin: '857031',
  timeRemaining: '14h 15m',
  acvEstimate: '$11,600',
  sentAmount: '--',
  receivedAmount: '$11,000',
  statusNew: false,
  statusReceived: false,
  statusSent: false,
  statusDeclined: true,
  updateDate: 'Sat, Aug 29, 09:40 AM',
  reservePrice: '$12,000',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'offer', amount: '$11,000', timestamp: 'Sat, Aug 29, 04:00 AM' },
    { speaker: 'seller', kind: 'declined', timestamp: 'Sat, Aug 29, 09:40 AM' }
  ]
}

export const rowChargerSentSeller = {
  isMultiDealer: true,
  photoUrl: '/assets/vehicle-photos/dodge-charger-sxt.jpg',
  dealerName: 'Classic Honda',
  auctionId: '291847',
  offerType: 'in-negotiation',
  vehicleTitle: '2015 Dodge Charger SXT',
  mileage: '91,200 miles',
  vin: '291847',
  timeRemaining: '5h 05m',
  acvEstimate: '$12,500',
  sentAmount: '$12,400',
  receivedAmount: '$11,300',
  statusNew: true,
  statusReceived: false,
  statusSent: true,
  statusDeclined: false,
  updateDate: 'Today, 06:20 AM',
  reservePrice: '$13,000',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'bid', amount: '$11,300', timestamp: 'Yesterday, 07:40 AM' },
    { speaker: 'seller', kind: 'counter', amount: '$12,400', timestamp: 'Today, 06:20 AM' }
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
  // 2026-09-02:同上,这一行是 rowWithNewAndReceived 的同一笔单子(见上面
  // 注释),用同一个时间(卖家还价 09:00 AM)
  updateDate: 'Today, 09:00 AM'
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
  rowToyotaMatrixSent,
  rowMalibuSent,
  rowEscapeTitaniumDeclined,
  rowEscapeSEDeclined,
  rowChargerSentBuyer,
  rowBmwX5DeclinedBuyer,
  rowKonaReceived2,
  rowRx300Sent,
  rowFiat500SentBuyer,
  rowMalibuReceived2,
  rowFocusRsReceivedSeller,
  rowRx300SentSeller,
  rowFiat500SentSeller,
  rowKonaDeclinedSeller,
  rowWranglerDeclinedSeller,
  rowLexusEsReceivedSeller,
  rowEscapeSeReceivedSeller,
  rowBmwX5DeclinedSeller,
  rowEscapeTitaniumDeclinedSeller,
  rowChargerSentSeller,
  rowSingleDealer
}
