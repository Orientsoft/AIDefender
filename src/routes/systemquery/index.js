import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page, MapNode } from 'components'
import moment from 'moment'
import { Tabs, Icon, Row, Col, DatePicker } from 'antd'
import $ from 'jquery'
import 'ion-rangeslider'
import Query from './query'
import Alert from './alert'
import KPI from './kpi'
import styles from './index.less'

const { TabPane } = Tabs

class Index extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.onPageChange = this.onPageChange.bind(this)
  }

  componentWillMount () {
    const { match } = this.props

    if (match && match.params && match.params.uid) {
      this.updateStructure(match.params.uid)
    }
  }

  componentWillUnmount () {
    this.props.dispatch({ type: 'systemquery/setStructure', payload: null })
  }

  updateStructure (id) {
    const { dispatch } = this.props

    if (id) {
      dispatch({ type: 'systemquery/getStructure', payload: id })
    }
  }

  componentWillReceiveProps (nextProps) {
    const { match } = nextProps

    if (match && match.params && match.params.uid && this.props.match && this.props.match.params) {
      if (match.params.uid !== this.props.match.params.uid) {
        this.updateStructure(match.params.uid)
      }
    }
  }

  getTab (key) {
    const { systemquery, dispatch } = this.props
    const tabs = [
      <MapNode nodes={systemquery.structure} mapNodeMode="query" onSelect={node => this.onSelectNode(node)} maxLevel="4" />,
      <Query dispatch={dispatch} config={systemquery} onPageChange={this.onPageChange} />,
      <KPI dispatch={dispatch} config={systemquery} />,
      <Alert dispatch={dispatch} config={systemquery} />,
    ]

    return tabs[key]
  }

  onSelectNode (node) {
    const { dispatch, systemquery } = this.props
    const { data = {} } = node

    if (systemquery.activeNode && systemquery.activeNode.name !== node.name) {
      dispatch({ type: 'systemquery/resetResult' })
    }
    dispatch({ type: 'systemquery/setActiveNode', payload: node })
    if (data.ds) {
      dispatch({ type: 'systemquery/queryDSConfig', payload: data.ds })
    }
    if (data.kpi) {
      dispatch({ type: 'systemquery/queryKPIConfig', payload: data.kpi })
    }
    if (data.alert) {
      dispatch({ type: 'systemquery/queryAlertConfig', payload: data.alert })
    }
  }

  initDateTimeSlider (el) {
    const { app } = this.props
    let timeRange = null

    if (this.slider) {
      this.slider.destroy()
    } else {
      timeRange = app.globalTimeRange
    }
    $(el).ionRangeSlider({
      type: 'double',
      grid: true,
      to_shadow: true,
      force_edges: true,
      to_max: +moment(),
      max: +moment().endOf('day'),
      min: timeRange ? +moment(timeRange.from) : +moment().startOf('day'),
      prettify: date => moment(date, 'x').locale('zh-cn').format('HH:mm'),
      onFinish: this.onDateTimeSliderFinish.bind(this),
    })
    this.slider = $(el).data('ionRangeSlider')
  }

  onDateTimeSliderFinish (data) {
    this.props.dispatch({
      type: 'app/setGlobalTimeRange',
      payload: {
        from: +moment(data.from),
        to: +moment(data.to),
      },
    })
  }

  onDisableDate = (date) => {
    return date && date.isAfter(moment())
  }

  onDateChange = (date, dateString, partial) => {
    let { dateRange } = this.props.systemquery

    if (partial === 'start') {
      dateRange[0] = date
    } else {
      dateRange[1] = date
    }
    this.props.dispatch({ type: 'systemquery/setDateRange', payload: dateRange })
  }

  onGotoDate = (partial) => {

  }

  onPageChange (payload, currentPage, pageSize) {
    this.props.dispatch({
      type: 'systemquery/query',
      payload,
      currentPage,
      pageSize,
    })
  }

  render () {
    const { systemquery } = this.props
    const subMenus = []

    if (systemquery.activeNode) {
      systemquery.subMenus.forEach((item) => {
        subMenus.push({ name: systemquery.activeNode.name + item.name })
      })
    }

    return (
      <div>
        <Row type="flex" justify="space-between" align="middle">
          <Col span={3} className={styles.offset}>
            <DatePicker onChange={(d, ds) => this.onDateChange(d, ds, 'start')} value={systemquery.dateRange[0]} allowClear={false} disabledDate={this.onDisableDate} placeholder="开始日期" />
          </Col>
          <Col span={1} className={styles.offset}>
            <a title="前一天" onClick={() => this.onGotoDate('prev')}>&lt;&lt;</a>
          </Col>
          <Col span={16}>
            <input ref={el => this.initDateTimeSlider(el)} />
          </Col>
          <Col span={1} className={styles.offset} justify="center">
            <a title="后一天" onClick={() => this.onGotoDate('next')}>&gt;&gt;</a>
          </Col>
          <Col span={3} className={styles.offset}>
            <DatePicker onChange={(d, ds) => this.onDateChange(d, ds, 'end')} value={systemquery.dateRange[1]} allowClear={false} disabledDate={this.onDisableDate} placeholder="结束日期" />
          </Col>
        </Row>
        <Page inner>
          {systemquery.structure && (
            <Tabs>
              {[systemquery.structure].concat(subMenus).map((tab, key) => {
                return (
                  <TabPane key={key} tab={<span><Icon type="setting" />{tab.name}</span>}>
                    {this.getTab(key)}
                  </TabPane>
                )
              })}
            </Tabs>
          )}
        </Page>
      </div>
    )
  }
}

Index.propTypes = {
  systemquery: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  match: PropTypes.object,
}

export default connect(({ systemquery, app, loading }) => ({ app, systemquery, loading }))(Index)
