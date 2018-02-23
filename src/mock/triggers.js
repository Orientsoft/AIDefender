const { config } = require('./common')
const { api } = config

let triggers = []

module.exports = {
  // 获取所有数据
  // [`GET ${api.flows}`](req, res) {
  //     res.status(200).json(flows)
  // },
  // 增加数据
  [`POST ${api.triggers}`](req, res) {
    let newData = req.body
    newData.id = Math.random().toString(16).substr(2)
    newData.createdAt = '2018-02-11'
    newData.updatedAt = '2018-02-11'
    triggers.push(newData)
    res.status(200).json(newData)
  },
  //获取指定数据
  // [`GET ${api.flow}:flowId`](req, res) {
  //   for (let key in flows) {
  //     if (flows[key].id === req.params.flowId) {
  //       res.status(200).json(flows[key])
  //     }
  //   }
  // },
  // 删除指定数据
  [`DELETE ${api.trigger}:triggerId`](req, res) {
    let deleteId = req.params.triggerId
    let newArr = triggers.filter(item => {
      if (item.id !== deleteId) {
        return item
      }
    })
    triggers = newArr
    res.status(200).end()
  },
  //更新指定数据
  // [`PUT ${api.flow}:flowId`](req, res) {
  //   let newData = req.body
  //   for (let key in flows) {
  //     if (flows[key].id === req.params.flowId) {
  //       flows[key] = newData
  //       res.status(200).json(flows[key])
  //     }
  //   }
  // },
}
