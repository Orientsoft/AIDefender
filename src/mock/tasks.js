const { config } = require('./common')
const { api } = config

let tasks = [
    {
        id: '1',
        name: 'dshw-tploader-trainer',
        type: 1,
        input: '125',
        output: '124', 
        script: '/home/voyager/tploader-tranier.py + ',
        status: 'P Waiting +',
        createdAt: '2018-02-7',
        updatedAt: '2018-02-7',
        params: ['ls', 'cd']
    },
    {
        id: '2',
        name: 'dshw-tploader-prophet',
        type: 0,
        input: '124', 
        output: '125', 
        script: '/home/voyager/tploader-tranier.py + ',
        status: 'G Working +',
        createdAt: '2018-02-17',
        updatedAt: '2018-02-27',
        params: ['cat', 'more']
    },
]

module.exports = {
    // 获取所有数据
    [`GET ${api.tasks}`](req, res) {
        if (req.query.type){
            let data = tasks.filter(item => item.type == req.query.type)
            res.status(200).json(data)
        }else {
            res.status(200).json(tasks)
        }
    },
    //增加数据
    [`POST ${api.tasks}`](req, res) {
        let newData = req.body
        newData.id = Math.random().toString(16).substr(2)
        newData.createdAt = '2018-02-11'
        newData.updatedAt = '2018-02-11'
        newData.status = 'P Waiting +'
        tasks.push(newData)
        res.status(200).json(newData)
    },
    //获取指定数据
    [`GET ${api.task}:taskId`](req, res) {
        for (let key in tasks) {
            if (tasks[key].id === req.params.taskId) {
                res.status(200).json(tasks[key])
            }
        }
    },
    //删除指定数据
    [`DELETE ${api.task}:taskId`](req, res) {
        var deleteId = req.params.taskId
        var newArr = tasks.filter((item, index)=>{
            if (item.id != deleteId){
                return item
            }
        })
        tasks = newArr
        res.status(200).json(tasks);
    },
    //更新指定数据
    [`PUT ${api.task}:taskId`](req, res) {
        let newData = req.body
        for (let key in tasks) {
            if (tasks[key].id === req.params.taskId) {
                tasks[key] = newData
                res.status(200).json(tasks[key])
            }
        }
    },
}
