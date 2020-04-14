import request from '@/utils/request'

export function categories(params) {
  return request({
    url: '/',
    method: 'get',
    params
  })
}

export function addCategory(data) {
  return request({
    url: '/shop/categoryAdd',
    method: 'post',
    data
  })
}
