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
  }
}
