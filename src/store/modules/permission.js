import { constantRoutes } from '@/router'

const permission = {
  state: {
    routers: constantRoutes,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      // console.log(routers);
      state.addRouters = routers
      state.routers = constantRoutes.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise((resolve, reject) => {
        const accessedRouters = data
        // 一级
        accessedRouters.map(function(item) {
          const item_component = item.component
          item.component = () => import(`@/views/${item_component}`)
          if (item.children) {
            // 二级
            item.children.map(function(child) {
              const child_component = child.component
              child.component = () => import(`@/views/${child_component}`)
              // 三级
              if (child.children) {
                child.children.map(function(san) {
                  const san_component = san.component
                  san.component = () => import(`@/views/${san_component}`)
                })
              }
            })
          }
        })
        accessedRouters.push({ path: '*', redirect: '/404', hidden: true })
        // console.log(accessedRouters)
        commit('SET_ROUTERS', accessedRouters)
        //  reject();
        resolve()
      })
    }
  }

}

export default permission
