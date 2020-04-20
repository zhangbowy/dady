import request from '@/utils/request'

export const embTemplate = {
  /**
   * 获取定制模板列表
   * @param {* template_type}
   */
  getEmbTemplate(data) {
    return request({
      url: '/system/embTemplate',
      method: 'post',
      data
    })
  },
  /**
   * 修改定制模板图片
   * @param {* template_type cover_image}
   */
  changeCoverImg(data) {
    return request({
      url: '/system/editEmbTemplate',
      method: 'post',
      data
    })
  },
  /**
   * 添加价格参数
   * @param {* id name price width height}
   */
  addTemplate(data) {
    return request({
      url: '/system/addEmbPrice',
      method: 'post',
      data
    })
  },
  /**
   * 添加价格参数
   * @param {* id template_id}
   */
  deleteTemplate(data) {
    return request({
      url: '/system/delEmbPrice',
      method: 'post',
      data
    })
  }
}
