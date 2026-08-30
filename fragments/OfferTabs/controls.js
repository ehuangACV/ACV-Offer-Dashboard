export default {
  activeTab: {
    type: 'select',
    label: 'Selected tab (activeTab)',
    options: [
      { value: 'buying', label: 'Buying' },
      { value: 'selling', label: 'Selling' }
    ],
    default: 'buying'
  },
  buyingCount: {
    type: 'text',
    label: 'Buying count (buyingCount)',
    default: '3'
  },
  sellingCount: {
    type: 'text',
    label: 'Selling count (sellingCount)',
    default: '2'
  }
}
