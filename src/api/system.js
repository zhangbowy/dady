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

export const adsense = {
  /**
   * 获取首页广告位列表
   * @param {* }
   */
  getAdsenseList(params) {
    return request({
      url: '/system/getSlider',
      method: 'get',
      params
    })
  },
  /**
   * 添加首页广告位
   * @param {*image_path sort link }
   */
  addAdsense(data) {
    return request({
      url: '/system/addSlider',
      method: 'post',
      data
    })
  },
  /**
   * 编辑首页广告位
   * @param {* id image_path sort link }
   */
  editAdsense(data) {
    return request({
      url: '/system/editSlider',
      method: 'post',
      data
    })
  },
  /**
   * 删除首页广告位
   * @param {*id }
   */
  deleteAdsense(data) {
    return request({
      url: '/system/delSlider',
      method: 'post',
      data
    })
  }
}

export const expressApi = {
  /**
   * 获取物流模板列表
   * @param {* }
   */
  getExpressList(params) {
    return request({
      url: '/system/expTemplate',
      method: 'get',
      params
    })
  },
  /**
  * 物流模板详情
  * @param {* }
  */
  expressDetail(params) {
    return request({
      url: '/system/expTemplateDetail',
      method: 'get',
      params
    })
  },
  /**
   * 添加物流模板
   * @param {* }
   */
  addExpress(data) {
    return request({
      url: '/system/addExpTemplate',
      method: 'post',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      data
    })
  },
  /**
  * 编辑物流模板
  * @param {* }
  */
  editExpress(data) {
    return request({
      url: '/system/editExpTemplate',
      method: 'post',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      data
    })
  },
  /**
  * 删除物流模板
  * @param {* }
  */
  deleteExpress(data) {
    return request({
      url: '/system/delExpTemplate',
      method: 'post',
      data
    })
  }
}
