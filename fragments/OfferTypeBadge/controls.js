export default {
  type: {
    type: 'select',
    label: 'Type (type)',
    options: [
      { value: 'in-negotiation', label: 'In Negotiation' },
      { value: 'make-offer', label: 'Make Offer' }
    ],
    default: 'in-negotiation'
  },
  label: {
    type: 'text',
    label: 'Label text (label)',
    default: 'In Negotiation'
  }
}
