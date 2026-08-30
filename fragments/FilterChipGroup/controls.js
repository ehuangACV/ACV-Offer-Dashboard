export default {
  isMultiDealer: {
    type: 'boolean',
    label: 'Multi-dealer account (isMultiDealer)',
    default: true
  },
  dealershipOpen: {
    type: 'boolean',
    label: 'Dealership dropdown expanded (dealershipOpen)',
    default: false
  },
  negotiationCount: {
    type: 'text',
    label: 'In negotiation count (negotiationCount)',
    default: '2'
  },
  makeOfferCount: {
    type: 'text',
    label: 'Make Offer count (makeOfferCount)',
    default: '1'
  },
  newCount: {
    type: 'text',
    label: 'New count, 0 = disabled gray state (newCount)',
    default: '1'
  },
  receivedCount: {
    type: 'text',
    label: 'Received count, 0 = disabled gray state (receivedCount)',
    default: '1'
  },
  sentCount: {
    type: 'text',
    label: 'Sent count, 0 = disabled gray state (sentCount)',
    default: '0'
  },
  declinedCount: {
    type: 'text',
    label: 'Declined count, 0 = disabled gray state (declinedCount)',
    default: '0'
  }
}
