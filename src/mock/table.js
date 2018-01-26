const { config } = require('./common')
const { api } = config

let cols = [
    {
        key: 'timestamp',
        field: 'timestamp', 
        label: '时间戳'
    },
    {
        key: 'index', 
        field: 'index', 
        lable: '数据源'
    },
    {
        key: 'host', 
        field: 'host',
        label: '主机'
    }, 
    {
        key: 'status',
        field: 'status', 
        label: '状态'
    },
    {
        key: 'ServerName', 
        field: 'ServerName',
        label: '主机名'
    }
]

const tableData = [
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
]

const table = {
    cols, 
    tableData
}

module.exports = {
    [`GET ${api.table}`] (req, res) {
      res.json(table)
    },
  }