export default {
  photoUrl: {
    type: 'text',
    label: 'Vehicle photo URL (photoUrl, empty = gray placeholder)',
    default: ''
  },
  offerType: {
    type: 'select',
    label: 'Offer type badge (offerType)',
    options: [
      { value: 'in-negotiation', label: 'In Negotiation' },
      { value: 'make-offer', label: 'Make Offer' },
      { value: 'none', label: 'None' }
    ],
    default: 'in-negotiation'
  },
  dealerName: {
    type: 'text',
    label: 'Dealer / lane badge (dealerName)',
    default: 'CarMax Boston'
  },
  vehicleTitle: {
    type: 'text',
    label: 'Vehicle title (vehicleTitle)',
    default: 'Year Make Model'
  },
  mileage: {
    type: 'text',
    label: 'Mileage (mileage)',
    default: '250,000 miles'
  },
  vin: {
    type: 'text',
    label: 'VIN (vin)',
    default: '192211'
  },
  auctionId: {
    type: 'text',
    label: 'Auction ID (auctionId)',
    default: '452161'
  },
  timeLeft: {
    type: 'text',
    label: 'Time left (timeLeft, empty = hide)',
    default: '45m Left'
  },
  statusNew: {
    type: 'boolean',
    label: 'Show "New" status chip (statusNew)',
    default: true
  },
  statusReceived: {
    type: 'boolean',
    label: 'Show "Received" status chip (statusReceived)',
    default: true
  },
  statusSent: {
    type: 'boolean',
    label: 'Show "Sent" status chip (statusSent)',
    default: false
  },
  statusDeclined: {
    type: 'boolean',
    label: 'Show "Declined" status chip (statusDeclined)',
    default: false
  },
  primaryMessage: {
    type: 'text',
    label: 'Primary message (primaryMessage, empty = hide message block)',
    default: 'Seller countered $4,500'
  },
  secondaryMessage: {
    type: 'text',
    label: 'Secondary message (secondaryMessage)',
    default: 'You offered $3,800 · Today, 08:45 AM'
  },
  // 2026-08 按你的要求新增:卡片下方按钮,V1/V2 两个版本切换,对照
  // 节点 7498:68345(V1)/ 7499:69479(V2)核实。
  buttonVersion: {
    type: 'select',
    label: 'Card buttons version (buttonVersion)',
    options: [
      { value: 'none', label: 'None' },
      { value: 'v1', label: 'V1 (hover to reveal, 3 buttons)' },
      { value: 'v2', label: 'V2 (always visible, 2 buttons)' }
    ],
    default: 'v1'
  },
  // 2026-08 按你的要求新增,对照节点 7501:69741 核实:V1 下按钮数量可以是
  // 1/2/3 个,只在 buttonVersion 是 v1 时才有效果(V2 固定 2 个按钮,不受
  // 这个控制项影响)。
  buttonCount: {
    type: 'select',
    label: 'V1 button count (buttonCount, only affects V1)',
    options: [
      { value: '1', label: '1 (Primary only)' },
      { value: '2', label: '2 (Primary + Tertiary)' },
      { value: '3', label: '3 (Primary + Secondary + Tertiary)' }
    ],
    default: '3'
  }
}
