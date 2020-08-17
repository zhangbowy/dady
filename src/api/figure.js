import request from '@/utils/request'

export const figureApi = {
  // 获取花样劣币爱
  getList(params) {
    return request({
      url: '/design/designList',
      method: 'get',
      params
    })
  },
  // 花样设置状态
  setStatus(data) {
    return request({
      url: '/design/setStatus',
      method: 'post',
      data
    })
  },
  // 统计数量
  designCount(params) {
    return request({
      url: '/design/designCount',
      method: 'get',
      params
    })
  },
  // 花样类别
  getCategory(params) {
    return request({
      url: '/design/getCategory',
      method: 'get',
      params
    })
  },
  // 添加花样分类
  addCategory(data) {
    return request({
      url:'/design/addCategory',
      method: 'post',
      data
    })
  },
  // 编辑花样分类
  editCategory(data) {
    return request({
      url:'/design/editCategory',
      method: 'post',
      data
    })
  },
  // 删除分类
  deleteCategory(data) {
    return request({
      url:'/design/delCategory',
      method: 'post',
      data
    })
  },
  // 设置分类
  setCategory(data) {
    return request({
      url:'/design/setCategory',
      method: 'post',
      data
    })
  }
  
}
