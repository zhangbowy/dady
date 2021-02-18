import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
// import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    pid: 0,
    id: 1,
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      pid: 1,
      id: 10,
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'home' }
    }]
  },

  {
    pid: 0,
    id: 4,
    path: '/management',
    component: Layout,
    alwaysShow: true,
    redirect: '/management/articleCategory',
    meta: { title: '文章管理', icon: 'all' },
    children: [{
      pid: 4,
      id: 13,
      path: 'articleCategory',
      name: 'ArticleCategory',
      component: () => import('@/views/management/articleCategory/index'),
      meta: { title: '文章分类' }
    },
    {
      pid: 4,
      id: 13,
      path: 'draft',
      name: 'Draft',
      component: () => import('@/views/management/draft/index'),
      meta: { title: '草稿箱' }
    },
    {
      pid: 4,
      id: 14,
      path: 'article',
      name: 'Article',
      redirect: '/management/article/list',
      component: () => import('@/views/management/article/index'),
      meta: { title: '文章列表' },
      children: [
        {
          pid: 4,
          id: 14,
          path: 'list',
          name: 'ArticleList',
          hidden: true,
          component: () => import('@/views/management/article/list'),
          meta: { activeMenu: '/management/article' }
        }, {
          pid: 4,
          id: 15,
          path: 'edit:id(\\d+)?',
          name: 'GoodsEdit',
          hidden: true,
          component: () => import('@/views/management/article/edit'),
          meta: { title: '文章编辑', activeMenu: '/management/article' }
        }, {
          pid: 4,
          id: 16,
          path: 'detail:id(\\d+)?',
          name: 'GoodsDetail',
          hidden: true,
          component: () => import('@/views/management/article/detail'),
          meta: { title: '文章详情', activeMenu: '/management/article' }
        }
      ]
    }, {
      pid: 4,
      id: 17,
      path: 'resources',
      name: 'Resources',
      component: () => import('@/views/management/resources'),
      meta: { title: '我的资源', activeMenu: '/management/resources' }
    },
    {
      pid: 4,
      id: 36,
      path: 'import',
      name: 'Import',
      component: () => import('@/views/management/import/index'),
      meta: { title: '文章导入', activeMenu: '/management/import' }
    }]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 重置router
}

export default router
