const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  skuList: state => state.sku.skuList,
  priceInfo: state => state.sku.priceInfo,
  adminInfo: state => state.user.adminInfo,
  permission: state => state.user.permission,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters
}
export default getters
