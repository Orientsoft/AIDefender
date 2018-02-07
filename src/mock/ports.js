const { config } = require('./common')
const { api } = config

let ports = [
    {
        id: '124',
        name: 'nnn',
        type: 1,
        createdAt: '2018-02-7',
        updatedAt: '2018-02-7',
    },
    {
        id: '125',
        name: 'nneeen',
        type: 2,
        createdAt: '2018-02-7',
        updatedAt: '2018-02-7',
    },
]

module.exports = {
    // 获取所有数据
    [`GET ${api.ports}`](req, res) {
        res.status(200).json(ports)
    },
    //增加数据
    [`POST ${api.ports}`](req, res) {
        let newData = req.body
        newData.id = '23kk'
        newData.createdAt = '2018-02-7'
        newData.updatedAt =  '2018-02-7'
        res.status(200).json(newData)
    },
    //获取指定数据
    [`GET ${api.port}:dataId`](req, res) {
       
    },
    //删除指定数据
    [`DELETE ${api.port}:dataId`](req, res) {
    
    },
    //更新指定数据
    [`PUT ${api.port}:dataId`](req, res) {
       
    },
}
