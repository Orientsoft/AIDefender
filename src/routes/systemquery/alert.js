import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import get from 'lodash/get'
import { formatSecond } from 'utils/datetime'
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
    const timeRange = [globalTimeRange[2], globalTimeRange[3]]
    const columns = [{
      key: 'createdAt',
      title: '日期',
      dataIndex: 'createdAt',
      width: 240,
      render: value => formatSecond(value),
    }, {
      key: 'level',
      title: '告警级别',
      dataIndex: 'level',
    }, {
      key: 'serverity',
      title: '告警值',
      dataIndex: 'serverity',
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
        <div style={{ marginTop: '1em' }}>
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
