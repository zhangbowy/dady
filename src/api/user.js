import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/admin/logOut',
    method: 'post'
  })
}

export function checkLogin() {
  return request({
    url: '/admin/checkLogin',
    method: 'get'
  })
}

// 获取验证码
export function getCaptcha(params) {
  return request({
    url: '/admin/getCaptcha',
    method: 'get',
    params
  })
}
