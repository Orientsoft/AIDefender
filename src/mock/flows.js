const { config } = require('./common')
const { api } = config

let flows = [
    {
        id: '1',
        name: 'aa',
        tasks: ['1', '2'],
        triggers: ['2', '3'],
        createdAt: '2018-02-7',
        updatedAt: '2018-02-7',
    },
    {
        id: '2',
        name: 'bb',
        tasks: ['1', '2'],
        triggers: ['2', '3'],
        createdAt: '2018-02-7',
        updatedAt: '2018-02-7',
    },
    {
        id: '3',
        name: 'cc',
        tasks: ['1', '2'],
        triggers: ['2', '3'],
        createdAt: '2018-02-7',
        updatedAt: '2018-02-7',
    }
]

module.exports = {
    // 获取所有数据
    [`GET ${api.flows}`](req, res) {
        res.status(200).json(flows)
    },
    //增加数据
    [`POST ${api.flows}`](req, res) {
        let newData = req.body
        newData.id = Math.random().toString(16).substr(2)
        newData.createdAt = '2018-02-11'
        newData.updatedAt = '2018-02-11'
        flows.push(newData)
        res.status(200).json(newData)
    },
    //获取指定数据
    [`GET ${api.flow}:flowId`](req, res) {
        for (let key in flows) {
            if (flows[key].id === req.params.flowId) {
                res.status(200).json(flows[key])
            }
        }
    },
    //删除指定数据
    [`DELETE ${api.flow}:flowId`](req, res) {
        var deleteId = req.params.flowId
        var newArr = flows.filter((item, index) => {
            if (item.id != deleteId) {
                return item
            }
        })
        flows = newArr
        res.status(200).json(flows);
    },
    //更新指定数据
    [`PUT ${api.flow}:flowId`](req, res) {
        let newData = req.body
        for (let key in flows) {
            if (flows[key].id === req.params.flowId) {
                flows[key] = newData
                res.status(200).json(flows[key])
            }
        }
    },
}
