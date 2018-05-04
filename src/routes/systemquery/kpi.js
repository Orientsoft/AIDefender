// @flow
import type { KPIData } from 'configs/charts/kpi'
import type { DateTime } from 'utils/datetime'
import type { Echarts } from 'echarts'

import React from 'react'
import PropTypes from 'prop-types'
import datetime, { intervals, getInterval, formatSecond } from 'utils/datetime'
import utils from 'utils'
import flatten from 'lodash/flatten'
import cloneDeep from 'lodash/cloneDeep'
import echarts from 'echarts'
import kpiOption from 'configs/charts/kpi'
import kpiTermsOption from 'configs/charts/kpiTerms'

const CHART_HEIGHT: number = 240

function buildData (field: any, result: any, timeRange): KPIData {
  const kpiData: KPIData = { xAxis: [], yAxis: [], data: [] }
  const seriesData = {}
  const firstTick = formatSecond(timeRange[0])

  if (!result) {
    return kpiData
  }
  result.buckets.forEach((bucket, i) => {
    const _field = bucket[field.field]

    if (bucket.key >= (+timeRange[0]) && bucket.key <= (+timeRange[1])) {
      kpiData.xAxis.push(bucket.key_as_string)
    } else if (i === 0) {
      kpiData.xAxis.push(firstTick)
    }
    /* eslint-disable */
    if (field.operator === 'terms') {
      _field.buckets.forEach(({ key, doc_count }) => {
        if (!seriesData[key]) {
          seriesData[key] = {
            _last: 0,
            data: [],
          }
        }
        for (let j = seriesData[key]._last; j < i; j++) {
          const _data = seriesData[key].data[j]
          seriesData[key].data[j] = _data || [0, 0]
          seriesData[key]._last = i + 1
        }
        seriesData[key].data[i] = [doc_count, bucket.doc_count]
      })
    } else {
      kpiData.data.push(_field.value || 0)
    }
    /* eslint-enable */
  })
  if (field.operator === 'terms') {
    const keys = Object.keys(seriesData)
    const _timeRange = kpiData.xAxis

    kpiData.yAxis = keys
    kpiData.data = flatten(keys.map((key, y) => {
      return seriesData[key].data.map((_data, x) => {
        return [x, y, _data[0], _data[1], _timeRange[x] || firstTick, key]
      })
    }))
  }

  return kpiData
}

function updateChart (
  chart: Echarts,
  option: any | null,
  title: string,
  field: any,
  timeRange: Array<DateTime>,
  kpiData: KPIData,
): void {
  const { operator, fieldChinese } = field
  const { xAxis, yAxis, data } = kpiData
  const height = yAxis.length * 20
  let interval = getInterval(timeRange[0], timeRange[1])
  if (+timeRange[1] - timeRange[0] <= 1000) {
    interval = 'second'
  }
  const { labelChinese } = utils.aggs.find(_agg => _agg.value === field.operator)

  option = option || chart.getOption()

  option.yAxis[0].name = `${fieldChinese} (${labelChinese}/${intervals[interval]})`
  // 如果指标有多个图表，只显示一个标题
  if (!(chart._index && chart._index !== 1)) {
    option.title.text = title
  } else {
    option.grid.top = 40
  }
  option.series[0].data = data
  option.xAxis.forEach((_xAxis) => {
    _xAxis.data = xAxis
  })
  if (operator === 'terms') {
    const el = chart.getDom()

    option.yAxis[0].data = yAxis
    el.style.height = `${height > CHART_HEIGHT ? height : CHART_HEIGHT}px`
    chart.resize()
  }
  chart.setOption(option)
}

export default class Index extends React.Component {
  charts = {}
  lastTimeRange: Array<DateTime> = []
  recoverTimeRange: Array<DateTime> = []

  componentWillMount () {
    const { app: { globalTimeRange }, config } = this.props

    this.lastTimeRange = globalTimeRange.map(t => t.clone())
    this.query(config.kpiConfig)
  }

