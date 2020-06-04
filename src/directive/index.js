// src/directive/index.js
import Has from './has'
import DialogDrag from './dialogDrag/index'
export default {
  install(Vue) {
    Vue.directive('has', Has)
    Vue.directive('dialogDrag', DialogDrag)
  }
}
