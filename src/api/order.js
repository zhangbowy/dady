import request from '@/utils/request'

export const orderApi = {
  getList(data) {
    return request({
      url: '/order/orderList',
      method: 'post',
      data
    })
  }
}
