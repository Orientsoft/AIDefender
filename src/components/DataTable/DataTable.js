import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import get from 'lodash/get'
import toPath from 'lodash/toPath'
import compact from 'lodash/compact'
import flatten from 'lodash/flatten'
import { ALERT_CONFIG } from 'services/consts'
import datetime, { formatSecond } from 'utils/datetime'
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
    const { columns, dataSource } = props
    this.state = {
      columns: this.parseColumns(columns),
      dataSource: this.parseDataSource(dataSource, columns),
    }
  }

  addonColumns = [{
    title: '时间',
    key: '@default/timestamp',
    width: 240,
    sorter: (a, b) => {
      const tsA = get(a, 'data._column.timestamp', '@timestamp')
      const tsB = get(b, 'data._column.timestamp', '@timestamp')
      return +datetime(a.data._source[tsA]) - datetime(b.data._source[tsB])
    },
    render: (_, record) => {
      const { _source, _column } = record.data
      const ts = get(_column, 'timestamp', '@timestamp')
      return formatSecond(_source[ts])
    },
  }]

  parseColumns (columns = []) {
    if (!columns.length) {
      return []
    }
    const newColumns = columns.map((config, i) => {
      const onlyOne = {}
      const ts = config.timestamp
      const fields = config.fields.map((field) => {
        const result = {}
        const dataIndex = `${config.index}/${field.field}`
        // If index and field already exist, ignore it
        if (onlyOne[dataIndex]) {
          return null
        }
        onlyOne[dataIndex] = true
        if (ts === field.field) {
          // Object.assign(result, {
          //   width: 240,
          //   sorter: (a, b) => {
          //     return +datetime(a.data._source[ts]) - datetime(b.data._source[ts])
          //   },
          // })
          // 用户不能配置时间字段
          return null
        }
        return Object.assign(result, {
          title: field.label,
          dataIndex,
          key: `${dataIndex}@${i}`,
          render: (_, record) => {
            const value = get(record.data._source, toPath(field.field), '')

            if (config.type === ALERT_CONFIG && field.field === 'level') {
              let style = {}
              if (typeof value === 'string') {
                switch (value.toLowerCase()) {
                  case 'warning':
                    style = { color: 'rgb(255,165,0)' }
                    break
                  case 'error':
                    style = { color: 'rgb(255,0,0)' }
                    break
                  default:
                    style = {}
                }
                return <span style={style}>{value}</span>
              }
            }
            return ts === field.field ? formatSecond(value) : value
          },
        })
      })

      return compact(fields)
    })

    return this.addonColumns.concat(flatten(newColumns))
  }

  parseDataSource (dataSource = [], columns = []) {
    let newSources = []

    this.pagination.total = 0
    dataSource.forEach((source) => {
      this.pagination.total += source.total
      newSources = newSources.concat(source.hits.map(hit => ({
        key: hit._id,
        data: Object.assign({
          _column: columns.find(c => c.index === hit._index),
        }, hit),
      })))
    })

    return newSources
  }

  componentWillReceiveProps (nextProps) {
    const { data: { dataSource, columns } } = nextProps

    if (columns) {
      this.state.columns = this.parseColumns(columns)
    }
    if (dataSource) {
      this.state.dataSource = this.parseDataSource(dataSource, columns)
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
      expandedRowRender={record => (
        <textarea
          readOnly
          spellCheck={false}
          style={{
            width: '100%',
            height: 240,
            outline: 'none',
            background: 'none',
            border: 'none',
          }}
          value={JSON.stringify(record, null, 4)}
        />
      )}
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
