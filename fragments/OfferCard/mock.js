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

  2026-08 补充 Information Dialog 需要的字段(reservePrice/acvEstimate/
  reportUrl/history):这些字段卡片本身不显示,只是传给点击 CTA 弹出的
  InformationDialog 用(见 fragments/InformationDialog/notes.md)。
  history 数组按"Offer Dialog Rules for CC.md"第4节写,oldest first,
  speaker 是 'buyer'/'seller',kind 是 'bid'/'counter'/'offer'/'declined'。

  2026-09 按你发的 "Offer States Logic for CC.md" 整批重新核对+修正,删掉
  了 openingBidAmount/floorAmount/ceilingAmount(原因见旧版注释,git history
  里还能查到)。

  2026-09-01 第二次整批重新生成(你截图指出 Information Dialog 里
  "Highest Bid $26,000 / Seller Counter $7,000 / Reserve $27,000"、
  "Between $26,000 and $7,000"、split "$16,500" 这几个数字互相矛盾之后,
  你给了完整的生成流程 + 严格区间规则,这是最终版本):
  1. 生成顺序:先定 reserve,再定买家开盘价(< reserve),再定卖家的
     counter(严格落在买家最新数字和 reserve 之间),后续每一方的新
     counter 必须严格比自己上一次更接近对方(不能反向、不能原地不动、
     不能等于对方的数字——等于对方数字就是 Accept 本身)。
  2. `Between $X and $Y` 是参考区间,两个端点本身都不是合法输入(严格
     区间,不是闭区间)。
  3. Ford Focus RS 这 5 个 In Negotiation 例子(buyerReceivedExample/
     buyerSentNegotiationExample/sellerReceivedNegotiationExample/
     sellerSentExample/buyerExpiredExample)全部是同一段协商的 5 个连续
     快照,不是互相独立的数据——car/dealerName/vin/auctionId 本来就完全
     一样,数字必须能拼成一条链才有意义。链路:
       R0 买家出价 $3,800(Yesterday 02:10 PM)
       R1 卖家还价 $4,500(Yesterday 06:30 PM)——买家的第一次(转
       R2 买家还价 $4,100(Today 08:12 AM)
       R3 卖家还价 $4,300(Today 08:45 AM)
     reserve 全程 $4,800 不变(同一笔单子)。每一步都严格朝对方移动、
     且严格落在"自己上一个数字"和"对方最新数字"之间:
       R1: 3,800 < 4,500 < 4,800(卖家第一次 counter,没有"自己上一次"
           这个锚点,只要求 > 买家、< reserve)
       R2: 3,800(own last) < 4,100 < 4,500(seller last)
       R3: 4,100(buyer last) < 4,300 < 4,500(own last,下降)
     gap/split 只在 dealState==='received' 时才会显示(dialog 的"Counter
     offer"输入面板只在这个状态出现),sent/expired 状态不显示,但数字
     本身在任何快照下都必须自洽:
       buyerReceivedExample(R1 之后,轮到买家):gap $700 / split $4,150
       sellerReceivedNegotiationExample(R2 之后,轮到卖家,和
       buyerSentNegotiationExample 是同一个真实时刻,只是买/卖两个角色
       各自的视角):gap $400 / split $4,300
     acvEstimate 统一定成 $4,600(同一辆车的市场参考价,不应该在 5 个
     快照之间变来变去)。
  4. BMW X5 这 5 个 Make Offer 例子(buyerSentMakeOfferExample/
     buyerDeclinedExample/sellerReceivedMakeOfferExample/
     sellerDeclinedExample/sellerExpiredExample)之前 reserve 分别是
     $23,000/$21,000/$32,000/$29,000——同一辆车(vin/auctionId 完全一样)
     reserve 却各不相同,你指出这看起来像 bug。统一成同一个 reserve
     $28,000、acvEstimate 统一 $27,500(同一个 listing 理应是同一个数字)。
     Make Offer 没有 counter,只要求买家的出价严格低于 reserve,这次额外
     把买家出价收紧到 reserve 的 85%–97% 这个区间内(此前有的例子价差
     太大,不现实,也让 reserve 这个数字失去意义):
       buyerSentMakeOfferExample:      $26,500 (94.6%)
       buyerDeclinedExample:           $25,000 (89.3%)
       sellerReceivedMakeOfferExample: $27,000 (96.4%,ownAmount/"Your
                                        reserve" 和 reservePrice 保持
                                        同一个数字 $28,000)
       sellerDeclinedExample:          $24,200 (86.4%)
       sellerExpiredExample:           $25,800 (92.1%)
  5. Time Remaining:In Negotiation 全部 < 6h(4h30m/2h40m/2h40m/45m,
     expired 状态不显示倒计时),Make Offer 全部 < 24h(18h/20h30m,
     declined/expired 不显示倒计时)。
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
  timeLeft: '4h 30m Left',
  timeLeftUrgent: false,
  isNew: true,
  // R1 之后,轮到买家:买家自己的数字还是 R0 的开盘价(没变过),对方
  // (卖家)最新是 R1 这一次 counter。gap $700 / split $4,150。
  counterpartyAmount: '$4,500',
  ownAmount: '$3,800',
  ownTimestamp: 'Yesterday, 02:10 PM',
  counterpartyTimestamp: 'Yesterday, 06:30 PM',
  reservePrice: '$4,800',
  acvEstimate: '$4,600',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'bid', amount: '$3,800', timestamp: 'Yesterday, 02:10 PM' },
    { speaker: 'seller', kind: 'counter', amount: '$4,500', timestamp: 'Yesterday, 06:30 PM' }
  ]
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
  // R2:买家刚 countered $4,100(严格 >自己上一次$3,800、<卖家最新
  // $4,500),等卖家回复。和下面 sellerReceivedNegotiationExample 是
  // 同一个真实时刻的两个视角。
  ownAmount: '$4,100',
  ownTimestamp: 'Today, 08:12 AM',
  counterpartyAmount: '$4,500',
  reservePrice: '$4,800',
  acvEstimate: '$4,600',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'bid', amount: '$3,800', timestamp: 'Yesterday, 02:10 PM' },
    { speaker: 'seller', kind: 'counter', amount: '$4,500', timestamp: 'Yesterday, 06:30 PM' },
    { speaker: 'buyer', kind: 'counter', amount: '$4,100', timestamp: 'Today, 08:12 AM' }
  ]
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
  ownAmount: '$26,500',
  ownTimestamp: 'Today, 10:49 AM',
  reservePrice: '$28,000',
  acvEstimate: '$27,500',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'offer', amount: '$26,500', timestamp: 'Today, 10:49 AM' }
  ]
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
  ownAmount: '$25,000',
  reservePrice: '$28,000',
  acvEstimate: '$27,500',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'offer', amount: '$25,000', timestamp: 'Mon, Aug 24, 09:15 AM' },
    { speaker: 'seller', kind: 'declined', timestamp: 'Mon, Aug 24, 03:40 PM' }
  ]
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
  // 过期时买家的最新数字还是 R2 的 $4,100(过期前没再动过),对方最新是
  // R3 卖家的 $4,300。
  ownAmount: '$4,100',
  expiredAt: '',
  counterpartyAmount: '$4,300',
  reservePrice: '$4,800',
  acvEstimate: '$4,600',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'bid', amount: '$3,800', timestamp: 'Mon, Aug 24, 02:10 PM' },
    { speaker: 'seller', kind: 'counter', amount: '$4,500', timestamp: 'Mon, Aug 24, 06:30 PM' },
    { speaker: 'buyer', kind: 'counter', amount: '$4,100', timestamp: 'Tue, Aug 25, 09:10 AM' },
    { speaker: 'seller', kind: 'counter', amount: '$4,300', timestamp: 'Tue, Aug 25, 09:45 AM' }
  ]
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
  timeLeft: '2h 40m Left',
  timeLeftUrgent: false,
  isNew: true,
  // 和 buyerSentNegotiationExample 是同一个真实时刻(R2 刚发生):卖家
  // 自己的数字还是 R1 的 $4,500(没变过),对方(买家)最新是 R2 的
  // $4,100。gap $400 / split $4,300。
  counterpartyAmount: '$4,100',
  ownAmount: '$4,500',
  ownTimestamp: 'Yesterday, 06:30 PM',
  counterpartyTimestamp: 'Today, 08:12 AM',
  reservePrice: '$4,800',
  acvEstimate: '$4,600',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'bid', amount: '$3,800', timestamp: 'Yesterday, 02:10 PM' },
    { speaker: 'seller', kind: 'counter', amount: '$4,500', timestamp: 'Yesterday, 06:30 PM' },
    { speaker: 'buyer', kind: 'counter', amount: '$4,100', timestamp: 'Today, 08:12 AM' }
  ]
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
  timeLeft: '45m Left',
  timeLeftUrgent: true,
  isNew: false,
  // R3:卖家刚 countered $4,300(严格 <自己上一次$4,500、>买家最新
  // $4,100),等买家回复。
  ownAmount: '$4,300',
  ownTimestamp: 'Today, 08:45 AM',
  counterpartyAmount: '$4,100',
  reservePrice: '$4,800',
  acvEstimate: '$4,600',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'bid', amount: '$3,800', timestamp: 'Yesterday, 02:10 PM' },
    { speaker: 'seller', kind: 'counter', amount: '$4,500', timestamp: 'Yesterday, 06:30 PM' },
    { speaker: 'buyer', kind: 'counter', amount: '$4,100', timestamp: 'Today, 08:12 AM' },
    { speaker: 'seller', kind: 'counter', amount: '$4,300', timestamp: 'Today, 08:45 AM' }
  ]
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
  timeLeft: '20h 30m Left',
  timeLeftUrgent: false,
  isNew: true,
  counterpartyAmount: '$27,000',
  ownAmount: '$28,000',
  counterpartyTimestamp: 'Today, 12:15 PM',
  reservePrice: '$28,000',
  acvEstimate: '$27,500',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'offer', amount: '$27,000', timestamp: 'Today, 12:15 PM' }
  ]
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
  counterpartyAmount: '$24,200',
  reservePrice: '$28,000',
  acvEstimate: '$27,500',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'offer', amount: '$24,200', timestamp: 'Mon, Aug 24, 10:05 AM' },
    { speaker: 'seller', kind: 'declined', timestamp: 'Mon, Aug 24, 02:50 PM' }
  ]
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
  counterpartyAmount: '$25,800',
  expiredAt: '',
  reservePrice: '$28,000',
  acvEstimate: '$27,500',
  reportUrl: '#',
  history: [
    { speaker: 'buyer', kind: 'offer', amount: '$25,800', timestamp: 'Mon, Aug 17, 10:05 AM' }
  ]
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
