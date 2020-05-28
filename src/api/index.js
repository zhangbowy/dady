import request from '@/utils/request'

export const indexApi = {
  getData(params) {
    return request({
      url: '/index/indexData',
      method: 'get',
      params
    })
  }
}
