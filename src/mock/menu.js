const { config } = require('./common')

const { apiPrefix } = config
let database = [
  {
    id: '1',
    icon: 'dashboard',
    name: '系统拓扑',
    route: '/dashboard',
  },
  {
    id: '2',
    // bpid: '1',
    name: '单数据查询',
    icon: 'to-top',
    route: '/singlequery',
  },
  {
    id: '3',
    // bpid: '1',
    name: '系统查询',
    icon: 'share-alt',
    route: '/systemquery',
  },
  {
    id: '4',
    // bpid: '1',
    name: '系统设置',
    icon: 'tool',
    route: '/settings',
  },
]

module.exports = {

  [`GET ${apiPrefix}/menus`] (req, res) {
    res.status(200).json(database)
  },
}
