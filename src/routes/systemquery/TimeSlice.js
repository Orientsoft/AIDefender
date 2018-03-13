import React from 'react'
import PropTypes from 'prop-types'
import echarts from 'echarts'
import moment from 'moment'
import cloneDeep from 'lodash/cloneDeep'

let cdata = [[0, 0, 5], [0, 1, 1], [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], [0, 9, 0], [0, 10, 0], [0, 11, 2], [0, 12, 4], [0, 13, 1], [0, 14, 1], [0, 15, 3], [0, 16, 4], [0, 17, 6], [0, 18, 4], [0, 19, 4], [0, 20, 3], [0, 21, 3], [0, 22, 2], [0, 23, 5], [1, 0, 7], [1, 1, 0], [1, 2, 0], [1, 3, 0], [1, 4, 0], [1, 5, 0], [1, 6, 0], [1, 7, 0], [1, 8, 0], [1, 9, 0], [1, 10, 5], [1, 11, 2], [1, 12, 2], [1, 13, 6], [1, 14, 9], [1, 15, 11], [1, 16, 6], [1, 17, 7], [1, 18, 8], [1, 19, 12], [1, 20, 5], [1, 21, 5], [1, 22, 7], [1, 23, 2], [2, 0, 1], [2, 1, 1], [2, 2, 0], [2, 3, 0], [2, 4, 0], [2, 5, 0], [2, 6, 0], [2, 7, 0], [2, 8, 0], [2, 9, 0], [2, 10, 3], [2, 11, 2], [2, 12, 1], [2, 13, 9], [2, 14, 8], [2, 15, 10], [2, 16, 6], [2, 17, 5], [2, 18, 5], [2, 19, 5], [2, 20, 7], [2, 21, 4], [2, 22, 2], [2, 23, 4], [3, 0, 7], [3, 1, 3], [3, 2, 0], [3, 3, 0], [3, 4, 0], [3, 5, 0], [3, 6, 0], [3, 7, 0], [3, 8, 1], [3, 9, 0], [3, 10, 5], [3, 11, 4], [3, 12, 7], [3, 13, 14], [3, 14, 13], [3, 15, 12], [3, 16, 9], [3, 17, 5], [3, 18, 5], [3, 19, 10], [3, 20, 6], [3, 21, 4], [3, 22, 4], [3, 23, 1], [4, 0, 1], [4, 1, 3], [4, 2, 0], [4, 3, 0], [4, 4, 0], [4, 5, 1], [4, 6, 0], [4, 7, 0], [4, 8, 0], [4, 9, 2], [4, 10, 4], [4, 11, 4], [4, 12, 2], [4, 13, 4], [4, 14, 4], [4, 15, 14], [4, 16, 12], [4, 17, 1], [4, 18, 8], [4, 19, 5], [4, 20, 3], [4, 21, 7], [4, 22, 3], [4, 23, 0], [5, 0, 2], [5, 1, 1], [5, 2, 0], [5, 3, 3], [5, 4, 0], [5, 5, 0], [5, 6, 0], [5, 7, 0], [5, 8, 2], [5, 9, 0], [5, 10, 4], [5, 11, 1], [5, 12, 5], [5, 13, 10], [5, 14, 5], [5, 15, 7], [5, 16, 11], [5, 17, 6], [5, 18, 0], [5, 19, 5], [5, 20, 3], [5, 21, 4], [5, 22, 2], [5, 23, 0], [6, 0, 1], [6, 1, 0], [6, 2, 0], [6, 3, 0], [6, 4, 0], [6, 5, 0], [6, 6, 0], [6, 7, 0], [6, 8, 0], [6, 9, 0], [6, 10, 1], [6, 11, 0], [6, 12, 2], [6, 13, 1], [6, 14, 3], [6, 15, 4], [6, 16, 0], [6, 17, 0], [6, 18, 0], [6, 19, 0], [6, 20, 1], [6, 21, 2], [6, 22, 2], [6, 23, 6]];

cdata = cdata.map(item => [item[1], item[0], item[2] || '-'])

