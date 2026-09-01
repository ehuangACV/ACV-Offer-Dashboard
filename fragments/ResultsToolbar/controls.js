export default {
  viewMode: {
    type: 'select',
    label: 'View mode (viewMode)',
    options: [
      { value: 'tile', label: 'Tile' },
      { value: 'table', label: 'Table' }
    ],
    default: 'table'
  },
  resultsCount: {
    type: 'number',
    label: '"Viewing N results" count (resultsCount, tile mode only)',
    default: 5
  },
  hasPrevPage: {
    type: 'boolean',
    label: 'Previous page enabled (hasPrevPage, table mode only)',
    default: false
  },
  hasNextPage: {
    type: 'boolean',
    label: 'Next page enabled (hasNextPage, table mode only)',
    default: true
  }
}
