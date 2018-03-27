import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { formatSecond } from 'utils/datetime'
import TimeSlice from './components/TimeSlice'

export default class Index extends React.Component {
  render () {
    const { config, dispatch, app: { globalTimeRange } } = this.props
    const timeRange = [globalTimeRange[2], globalTimeRange[3]]
    const columns = [{
      key: 'createdAt',
      title: '日期',
      dataIndex: 'createdAt',
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
    const dataSource = config.alertData.map((data, key) => {
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
          <Table
            size="small"
            pagination={{ defaultPageSize: 20 }}
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
