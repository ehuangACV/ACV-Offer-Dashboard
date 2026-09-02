export default {
  variant: {
    type: 'select',
    label: 'Badge type (variant)',
    options: [
      { value: 'in-negotiation', label: 'In Negotiation' },
      { value: 'make-offer', label: 'Make Offer' },
      { value: 'dealer', label: 'Dealer name (lane badge)' }
    ],
    default: 'in-negotiation'
  },
  label: {
    type: 'text',
    label: 'Badge text (label)',
    default: 'In Negotiation'
  },
  ring: {
    type: 'boolean',
    label: 'Ring style (ring, in-negotiation only)',
    default: false
  }
}
