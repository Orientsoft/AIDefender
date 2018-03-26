// @flow
import type { TimeSliceData } from 'configs/charts/timeSlice'
import type { AlertData } from 'models/systemquery'

import React from 'react'
import PropTypes from 'prop-types'
import echarts from 'echarts'
import get from 'lodash/get'
import datetime from 'utils/datetime'
import timeSliceOption from 'configs/charts/timeSlice'

// 从返回的聚合结果中生成图表所需数据
function buildData (
  alerts: Array<AlertData>,
  results: Array<any>,
): TimeSliceData {
  const timeSliceData: TimeSliceData = { xAxis: [], yAxis: [], data: [] }

  if (!alerts.length || !results.length) {
    return timeSliceData
  }
  alerts.forEach(({ name, index }, i) => {
    const result = results.find(_result => get(_result, `aggregations.${index}`))

    if (result) {
      const n = timeSliceData.yAxis.push(name)
      const buckets = get(result, `aggregations.${index}.buckets`)

      timeSliceData.data = timeSliceData.data.concat(buckets.map((bucket, j) => {
        const total = bucket.level.buckets.filter((_level) => {
          return _level.key.toLowerCase() !== 'normal'
        }).reduce((_total, _level) => _total + _level.doc_count, 0)

        if (i === 0) {
          timeSliceData.xAxis.push(bucket.key_as_string)
        }

        return [j, n - 1, total || '-']
      }))
    }
  })

  return timeSliceData
}

export default class TimeSlice extends React.Component {
  chart: ?echarts.ECharts = null

  componentWillMount () {
    this.queryResult()
  }

  onChartClick = ({ value }: any) => {
    const { dispatch } = this.props
    const ts = timeSliceOption.xAxis.data[value[0]]

    dispatch({
      type: 'systemquery/queryAlertData',
      payload: {
        timeRange: [datetime(ts), datetime(ts)],
      },
    })
  }

  initChart (el: mixed) {
    const { config: { activeNode, alertResult } } = this.props

    if (el) {
      const chart = echarts.init(el)
      chart.on('click', this.onChartClick)
      const data = buildData(activeNode.data.alert, alertResult)
      timeSliceOption.xAxis.data = data.xAxis
      timeSliceOption.yAxis.data = data.yAxis
      timeSliceOption.series[0].data = data.data
      chart.setOption(timeSliceOption)
      this.chart = chart
    } else if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
  }

  queryResult () {
    const { dispatch, timeRange, config: { activeNode } } = this.props

    dispatch({
      type: 'systemquery/queryAlert',
      payload: {
        alerts: activeNode.data.alert,
        timeRange,
        interval: 'hour',
      },
    })
  }

  componentWillReceiveProps (nextProps) {
    const {
      timeRange: [startTs, endTs],
      config: {
        activeNode,
        alertResult,
      },
    } = nextProps
    const { timeRange } = this.props

    if (!(startTs.isSame(timeRange[0]) && endTs.isSame(timeRange[1]))) {
      timeRange[0] = startTs
      timeRange[1] = endTs
      this.queryResult()
      const data = buildData(activeNode.data.alert, alertResult)
      timeSliceOption.xAxis.data = data.xAxis
      timeSliceOption.yAxis.data = data.yAxis
      timeSliceOption.series[0].data = data.data
      if (this.chart) {
        this.chart.setOption(timeSliceOption)
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

TimeSlice.propTypes = {
  dispatch: PropTypes.func.isRequired,
  timeRange: PropTypes.array.isRequired,
  config: PropTypes.object.isRequired,
}
