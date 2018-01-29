import React from 'react'
import PropTypes from 'prop-types'
import { DataTable } from 'components'

export default class Index extends React.Component {
  render () {
    const { data = {} } = this.props

    return (
      <div>
        <div />
        <DataTable data={data} />
      </div>
    )
  }
}

Index.propTypes = {
  data: PropTypes.object,
}
