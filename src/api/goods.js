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
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function editGood(data) {
  return request({
    url: '/goods/editGoods',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
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

export function deleteGoods(data) {
  return request({
    url: '/goods/deleteGoods',
    method: 'post',
    data
  })
}
/**
 * 修改商品状态
 * @param {*id status}
 */
export function changeStatus(data) {
  return request({
    url: '/goods/setStatus',
    method: 'post',
    data
  })
}

// 商品分类模块
export const Category = {
  // 获取分类列表
  getList(data) {
    return request({
      url: '/goods/getCategory',
      method: 'post',
      data
    })
  },
  // 添加分类
  addCategory(data) {
    return request({
      url: '/goods/addCategory',
      method: 'post',
      data
    })
  },
  // 编辑分类
  editCategory(data) {
    return request({
      url: '/goods/editCategory',
      method: 'post',
      data
    })
  },
  // 删除分类
  deleteCategory(data) {
    return request({
      url: '/goods/delCategory',
      method: 'post',
      data
    })
  }
}
