import React from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'
import { KPIChart } from 'components'

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
    console.log(kpiResult)
    return (
      <div>
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
