import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import get from 'lodash/get'
import toPath from 'lodash/toPath'
import compact from 'lodash/compact'
import flatten from 'lodash/flatten'
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

  addonColumns = []

  parseColumns (columns = []) {
    if (!columns.length) {
      return []
    }

    const newColumns = columns.map((config) => {
      const onlyOne = {}
      const fields = config.fields.map((field) => {
        const dataIndex = `${config.index}/${field.field}`
        // If index and field already exist, ignore it
        if (onlyOne[dataIndex]) {
          return null
        }
        onlyOne[dataIndex] = true

        return {
          title: field.label,
          dataIndex,
          key: dataIndex,
          render: (_, record) => <span>{get(record.data._source, toPath(field.field), '')}</span>,
        }
      })

      return compact(fields)
    })

    return this.addonColumns.concat(flatten(newColumns))
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
    let { columns, dataSource } = this.state
    // No result, no columns
    if (!dataSource.length) {
      columns = []
    }

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
