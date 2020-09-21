import store from './store'

if (!store.getters.hasLanguagePack) {
  // 获取语言包
  store.dispatch('settings/getLanguage', { currentPage: 1, pageSize: 1000, platform: 1 })
}

