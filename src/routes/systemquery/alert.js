import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import TimeSlice from './TimeSlice'

export default class Index extends React.Component {
  render () {
    const { config, dispatch, app: { globalTimeRange } } = this.props
    const timeRange = [globalTimeRange[2], globalTimeRange[3]]
    const columns = [{
      key: 'name',
      title: '索引',
      dataIndex: 'name',
    }, {
      key: 'level',
      title: '告警级别',
      dataIndex: 'level',
    }, {
      key: 'createdAt',
      title: '时间',
      dataIndex: 'createdAt',
    }]
    const dataSource = config.alertData.map((data, key) => {
      const { name, level, createdAt } = data._source
      return {
        key,
        name,
        level,
        createdAt,
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
