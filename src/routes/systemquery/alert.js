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
      key: 'level',
      title: '告警级别',
      dataIndex: 'level',
    }, {
      key: 'serverity',
      title: '告警值',
      dataIndex: 'serverity',
      render: value => value || 0,
      sorter: (a, b) => a.serverity - b.serverity,
    }]
    const hits = get(config.alertData, 'hits', { hits: [], total: 0 })
    const dataSource = hits.hits.map((data, key) => {
      const { createdAt, level, serverity } = data._source
      return {
        key,
        createdAt,
        level,
        serverity,
      }
    })

    return (
      <div>
        <TimeSlice dispatch={dispatch} config={config} timeRange={timeRange} />
        <Divider />
        <div>
          <p>找到 <span style={{ color: '#1890ff' }}>{hits.total}</span> 条结果：</p>
          <Table
            size="small"
            pagination={{ defaultPageSize: 20, total: hits.total, onChange: this.onPageChange }}
            bordered
            columns={columns}
            dataSource={dataSource}
          />
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
