import React from 'react'
import PropTypes from 'prop-types'
import { Table, Divider, Button, Row, Col, Select, InputNumber } from 'antd'
import get from 'lodash/get'
import datetime, { formatSecond } from 'utils/datetime'
import TimeSlice from './components/TimeSlice'
import styles from './index.less'

const { Option } = Select
const AI_ALERT_REFRESH_TIME = '__ai_refresh_time__'
const INTERVAL_SPAN = '__interval_span__'

const intervals = [{
  label: '自动',
  value: 'auto',
}, {
  label: '天',
  value: 'day',
}, {
  label: '小时',
  value: 'hour',
}, {
  label: '分钟',
  value: 'minute',
}]

export default class Index extends React.Component {
  state = {
    currentPage: 1,
    activeRecord: null,
    refreshTime: 0,
    chartStyle: {},
    interval: 'auto',
    isFullScreen: false,
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
      if (globalTimeRange[2].isAfter(globalTimeRange[0], 'day')) {
        globalTimeRange[0] = globalTimeRange[2].clone().startOf('day')
      }
      if (globalTimeRange[3].isAfter(globalTimeRange[1], 'day')) {
        globalTimeRange[1] = globalTimeRange[3].clone().endOf('day')
      }
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

  componentWillReceiveProps (nextProps) {
    const { app: { globalTimeRange } } = nextProps
    let { interval } = this.state
    let isSame = false

    if (interval !== 'auto') {
      isSame = globalTimeRange[3].isSame(globalTimeRange[2], interval)
    }
    if (isSame) {
      switch (interval) {
        case 'day':
          interval = 'hour'
          break
        case 'hour':
          interval = 'minute'
          break
        default:
          interval = 'auto'
      }
      this.onIntervalChange(interval)
    }
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
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        paddingTop: 40,
        zIndex: 999999,
        background: '#000',
      },
      isFullScreen: true,
    })
  }

  quitFullScreen = () => this.setState({
    chartStyle: {},
    isFullScreen: false,
  });

  onIntervalChange = (value) => {
    this.setState({ interval: value })
    sessionStorage.setItem(INTERVAL_SPAN, value) /* eslint-disable-line */
  };

  shouldDisableInterval = (interval) => {
    const { app: { globalTimeRange } } = this.props
    const isSame = globalTimeRange[3].isSame(globalTimeRange[2], interval)

    return interval === 'auto' ? false : isSame
  };

  render () {
    const { config, dispatch, app: { globalTimeRange } } = this.props
    const { currentPage, refreshTime, chartStyle, isFullScreen, interval } = this.state
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
          <TimeSlice isFullScreen={isFullScreen} interval={interval} dispatch={dispatch} config={config} timeRange={timeRange} onClick={this.onIndexChange} />
        </div>
        <Row type="flex" align="middle">
          <Col span={2}><Button onClick={this.openChartOnFullScreen}>全屏</Button></Col>
          <Col>时间粒度:&nbsp;</Col>
          <Col span={3}>
            <Select style={{ width: '80%' }} onChange={this.onIntervalChange} value={interval} placeholder="未设置">
              {intervals.map(({ label, value }) => <Option disabled={this.shouldDisableInterval(value)} key={value} value={value}>{label}</Option>)}
            </Select>
          </Col>
          <Col>刷新间隔:&nbsp;</Col>
          <Col span={4}>
            <InputNumber min={1} max={60} style={{ width: 120 }} onChange={v => this.setState({ refreshTime: v })} defaultValue={refreshTime} onBlur={this.onRefresh} placeholder="1 ～ 60分钟" />&nbsp;分钟
          </Col>
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
