import Cookies from 'js-cookie'

const StatusKey = 'yuncx_is_login'

export function getStatus() {
  return Cookies.get(StatusKey)
}

export function setStatus(status) {
  return Cookies.set(StatusKey, status)
}

export function removeStatus() {
  return Cookies.remove(StatusKey)
}
