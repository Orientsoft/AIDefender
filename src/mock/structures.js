const { config } = require('./common')

const { api } = config

const treeData = [{
  name: '银行核心系统',
  level: 0,
  data: [],
  children: [
    {
      name: '应用系统',
      level: 1,
      data: [],
      children: [
        {
          name: '业务日志',
          level: 2,
          hosts: [],
        },
      ],
    }, {
      name: '负载均衡器',
      level: 1,
      data: [],
      children: [
        {
          name: 'Nginx',
          level: 2,
          hosts: [],
        },
        {
          name: 'Apache',
          level: 2,
          hosts: [],
        },
      ],
    },
    {
      name: '中间件',
      level: 1,
      data: [],
      children: [
        {
          name: 'Tuxedo',
          level: 2,
          data: [],
          hosts: [],
        },
        {
          name: 'WebLogic',
          level: 2,
          data: [],
          hosts: [],
        },
        {
          name: 'JBOSS',
          level: 2,
          data: [],
          hosts: [],
        },
        {
          name: 'Tomcat',
          level: 2,
          data: [],
          hosts: [],
        },

      ],
    },
    {
      name: '数据库',
      level: 1,
      data: [],
      children: [
        {
          name: 'Oracle',
          level: 2,
          data: [],
          hosts: [],
        },
        {
          name: 'MySQL',
          level: 2,
          data: [],
          hosts: [],
        },

      ],
    },
    {
      name: '操作系统',
      level: 1,
      data: [],
      children: [
        {
          name: 'AIX',
          level: 2,
          data: [],
          hosts: [],
        },
        {
          name: 'Linux',
          level: 2,
          data: [],
          hosts: [],
        },

      ],
    },
    {
      name: '网络',
      level: 1,
      data: [],
      children: [
        {
          name: 'NPM',
          level: 2,
          data: [],
          hosts: [],
        },
        {
          name: 'SNMP',
          level: 2,
          data: [],
          hosts: [],
        },

      ],
    },
  ],
}]

const metaTreeData = treeData[0]

module.exports = {
  [`GET ${api.structures}`] (req, res) {
    res.status(200).json(treeData)
  },
  [`GET ${api.metaStructure}`] (req, res) {
    res.status(200).json(metaTreeData)
  },
}
