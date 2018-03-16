import React from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'
import { KPIChart } from 'components'
import Plotly from 'plotly.js'

let trace1 = {
  x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  y: [20, 14, 25, 16, 18, 22, 19, 15, 12, 16, 14, 17],
  type: 'bar',
  name: 'Primary Product',
  marker: {
    color: 'rgb(49,130,189)',
    opacity: 0.7,
  },
}

let trace2 = {
  x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  y: [19, 14, 22, 14, 16, 19, 15, 14, 10, 12, 12, 16],
  type: 'bar',
  name: 'Secondary Product',
  marker: {
    color: 'rgb(204,204,204)',
    opacity: 0.5,
  },
}

let data = [trace1, trace2]

let layout = {
  title: '2013 Sales Report',
  xaxis: {
    tickangle: -45,
  },
  barmode: 'group',
}

// Plotly.newPlot('myDiv', data, layout);

export default class Index extends React.Component {
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

  initChart (el) {
    if (el) {
      Plotly.newPlot(el, data, layout)
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

  render () {
    const { config: { kpiConfig, kpiResult } } = this.props

    return (
      <div>
        <div ref={el => this.initChart(el)} />
        {Object.keys(kpiResult).map((mid, key) => (
          <KPIChart key={key} chartConfig={kpiConfig.find(c => c._id === mid)} dataSource={kpiResult[mid]} />
        ))}
      </div>
    )
  }
}

Index.propTypes = {
  dispatch: PropTypes.func.isRequired,
  app: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
}
