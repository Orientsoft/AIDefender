const { config } = require('./common')
const { api } = config

let indexs = ['index', 'weblogic', 'tploader']
let fields = [
    {
        source: "index",
        fields: ['endtime', 'ip', 'length']
    },
    {
        source: "weblogic",
        fields: ['endtime', 'starttime', 'length']
    },
    {
        source: "tploader",
        fields: ['endtime', 'duration', 'length']
    }
]
let singleSourcedata = [
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

let metricdata = [
    {
        _id: "789",
        type: 'metrics',
        structure: [],
        name: 'ddd',
        source: 'a',
        filters: [{
            field: "length",
            operator: ">",
            value: 11
        }],
        chart: {
            title: 'sss',
            type: 'line',
            x: {
                field: '@timestamp',
                label: '时间'
            },
            values: [
                {
                    field: "length",       // 在数据源配置fields.field
                    operator: 'avg',   //count,sum,avg,max,min.....
                    label: '平均值'  //图例名称
                }
            ]
        },
    }
]

module.exports = {
    //  获取index
    [`GET ${api.indexs}`](req, res) {
        res.status(200).json(indexs)
    },
    // 获取fields
    [`GET ${api.fields}`](req, res) {
        let source = req.query.source
        let returndata = fields.filter((item) => {
            return item.source == source
        })
        res.status(200).json(returndata[0].fields)
    },
    //获取所有数据
    [`GET ${api.datas}`](req, res) {
        if (req.query.type == 'singleSource') {
            res.status(200).json(singleSourcedata)
        } else if (req.query.type == 'metrics') {
            res.status(200).json(metricdata)
        }
    },
    //增加数据
    [`POST ${api.datas}`](req, res) {
        let newData = req.body
        let id = Math.random().toString(16).substr(2)
        newData['_id'] = id
        if (newData.type == "singleSource") {
            singleSourcedata.unshift(newData)
            res.status(200).end()
        } else if (newData.type == "metrics") {
            metricdata.unshift(newData)
            res.status(200).end()
        }
    },
    //获取指定数据
    [`GET ${api.data}:dataId`](req, res) {
        const id = req.params.dataId
        console.log('id', id)
        const data1 = singleSourcedata.filter((item) => {
            return item._id == id
        })
        const data2 = metricdata.filter((item) => {
            return item._id == id
        })
        if (data1) {
            res.status(200).json(data1[0])
        } else if (data2) {
            res.status(200).json(data2[0])
        } else {
            res.status(404).json("notfound")
        }
    },
    //删除指定数据
    [`DELETE ${api.data}:dataId`](req, res) {
        const id = req.params.dataId
        let newdata1 = []
        let newdata2 = []
        for (let key in singleSourcedata) {
            if (singleSourcedata[key]._id == id) {
                newdata1 = singleSourcedata.filter((item) => {
                    return item._id != id
                })
                singleSourcedata = newdata1
            }
        }
        for (let key in metricdata) {
            if (metricdata[key]._id == id) {
                newdata2 = metricdata.filter((item) => {
                    return item._id != id
                })
                metricdata = newdata2
            }
        }
        res.status(200).end()
    },
    //更新指定数据
    [`PUT ${api.data}:dataId`](req, res) {
        const data = req.body
        let id = data._id
        let newdata1 = []
        let newdata2 = []
        for (let key in singleSourcedata) {
            if(singleSourcedata[key]._id == id){
                singleSourcedata[key] = data
            }
        }    
        for(let key in metricdata){
            if(metricdata[key]._id == id){
                metricdata[key] = data
            }
        }
        res.status(200).end()
    },
}
