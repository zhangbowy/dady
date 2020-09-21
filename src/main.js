import Vue from 'vue'
import 'normalize.css/normalize.css' // CSS重置的现代替代方法

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Egrid from 'egrid' // 封装element table
import { limetedStr, getUrl } from '@/utils'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import '@/styles/index.scss' // 公共样式

import App from './App'
import store from './store'
import router from './router'
import VueI18n from 'vue-i18n'
import './icons' // icon
import '@/permission' // 路由拦截器-权限控制
// import VueSocketIO from 'vue-socket.io'
import Directive from '@/directive'

import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
// Vue.use(ElementUI, { size: 'small' })
Vue.use(Egrid)
Vue.config.productionTip = false
Vue.prototype.limetedStr = limetedStr // 截取字符串方法
Vue.prototype.getUrl = getUrl // 获取文件url

// 使用插件
Vue.use(Directive)
// 全局图片上传地址
Vue.mixin({
  computed: {
    uploadUrl() {
      return `${process.env.VUE_APP_BASE_API}/file/uploadOss`
    }
  }
})

// 国际化
Vue.use(VueI18n)
let enLang = localStorage.getItem('en')
let zhLang = localStorage.getItem('cn')
zhLang = zhLang && JSON.parse(zhLang)
enLang = enLang && JSON.parse(enLang)
const lang = localStorage.getItem('lang') || 'zh'
store.dispatch('settings/changeSetting', { key: 'lang', value: lang })
console.log(zhLang)
const i18n = new VueI18n({
  locale: lang,
  messages: {
    'zh': Object.assign(require('./lang/zh.json'), zhLang, zhLocale),
    'en': Object.assign(require('./lang/en.json'), enLang, enLocale)
  },
  silentFallbackWarn: true
})

new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App)
})
