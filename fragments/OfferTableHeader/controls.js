export default {
  isMultiDealer: {
    type: 'boolean',
    label: 'Multi-dealer account (isMultiDealer)',
    default: true
  },
  sortColumn: {
    type: 'select',
    label: 'Column being sorted (sortColumn)',
    options: [
      { value: '', label: '(none)' },
      { value: 'dealer-name', label: 'Dealer Name' },
      { value: 'time-remaining', label: 'Time Remaining' }
    ],
    default: ''
  }
}
