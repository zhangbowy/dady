import Vue from 'vue'
import store from '@/store'
// 权限检查方法
Vue.prototype.$_has = function(value) {
  let isExist = false
  const buttonpermsStr = store.state.user.permission
  if (buttonpermsStr === undefined || buttonpermsStr == null) {
    return false
  }
  if (buttonpermsStr.indexOf(value) > -1) {
    isExist = true
  }
  return isExist
}
export default {
  // bind: function(el, binding) {
  //   if (!Vue.prototype.$_has(binding.value)) {
  //     console.log(el.parentNode)
  //     el.parentNode.removeChild(el)
  //   }
  // },
  inserted: function(el, binding) {
    if (!Vue.prototype.$_has(binding.value)) {
      el.parentNode.removeChild(el)
    }
  }
}
