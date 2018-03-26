// @flow
import type { TimeSliceData } from 'configs/charts/timeSlice'
import React from 'react'
import PropTypes from 'prop-types'
import echarts from 'echarts'
import moment from 'moment'
import get from 'lodash/get'
import timeSliceOption from 'configs/charts/timeSlice'

// 从返回的聚合结果中生成图表所需数据
function buildData (
  alerts: Array<Object>,
  result: Array<Object>,
): TimeSliceData {
  const timeSliceData: TimeSliceData = { xAxis: [], yAxis: [], data: [] }

  if (!alerts.length || !result.length) {
    return timeSliceData
  }
  alerts.forEach(({ name, index }) => {
    const aggs = result.find(_result => get(_result, `aggregations.${index}`))

    if (aggs) {
      const n = timeSliceData.yAxis.push(name || index)

      timeSliceData.data.push(aggs.buckets.map((bucket, i) => {
        const total = bucket.level.bucket.filter((_level) => {
          return _level.key.toLowerCase() !== 'normal'
        }).reduce((_total, _level) => _total + _level.doc_count, 0)

        return [i, n - 1, total]
      }))
    }
  })

  return timeSliceData
}

export default class TimeSlice extends React.Component {
  chart: echarts.ECharts = null

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
    } = nextProps.timeRange
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
