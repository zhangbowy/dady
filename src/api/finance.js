import request from '@/utils/request'

export const financeApi = {

  /**
   * 获取统计数据
   * @param {*} params
   */
  getData(params) {
    return request({
      url: '/finance/getData',
      method: 'get',
      params
    })
  },
  /**
   * 获取佣金结算列表
   * @param {*} params
   */
  getCashList(params) {
    return request({
      url: '/finance/getCashList',
      method: 'get',
      params
    })
  },
  // 同意提现
  cashVerify(data) {
    return request({
      url: '/finance/cashVerify',
      method: 'post',
      data
    })
  },
  // 驳回提现
  cashRefused(data) {
    return request({
      url: '/finance/cashRefused',
      method: 'post',
      data
    })
  }
}
