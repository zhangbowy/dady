import defaultSettings from '@/settings'
import { getLanguage } from '@/api/common'
const { showSettings, fixedHeader, sidebarLogo, lang, langsType } = defaultSettings
const state = {
  showSettings: showSettings,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  lang: lang,
  langsType: langsType,
  hasLanguagePack: false
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
      if (key === 'lang') {
        localStorage.setItem('lang', value)
      }
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  getLanguage({ commit }, param) {
    getLanguage(param).then((res) => {
      if (res.code === 0) {
        const langsList = {}
        for (const lang in langsType) {
          langsList[lang] = {}
        }
        res.data.data.forEach(item => {
          for (const lang in langsType) {
            langsList[lang][item.key] = item[lang]
          }
        })
        for (const lang in langsType) {
          localStorage.setItem(lang, JSON.stringify(langsList[lang]))
          delete langsList[lang]
        }
        commit('CHANGE_SETTING', { key: 'hasLanguagePack', value: true })
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

