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
  }
}
