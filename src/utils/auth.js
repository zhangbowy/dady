import Cookies from 'js-cookie'

const TokenKey = 'adm_sign'
const AdminId = 'adm_id'
// 获取/设置/移除用户token方法
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(status) {
  return Cookies.set(TokenKey, status)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
// 获取/设置/移除adminId方法
export function getAdminId() {
  return Cookies.get(AdminId)
}

export function setAdminId(status) {
  return Cookies.set(AdminId, status)
}

export function removeAdminId() {
  return Cookies.remove(AdminId)
}
