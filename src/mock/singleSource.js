const { config } = require('./common')

const { api } = config

let indexs = [
    'index', 'weblogic', 'tploader'
]
let fields = ['endtime', 'ip', 'length']
let data = [
    {
        _id: "123",
        type: 'singlesource',
        structure: [],
        name: 'a',
        index: 'tploader',
        fields: [
            {
                field: 'length',
                label: '长度'
            },
            {
                field: 'endtime',
                label: '结束时间'
            }
        ],
        timestamp: '@timestamp',
        allfields: ['length', 'endtime']
    },
    {
        _id: "456",
        type: 'singlesource',
        structure: [],
        name: 'b',
        index: 'weblogic',
        fields: [
            {
                field: 'length',
                label: '长度'
            },
            {
                field: 'endtime',
                label: '结束时间'
            }
        ],
        timestamp: '@timestamp',
        allfields: ['length', 'endtime']
    }
]

module.exports = {
    [`GET ${api.indexs}`](req, res) {
        res.status(200).json(indexs)
    },
    [`GET ${api.fields}`](req, res) {
        res.status(200).json(fields)
    },
    [`GET ${api.datas}`](req, res) {
        res.status(200).json(data)
    },
    [`POST ${api.datas}`](req, res) {
        const newData = req.body
        data.unshift(newData)
        res.status(200).end()
    },
}
