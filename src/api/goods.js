import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/goods/goodsList',
    method: 'post',
    data
  })
}

export function addGood(data) {
  return request({
    url: '/goods/addGoods',
    method: 'post',
    data
  })
}

export function editGood(data) {
  return request({
    url: '/goods/editGoods',
    method: 'post',
    data
  })
}

export function goodDetail(data) {
  return request({
    url: '/goods/goodsDetail',
    method: 'post',
    data
  })
}

export function deleteGoods(params) {
  return request({
    url: '/goods/deleteGoods',
    method: 'get',
    params
  })
}
