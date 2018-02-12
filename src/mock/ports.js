const { config } = require('./common')
const { api } = config

let ports = [
    {
        id: '124',
        name: 'p_tploader',
        type: 1,
        createdAt: '2018-02-7',
        updatedAt: '2018-02-7',
    },
    {
        id: '125',
        name: 'p_mq',
        type: 2,
        createdAt: '2018-02-7',
        updatedAt: '2018-02-7',
    },
    {
        id: '126',
        name: 'p_mongodb',
        type: 2,
        createdAt: '2018-02-7',
        updatedAt: '2018-02-7',
    },
]

module.exports = {
    // 获取所有数据
    [`GET ${api.ports}`](req, res) {
        if (req.params.type) {
            let data = ports.filter(item => item.type === req.params.type)
            res.status(200).json(data)
        } else {
            res.status(200).json(ports)
        }
    },
    //增加数据
    [`POST ${api.ports}`](req, res) {
        let newData = req.body
        let id = Math.random().toString(16).substr(2)
        newData.id = id
        newData.createdAt = '2018-02-7'
        newData.updatedAt = '2018-02-7'
        ports.unshift(newData)
        res.status(200).json(newData)
    },
    //获取指定数据
    [`GET ${api.port}:portId`](req, res) {
        for (let key in ports) {
            if (ports[key].id === req.params.portId) {
                res.status(200).json(ports[key])
            }
        }
    },
    //删除指定数据
    [`DELETE ${api.port}:portId`](req, res) {
        var deleteId = req.params.portId
        // console.log(req.params.portId)
        var newArr = ports.filter((item, index)=>{
            if (item.id != deleteId){
                return item
            }
        })
        ports = newArr
        res.status(200).end()
    },
    //更新指定数据
    [`PUT ${api.port}:portId`](req, res) {
        let newData = req.body
        for (let key in ports) {
            if (ports[key].id === req.params.portId) {
                ports[key].name = newData.name
                ports[key].type = newData.type
                res.status(200).json(ports[key])
            }
        }
    },
}
