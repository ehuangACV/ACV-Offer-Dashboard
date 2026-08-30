// 对应源卡片默认状态:Marketplace 选中,Rewards 展开态,姓名展开态
export const defaultExample = {
  initialSelectedIndex: 0,
  companyName: 'Magnacar Auto Corp',
  userName: 'Emily Huang',
  avatarLetter: 'A',
  rewardsLabel: 'Dealer Rewards Program'
}

// 自定义示例:选中 ACV Transport(带 New 徽标),换一个更长的公司名,
// 方便在 Playground 里把容器拖窄,观察收缩顺序(Rewards→姓名→More)
export const longCompanyExample = {
  initialSelectedIndex: 4,
  companyName: 'Sunset Motors LLC',
  userName: 'Jamie Rivera',
  avatarLetter: 'J',
  rewardsLabel: 'Dealer Rewards Program'
}

export default {
  defaultExample,
  longCompanyExample
}
