// src/directive/index.js
import Has from './has'
export default {
  install(Vue) {
    Vue.directive('has', Has)
  }
}
