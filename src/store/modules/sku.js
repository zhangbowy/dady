const getDefaultState = () => {
  return {
    skuList: [],
    skuData: [],
    priceInfo: {}
  }
}
const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_SKULIST: (state, skuList) => {
    state.skuList = skuList
  },
  SET_SKUDATA: (state, skuData) => {
    state.skuData = skuData
  },
  SET_PRICEINFO: (state, priceInfo) => {
    state.priceInfo = priceInfo
  }
}

const actions = {
  setSkuList({ commit }, skuList) {
    return new Promise((resolve, reject) => {
      commit('SET_SKULIST', skuList)
      resolve()
    })
  },
  setPriceInfo({ commit }, priceInfo) {
    return new Promise((resolve, reject) => {
      commit('SET_PRICEINFO', priceInfo)
      resolve()
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
