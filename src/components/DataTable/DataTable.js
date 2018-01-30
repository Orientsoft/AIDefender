import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import './DataTable.less'

class DataTable extends React.Component {
  constructor (props) {
    super(props)
    this.pagination = {
      showQuickJumper: true,
      defaultPageSize: 10,
    }
  }

  render () {
    return (<Table
      ref="DataTable"
      bordered
      pagination={this.pagination}
      {...this.props.data}
    />)
  }
}

DataTable.propTypes = {
  pagination: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]),
  data: PropTypes.object,
  columns: PropTypes.array,
  dataSource: PropTypes.array,
}

export default DataTable
