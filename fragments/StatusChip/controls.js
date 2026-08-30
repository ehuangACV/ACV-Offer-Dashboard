/*
  Controls declaration file.
  The Playground's bottom Controls panel reads this file and auto-generates
  the matching form controls (select / checkbox / text ...), so you don't
  need to hand-write a panel UI for every component.

  Supported `type` values:
    'select'   -> dropdown, needs options
    'boolean'  -> checkbox / toggle
    'text'     -> text input
*/
export default {
  status: {
    type: 'select',
    label: 'Status (status)',
    options: [
      { value: 'new', label: 'New' },
      { value: 'received', label: 'Received' },
      { value: 'sent', label: 'Sent' },
      { value: 'declined', label: 'Declined' },
      { value: 'overflow', label: '+N (overflow badge)' }
    ],
    default: 'new'
  },
  label: {
    type: 'text',
    label: 'Label text (label)',
    default: 'New'
  },
  showIcon: {
    type: 'boolean',
    label: 'Show icon (showIcon)',
    default: true
  }
}
