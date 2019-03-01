import React from 'react'
import PropTypes from 'prop-types'
import { Table, Divider, Button, Row, Col, InputNumber } from 'antd'
import get from 'lodash/get'
import datetime, { formatSecond } from 'utils/datetime'
import TimeSlice from './components/TimeSlice'
import styles from './index.less'

const AI_ALERT_REFRESH_TIME = '__ai_refresh_time__'

export default class Index extends React.Component {
  state = {
    currentPage: 1,
    activeRecord: null,
    refreshTime: 0,
    chartStyle: {},
  }
  activeIndex = null
  refreshTimer = null

  onPageChange = (page, pageSize) => {
    this.setState({
      currentPage: page,
      activeRecord: null,
    })
    this.props.dispatch({
      type: 'systemquery/queryAlertData',
      payload: {
        index: this.activeIndex,
        from: (page - 1) * pageSize,
        size: pageSize,
      },
    })
  }

  onIndexChange = (e) => {
    this.activeIndex = e.index
    this.setState({
      currentPage: 1,
    })
  }

  onRowClick (e, record) {
    const { app: { globalTimeRange }, dispatch } = this.props
    const now = datetime(record.createdAt)

    this.setState({
      activeRecord: record,
    })
    globalTimeRange[2] = now.clone().subtract(1, 'minute')
    globalTimeRange[3] = now.clone().add(1, 'minute')
    dispatch({
      type: 'app/setGlobalTimeRange',
      payload: globalTimeRange,
    })
  }

  updateAlert = (t) => {
    const { app: { globalTimeRange }, dispatch } = this.props
    this.setState({ refreshTime: t })
    sessionStorage.setItem(AI_ALERT_REFRESH_TIME, t) /* eslint-disable-line */
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
    }
    this.refreshTimer = setInterval(() => {
      globalTimeRange[2].add(t, 'minutes')
      globalTimeRange[3].add(t, 'minutes')
      dispatch({
        type: 'app/setGlobalTimeRange',
        payload: globalTimeRange,
      })
    }, t * 60 * 1000)
  }

  onRefresh = () => {
    let t = parseInt(this.state.refreshTime, 10)
    if (isNaN(t) || t < 1) { /* eslint-disable-line */
      return
    }
    this.updateAlert(t)
  }

  componentDidMount () {
    let t = sessionStorage.getItem(AI_ALERT_REFRESH_TIME) /* eslint-disable-line */
    if (!t) {
      return
    }
    t = parseInt(t, 10)
    if (isNaN(t) || t < 1) { /* eslint-disable-line */
      return
    }
    this.updateAlert(t)
  }

  componentWillUnmount () {
    clearInterval(this.refreshTimer)
    this.refreshTimer = null
  }

  setRowClassName = (record) => {
    const { activeRecord } = this.state

    if (activeRecord && record.key === activeRecord.key) {
      return styles.rowSelected
    }
    return styles.row
  }

  openChartOnFullScreen = () => {
    this.setState({
      chartStyle: {
        background: 'white',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        paddingTop: 40,
        zIndex: 999999,
      },
    })
  }

  quitFullScreen = () => this.setState({ chartStyle: {} });

  render () {
    const { config, dispatch, app: { globalTimeRange } } = this.props
    const { currentPage, chartStyle } = this.state
    const timeRange = globalTimeRange.map(t => t.clone())
    const columns = [{
      key: 'createdAt',
      title: '日期',
      dataIndex: 'createdAt',
      width: 160,
      fixed: 'left',
      sorter: (a, b) => +datetime(a.createdAt) - datetime(b.createdAt),
      render: value => formatSecond(value),
    }, {
      key: 'name',
      title: '名称',
      dataIndex: 'name',
    }, {
      key: 'level',
      title: '级别',
      width: 160,
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
    }, {
      key: 'info.value',
      title: '取值',
      dataIndex: 'info.value',
      render: value => String(value),
    }]
    const hits = get(config.alertData, 'hits', { hits: [], total: 0 })
    const dataSource = hits.hits.map((data, key) => {
      const {
        createdAt,
        name,
        level,
        serverity,
        info,
      } = data._source
      return {
        key,
        createdAt,
        name,
        level,
        serverity,
        info,
      }
    })

    return (
      <div>
        <div style={chartStyle} onDoubleClick={this.quitFullScreen}>
          <TimeSlice dispatch={dispatch} config={config} timeRange={timeRange} onClick={this.onIndexChange} />
        </div>
        <Row type="flex" align="middle">
          <Col span={2}><Button onClick={this.openChartOnFullScreen}>全屏</Button></Col>
          <Col span={2}>刷新间隔:</Col>
          <Col><InputNumber min={1} max={60} style={{ width: 120 }} onChange={v => this.setState({ refreshTime: v })} onBlur={this.onRefresh} placeholder="1 ～ 60分钟" />&nbsp;分钟</Col>
        </Row>
        <Divider style={{ marginTop: '1em' }} />
        <div>
          <p>找到 <span style={{ color: '#1890ff' }}>{hits.total}</span> 条结果：</p>
          {dataSource.length ? (
            <Table
              size="small"
              onRow={record => ({
                onClick: e => this.onRowClick(e, record),
              })}
              current={this}
              scroll={{ x: columns.length * 100 }}
              rowClassName={this.setRowClassName}
              pagination={{
                current: currentPage,
                defaultPageSize: 20,
                total: hits.total,
                onChange: this.onPageChange,
              }}
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
