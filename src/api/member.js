import request from '@/utils/request'

export const member = {
  userList(params) {
    return request({
      url: '/user/userList',
      method: 'get',
      params
    })
  }
}
