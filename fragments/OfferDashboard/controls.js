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
    label: 'Multi-dealer account (isMultiDealer)',
    default: true
  }
}
