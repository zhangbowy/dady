import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/shops/shopList',
    method: 'post',
    data
  })
}

export function addShop(data) {
  return request({
    url: '/shops/addShop',
    method: 'post',
    data
  })
}

export function editShop(data) {
  return request({
    url: '/shops/editShop',
    method: 'post',
    data
  })
}

export function delShop(data) {
  return request({
    url: '/shops/delShop',
    method: 'post',
    data
  })
}
