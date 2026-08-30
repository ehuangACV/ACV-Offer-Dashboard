export default {
  initialSelectedIndex: {
    type: 'select',
    label: 'Initial selected nav item (initialSelectedIndex)',
    options: [
      { value: '0', label: 'Marketplace' },
      { value: '1', label: 'My ACV' },
      { value: '2', label: 'Market Report' },
      { value: '3', label: 'ACV Capital' },
      { value: '4', label: 'ACV Transport' }
    ],
    default: '0'
  },
  companyName: {
    type: 'text',
    label: 'Company name (companyName)',
    default: 'Magnacar Auto Corp'
  },
  userName: {
    type: 'text',
    label: 'User name (userName)',
    default: 'Emily Huang'
  },
  avatarLetter: {
    type: 'text',
    label: 'Avatar letter (avatarLetter)',
    default: 'A'
  },
  rewardsLabel: {
    type: 'text',
    label: 'Rewards badge text (rewardsLabel)',
    default: 'Dealer Rewards Program'
  },
  // 2026-08 按你的要求新增,对照节点 7432:69595 核实
  hasNewOffers: {
    type: 'boolean',
    label: '"My ACV" 旁边显示 New 红点 (hasNewOffers)',
    default: false
  }
}
