import VueI18n from 'vue-i18n'
import Vue from 'vue'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
// 国际化
Vue.use(VueI18n)
let enLang = localStorage.getItem('en')
let zhLang = localStorage.getItem('cn')
zhLang = zhLang && JSON.parse(zhLang)
enLang = enLang && JSON.parse(enLang)
const lang = localStorage.getItem('lang') || 'zh'
// store.dispatch('settings/changeSetting', { key: 'lang', value: lang })
const i18n = new VueI18n({
  locale: lang,
  messages: {
    'zh': Object.assign(require('../lang/zh.json'), zhLang, zhLocale),
    'en': Object.assign(require('../lang/en.json'), enLang, enLocale)
  },
  silentFallbackWarn: true
})
export default i18n
