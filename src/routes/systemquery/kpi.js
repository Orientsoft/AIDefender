// @flow
import type { KPIData } from 'configs/charts/kpi'
import type { DateTime } from 'utils/datetime'
import type { Echarts } from 'echarts'

import React from 'react'
import PropTypes from 'prop-types'
import datetime, { intervals, getInterval } from 'utils/datetime'
import utils from 'utils'
import flatten from 'lodash/flatten'
import cloneDeep from 'lodash/cloneDeep'
import echarts from 'echarts'
import kpiOption from 'configs/charts/kpi'
import kpiTermsOption from 'configs/charts/kpiTerms'

const CHART_HEIGHT: number = 240

function buildData (field: any, result: any): KPIData {
  const kpiData: KPIData = { xAxis: [], yAxis: [], data: [] }
  const seriesData = {}

  if (!result) {
    return kpiData
  }
  result.buckets.forEach((bucket, i) => {
    const _field = bucket[field.field]

    kpiData.xAxis.push(bucket.key_as_string)
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
      kpiData.data.push(_field.value)
    }
    /* eslint-enable */
  })
  if (field.operator === 'terms') {
    const keys = Object.keys(seriesData)
    const timeRange = kpiData.xAxis

    kpiData.yAxis = keys
    kpiData.data = flatten(keys.map((key, y) => {
      return seriesData[key].data.map((_data, x) => {
        return [x, y, _data[0], _data[1], timeRange[x], key]
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
  const interval = getInterval(timeRange[0], timeRange[1])
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

  componentWillMount () {
    const { app: { globalTimeRange }, config: { kpiConfig } } = this.props

    this.lastTimeRange = globalTimeRange.map(t => t.clone())
    this.query(kpiConfig)
  }

  componentWillReceiveProps (nextProps) {
    const {
      app: { globalTimeRange },
      config: { kpiConfig, kpiResult },
    } = nextProps
    let isTimeRangeSame = true

    for (let i = 0; i < globalTimeRange.length; i++) {
      if (!globalTimeRange[i].isSame(this.lastTimeRange[i])) {
        isTimeRangeSame = false
        break
      }
    }
    if (!isTimeRangeSame) {
      this.lastTimeRange = globalTimeRange.map(t => t.clone())
      this.query(kpiConfig)
    } else if (this.props.config.kpiResult !== kpiResult) {
      const timeRange = [globalTimeRange[2], globalTimeRange[3]]

      kpiConfig.forEach(({ _id, chart }) => {
        const charts = this.charts[_id] || []

        if (kpiResult[_id]) {
          charts.forEach(({ instance, field }) => {
            updateChart(
              instance,
              null,
              chart.title,
              field,
              timeRange,
              buildData(field, kpiResult[_id])
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
    const interval = getInterval(timeRange[0], timeRange[1])

    dispatch({
      type: 'systemquery/queryKPI',
      payload: {
        config: queryConfig,
        timeRange,
        interval,
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

      console.log(kpi.chart)
      if (field.operator === 'terms') {
        option = cloneDeep(kpiTermsOption)
      } else if (kpi.chart.type === 'area') {
        option.series[0].type = 'line'
        option.series[0].areaStyle = {
          opacity: 1,
        }
      } else {
        option.series[0].type = kpi.chart.type
      }
      if (!this.charts[_id]) {
        this.charts[_id] = []
      }
      chart._index = this.charts[_id].push({ field, instance: chart })

      updateChart(
        chart,
        option,
        kpi.chart.title,
        field,
        [globalTimeRange[2], globalTimeRange[3]],
        buildData(field, kpiResult[_id])
      )
      chart.dispatchAction({
        type: 'takeGlobalCursor',
        key: 'dataZoomSelect',
        dataZoomSelectActive: true,
      })
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
