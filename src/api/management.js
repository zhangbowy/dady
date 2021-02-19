import request from '@/utils/request'

export const articleApi = {
  articleList(params) {
    return request({
      url: '/article/articleList',
      method: 'get',
      params
    })
  },
  addArticle(data) {
    return request({
      url: '/article/addArticle',
      method: 'post',
      data
    })
  },
  editArticle(data) {
    return request({
      url: '/article/editArticle',
      method: 'post',
      data
    })
  },
  articleDetail(params) {
    return request({
      url: '/article/getDetail',
      method: 'get',
      params
    })
  },
  publishArticle(data) {
    return request({
      url: '/article/publish',
      method: 'POST',
      data
    })
  },
  delArticle(data) {
    return request({
      url: '/article/delArticle',
      method: 'POST',
      data
    })
  }
}
