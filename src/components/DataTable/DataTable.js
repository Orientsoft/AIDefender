import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import './DataTable.less'

class DataTable extends React.Component {
  constructor (props) {
    super(props)
    this.onPageChange = this.onPageChange.bind(this)
    this.state = {
      dataSource: props.data.dataSource || [], 
      columns: props.data.columns || []
    }
    this.pagination = {
      total: this.props.data.total, 
      showQuickJumper: true,
      defaultPageSize: 20,
      onChange: this.onPageChange
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.dataSource) {
      this.state.dataSource = nextProps.data.dataSource
    }
    if (nextProps.data.columns) {
      this.state.columns = this.props.data.columns
    }
    this.setState(this.state)
  }

  onPageChange(currentPage, pageSize) {
    this.props.onPageChange(currentPage - 1, pageSize);
  }

  render () {
    const { columns, dataSource } = this.state

    return (<Table
      ref="DataTable"
      bordered
      pagination={this.pagination}
      columns={columns}
      dataSource={dataSource}
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
