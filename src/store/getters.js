const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  skuList: state => state.sku.skuList,
  priceInfo: state => state.sku.priceInfo
}
export default getters
