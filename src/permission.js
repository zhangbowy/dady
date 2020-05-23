import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // 从cookie中获取token
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress配置

const whiteList = ['/login', '/404'] // 不重定向白名单

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
      // next()
      // 判断vuex里边是否有权限表
      if (store.getters.permission.length > 0) {
        next()
      } else {
        // 没有请求用户信息，获取权限表
        store.dispatch('user/getInfo').then(res => {
          const permission = res.authority_list
          store.dispatch('GenerateRoutes', permission).then(() => { // 根据roles权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            if (token) {
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
            } else {
              next({ path: store.getters.addRouters[0].path, replace: true }) // hack方法 确保addRoutes已完成
            }
          })
        }).catch((err) => {
          console.log(err)
          store.dispatch('user/logout').then(() => {
            store.dispatch('user/resetToken')
            // Message.error(err || '验证失败，请重新登陆')
            next({ path: '/' })
          })
        })
      }
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
        // next(`/login?redirect=${to.path}`)
        next(`/login`)
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
