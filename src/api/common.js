
import request from '@/utils/request'

export const GroupApi = {
  /**
  * 获取分组列表
  */
  getGroupList(data) {
    return request({
      url: '/gallery/groupList',
      method: 'post',
      data
    })
  },
  /**
   * 添加分组
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
   * 编辑分组
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
   * 删除分组
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
// 获取所有城市 只到市
export default function getCityData(params) {
  return request({
    url: '/system/getCity',
    method: 'get',
    params
  })
}

// 获取快递公司列表
export function getExpressList(params) {
  return request({
    url: '/order/expressList',
    method: 'get',
    params
  })
}
