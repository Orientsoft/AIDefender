// @flow
import type { TimeSliceData } from 'configs/charts/timeSlice'
import type { AlertData } from 'models/systemquery'
import type { Echarts } from 'echarts'

import React from 'react'
import PropTypes from 'prop-types'
import echarts from 'echarts'
import get from 'lodash/get'
import datetime, { getInterval } from 'utils/datetime'
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
        const serverity = bucket.serverity.value || '-'

        if (i === 0) {
          timeSliceData.xAxis.push(bucket.key_as_string)
        }

        return {
          name: bucket.key_as_string,
          value: [j, n - 1, serverity],
        }
      }))
    }
  })

  return timeSliceData
}

export default class TimeSlice extends React.Component {
  chart: ?Echarts = null

  componentWillMount () {
    const { config: { activeNode, alertResult } } = this.props

    if (!activeNode || !alertResult.length) {
      this.queryResult()
    }
  }

  onDataZoom = (e: any, chart: Echarts) => {
    const { dispatch, timeRange } = this.props
    const _timeRange = timeRange.map(t => t.clone())
    const option = chart.getOption()
    const { data } = option.xAxis[0]
    const { startValue, endValue } = e.batch[0]
    const from = datetime(data[startValue])
    const to = datetime(data[endValue])

    this.setLoading(chart, true)
    _timeRange[2] = from
    _timeRange[3] = to
    setTimeout(() => {
      dispatch({ type: 'app/setGlobalTimeRange', payload: _timeRange })
    }, 0)
  }

  onChartClick = ({ value }: any) => {
    const { dispatch, timeRange, config: { alertConfig } } = this.props
    const ts = timeSliceOption.xAxis[0].data[value[0]]
    const interval = getInterval(timeRange[0], timeRange[1])
    const config = alertConfig[value[1]]

    dispatch({
      type: 'systemquery/queryAlertData',
      payload: {
        timestamp: config.timestamp,
        timeRange: [datetime(ts), datetime(ts).add(1, interval)],
      },
    })
  }

  /* eslint-disable */
  setLoading (chart: Echarts, visible: boolean) {
    chart.dispatchAction({
      type: 'takeGlobalCursor',
      key: 'dataZoomSelect',
      dataZoomSelectActive: !visible,
    })
    if (visible) {
      chart.showLoading('default', { text: '加载中...' })
    } else {
      chart.hideLoading()
    }
  }
  /* eslint-enable */

  initChart (el: any) {
    const { config: { alertResult, alertConfig } } = this.props
    if (el) {
      const chart = echarts.init(el)
      chart.on('click', this.onChartClick)
      const { xAxis, yAxis, data } = buildData(alertConfig, alertResult)
      timeSliceOption.xAxis.forEach((_xAxis) => {
        _xAxis.data = xAxis
      })
      timeSliceOption.yAxis[0].data = yAxis
      timeSliceOption.series[0].data = data
      chart.setOption(timeSliceOption)
      chart.dispatchAction({
        type: 'takeGlobalCursor',
        key: 'dataZoomSelect',
        dataZoomSelectActive: true,
      })
      chart.on('dataZoom', e => this.onDataZoom(e, chart))
      this.chart = chart
    } else if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
  }

  queryResult () {
    const { dispatch, timeRange, config: { alertConfig } } = this.props

    dispatch({
      type: 'systemquery/queryAlert',
      payload: {
        alerts: alertConfig,
        timeRange: [timeRange[2], timeRange[3]],
      },
    })
  }

  componentWillReceiveProps (nextProps) {
    const {
      timeRange: [_start, _end, startTs, endTs], // eslint-disable-line
      config: {
        alertResult,
        alertConfig,
      },
    } = nextProps
    const { timeRange } = this.props

    if (!(startTs.isSame(timeRange[2]) && endTs.isSame(timeRange[3]))) {
      timeRange[2] = startTs
      timeRange[3] = endTs
      this.queryResult()
    } else {
      const { xAxis, yAxis, data } = buildData(alertConfig, alertResult)
      timeSliceOption.xAxis.forEach((_xAxis) => {
        _xAxis.data = xAxis
      })
      timeSliceOption.yAxis[0].data = yAxis
      timeSliceOption.series[0].data = data
      if (this.chart) {
        this.chart.setOption(timeSliceOption)
        this.setLoading(this.chart, false)
      }
    }
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    const { config: { activeNode: { data: { alert } } } } = this.props

    return (
      <div ref={el => this.initChart(el)} style={{ height: alert ? alert.length * 40 : 0, width: '100%' }} />
    )
  }
}

TimeSlice.propTypes = {
  dispatch: PropTypes.func.isRequired,
  timeRange: PropTypes.array.isRequired,
  config: PropTypes.object.isRequired,
}
