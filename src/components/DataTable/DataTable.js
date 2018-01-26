import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { request } from 'utils'
import lodash from 'lodash'
import './DataTable.less'


class DataTable extends React.Component {
  constructor (props) {
    super(props)
    this.pagination = {
      showQuickJumper: true, 
      defaultPageSize: 10,
    }
    this.rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
      },
    };
    
  }
 
  render () {
    return (<Table
      ref="DataTable"
      bordered
      rowSelection={this.rowSelection}
      pagination = {this.pagination}
      {...this.props.data}
    />)
  }
}

DataTable.propTypes = {
  pagination: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]),
  columns: PropTypes.array,
  dataSource: PropTypes.array,
}

export default DataTable
