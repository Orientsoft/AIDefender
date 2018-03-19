import React from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'
import Plotly from 'react-plotly.js'

const layout = {
  margin: {
    r: 0,
    t: 0,
  },
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

  formatData = (source, field) => {
    const fieldName = field.field
    const xAxis = []
    const yAxis = []

    source.buckets.forEach((bucket) => {
      xAxis.push(bucket.key_as_string)
      yAxis.push(bucket.doc_count)
    })
    return {
      name: fieldName,
      type: 'bar',
      y: yAxis,
      x: xAxis,
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
        timeRange: globalTimeRange,
      },
    })
  }

  onChartUpdate = (figure, el) => {
    console.log(figure, el)
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
              data={this.formatData(kpiResult[mid], kpi, field)}
              layout={layout}
              config={config}
              onUpdate={this.onChartUpdate}
              style={{ height: 160, width: '100%' }}
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
