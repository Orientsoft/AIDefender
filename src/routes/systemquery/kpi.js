import React from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'
import { KPIChart } from 'components'

export default class Index extends React.Component {
  componentWillReceiveProps (nextProps) {
    if (!isEqual(nextProps.config.kpiConfig, this.props.config.kpiConfig)) {
      this.query(nextProps.config)
    }
  }

  query (defaultConfig) {
    const { dispatch, app: { globalTimeRange }, config: { kpiConfig } } = this.props
    const queryConfig = defaultConfig || kpiConfig

    dispatch({
      type: 'systemquery/queryKPI',
      payload: {
        globalTimeRange,
      },
    })
  }

  render () {
    const { config } = this.props

    return (
      <div>
        <KPIChart chartConfigs={config.chart} dataSource={config.kpiResult} />
      </div>
    )
  }
}

Index.propTypes = {
  dispatch: PropTypes.func.isRequired,
  app: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
}
