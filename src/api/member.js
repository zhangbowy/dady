import request from '@/utils/request'

export const member = {
  userList(data) {
    return request({
      url: '/user/userList',
      method: 'post',
      data
    })
  }
}
