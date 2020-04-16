import request from '@/utils/request'

export default {
  uploadImage(data) {
    return request({
      url: '/Item/uploadImage',
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
  getList(data) {
    return request({
      url: '/Item/index',
      method: 'post',
      data
    })
  }
}
// # sourceMappingURL=image.js.map
