/*
  "reset" 是一个特殊的 'button' 类型控件——点击时不改变任何 prop 的值,
  而是让 Playground 把这个组件重新挂载一次,回到默认状态(包括子组件
  内部自己维护的状态,比如搜索框输入的文字、筛选 chip 的选中态)。
  Playground 的 Controls 面板需要认识 'button' 这个 type 才能画出按钮,
  不认识的话请忽略这个字段,不影响其余 select/boolean/text 控件。
*/
export default {
  reset: {
    type: 'button',
    label: 'Reset dashboard'
  },
  isMultiDealer: {
    type: 'boolean',
    label: 'Multi-dealer',
    default: true
  },
  // 2026-09-02 按 PM 反馈新增,只透传给 tile 视图的 OfferCard,细节见
  // OfferDashboard.vue 的 cardBadgeStyle prop 注释
  cardBadgeStyle: {
    type: 'select',
    label: 'In Negotiation badge style',
    options: [
      { value: 'default', label: 'Current' },
      { value: 'ring', label: 'Ring' }
    ],
    default: 'default'
  },
  // 2026-09-02 按你的要求新增:InformationDialog 的 v1/v2 切换,细节见
  // fragments/InformationDialog/notes.md
  dialogVersion: {
    type: 'select',
    label: 'Information Dialog version',
    options: [
      { value: 'v1', label: 'V1 — badge on vehicle title' },
      { value: 'v2', label: 'V2 — badge on status row + info tooltip' }
    ],
    default: 'v1'
  }
}
