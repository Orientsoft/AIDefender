import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import './DataTable.less'

class DataTable extends React.Component {
  constructor (props) {
    super(props)
    this.onPageChange = this.onPageChange.bind(this)
    this.pagination = {
      showQuickJumper: true,
      defaultPageSize: 10,
      onChange: this.onPageChange
    }
  }

  componentWillMount() {
    let pageCount = Math.ceil(this.props.data.dataSource.length / this.pagination.defaultPageSize);
    this.props.getPageCount(pageCount);
  }

  onPageChange(currentPage, pageSize) {
    this.props.onPageChange(currentPage, pageSize);
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
