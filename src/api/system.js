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
   * @param {* emb_template_id name price width height}
   */
  addTemplate(data) {
    return request({
      url: '/system/addEmbPrice',
      method: 'post',
      data
    })
  },
  /**
   * 编辑价格参数
   * @param {* emb_template_id id name price width height}
   */
  editTemplate(data) {
    return request({
      url: '/system/editEmbPrice',
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
  },
  /**
   * 广告位排序
   * @param {*id sort}
   */
  sortSlider(data) {
    return request({
      url: '/system/sortSlider',
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

export const customCateApi = {
  /**
   * 获取定制分类列表
   * @param {* }
   */
  getCategoryList(params) {
    return request({
      url: '/system/customCategory',
      method: 'get',
      params
    })
  },
  /**
   * 添加可定制分类
   * @param {*} data
   */
  addCustomCate(data) {
    return request({
      url: '/system/addCustomCate',
      method: 'post',
      data
    })
  },
  /**
   * 编辑可定制分类
   * @param {*} data
   */
  editCustomCate(data) {
    return request({
      url: '/system/editCustomCate',
      method: 'post',
      data
    })
  },
  /**
   * 关联机器
   * @param {*} data
   */
  relationMachine(data) {
    return request({
      url: '/system/relationMachine',
      method: 'post',
      data
    })
  },
  /**
   * 解除关联机器
   * @param {*} data
   */
  unRelationMachine(data) {
    return request({
      url: '/system/unRelationMachine',
      method: 'post',
      data
    })
  },
  /**
  * 删除可定制分类
  * @param {* custom_category_id}
  */
  delCustomCate(data) {
    return request({
      url: '/system/delCustomCate',
      method: 'post',
      data
    })
  },
  /**
  * 根据定制分类id获取机器
  * @param {* custom_category_id}
  */
  getMachineById(params) {
    return request({
      url: '/system/getMachineById',
      method: 'get',
      params
    })
  }
}

export const machineApi = {
  /**
   * 获取机器列表
   * @param {* }
   */
  getMachine(params) {
    return request({
      url: '/system/getMachine',
      method: 'get',
      params
    })
  },
  /**
  * 添加机器
  * @param {* }
  */
  addMachine(data) {
    return request({
      url: '/system/addMachine',
      method: 'post',
      data
    })
  },
  /**
  * 编辑机器
  * @param {* machine_id}
  */
  editMachine(data) {
    return request({
      url: '/system/editMachine',
      method: 'post',
      data
    })
  },
  /**
  * 删除机器
  * @param {* machine_id}
  */
  delMachine(data) {
    return request({
      url: '/system/delMachine',
      method: 'post',
      data
    })
  }
}

// 获取图片源信息
export function getImgMeta(params) {
  return request({
    url: '/system/getImgMeta',
    method: 'get',
    params
  })
}

export const settingApi = {
  /**
   * 获取设置
   * @param {*} params
   */
  getSetting(params) {
    return request({
      url: '/system/getSetting',
      methods: 'get',
      params
    })
  },
  /**
   * 编辑设置
   * @param {*key value} data
   */
  editSetting(data) {
    return request({
      url: '/system/editSetting',
      method: 'post',
      data
    })
  },
  /**
   * 获取微信配置
   * @param {*} params
   */
  getWxConfig(params) {
    return request({
      url: '/system/getWxConfig',
      methods: 'get',
      params
    })
  },
  /**
   * 保存微信设置
   * @param {*key value} data
   */
  saveWxConfig(data) {
    return request({
      url: '/system/saveWxConfig',
      method: 'post',
      data
    })
  },
  /**
   * 获取店铺配置
   * @param {*} params
   */
  getShopConfig(params) {
    return request({
      url: '/system/getShopConfig',
      methods: 'get',
      params
    })
  },
  /**
   * 保存店铺设置
   * @param {*key value} data
   */
  saveShopConfig(data) {
    return request({
      url: '/system/saveShopConfig',
      method: 'post',
      data
    })
  }

}
