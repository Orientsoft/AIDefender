import React from 'react'
import PropTypes from 'prop-types'
import { KPIChart } from 'components'

export default class Index extends React.Component {
  render () {
    const { data = {} } = this.props
    return (
      <div>
        <div />
        <KPIChart data={data} />
      </div>
    )
  }
}

Index.propTypes = {
  data: PropTypes.object,
}
