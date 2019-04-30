// @flow
import type { TimeSliceData } from 'configs/charts/timeSlice'
import type { AlertData } from 'models/systemquery'
import type { Echarts } from 'echarts'

import React from 'react'
import PropTypes from 'prop-types'
import echarts from 'echarts'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import datetime, { intervals, getInterval } from 'utils/datetime'
import timeSliceOption, { fullScreenChartConfig } from 'configs/charts/timeSlice'

let currentChartConfig = cloneDeep(timeSliceOption)

// 从返回的聚合结果中生成图表所需数据
function buildData (
  alerts: Array<AlertData>,
  results: Array<any>,
  timeRange: Array<any>,
): TimeSliceData {
  const timeSliceData: TimeSliceData = {
    xAxis: [], yAxis: [], data: [], grid: {},
  }
  let maxTextLength = 0

  if (!alerts.length || !results.length) {
    return timeSliceData
  }
  alerts.forEach(({ name, index }, i) => {
    const result = results.find(_result => get(_result, `aggregations.${index}`))

    if (result) {
      const n = timeSliceData.yAxis.push(name)
      const buckets = get(result, `aggregations.${index}.buckets`)

      if (name.length > maxTextLength) {
        maxTextLength = name.length
        timeSliceData.grid.left = maxTextLength * (/^[a-zA-Z_-]+$/.test(name) ? 8.6 : 12.6)
      }
      timeSliceData.data = timeSliceData.data.concat(buckets.map((bucket, j) => {
        const serverity = bucket.serverity.value || 0
        const a = serverity / 100
        let tname = bucket.key_as_string
        let color = 'rgba(0,153,0,.5)'

        if (i === 0) {
          // if (bucket.key < +timeRange[0] || bucket.key > +timeRange[1]) {
          //   if (!timeSliceData.xAxis.length) {
          //     tname = timeRange[0].toJSON()
          //     timeSliceData.xAxis.push(tname)
          //   }
          // } else {
          timeSliceData.xAxis.push(bucket.key_as_string)
          // }
        }
        // 如果是错误
        if (serverity > 50) {
          color = `rgba(255,51,51,${a})`
        } else if (serverity > 0) {
          color = `rgba(255,102,0,${a * 2})`
        }

        return {
          alertName: name,
          name: tname,
          value: [j, n - 1, serverity],
          itemStyle: {
            color,
            borderWidth: 1,
            borderColor: 'white',
          },
        }
      }))
    }
  })

  return timeSliceData
}

export default class TimeSlice extends React.Component {
  chart: ?Echarts = null

  componentWillMount () {
    // const { config: { activeNode, alertResult } } = this.props
    this.queryResult()
  }

  onDataZoom = (e: any, chart: Echarts) => {
    const { dispatch, timeRange } = this.props
    const _timeRange = timeRange.map(t => t.clone())
    const option = chart.getOption()
    const { data } = option.xAxis[0]
    const { startValue, endValue } = e.batch[0]
    const from = datetime(data[startValue])
    // 禁止选中某一个时间点
    const to = datetime(data[startValue === endValue ? endValue + 1 : endValue])

    this.setLoading(chart, true)
    _timeRange[2] = from
    _timeRange[3] = to
    setTimeout(() => {
      dispatch({ type: 'app/setGlobalTimeRange', payload: _timeRange })
    }, 0)
  }

  onChartClick = ({ value }: any) => {
    let {
      dispatch,
      timeRange,
      onClick,
      interval,
      config: { alertConfig },
    } = this.props
    const ts = timeSliceOption.xAxis[0].data[value[0]]
    const config = alertConfig[value[1]]

    if (interval) {
      if (interval === 'auto') {
        interval = getInterval(timeRange[2], timeRange[3])
      }
    } else {
      interval = getInterval(timeRange[2], timeRange[3])
    }
    if (onClick) {
      onClick(config)
    }
    dispatch({
      type: 'systemquery/queryAlertData',
      payload: {
        index: config.index,
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
    const { config: { alertResult, alertConfig }, timeRange } = this.props

    if (el) {
      const chart = echarts.init(el)
      chart.on('click', this.onChartClick)
      const { xAxis, yAxis, data, grid } = buildData(
        alertConfig,
        alertResult,
        [timeRange[2], timeRange[3]]
      )
      currentChartConfig.xAxis.forEach((_xAxis) => {
        _xAxis.data = xAxis
      })
      currentChartConfig.yAxis[0].data = yAxis
      currentChartConfig.series[0].data = data
      currentChartConfig.grid = { ...currentChartConfig.grid, ...grid }
      chart.setOption(currentChartConfig)
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
    const { dispatch, timeRange, config: { alertConfig }, interval } = this.props
    const payload = {
      alerts: alertConfig,
      timeRange: [timeRange[2], timeRange[3]],
    }

    if (interval) {
      if (interval === 'auto') {
        payload.interval = getInterval(...payload.timeRange)
      } else {
        payload.interval = interval
      }
    } else {
      payload.interval = getInterval(...payload.timeRange)
    }

    dispatch({
      type: 'systemquery/queryAlert',
      payload,
    })
  }

  componentWillReceiveProps (nextProps) {
    const {
      timeRange: [_start, _end, startTs, endTs], // eslint-disable-line
      config: {
        alertResult,
        alertConfig,
      },
      isFullScreen,
    } = nextProps
    const { timeRange, interval } = this.props

    if (isFullScreen) {
      currentChartConfig = cloneDeep(fullScreenChartConfig)
    } else {
      currentChartConfig = cloneDeep(timeSliceOption)
    }
    if (!(startTs.isSame(timeRange[2]) && endTs.isSame(timeRange[3]))) {
      timeRange[2] = startTs
      timeRange[3] = endTs
      setTimeout(() => this.queryResult(), 0)
    } else if (interval !== nextProps.interval) {
      setTimeout(() => this.queryResult(), 0)
    } else {
      const { xAxis, yAxis, data, grid } = buildData(
        alertConfig,
        alertResult,
        [timeRange[2], timeRange[3]]
      )
      currentChartConfig.xAxis.forEach((_xAxis) => {
        _xAxis.data = xAxis
      })
      currentChartConfig.yAxis[0].data = yAxis
      currentChartConfig.series[0].data = data
      currentChartConfig.grid = { ...currentChartConfig.grid, ...grid }
      if (this.chart) {
        this.chart.setOption(currentChartConfig)
        this.setLoading(this.chart, false)
      }
    }
  }

  // shouldComponentUpdate (nextProps) {
  //   return this.props.isFullScreen !== nextProps.isFullScreen
  // }

  render () {
    const { interval, timeRange, config: { activeNode: { data: { alert } } } } = this.props
    let ts = interval

    if (interval) {
      if (interval === 'auto') {
        ts = getInterval(timeRange[2], timeRange[3])
      } else {
        ts = interval
      }
    } else {
      ts = getInterval(timeRange[2], timeRange[3])
    }

    return (
      <div>
        <div ref={el => this.initChart(el)} style={{ height: alert ? alert.length * 40 : 0, width: '100%' }} />
        <div style={{ textAlign: 'center', marginBottom: 24 }}>按 <b>{intervals[ts]}</b> 聚合</div>
      </div>
    )
  }
}

TimeSlice.propTypes = {
  dispatch: PropTypes.func.isRequired,
  timeRange: PropTypes.array.isRequired,
  config: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  interval: PropTypes.string,
  isFullScreen: PropTypes.bool,
}
