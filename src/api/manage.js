import request from '@/utils/request'

export const rolesApi = {
  // 路由表
  authorityList(params) {
    return request({
      url: '/authority/authorityList',
      method: 'get',
      params
    })
  },
  /**
   * 添加角色
   * @param {} data
   */
  addRole(data) {
    return request({
      url: '/authority/addRole',
      method: 'post',
      data
    })
  }
}
