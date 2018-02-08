const { config } = require('./common')
const { api } = config

let tasks = [
    {
        id: '1',
        name: 'p_tploader',
        type: 1,
        input: '124',
        ouput: '125', 
        script: '/home/voyager/tploader-tranier.py + ',
        status: 'P Waiting +', 
        createdAt: '2018-02-7',
        updatedAt: '2018-02-7',
    },
    {
        id: '2',
        name: 'p_mq',
        type: 2,
        input: '125',
        ouput: '124', 
        script: '/home/voyager/tploader-tranier.py + ',
        status: 'G Working +', 
        createdAt: '2018-02-17',
        updatedAt: '2018-02-27',
    },
]

module.exports = {
    // 获取所有数据
    [`GET ${api.tasks}`](req, res) {
        res.status(200).json(tasks)
    },
    //增加数据
    [`POST ${api.tasks}`](req, res) {
        let newData = req.body
        newData.id = Number(tasks.length + 1)
        newData.createdAt = new Date().now()
        newData.updatedAt = new Date().now()
        newData.status = 'P Waiting +'
        tasks.push(newData)
        res.status(200).json(newData)
    },
    //获取指定数据
    [`GET ${api.tasks}:taskId`](req, res) {
        for (let key in tasks) {
            if (tasks[key].id === req.params.taskId) {
                res.status(200).json(tasks[key])
            }
        }
    },
    //删除指定数据
    [`DELETE ${api.tasks}:portId`](req, res) {
        var deleteId = req.params.taskId
        // console.log(req.params.taskId)
        var newArr = tasks.filter((item, index)=>{
            if (item.id != deleteId){
                return item
            }
        })
        tasks = newArr
        res.status(200).end()
    },
    //更新指定数据
    [`PUT ${api.tasks}:taskId`](req, res) {
        let newData = req.body
        for (let key in tasks) {
            if (tasks[key].id === req.params.taskId) {
                tasks[key].name = newData.name
                tasks[key].type = newData.type
                res.status(200).json(tasks[key])
            }
        }
    },
}
