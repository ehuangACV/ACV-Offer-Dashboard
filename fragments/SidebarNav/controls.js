export default {
  activeItem: {
    type: 'select',
    label: 'Active item (activeItem)',
    options: [
      { value: 'my-inventory', label: 'My Inventory' },
      { value: 'saved-auctions', label: 'Saved Auctions' },
      { value: 'request-inspection', label: 'Request Inspection' },
      { value: 'active', label: 'Active' },
      { value: 'pending-proxy', label: 'Pending Proxy' },
      { value: 'negotiation', label: 'Negotiation' },
      { value: 'offers', label: 'Offers' },
      { value: 'billing', label: 'Billing' },
      { value: 'won', label: 'Won' },
      { value: 'sold', label: 'Sold' },
      { value: 'titles-hub', label: 'Titles Hub' },
      { value: 'performance', label: 'Performance' }
    ],
    default: 'offers'
  },
  offersCount: {
    type: 'text',
    label: 'Offers count badge (offersCount)',
    default: '5'
  }
}
