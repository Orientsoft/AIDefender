import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import get from 'lodash/get'
import toPath from 'lodash/toPath'
import compact from 'lodash/compact'
import './DataTable.less'

class DataTable extends React.Component {
  constructor (props) {
    super(props)
    this.pagination = {
      total: 0,
      showQuickJumper: true,
      defaultPageSize: 20,
      onChange: this.onPageChange.bind(this),
    }
    this.state = {
      dataSource: this.parseDataSource(props.data.dataSource),
      columns: this.parseColumns(props.data.columns),
    }
  }

  addonColumns = [{
    key: 'index',
    width: 240,
    fixed: 'left',
    dataIndex: 'index',
    title: '数据源',
    render: (_, record) => <span>{record.data._index}</span>,
  }]

  parseColumns (columns = []) {
    const onlyOne = {}
    const newColumns = columns.map((filter) => {
      const index = get(filter.field[0], 'value', '')
      const label = get(filter.field[1], 'label', '')
      const value = get(filter.field[1], 'value', '')
      const dataIndex = `${index}/${value}`

      if (onlyOne[dataIndex]) {
        return null
      }
      onlyOne[`${index}/${value}`] = true

      return {
        title: label,
        dataIndex,
        key: dataIndex,
        render: (_, record) => <span>{get(record.data._source, toPath(value), '')}</span>,
      }
    })

    return newColumns.length ? this.addonColumns.concat(compact(newColumns)) : []
  }

  parseDataSource (dataSource = []) {
    let newSources = []

    this.pagination.total = 0
    dataSource.forEach((source) => {
      this.pagination.total += source.total
      newSources = newSources.concat(source.hits.map(hit => ({ key: hit._id, data: hit })))
    })

    return newSources
  }

  componentWillReceiveProps (nextProps) {
    const { data: { dataSource, columns } } = nextProps

    if (dataSource) {
      this.state.dataSource = this.parseDataSource(dataSource)
    }
    if (columns) {
      this.state.columns = this.parseColumns(columns)
    }
    this.setState({ ...this.state })
  }

  onPageChange (currentPage, pageSize) {
    this.props.onPageChange(currentPage - 1, pageSize)
  }

  render () {
    const { columns, dataSource } = this.state

    return (<Table
      ref="DataTable"
      size="small"
      bordered
      pagination={this.pagination}
      columns={columns}
      dataSource={dataSource}
    />)
  }
}

DataTable.propTypes = {
  onPageChange: PropTypes.func,
  data: PropTypes.object,
  columns: PropTypes.array,
  dataSource: PropTypes.array,
}

export default DataTable
