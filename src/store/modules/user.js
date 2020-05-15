import { login, logout, getInfo, checkLogin } from '@/api/user'
import { getToken, setToken, removeToken, getAdminId, setAdminId, removeAdminId } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    adminId: getAdminId(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_STATUS: (state, status) => {
    state.token = status.token
    state.adminId = status.adminId
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, code } = userInfo
    return new Promise((resolve, reject) => {
      login({ phone: username.trim(), passWord: password, code: code }).then(response => {
        const { data } = response
        commit('SET_STATUS', data)
        setToken(data.token)
        setAdminId(data.adminId)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response
        if (!data) {
          reject('验证失败，请重新登录')
        }
        const { name, avatar } = data
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        removeToken() // must remove  token  first
        removeAdminId() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user logout
  checkLogin({ commit, state }) {
    return new Promise((resolve, reject) => {
      checkLogin().then(() => {
        removeToken() // must remove  token  first
        removeAdminId() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove 登录状态
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      removeAdminId() // must remove  token  first
      commit('RESET_STATE')
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

