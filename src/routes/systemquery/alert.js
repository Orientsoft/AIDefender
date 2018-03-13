import React from 'react'
import PropTypes from 'prop-types'
import { DataTable } from 'components'
import TimeSlice from './TimeSlice'

export default class Index extends React.Component {
  render () {
    const { config, dispatch, app: { globalTimeRange } } = this.props

    return (
      <div>
        <TimeSlice dispatch={dispatch} config={config} defaultTimeRange={globalTimeRange} />
        <div>
          {config.alertResult.map(alert => (
            <DataTable data={alert} />
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
