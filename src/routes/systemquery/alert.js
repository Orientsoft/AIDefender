import React from 'react'
import PropTypes from 'prop-types'
import { DataTable } from 'components'
import TimeSlice from './TimeSlice'

export default class Index extends React.Component {
  render () {
    const { config, dispatch, app: { globalTimeRange } } = this.props
    const timeRange = [globalTimeRange[2], globalTimeRange[3]]

    return (
      <div>
        <TimeSlice dispatch={dispatch} config={config} defaultTimeRange={timeRange} />
        <div>
          {config.alertResult.map((alert, key) => (
            <DataTable key={key} data={config.alertResult} />
          ))}
        </div>
      </div>
    )
  }
}

Index.propTypes = {
  dispatch: PropTypes.func.isRequired,
  app: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
}
