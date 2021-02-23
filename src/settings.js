const path = require('path')
module.exports = {

  title: '文章发布后台',

  /**
   * @type {boolean} true | false
   * @description 是否固定头部
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description 是否显示侧边栏logo
   */
  sidebarLogo: true,
  lang: 'zh',
  langsType: {
    'cn': {
      name: 'zh',
      path: path.resolve(__dirname, '../src/lang/zh.json')
    },
    'en': {
      name: 'en',
      path: path.resolve(__dirname, '../src/lang/en.json'),
      type: 'ZH_CN2EN'
    }
  }
}
