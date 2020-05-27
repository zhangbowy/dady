import request from '@/utils/request'

export const orderApi = {
  /**
   * 订单列表
   * @param {*currentPage pageSize status order_no order_type} data
   */
  getList(data) {
    return request({
      url: '/order/orderList',
      method: 'post',
      data
    })
  },
  /**
   * 订单详情
   * @param {*order_no} data
   */
  getOrderDetail(data) {
    return request({
      url: '/order/orderDetail',
      method: 'post',
      data
    })
  },
  /**
   * 取消订单
   * @param {*order_no} data
   */
  orderCancel(data) {
    return request({
      url: '/order/cancel',
      method: 'post',
      data
    })
  },
  /**
   * 订单发货
   * @param {*order_no} data
   */
  orderDeliver(data) {
    return request({
      url: '/order/sendGoods',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data
    })
  },
  /**
   * 订单确认支付
   * @param {*order_id} data
   */
  confirmPayment(data) {
    return request({
      url: '/order/confirmPayment',
      method: 'post',
      data
    })
  },
  /**
   * 订单轨迹
   * @param {*order_item_id} data
   */
  orderTrace(data) {
    return request({
      url: '/order/orderTrace',
      method: 'post',
      data
    })
  },
  /**
   * 订单确认收货
   * @param {*order_id} data
   */
  confirmReceived(data) {
    return request({
      url: '/order/confirmReceived',
      method: 'post',
      data
    })
  },
  /**
   * 获取订单统计
   * @param {*order_type order_no} data
   */
  getOrderCount(data) {
    return request({
      url: '/order/orderCount',
      method: 'post',
      data
    })
  },
  /**
   * 订单发货
   * @param {*order_id designer_team_id} data
   */
  dispatchOrder(data) {
    return request({
      url: '/order/dispatchOrder',
      method: 'post',
      data
    })
  },
  /**
   * 回复询价
   * @param {*order_id price} data
   */
  replyOrder(data) {
    return request({
      url: '/order/replyOrder',
      method: 'post',
      data
    })
  }

}
