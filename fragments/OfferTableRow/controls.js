export default {
  isMultiDealer: {
    type: 'boolean',
    label: 'Multi-dealer account (isMultiDealer)',
    default: true
  },
  photoUrl: {
    type: 'text',
    label: 'Vehicle photo URL (photoUrl, empty = no photo)',
    default: ''
  },
  dealerName: {
    type: 'text',
    label: 'Dealer name (dealerName)',
    default: 'CarMax Boston'
  },
  auctionId: {
    type: 'text',
    label: 'Auction ID (auctionId)',
    default: '264578'
  },
  offerType: {
    type: 'select',
    label: 'Badge below Dealer column (offerType)',
    options: [
      { value: 'none', label: '(hidden)' },
      { value: 'in-negotiation', label: 'In Negotiation' },
      { value: 'make-offer', label: 'Make Offer' }
    ],
    default: 'in-negotiation'
  },
  vehicleTitle: {
    type: 'text',
    label: 'Vehicle title (vehicleTitle)',
    default: '2018 Ford Somemodel'
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
  timeRemaining: {
    type: 'text',
    label: 'Time remaining (timeRemaining)',
    default: '20h 45m'
  },
  acvEstimate: {
    type: 'text',
    label: 'ACV Estimate (acvEstimate)',
    default: '$25,000'
  },
  sentAmount: {
    type: 'text',
    label: 'Sent amount, can be "--" (sentAmount)',
    default: '$26,000'
  },
  receivedAmount: {
    type: 'text',
    label: 'Received amount, can be "--" (receivedAmount)',
    default: '$7,000'
  },
  statusNew: {
    type: 'boolean',
    label: 'Show New in Update column (statusNew)',
    default: true
  },
  statusReceived: {
    type: 'boolean',
    label: 'Show Received in Update column (statusReceived)',
    default: true
  },
  updateDate: {
    type: 'text',
    label: 'Update column date (updateDate)',
    default: 'Today'
  }
}
