import React from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'
import moment from 'moment'
import cloneDeep from 'lodash/cloneDeep'
import echarts from 'echarts'

// 格式化日期
function formatXAxis (value) {
  return moment(parseInt(value, 10)).format('YYYY-MM-DD HH:mm')
}

const defaultOption = {
  tooltip: {
    trigger: 'axis',
  },
  title: {},
  toolbox: {
    feature: {
      dataZoom: {
        iconStyle: {
          opacity: 0,
        },
        title: {
          zoom: '框选',
          back: '还原',
        },
        yAxisIndex: 'none',
        xAxisIndex: 1,
      },
      // restore: {},
    },
  },
  xAxis: [{
    type: 'category',
    boundaryGap: true,
    data: [],
    axisLabel: {
      formatter: formatXAxis,
    },
  }, {
    show: false,
    type: 'category',
    boundaryGap: true,
    data: [],
    axisLabel: {
      formatter: formatXAxis,
    },
  }],
  yAxis: {
    type: 'value',
    boundaryGap: [0, '100%'],
  },
  series: [{
    name: '模拟数据',
    type: 'bar',
    smooth: true,
    itemStyle: {
      normal: {
        color: 'rgb(255, 70, 131)',
      },
    },
    areaStyle: {
      normal: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgb(255, 158, 68)',
        }, {
          offset: 1,
          color: 'rgb(255, 70, 131)',
        }]),
      },
    },
    data: [],
  }],
}

export default class Index extends React.Component {
  charts = {}

  componentWillMount () {
    this.lastTimeRange = this.props.app.globalTimeRange.map(t => t.clone())
    this.query(this.props.config.kpiConfig)
  }

  componentWillReceiveProps (nextProps) {
    const { config: { kpiConfig } } = this.props
    const isKpiConfigSame = isEqual(nextProps.config.kpiConfig, kpiConfig)
    const isTimeRangeSame = isEqual(nextProps.app.globalTimeRange, this.lastTimeRange)

    if (!isKpiConfigSame || !isTimeRangeSame) {
      this.lastTimeRange = nextProps.app.globalTimeRange.map(t => t.clone())
      this.query(nextProps.config.kpiConfig)
    }
  }

  query (config) {
    const { dispatch, app: { globalTimeRange } } = this.props
    const queryConfig = config.map(cfg => ({
      _id: cfg._id,
      index: cfg.source.index,
      chart: cfg.chart,
      filters: cfg.filters,
    }))

    dispatch({
      type: 'systemquery/queryKPI',
      payload: {
        config: queryConfig,
        timeRange: [globalTimeRange[2], globalTimeRange[3]],
      },
    })
  }

  onDataZoom (e, chart) {
    const { config: { kpiConfig }, app: { globalTimeRange } } = this.props
    const option = chart.getOption()
    const { data } = option.xAxis[0]
    const { startValue, endValue } = e.batch[0]
    const from = moment(parseInt(data[startValue], 10))
    const to = moment(parseInt(data[endValue], 10))
    chart.showLoading()
    globalTimeRange[2] = from
    globalTimeRange[3] = to
    this.query(kpiConfig)
  }

  initChart (el, key, title, field, source) {
    if (el) {
      const chart = echarts.init(el)
      const option = cloneDeep(defaultOption)
      const data = []
      source.buckets.forEach((bucket) => {
        data.push(bucket.key)
        option.series[0].data.push(bucket.doc_count)
      })
      option.xAxis.forEach((xAxis) => {
        xAxis.data = data
      })
      option.title.text = title
      chart.setOption(option)
      chart.dispatchAction({
        type: 'takeGlobalCursor',
        key: 'dataZoomSelect',
        dataZoomSelectActive: true,
      })
      chart.on('dataZoom', e => this.onDataZoom(e, chart))
      this.charts[key] = chart
    } else if (this.charts[key]) {
      this.charts[key].dispose()
      this.charts[key] = null
    }
  }

  render () {
    const { config: { kpiConfig, kpiResult } } = this.props

    return (
      <div>
        {Object.keys(kpiResult).reduce((els, id) => {
          const kpi = kpiConfig.find(c => c._id === id)
          return els.concat(kpi.chart.values.map((field, key) => (
            <div key={id + key} ref={el => this.initChart(el, id + key, kpi.chart.title, field, kpiResult[id])} style={{ height: 240, width: '100%' }} />
          )))
        }, [])}
      </div>
    )
  }
}

Index.propTypes = {
  dispatch: PropTypes.func.isRequired,
  app: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
}
