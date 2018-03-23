import React from 'react'
import PropTypes from 'prop-types'
import echarts from 'echarts'
import moment from 'moment'
import get from 'lodash/get'

const types = [{
  level: 'NORMAL',
  name: '正常',
  color: '#75d874',
}, {
  level: 'ERROR',
  name: '错误',
  color: '#bd6d6c',
}, {
  level: 'WARNING',
  name: '告警',
  color: '#e0bc78',
}]

const alerts = [{
  index: 'alter_mobile_count',
}, {
  index: 'alter_mobile_usetime',
}]

function buildData (config) {
  const chartData = []
  const { alertResult } = config

  alertResult.forEach((result, index) => {
    const buckets = get(result, `aggregations.${alerts[index].index}.buckets`, [])
    buckets.forEach((bucket) => {
      const levels = get(bucket, 'level.buckets', [])
      levels.forEach((level) => {
        const type = types.find(t => level.key === t.level)
        if (type) {
          chartData.push({
            name: type.name,
            value: [
              index,
              bucket.key,
              bucket.key + 5000000,
              level.doc_count,
            ],
            itemStyle: {
              normal: {
                color: type.color,
              },
            },
          })
        }
      })
    })
  })

  return chartData
}

function renderItem (params, api) {
  const categoryIndex = api.value(0)
  const start = api.coord([api.value(1), categoryIndex])
  const end = api.coord([api.value(2), categoryIndex])
  const height = api.size([0, 1])[1] * 0.5

  return {
    type: 'rect',
    shape: echarts.graphic.clipRectByRect({
      x: start[0],
      y: start[1] - height / 2,
      width: end[0] - start[0],
      height,
    }, {
      x: params.coordSys.x,
      y: params.coordSys.y,
      width: params.coordSys.width,
      height: params.coordSys.height,
    }),
    style: api.style(),
  }
}

const defaultOption = {
  tooltip: {
    formatter: item => `${item.data.name}: ${item.data.value[3]}`,
  },
  xAxis: {
    scale: true,
    axisLabel: {
      formatter: value => `${moment(value).format('YYYY-MM-DD HH:mm')}`,
    },
  },
  yAxis: {
    data: [],
  },
  grid: {
    top: 0,
    bottom: 20,
  },
  series: [{
    type: 'custom',
    renderItem,
    itemStyle: {
      normal: {
        opacity: 0.8,
      },
    },
    encode: {
      x: [1],
      y: 0,
    },
    data: [],
  }],
}

export default class Index extends React.Component {
  componentWillMount () {
    this.queryResult()
  }

  onChartClick = (e) => {
    const { value } = e
    const { dispatch } = this.props

    dispatch({
      type: 'systemquery/queryAlertData',
      payload: {
        timeRange: [moment(value[1]), moment(value[2])],
      },
    })
  }

  initChart (el) {
    const { config } = this.props

    if (el) {
      const chart = echarts.init(el)
      chart.on('click', this.onChartClick)
      defaultOption.yAxis.data = config.kpiConfig.map(kpi => kpi.name)
      defaultOption.series[0].data = buildData(config)
      chart.setOption(defaultOption)
      this.chart = chart
    } else if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
  }

  queryResult () {
    const { dispatch, timeRange } = this.props

    dispatch({
      type: 'systemquery/queryAlert',
      payload: {
        alerts,
        timeRange,
      },
    })
  }

  componentWillReceiveProps (nextProps) {
    const [startTs, endTs] = nextProps.timeRange
    const { timeRange } = this.props

    if (!(startTs.isSame(timeRange[0]) && endTs.isSame(timeRange[1]))) {
      timeRange[0] = startTs
      timeRange[1] = endTs
      this.queryResult()
      const d = buildData(nextProps.config)
      defaultOption.series[0].data = d
      if (this.chart) {
        this.chart.setOption(defaultOption)
      }
    }
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    const { config: { kpiConfig } } = this.props

    return (
      <div ref={el => this.initChart(el)} style={{ height: kpiConfig.length * 40, width: '100%' }} />
    )
  }
}

Index.propTypes = {
  dispatch: PropTypes.func.isRequired,
  timeRange: PropTypes.array.isRequired,
  config: PropTypes.object.isRequired,
}
