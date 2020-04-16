
import request from '@/utils/request'

export const DropDownService = {
  // 获取分类下拉
  getCategroiesList(data) {
    return request({
      url: '/Item/index',
      method: 'post',
      data
    })
  }
}
