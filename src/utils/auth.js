import Cookies from 'js-cookie'

const TokenKey = 'adm_sign'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(status) {
  return Cookies.set(TokenKey, status)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
