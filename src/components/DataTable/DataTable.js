import React from 'react'
import PropTypes from 'prop-types'
import { Table, Tabs, Modal } from 'antd'
import get from 'lodash/get'
import toPath from 'lodash/toPath'
import compact from 'lodash/compact'
import { ALERT_CONFIG } from 'services/consts'
import datetime, { formatSecond } from 'utils/datetime'
import './DataTable.less'

const { TabPane } = Tabs

class DataTable extends React.Component {
  constructor (props) {
    super(props)
    this.paginations = []
    const { columns, dataSource } = props
    this.state = {
      columns: this.parseColumns(columns),
      dataSource: this.parseDataSource(dataSource, columns),
    }
  }

  _storedSources = []
  // 点击的是哪个数据源的分页
  _indexWillChange = null

  /* eslint-disable */
  parseColumns (columns = []) {
    const newColumns = []
    if (!columns.length) {
      return []
    }

    columns.forEach((config, i) => {
      const onlyOne = {}
      const ts = config.timestamp
      newColumns[i] = { name: config.name }
      newColumns[i].data = [{
        title: '时间',
        width: 160,
        fixed: 'left',
        dataIndex: `${config.index}/${ts}`,
        sorter: (a, b) => {
          return +datetime(a.data._source[ts]) - datetime(b.data._source[ts])
        },
        render: (_, record) => formatSecond(record.data._source[ts]),
      }]
      const fields = config.fields.map((field) => {
        const result = {}
        const dataIndex = `${config.index}/${field.field}`
        // If index and field already exist, ignore it
        if (onlyOne[dataIndex]) {
          return null
        }
        onlyOne[dataIndex] = true
        if (ts === field.field) {
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
            return value //ts === field.field ? formatSecond(value) : value
          },
        })
      })
      newColumns[i].data = newColumns[i].data.concat(compact(fields), {
        title: '操作',
        width: 80,
        fixed: 'right',
        render: (_, record) => <a href="javascript: void(0);" onClick={() => this.showRecord(record)}>查看</a>,
      })
    })

    return newColumns
  }

  parseDataSource (dataSource = [], columns = []) {
    const index = columns.find(c => c._id === this._indexWillChange)

    if (!index) {
      this._storedSources.length = 0
    }
    dataSource.forEach((source, i) => {
      if (!this.paginations[i]) {
        this.paginations[i] = {
          total: 0,
          showQuickJumper: true,
          defaultPageSize: 20,
        }
      }
      this.paginations[i].total = source.total
      this.paginations[i].onChange = (currentPage, pageSize) => {
        this.onPageChange(currentPage, pageSize, get(columns[0], '_id'))
      }
      const data = source.hits.map(hit => ({
        key: hit._id,
        data: hit,
      }))
      if (index) {
        const j = columns.indexOf(index)
        this._storedSources[j] = data
      } else {
        this._storedSources.push(data)
      }
    })

    return this._storedSources
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

  showRecord (record) {
    Modal.info({
      title: <p>{get(record, 'data._source.name', record.key)}</p>,
      width: 560,
      content: (
        <pre style={{ height: 400 }}>
          <code>{JSON.stringify(record, null, 4)}</code>
        </pre>
      ),
      okText: '确定', 
    })
  }

  onPageChange (currentPage, pageSize, index) {
    this._indexWillChange = index
    this.props.onPageChange(currentPage - 1, pageSize, index)
  }

  render () {
    let { columns, dataSource } = this.state

    return (
      <Tabs type="card">
        {dataSource.map((ds, i) => (
          <TabPane tab={columns[i].name} key={i}>
            <Table
              ref="DataTable"
              size="small"
              bordered
              pagination={this.paginations[i]}
              columns={columns[i].data}
              dataSource={ds}
              scroll={{x: columns[i].data.length * 120}}
            />
          </TabPane>
        ))}
      </Tabs>
    )
  }
}

DataTable.propTypes = {
  onPageChange: PropTypes.func,
  data: PropTypes.object,
  columns: PropTypes.array,
  dataSource: PropTypes.array,
}

export default DataTable
