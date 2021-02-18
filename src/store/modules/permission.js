import { constantRoutes } from '@/router' // 静态路由
import { asyncRouter } from '@/router/asyncRouter' // 动态路由

const permission = {
  state: {
    routers: constantRoutes,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRoutes.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise((resolve, reject) => {
        const userPermission = data
        const accessedRouters = []
        // 根据角色权限，动态生成新路由
        // 返回一级
        asyncRouter.forEach(item => {
          if (userPermission.indexOf(item.id) > -1) {
            const route = Object.assign({}, item)
            route.children = [...item.children]
            accessedRouters.push(route)
          }
        })
        // 返回二级路由
        accessedRouters.map((item) => {
          if (item.children) {
            item.children = item.children.filter(child => {
              return userPermission.indexOf(child.id) > -1
            })
            item.redirect = item.children[0] ? `${item.path === '/' ? '' : item.path}/${item.children[0].path}` : ''
          }
        })
        // accessedRouters = asyncRouter
        accessedRouters.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROUTERS', accessedRouters)
        //  reject();
        resolve()
      })
    }
  }

}

export default permission
