export default {
  photoUrl: {
    type: 'text',
    label: 'Vehicle photo URL (photoUrl, empty = gray placeholder)',
    default: ''
  },
  offerType: {
    type: 'select',
    label: 'Deal type (offerType) — fixed for the deal, not a status',
    options: [
      { value: 'in-negotiation', label: 'In Negotiation' },
      { value: 'make-offer', label: 'Make Offer' }
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
  // 2026-08 按 "Offer card — content & interaction spec" 重写:viewerRole
  // 决定文案措辞和 hover 按钮组
  viewerRole: {
    type: 'select',
    label: 'Viewer role (viewerRole)',
    options: [
      { value: 'buyer', label: 'Buyer' },
      { value: 'seller', label: 'Seller' }
    ],
    default: 'seller'
  },
  dealState: {
    type: 'select',
    label: 'Deal state (dealState)',
    options: [
      { value: 'received', label: 'Received — their move, your turn' },
      { value: 'sent', label: 'Sent — your move, waiting on them' },
      { value: 'declined', label: 'Declined — closed' },
      { value: 'expired', label: 'Expired — closed' }
    ],
    default: 'received'
  },
  isNew: {
    type: 'boolean',
    label: 'New flag (isNew, only shows with Received/Declined)',
    default: true
  },
  timeLeft: {
    type: 'text',
    label: 'Countdown text (timeLeft, empty = hide; auto-hidden on Declined/Expired)',
    default: '45m Left'
  },
  timeLeftUrgent: {
    type: 'boolean',
    label: 'Countdown < 1h (timeLeftUrgent → red, else grey)',
    default: false
  },
  counterpartyAmount: {
    type: 'text',
    label: "Counterparty's amount (counterpartyAmount)",
    default: '$4,500'
  },
  ownAmount: {
    type: 'text',
    label: 'Your own amount — offer/counter/reserve (ownAmount)',
    default: '$3,800'
  },
  ownTimestamp: {
    type: 'text',
    label: 'Your amount timestamp (ownTimestamp)',
    default: 'Today, 08:45 AM'
  },
  expiredAt: {
    type: 'text',
    label: 'Expired-at time, optional (expiredAt, empty = omit)',
    default: ''
  },
  showGap: {
    type: 'boolean',
    label: '[Open question] Show gap instead of timestamp (showGap, Received only)',
    default: false
  },
  gapAmount: {
    type: 'text',
    label: 'Gap amount text (gapAmount)',
    default: '$700 apart'
  },
  // 2026-09-02 按 PM 反馈新增,只影响 offerType==='in-negotiation' 时的
  // 徽标样式,细节见 OfferCard.vue 同一处注释
  badgeStyle: {
    type: 'select',
    label: 'In Negotiation badge style (badgeStyle, in-negotiation only)',
    options: [
      { value: 'default', label: 'Current' },
      { value: 'ring', label: 'Ring' }
    ],
    default: 'default'
  }
}
