import React from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'
import moment from 'moment'
import Plotly from 'react-plotly.js'

const layout = {
  margin: {
    t: 30,
  },
  yaxis: {
    fixedrange: true,
  },
  'yaxis.range[0]': 0,
  xaxis: {
    tickangle: -45,
  },
  showTips: false,
  barmode: 'stack',
  showlegend: false,
}

const config = {
  displayModeBar: false,
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

  formatData = (source) => {
    const xAxis = []
    const yAxis = []

    source.buckets.forEach((bucket) => {
      xAxis.push(new Date(bucket.key))
      yAxis.push(bucket.doc_count)
    })
    return [{
      type: 'bar',
      y: yAxis,
      x: xAxis,
      xcalendar: 'chinese',
    }]
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

  onChartUpdate = (figure) => {
    const { dispatch, app: { globalTimeRange } } = this.props
    let startTs = figure['xaxis.range[0]']
    let endTs = figure['xaxis.range[1]']
    startTs = moment(startTs)
    endTs = moment(endTs)
    if (!figure['xaxis.autorange']) {
      globalTimeRange[2] = startTs
      globalTimeRange[3] = endTs
      dispatch({ type: 'app/setGlobalTimeRange', payload: globalTimeRange })
    }
  }

  render () {
    const { config: { kpiConfig, kpiResult } } = this.props

    return (
      <div>
        {Object.keys(kpiResult).reduce((els, mid) => {
          const kpi = kpiConfig.find(c => c._id === mid)
          return els.concat(kpi.chart.values.map((field, key) => (
            <Plotly
              key={mid + key}
              data={this.formatData(kpiResult[mid])}
              layout={Object.assign({ title: kpi.chart.title }, layout)}
              config={config}
              onRelayout={this.onChartUpdate}
              style={{ height: 240, width: '100%' }}
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
