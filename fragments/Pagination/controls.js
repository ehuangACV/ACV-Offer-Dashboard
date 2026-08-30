export default {
  showViewingText: {
    type: 'boolean',
    label: 'Show "Viewing X out of Y results" (bottom pagination only) (showViewingText)',
    default: false
  },
  viewingCount: {
    type: 'text',
    label: 'Current visible count (viewingCount)',
    default: '6'
  },
  totalCount: {
    type: 'text',
    label: 'Total count (totalCount)',
    default: '6'
  },
  rowsPerPage: {
    type: 'select',
    label: 'Rows per page (rowsPerPage)',
    options: [
      { value: '10', label: '10' },
      { value: '20', label: '20' },
      { value: '50', label: '50' },
      { value: '100', label: '100' }
    ],
    default: '10'
  },
  hasPrevPage: {
    type: 'boolean',
    label: 'Previous page enabled (hasPrevPage)',
    default: false
  },
  hasNextPage: {
    type: 'boolean',
    label: 'Next page enabled (hasNextPage)',
    default: true
  }
}
