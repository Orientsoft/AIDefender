const { config } = require('./common')

const { api } = config

let data = [
    {
        type: 'metrics',
        structure: [],
        name: 'ddd',
        source: 'a',
        filters: [{
            field: "length",      
            operator :">",    
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
                operator :  'avg',   //count,sum,avg,max,min.....
                label: '平均值'  //图例名称
               }
          ]
        },
      }
]

module.exports = {
    [`GET ${api.datas}`](req, res) {
        res.status(200).json(data)
    },
}
