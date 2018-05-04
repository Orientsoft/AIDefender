import React from 'react'
import PropTypes from 'prop-types'
import { Table, Divider } from 'antd'
import get from 'lodash/get'
import datetime, { formatSecond } from 'utils/datetime'
import TimeSlice from './components/TimeSlice'

export default class Index extends React.Component {
  onPageChange = (page, pageSize) => {
    this.props.dispatch({
      type: 'systemquery/queryAlertData',
      payload: {
        from: (page - 1) * pageSize,
        size: pageSize,
      },
    })
  }

  render () {
    const { config, dispatch, app: { globalTimeRange } } = this.props
    const timeRange = globalTimeRange.map(t => t.clone())
    const columns = [{
      key: 'createdAt',
      title: '日期',
      dataIndex: 'createdAt',
      width: 240,
      sorter: (a, b) => +datetime(a.createdAt) - datetime(b.createdAt),
      render: value => formatSecond(value),
    }, {
      key: 'name',
      title: '名称',
      dataIndex: 'name',
    }, {
      key: 'level',
      title: '级别',
      dataIndex: 'level',
      render: (value) => {
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
        return null
      },
    }, {
      key: 'serverity',
      title: '异常指数',
      dataIndex: 'serverity',
      render: value => value || 0,
      sorter: (a, b) => a.serverity - b.serverity,
    }]
    const hits = get(config.alertData, 'hits', { hits: [], total: 0 })
    const dataSource = hits.hits.map((data, key) => {
      const {
        createdAt,
        name,
        level,
        serverity,
      } = data._source
      return {
        key,
        createdAt,
        name,
        level,
        serverity,
      }
    })

    return (
      <div>
        <TimeSlice dispatch={dispatch} config={config} timeRange={timeRange} />
        <Divider style={{ marginTop: '1em' }} />
        <div>
          <p>找到 <span style={{ color: '#1890ff' }}>{hits.total}</span> 条结果：</p>
          {dataSource.length ? (
            <Table
              size="small"
              pagination={{ defaultPageSize: 20, total: hits.total, onChange: this.onPageChange }}
              bordered
              columns={columns}
              dataSource={dataSource}
            />
          ) : null}
        </div>
      </div>
    )
  }
}

Index.propTypes = {
  dispatch: PropTypes.func.isRequired,
  app: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
}
