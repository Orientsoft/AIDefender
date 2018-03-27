// @flow
import type { KPIData } from 'configs/charts/kpi'

import React from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'
import moment from 'moment'
import cloneDeep from 'lodash/cloneDeep'
import echarts from 'echarts'
import kpiOption from 'configs/charts/kpi'

function buildData (chartConfig: any, result: any): KPIData {
  const kpiData: KPIData = { title: '', xAxis: [], data: [] }

  result.buckets.forEach((bucket) => {
    kpiData.xAxis.push(bucket.key_as_string)
    kpiData.data.push(bucket.doc_count)
  })
  kpiData.title = chartConfig.title

  return kpiData
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
    const from = moment(data[startValue])
    const to = moment(data[endValue])
    chart.dispatchAction({
      type: 'takeGlobalCursor',
      key: 'dataZoomSelect',
      dataZoomSelectActive: false,
    })
    chart.showLoading()
    globalTimeRange[2] = from
    globalTimeRange[3] = to
    this.query(kpiConfig)
  }

  initChart (el, key, chartConfig, source) {
    if (el) {
      const chart = echarts.init(el)
      const option = cloneDeep(kpiOption)
      const data = buildData(chartConfig, source)

      option.series[0].data = data.data
      option.xAxis.forEach((xAxis) => {
        xAxis.data = data.xAxis
      })
      option.title.text = data.title
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
            <div key={id + key} ref={el => this.initChart(el, id + key, kpi.chart, kpiResult[id])} style={{ height: 240, width: '100%' }} />
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
