import Vue from 'vue'

import 'normalize.css/normalize.css' // CSS重置的现代替代方法

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Egrid from 'egrid'

import 'mavon-editor/dist/css/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // 公共样式

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // 路由拦截器-权限控制

// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.use(ElementUI, { size: 'small' })
Vue.use(Egrid)
Vue.config.productionTip = false

// 全局图片上传地址
Vue.mixin({
  computed: {
    uploadImgUrl() {
      return `${process.env.VUE_APP_BASE_API}/file/uploadOss`
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
