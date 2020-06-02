import request from '@/utils/request'

export default {
  uploadFont(data) {
    return request({
      url: '/font/uploadFont',
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data
    })
  },
  // 获取字体列表
  fontList(data) {
    return request({
      url: '/font/fontList',
      method: 'post',
      data
    })
  },
  // 删除字体
  deleteFont(data) {
    return request({
      url: '/font/deleteFont',
      method: 'post',
      data
    })
  },
  // 编辑字体
  editFont(data) {
    return request({
      url: '/font/editFont',
      method: 'post',
      data
    })
  }

}
