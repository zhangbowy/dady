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
    path: '/shopManage',
    component: Layout,
    alwaysShow: true,
    redirect: '/shopManage/shopList',
    meta: { title: '店铺管理', icon: 'shop' },
    children: [{
      path: 'shopList',
      name: 'ShopList',
      component: () => import('@/views/shopManage/shop/list'),
      alwaysShow: false,
      meta: { title: '店铺列表', noCache: false }
    }]
  },
  {
    path: '/member',
    component: Layout,
    alwaysShow: true,
    redirect: '/member/memberList',
    meta: { title: '会员管理', icon: 'member' },
    children: [{
      path: 'memberList',
      name: 'MemberList',
      component: () => import('@/views/memberCenter/member/list'),
      alwaysShow: false,
      meta: { title: '会员列表', noCache: false }
    }]
  },
  {
    path: '/commodity',
    component: Layout,
    alwaysShow: true,
    redirect: '/commodity/goodsCategory',
    meta: { title: '商品管理', icon: 'goods' },
    children: [{
      path: 'goodsCategory',
      name: 'GoodsCategory',
      component: () => import('@/views/commodity/goodsCategory/index'),
      meta: { title: '商品分类' }
    },
    {
      path: 'goodsList',
      name: 'GoodsList',
      component: () => import('@/views/commodity/goods/list'),
      meta: { title: '商品列表', activeMenu: '/commodity/goodsList' }
    }, {
      path: 'goodsEdit:id(\\d+)?',
      name: 'GoodsEdit',
      hidden: true,
      component: () => import('@/views/commodity/goods/edit'),
      meta: { title: '商品编辑', activeMenu: '/commodity/goodsList' }
    }, {
      path: 'goodsDetail:id(\\d+)?',
      name: 'GoodsDetail',
      hidden: true,
      component: () => import('@/views/commodity/goods/detail'),
      meta: { title: '商品详情', activeMenu: '/commodity/goodsList' }
    }, {
      path: 'resources',
      name: 'Resources',
      component: () => import('@/views/commodity/resources'),
      meta: { title: '我的资源', activeMenu: '/commodity/resources' }
    }]
  },
  {
    path: '/orderManage',
    component: Layout,
    alwaysShow: true,
    redirect: '/orderManage/orderList',
    meta: { title: '订单管理', icon: 'order' },
    children: [{
      path: 'orderList',
      name: 'OrderList',
      component: () => import('@/views/orderManage/order/list'),
      meta: { title: '订单列表' }
    },
    {
      path: 'orderDetail:order_no(\\d+)?',
      name: 'OrderDetail',
      hidden: true,
      component: () => import('@/views/orderManage/order/detail'),
      meta: { title: '订单详情' }
    }]
  },
  {
    path: '/designerManage',
    component: Layout,
    alwaysShow: true,
    redirect: '/designerManage/designerTeam',
    meta: { title: '设计师管理', icon: 'designer' },
    children: [{
      path: 'designerTeam',
      name: 'DesignerTeam',
      component: () => import('@/views/designer/designerTeam/list'),
      meta: { title: '团队列表' }
    }, {
      path: 'designerList',
      name: 'DesignerList',
      component: () => import('@/views/designer/designerList/list'),
      meta: { title: '设计师列表' }
    }]
  },
  {
    path: '/machineManage',
    component: Layout,
    alwaysShow: true,
    redirect: '/machineManage/machineList',
    meta: { title: '设备管理', icon: 'machine' },
    children: [{
      path: 'machineList',
      name: 'MachineList',
      component: () => import('@/views/machineManage/machine/list'),
      meta: { title: '设备列表' }
    }]
  },
  {
    path: '/fontLibrary',
    component: Layout,
    alwaysShow: true,
    redirect: '/fontLibrary/list',
    meta: { title: '字体库', icon: 'fontLib' },
    children: [{
      path: 'list',
      name: 'FontList',
      component: () => import('@/views/fontLibrary/list/index'),
      meta: { title: '字体列表' }
    }]
  },
  {
    path: '/system',
    component: Layout,
    alwaysShow: true,
    redirect: '/system/logisticTemplate',
    meta: { title: '系统设置', icon: 'system' },
    children: [{
      path: 'logisticTemplate',
      name: 'LogisticTemplate',
      component: () => import('@/views/systemSetup/logisticTemplate/list'),
      meta: { title: '物流模板设置' }
    },
    {
      path: 'logisticTempEdit:id(\\d+)?',
      name: 'LogisticTempEdit',
      hidden: true,
      component: () => import('@/views/systemSetup/logisticTemplate/edit'),
      meta: { title: '物流模板编辑' }
    },
    {
      path: 'embroidTemplate',
      name: 'EmbroidTemplate',
      component: () => import('@/views/systemSetup/embroidTemplate/index'),
      meta: { title: '刺绣模板设置' }
    }, {
      path: 'adsense',
      name: 'Adsense',
      component: () => import('@/views/systemSetup/adsense/index'),
      meta: { title: '广告位设置' }
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
        component: () => import('@/views/manage/admin/list'),
        meta: { title: '管理员列表' }
      },
      {
        path: 'roles',
        name: 'Roles',
        component: () => import('@/views/manage/roles/list'),
        meta: { title: '角色列表' }
      },
      {
        path: 'rolesEdit:id(\\d+)?',
        name: 'RolesEdit',
        hidden: true,
        component: () => import('@/views/manage/roles/edit'),
        meta: { title: '角色编辑', activeMenu: '/manage/roles' }
      },
      {
        path: 'rules',
        name: 'Rules',
        component: () => import('@/views/manage/rules/list'),
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
