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
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data
    })
  },
  /**
   * 添加角色
   * @param {} data
   */
  editRole(data) {
    return request({
      url: '/authority/editRole',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data
    })
  },

  /**
   * 角色列表
   * @param {} data
   */
  roleList(params) {
    return request({
      url: '/authority/roleList',
      method: 'get',
      params
    })
  },
  /**
   * 角色详情
   * @param {admin_role_id} data
   */
  roleDetail(params) {
    return request({
      url: '/authority/roleDetail',
      method: 'get',
      params
    })
  },
  /**
   * 删除角色
   * @param {admin_role_id} data
   */
  delRole(data) {
    return request({
      url: '/authority/delRole',
      method: 'post',
      data
    })
  }

}

// 管理员管理接口
export const adminApi = {
  // 获取管理员列表
  getAdminList(params) {
    return request({
      url: '/authority/adminList',
      method: 'get',
      params
    })
  },
  /**
   * 添加管理员
   *
   * @param {*} data
   */
  addAdmin(data) {
    return request({
      url: '/authority/addAdmin',
      method: 'post',
      data
    })
  },
  /**
   * 删除管理员
   * @param {*} params
   */
  delAdmin(params) {
    return request({
      url: '/authority/delAdmin',
      method: 'get',
      params
    })
  },
  /**
   * 编辑管理员
   *
   * @param {*} data
   */
  editAdmin(data) {
    return request({
      url: '/authority/editAdmin',
      method: 'post',
      data
    })
  }

}
