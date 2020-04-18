
import request from '@/utils/request'

export const GroupApi = {
  // 获取分类下拉
  getGroupList(data) {
    return request({
      url: '/gallery/groupList',
      method: 'post',
      data
    })
  },
  /**
   * @param {group_name parent_id level}
   */
  addGroup(data) {
    return request({
      url: '/gallery/addGroup',
      method: 'post',
      data
    })
  },
  /**
  * @param {gallery_group_id group_name}
  */
  editGroup(data) {
    return request({
      url: '/gallery/editGroup',
      method: 'post',
      data
    })
  },
  /**
  * @param {group_id}
  */
  deleteGroup(data) {
    return request({
      url: '/gallery/deleteGroup',
      method: 'post',
      data
    })
  }

}