  componentWillReceiveProps (nextProps) {
    const {
      app: { globalTimeRange },
      config: { kpiConfig, kpiResult },
    } = nextProps
    const thisKPIConfig = this.props.config.kpiConfig
    let isTimeRangeSame = true
    let isKPISame = true

    for (let i = 0; i < globalTimeRange.length; i++) {
      if (!globalTimeRange[i].isSame(this.lastTimeRange[i])) {
        isTimeRangeSame = false
        break
      }
    }
    isKPISame = kpiConfig.every((kpi) => {
      return thisKPIConfig.find(_kpi => _kpi._id === kpi._id)
    }) && (kpiConfig.length === thisKPIConfig.length)
    if (!isTimeRangeSame || !isKPISame) {
      this.lastTimeRange = globalTimeRange.map(t => t.clone())
      if (!isKPISame) {
        this.forceUpdate()
      }
      this.query(kpiConfig)
    } else if (this.props.config.kpiResult !== kpiResult) {
      const timeRange = [globalTimeRange[2], globalTimeRange[3]]

      kpiConfig.forEach(({ _id, chart }) => {
        let charts = this.charts[_id] || []

        if (kpiResult[_id]) {
          charts.forEach(({ instance, field }) => {
            updateChart(
              instance,
              null,
              chart.title,
              field,
              timeRange,
              buildData(field, kpiResult[_id], timeRange)
            )
            this.setLoading(instance, false)
          })
        }
      })
    }
  }

  query (config: Array<any>) {
    const { dispatch, app: { globalTimeRange } } = this.props
    const queryConfig = config.map(cfg => ({
      _id: cfg._id,
      index: cfg.source.index,
      chart: cfg.chart,
      filters: cfg.filters,
    }))
    const timeRange = [globalTimeRange[2], globalTimeRange[3]]
    let interval = getInterval(timeRange[0], timeRange[1])
    if (+timeRange[1] - timeRange[0] <= 1000) {
      interval = 'second'
    }

    if (config.length) {
      dispatch({
        type: 'systemquery/queryKPI',
        payload: {
          config: queryConfig,
          timeRange,
          interval,
        },
      })
    }
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

  onChartClick = ({ dataIndex }: any, chart: Echarts) => {
    const { dispatch, app: { globalTimeRange } } = this.props
    const option = chart.getOption()
    const ts0 = datetime(option.xAxis[0].data[dataIndex]).startOf('second')
    const ts1 = ts0.clone().add(999, 'milliseconds')

    this.recoverTimeRange = [
      globalTimeRange[2].clone(),
      globalTimeRange[3].clone(),
    ]
    this.isRecoverable = true
    // 获取KPI当前秒，查询时间精确到毫秒
    globalTimeRange[2] = ts0
    globalTimeRange[3] = ts1

    dispatch({
      type: 'systemquery/setActiveTab',
      payload: {
        key: 3, // [查询]Tab
      },
    })
  }

  onDataZoom (e: any, chart: Echarts) {
    const { dispatch, app: { globalTimeRange } } = this.props
    const option = chart.getOption()
    const { data } = option.xAxis[0]
    const { startValue, endValue } = e.batch[0]
    const from = datetime(data[startValue])
    const to = datetime(data[endValue])
    this.setLoading(chart, true)
    globalTimeRange[2] = from
    globalTimeRange[3] = to
    setTimeout(() => {
      dispatch({ type: 'app/setGlobalTimeRange', payload: globalTimeRange })
    }, 0)
  }

  initChart (el: any, kpi: any, field: any) {
    const { config: { kpiResult }, app: { globalTimeRange } } = this.props
    const { _id } = kpi

    if (el) {
      const chart = echarts.init(el)
      let option = cloneDeep(kpiOption)

      if (field.operator === 'terms') {
        option = cloneDeep(kpiTermsOption)
      } else if (field.chartType === 'area') {
        option.series[0].type = 'line'
        option.series[0].areaStyle = {
          opacity: 1,
        }
      } else {
        option.series[0].type = field.chartType
      }
      if (!this.charts[_id]) {
        this.charts[_id] = []
      }
      chart._index = this.charts[_id].push({ field, instance: chart })
      const timeRange = [globalTimeRange[2], globalTimeRange[3]]

      updateChart(
        chart,
        option,
        kpi.chart.title,
        field,
        timeRange,
        buildData(field, kpiResult[_id], timeRange)
      )
      chart.dispatchAction({
        type: 'takeGlobalCursor',
        key: 'dataZoomSelect',
        dataZoomSelectActive: true,
      })
      chart.on('click', e => this.onChartClick(e, chart))
      chart.on('dataZoom', e => this.onDataZoom(e, chart))
    } else if (this.charts[_id]) {
      this.charts[_id].forEach((chart) => {
        if (chart.instance) {
          chart.instance.dispose()
        }
      })
      this.charts[_id].length = 0
    }
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    const { config: { kpiConfig } } = this.props

    return (
      <div>
        {kpiConfig.reduce((els, kpi) => {
          return els.concat(kpi.chart.values.map(value => (
            <div
              key={kpi._id + value.field}
              ref={el => this.initChart(el, kpi, value)}
              style={{ height: CHART_HEIGHT, width: '100%', marginBottom: '2em' }}
            />
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
