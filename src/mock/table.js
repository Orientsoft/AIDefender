const { config } = require('./common')
const { api } = config

let columns = [
    {
        key: 'timestamp',
        dataIndex: 'timestamp', 
        title: '时间戳'
    },
    {
        key: 'index', 
        dataIndex: 'index', 
        title: '数据源'
    },
    {
        key: 'host', 
        dataIndex: 'host',
        title: '主机'
    }, 
    {
        key: 'status',
        dataIndex: 'status', 
        title: '状态'
    },
    {
        key: 'ServerName', 
        dataIndex: 'ServerName',
        title: '主机名'
    }
]

const dataSource = [
    [
        {key: 1, timestamp: '2018-01-01', index: 'tploader', host: '192.168.0.1', status: 'ACTIVE', ServerName: 'vayager'},
        {key: 2, timestamp: '2018-01-02', index: 'oracle', host: '192.168.0.20', status:'SLEEP', ServerName: 'oracle'},
        {key: 3, timestamp: '2018-01-03', index: 'tploader', host: '192.168.0.3', status: 'STOP', ServerName: 'jvm'}, 
        {key: 4, timestamp: '2018-01-04', index: 'tploader', host: '192.168.0.4', status: 'ACTIVE', ServerName: 'vayager'},
        {key: 5, timestamp: '2018-01-05', index: 'oracle', host: '192.168.0.21', status:'SLEEP', ServerName: 'oracle'},
        {key: 6, timestamp: '2018-01-06', index: 'tploader', host: '192.168.0.33', status: 'STOP', ServerName: 'jvm'}, 
        {key: 7, timestamp: '2018-01-07', index: 'tploader', host: '192.168.0.13', status: 'ACTIVE', ServerName: 'vayager'},
        {key: 8, timestamp: '2018-01-08', index: 'oracle', host: '192.168.0.28', status:'SLEEP', ServerName: 'oracle'},
        {key: 9, timestamp: '2018-01-09', index: 'tploader', host: '192.168.0.32', status: 'STOP', ServerName: 'jvm'}, 
        {key: 10, timestamp: '2018-01-10', index: 'tploader', host: '192.168.0.11', status: 'ACTIVE', ServerName: 'vayager'},
        {key: 11, timestamp: '2018-01-11', index: 'oracle', host: '192.168.0.27', status:'SLEEP', ServerName: 'oracle'},
        {key: 12, timestamp: '2018-01-12', index: 'tploader', host: '192.168.0.32', status: 'STOP', ServerName: 'jvm'}, 
        {key: 13, timestamp: '2018-01-01', index: 'tploader', host: '192.168.0.1', status: 'ACTIVE', ServerName: 'vayager'},
        {key: 14, timestamp: '2018-01-02', index: 'oracle', host: '192.168.0.20', status:'SLEEP', ServerName: 'oracle'},
        {key: 15, timestamp: '2018-01-03', index: 'tploader', host: '192.168.0.3', status: 'STOP', ServerName: 'jvm'}, 
        {key: 16, timestamp: '2018-01-04', index: 'tploader', host: '192.168.0.4', status: 'ACTIVE', ServerName: 'vayager'},
        {key: 17, timestamp: '2018-01-05', index: 'oracle', host: '192.168.0.21', status:'SLEEP', ServerName: 'oracle'},
        {key: 18, timestamp: '2018-01-06', index: 'tploader', host: '192.168.0.33', status: 'STOP', ServerName: 'jvm'}, 
        {key: 19, timestamp: '2018-01-07', index: 'tploader', host: '192.168.0.13', status: 'ACTIVE', ServerName: 'vayager'},
        {key: 20, timestamp: '2018-01-08', index: 'oracle', host: '192.168.0.28', status:'SLEEP', ServerName: 'oracle'},
        {key: 21, timestamp: '2018-01-09', index: 'tploader', host: '192.168.0.32', status: 'STOP', ServerName: 'jvm'}, 
    ],
    [
        {key: 22, timestamp: '2018-01-10', index: 'tploader', host: '192.168.0.11', status: 'ACTIVE', ServerName: 'vayager'},
        {key: 23, timestamp: '2018-01-11', index: 'oracle', host: '192.168.0.27', status:'SLEEP', ServerName: 'oracle'},
        {key: 24, timestamp: '2018-01-12', index: 'tploader', host: '192.168.0.32', status: 'STOP', ServerName: 'jvm'},
        {key: 25, timestamp: '2018-01-01', index: 'tploader', host: '192.168.0.1', status: 'ACTIVE', ServerName: 'vayager'},
        {key: 26, timestamp: '2018-01-02', index: 'oracle', host: '192.168.0.20', status:'SLEEP', ServerName: 'oracle'},
        {key: 27, timestamp: '2018-01-03', index: 'tploader', host: '192.168.0.3', status: 'STOP', ServerName: 'jvm'}, 
        {key: 28, timestamp: '2018-01-04', index: 'tploader', host: '192.168.0.4', status: 'ACTIVE', ServerName: 'vayager'},
        {key: 29, timestamp: '2018-01-05', index: 'oracle', host: '192.168.0.21', status:'SLEEP', ServerName: 'oracle'},
        {key: 30, timestamp: '2018-01-06', index: 'tploader', host: '192.168.0.33', status: 'STOP', ServerName: 'jvm'}, 
        {key: 31, timestamp: '2018-01-07', index: 'tploader', host: '192.168.0.13', status: 'ACTIVE', ServerName: 'vayager'},
        {key: 32, timestamp: '2018-01-08', index: 'oracle', host: '192.168.0.28', status:'SLEEP', ServerName: 'oracle'},
        {key: 33, timestamp: '2018-01-09', index: 'tploader', host: '192.168.0.32', status: 'STOP', ServerName: 'jvm'}, 
        {key: 34, timestamp: '2018-01-10', index: 'tploader', host: '192.168.0.11', status: 'ACTIVE', ServerName: 'vayager'},
        {key: 35, timestamp: '2018-01-10', index: 'tploader', host: '192.168.0.11', status: 'ACTIVE', ServerName: 'vayager'},
        {key: 36, timestamp: '2018-01-11', index: 'oracle', host: '192.168.0.27', status:'SLEEP', ServerName: 'oracle'},
        {key: 37, timestamp: '2018-01-12', index: 'tploader', host: '192.168.0.32', status: 'STOP', ServerName: 'jvm'},
        {key: 38, timestamp: '2018-01-01', index: 'tploader', host: '192.168.0.1', status: 'ACTIVE', ServerName: 'vayager'},
        {key: 39, timestamp: '2018-01-02', index: 'oracle', host: '192.168.0.20', status:'SLEEP', ServerName: 'oracle'},
        {key: 40, timestamp: '2018-01-03', index: 'tploader', host: '192.168.0.3', status: 'STOP', ServerName: 'jvm'}, 
        {key: 41, timestamp: '2018-01-04', index: 'tploader', host: '192.168.0.4', status: 'ACTIVE', ServerName: 'vayager'},
        {key: 42, timestamp: '2018-01-05', index: 'tploader', host: '192.168.0.5', status: 'SLEEP', ServerName: 'vayager'}
    ]
    
]


module.exports = {
    [`POST ${api.query}`] (req, res) {
      console.log(req.body)

      let table = {
          columns, 
          dataSource: dataSource[0]
      }
      res.json(table)
    },
  }