import request from '@/utils/request'

/**
 * 获取设计师团队列表
 * @param {*} data
 */
export function getTeamList(data) {
  return request({
    url: '/design/designerList',
    method: 'post',
    data
  })
}

/**
 * 添加设计师管理者
 * @param {*} data
 */
export function addDesigner(data) {
  return request({
    url: '/design/addDesigner',
    method: 'post',
    data
  })
}

/**
 * 编辑设计师管理者
 * @param {*} data
 */
export function editDesigner(data) {
  return request({
    url: '/design/editDesigner',
    method: 'post',
    data
  })
}

/**
 * 删除设计师管理者
 * @param {*} data
 */
export function deleteDesigner(data) {
  return request({
    url: '/design/deleteDesigner',
    method: 'post',
    data
  })
}
