const { config } = require('./common')
const { api } = config

let chartConfig = [
   {
       title: '中间件',
       type: 'line', 
       x: {
           filed: 'timestamp',
           label: '时间'
       },
       values: [
           {
               field: 'count', 
               operator: 'avg',
               label: '平均值'
           }
       ]
   },
   {
    title: '数据库',
    type: 'bar', 
    x: {
        filed: 'timestamp',
        label: '时间'
    },
    values: [
        {
            field: 'SrcIp', 
            operator: 'count',
            label: '总数'
        }
    ] 
   }
]

const dataSource = {
    xAxis:['2017-01', '2017-02', '2017-03', '2017-04', '2017-05', '2017-06', '2017-07', '2017-08', '2017-09', '2017-10', '2017-11', '2017-12'], 
    yAxis:[20, 754, 123, 345, 76, 98, 122, 88, 47, 190, 270, 110]
} 


const KPI = {
    chartConfig,
    dataSource
}

module.exports = {
    [`GET ${api.kpi}`] (req, res) {
      res.json(KPI)
    },
  }