const option = {
  tooltip: {
    show: false,
  },
  animation: false,
  grid: {
    height: '60%',
    y: '0%',
  },
  xAxis: {
    type: 'category',
    data: [],
    splitArea: {
      show: true,
    },
  },
  yAxis: {
    type: 'category',
    data: [],
    splitArea: {
      show: true,
    },
  },
  visualMap: {
    min: 0,
    max: 10,
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    bottom: '15%',
    show: false,
  },
  series: [{
    name: '告警',
    type: 'heatmap',
    data: [],
    label: {
      normal: {
        show: true,
      },
    },
    itemStyle: {
      emphasis: {
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
      },
    },
  }],
}

// default height for chart
const height = 30

export default class Index extends React.Component {
  state = {
    chartHeight: height,
  }
  query = {}

  initChart (el) {
    const { defaultTimeRange, config } = this.props
    const from = defaultTimeRange[0]
    const to = defaultTimeRange[1]
    const days = []

    if (el) {
      const _option = cloneDeep(option)

      for (let start = from.clone(); start.isBefore(to); start = start.add(1, 'days')) {
        days.push(start.clone())
      }
      _option.xAxis.data = days.map(d => d.format('YYYY-MM-DD'))
      _option.yAxis.data = config.kpiConfig.map(q => q.name)

      _option.series[0].data = cdata.filter(c => c[0] < days.length)
      this.chart = echarts.init(el)
      this.chart.setOption(_option)
      this.chart.on('click', ({ data }) => {
        const x = data[0]
        const _from = days[x]
        const _to = days[x + 1]
        this.query.timeRange = [_from, _to]
        this.query.kpi = config.kpiConfig[data[1]]

        const xAxisData = []
        for (let i = _from.clone(); i.isBefore(_to); i = i.add(1, 'hour')) {
          xAxisData.push(i.format('HH:mm:ss'))
        }
        this.hourChart.setOption({
          xAxis: {
            data: xAxisData,
          },
          yAxis: {
            data: [this.query.kpi.name],
          },
          series: {
            data: cdata,
          },
        })
      })
    } else {
      this.chart && this.chart.dispose()
    }
  }

  initHourChart (el) {
    if (el) {
      this.hourChart = echarts.init(el)
      this.hourChart.setOption(cloneDeep(option))
      this.hourChart.on('click', ({ data }) => {
        const _data = this.hourChart.getOption().xAxis[0].data
        const _current = this.query.timeRange[0]
        const x = data[0]
        const di = {
          year: _current.get('year'),
          month: _current.get('month'),
          date: _current.get('date'),
        }
        const _from = moment(_data[x], 'HH:mm:ss').set(di)
        const _to = moment(_data[x + 1], 'HH:mm:ss').set(di)
        this.query.timeRange = [_from, _to]
        const xAxisData = []
        for (let i = _from.clone(); i.isBefore(_to); i = i.add(1, 'minute')) {
          xAxisData.push(i.format('mm:ss'))
        }
        this.minuteChart.setOption({
          xAxis: {
            data: xAxisData,
          },
          yAxis: {
            data: [this.query.kpi.name],
          },
          series: {
            data: cdata,
          },
        })
      })
    } else {
      this.hourChart && this.hourChart.dispose()
    }
  }

  initMinuteChart (el) {
    if (el) {
      this.minuteChart = echarts.init(el)
      this.minuteChart.setOption(cloneDeep(option))
      this.minuteChart.on('click', ({ data }) => {
        // const x = data[0]
        // const timeRange = [day[x], days[x + 1]]
        // this.query()
      })
    } else {
      this.minuteChart && this.minuteChart.dispose()
    }
  }

  query () { // eslint-disable-line
    const { dispatch } = this.props

    dispatch({ type: 'systemquery/queryAlert' })
  }

  componentWillMount () {
    const { config: { kpiConfig } } = this.props

    this.setState({
      chartHeight: (kpiConfig.length + 1) * height,
    })
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    const { chartHeight } = this.state

    return (
      <div>
        <div style={{ width: '100%', height: chartHeight }} ref={el => this.initChart(el)} />
        <div style={{ width: '100%', height: height * 2 }} ref={el => this.initHourChart(el)} />
        <div style={{ width: '100%', height: height * 2 }} ref={el => this.initMinuteChart(el)} />
      </div>
    )
  }
}

Index.propTypes = {
  dispatch: PropTypes.func.isRequired,
  defaultTimeRange: PropTypes.array.isRequired,
  config: PropTypes.object.isRequired,
}
