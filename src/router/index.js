import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

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
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'home' }
    }]
  },
  {
    path: '/commodity',
    component: Layout,
    alwaysShow: true,
    redirect: '/commodity/goodsCategory',
    meta: { title: '商品', icon: 'goods' },
    children: [{
      path: 'goodsCategory',
      name: 'GoodsCategory',
      component: () => import('@/views/commodity/goodsCategory/index'),
      meta: { title: '商品分类' }
    },
    {
      path: 'goods',
      name: 'Goods',
      component: () => import('@/views/commodity/goods/index'),
      alwaysShow: false,
      redirect: '/commodity/goods/list',
      meta: { title: '商品管理', noCache: false },
      children: [{
        path: 'list',
        name: 'GoodsList',
        hidden: true,
        component: () => import('@/views/commodity/goods/list/index'),
        meta: { title: '商品列表', activeMenu: '/commodity/goods' }
      }, {
        path: 'detail/:id(\\d+)?',
        name: 'GoodsDetail',
        hidden: true,
        component: () => import('@/views/commodity/goods/detail/index'),
        meta: { title: '商品详情', activeMenu: '/commodity/goods' }
      }, {
        path: 'edit/:id(\\d+)?',
        name: 'EditGoods',
        hidden: true,
        component: () => import('@/views/commodity/goods/edit/index'),
        meta: { title: '编辑/新增商品', activeMenu: '/commodity/goods' }
      }]
    }]
  },
  {
    path: '/manage',
    name: 'Manage',
    component: Layout,
    redirect: '/manage/admin',
    meta: { title: '权限管理', icon: 'manage' },
    children: [
      {
        path: 'admin',
        name: 'Admin',
        component: () => import('@/views/manage/admin/index'),
        meta: { title: '管理员列表' }
      },
      {
        path: 'roles',
        name: 'Roles',
        component: () => import('@/views/manage/roles/index'),
        meta: { title: '角色列表' }
      },
      {
        path: 'rules',
        name: 'Rules',
        component: () => import('@/views/manage/rules/index'),
        meta: { title: '权限规则' }
      }
    ]
  },
  // 404 页面必须在底部 !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 重置router
}

export default router
