import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // 从cookie中获取token
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress配置

const whiteList = ['/login'] // 不重定向白名单

router.beforeEach(async(to, from, next) => {
  // 开始进度条
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 确定用户是否已登录
  const token = getToken()

  if (token) {
    if (to.path === '/login') {
      // 如果已经登录，重定向到首页
      next({ path: '/' })
      NProgress.done()
    } else {
      next()
      // const hasGetUserInfo = store.getters.name
      // if (hasGetUserInfo) {
      //   next()
      // } else {
      //   try {
      //     // 获取用户信息
      //     await store.dispatch('user/getInfo')

      //     next()
      //   } catch (error) {
      //     // 移除token并跳转到登录页重新登录
      //     await store.dispatch('user/resetToken')
      //     Message.error(error || 'Has Error')
      //     next(`/login?redirect=${to.path}`)
      //     NProgress.done()
      //   }
      // }
    }
  } else {
  /* 没有token*/
    if (whiteList.indexOf(to.path) !== -1) {
    // 在免费登录白名单中，直接进入
      next()
    } else {
    // 校验登录状态
      await store.dispatch('user/checkLogin').then(() => {
        next()
      }).catch(() => {
        next(`/login?redirect=${to.path}`)
      })
      // 没有访问权限的其他页将重定向到登录页。
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 进度条结束
  NProgress.done()
})
