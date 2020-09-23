import axios from 'axios'
import qs from 'qs'
import { MessageBox, Message, Notification } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// import router from './../router/index'
import i18n from '../plugins/i18n'
const { messages } = i18n

// 创建axios相应拦截器
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // 跨域请求发送cookie
  timeout: 20000 // 请求超时
})

// 响应拦截器
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // 使每个请求头携带token
      // ['X-Token'] 是header请求头中的key
      // 请根据实际情况修改
      config.headers['adm_sign'] = getToken()
    }
    if (config.method === 'post') { // 支持2种方法，默认使用Form Data
      // 如果useRequestBody=false, 默认支持Form Data
      // SpringMVC Controller 中不需要使用@RequestBody，默认使用@RequestParam
      if (!config.headers['Content-Type']) {
        config.data = qs.stringify(config.data)
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    } else if (config.method === 'get') {
      const newParams = {}
      for (const key in config.params) {
        // newParams[key] = encodeURIComponent(config.params[key])
        newParams[key] = config.params[key]
      }
      config.params = newParams
      config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    }
    return config
  },
  error => {
    // 请求出错
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 翻译
function translate(msg) {
  const lang = i18n.locale
  if (Array.isArray(msg)) {
    const [key, params] = msg
    const reg = /{\s{0,1}\w+\s{0,1}}/g
    let value = messages[lang][key] || ''
    value = value.replace(reg, val => {
      const param = val.replace(/[{|}]/g, '')
      return translate(params[param]) || params[param] || ''
    })
    return value || key
  } else if (typeof msg === 'string') {
    return messages[lang][msg] || msg
  } else {
    return msg
  }
}

// 响应拦截器
service.interceptors.response.use(
  /**
    *如果您想要获取诸如头或状态之类的http信息
    *请返回response=>response
  */
  /**
    *通过自定义代码确定请求状态
    *这里只是一个例子
    *您还可以通过HTTP状态代码判断状态
  */
  response => {
    const res = response.data
    // const lang = store.getters.lang
    // code为1即请求成功.
    if (res.code !== 0) {
      if (res.code === 402) {
        // 去重新登录
        MessageBox.confirm(translate('您未登录或登录失效，请重新登录！'), translate('确认退出'), {
          confirmButtonText: translate('重新登录'),
          cancelButtonText: translate('取消'),
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
          // router.push({ path: '/login' })
        })
      } else if (res.code === 401) {
        Notification({
          title: translate('系统提示'),
          duration: 5 * 1000,
          message: translate(res.msg),
          type: 'warning'
        })
      } else {
        Message({
          message: translate(res.msg) || `${translate('请求异常')}：${res.code}`,
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject(new Error(translate(res.msg) || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // debug
    Message({
      message: translate(error.msg) || translate('请求异常'),
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
