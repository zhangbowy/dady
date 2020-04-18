import request from '@/utils/request'

export default {
  uploadImage(data) {
    return request({
      url: '/file/uploadOss',
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data
    })
  },
  // 提取图片
  drawImage(data) {
    return request({
      url: '/Item/drawImage',
      method: 'post',
      data
    })
  },
  /**
   * 获取图片列表
   * @param {*gallery_group_id} data
   */
  getList(data) {
    return request({
      url: '/gallery/index',
      method: 'post',
      data
    })
  },
  // 添加图片
  addImage(data) {
    return request({
      url: '/gallery/uploadImg',
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data
    })
  },
  // 删除图片
  deleteImage(data) {
    return request({
      url: '/gallery/delete',
      method: 'post',
      data
    })
  },
  /**
   *
   * @param {*id img_name} data
   */
  editImageName(data) {
    return request({
      url: '/gallery/edit',
      method: 'post',
      data
    })
  },
  /**
  * @param {id gallery_group_id}
  */
  setImgGroup(data) {
    return request({
      url: '/gallery/setGroup',
      method: 'post',
      data
    })
  }
}
