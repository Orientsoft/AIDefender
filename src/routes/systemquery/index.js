import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page, MapNode } from 'components'
import { Tabs, Icon, Row, Col, DatePicker } from 'antd'
import datetime from 'utils/datetime'
import $ from 'jquery'
import 'ion-rangeslider'
import get from 'lodash/get'
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
    const { systemquery, dispatch } = this.props
    const cid = get(systemquery.structure, '_id', '')
    const nid = get(nextProps.systemquery.structure, '_id', '')

    if (match && match.params && match.params.uid && this.props.match && this.props.match.params) {
      if (match.params.uid !== this.props.match.params.uid) {
        this.updateStructure(match.params.uid)
      }
    }
    if (cid && nid && cid !== nid) {
      dispatch({
        type: 'systemquery/resetResult',
        payload: {
          activeNode: null,
        },
      })
    }
  }

  getTab (key) {
    const { app, systemquery, dispatch } = this.props
    const tabs = [
      <MapNode nodes={systemquery.structure} mapNodeMode="query" onSelect={node => this.onSelectNode(node)} maxLevel="4" />,
      <KPI dispatch={dispatch} app={app} config={systemquery} />,
      <Alert dispatch={dispatch} app={app} config={systemquery} />,
      <Query dispatch={dispatch} app={app} config={systemquery} onPageChange={this.onPageChange} />,
    ]

    return tabs[key]
  }

  onSelectNode (node) {
    const { dispatch, systemquery } = this.props
    const { data = {} } = node

    dispatch({ type: 'systemquery/setActiveNode', payload: node })
    dispatch({ type: 'systemquery/getCurrentSource', payload: node.data.ds[0] })

    if (!systemquery.activeNode
        || (systemquery.activeNode && (systemquery.activeNode.code !== node.code))) {
      dispatch({ type: 'systemquery/resetResult' })
    }
    if (data.ds) {
      dispatch({ type: 'systemquery/queryDSConfig', payload: data.ds })
    }
    if (data.kpi) {
      dispatch({ type: 'systemquery/queryKPIConfig', payload: data.kpi })
    }
    // if (data.alert) {
    //   dispatch({ type: 'systemquery/queryAlertConfig', payload: data.alert })
    // }
  }

  initDateTimeSlider (el) {
    const { app: { globalTimeRange } } = this.props
    const max = +globalTimeRange[1].clone().endOf('day')
    const min = +globalTimeRange[0]

    if (this.slider) {
      this.slider.destroy()
    }
    if (!el) return

    $(el).ionRangeSlider({
      type: 'double',
      grid: true,
      to_shadow: true,
      force_edges: true,
      to_max: datetime().isSame(globalTimeRange[1], 'day') ? +datetime().endOf('day') : max,
      max,
      min,
      prettify: date => datetime(date, 'x').locale('zh-cn').format('YYYY-MM-DD HH:mm'),
      onFinish: this.onDateTimeSliderFinish.bind(this),
    })
    this.slider = $(el).data('ionRangeSlider')
    if (this.slider) {
      this.slider.update({
        from: +globalTimeRange[2],
        to: +globalTimeRange[3],
      })
    }
  }

  onDateTimeSliderFinish (data) {
    const { app: { globalTimeRange }, dispatch } = this.props

    globalTimeRange[2] = datetime(data.from)
    globalTimeRange[3] = datetime(data.to)

    // globalTimeRange[0].set({
    //   hour: from.hour(),
    //   minute: from.minute(),
    //   second: from.second(),
    // })
    // globalTimeRange[1].set({
    //   hour: to.hour(),
    //   minute: to.minute(),
    //   second: to.second(),
    // })
    dispatch({ type: 'app/setGlobalTimeRange', payload: globalTimeRange })
  }

  onDisableDate = (date, partial) => {
    const { globalTimeRange } = this.props.app
    const shouldDisable = date && date.isAfter(datetime())

    if (partial === 'start') {
      return shouldDisable || date.isAfter(globalTimeRange[1])
    }
    return shouldDisable || date.isBefore(globalTimeRange[0])
  }

  onDateChange = (date, dateString, partial) => {
    let { app: { globalTimeRange }, dispatch } = this.props

    if (partial === 'start') {
      globalTimeRange[0] = date
      globalTimeRange[2] = date
    } else {
      const now = datetime()
      globalTimeRange[1] = date
      globalTimeRange[3] = date.isSame(now, 'day') ? now : date.endOf('day')
    }
    dispatch({ type: 'app/setGlobalTimeRange', payload: globalTimeRange })
  }

  onGotoDate = (partial) => {
    const { app: { globalTimeRange }, dispatch } = this.props
    const end = globalTimeRange[1].clone()

    if (partial === 'prev') {
      globalTimeRange[0].subtract(1, 'days')
    } else if (end.add(1, 'days').isBefore(datetime())) {
      globalTimeRange[1].add(1, 'days')
    }
    dispatch({ type: 'app/setGlobalTimeRange', payload: globalTimeRange })
  }

  onPageChange (payload, currentPage, pageSize) {
    this.props.dispatch({
      type: 'systemquery/query',
      payload: {
        filters: payload,
        dateRange: this.props.app.globalTimeRange,
      },
      currentPage,
      pageSize,
    })
  }

  render () {
    const { systemquery, app } = this.props
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
            <DatePicker onChange={(d, ds) => this.onDateChange(d, ds, 'start')} value={app.globalTimeRange[0]} allowClear={false} disabledDate={d => this.onDisableDate(d, 'start')} placeholder="开始日期" />
          </Col>
          <Col span={1} className={styles.offset}>
            <a title="前一天" className={styles.goto} onClick={() => this.onGotoDate('prev')}>&lt;&lt;</a>
          </Col>
          <Col span={16}>
            <input ref={el => this.initDateTimeSlider(el)} />
          </Col>
          <Col span={1} className={styles.offset} justify="center">
            <a title="后一天" className={styles.goto} onClick={() => this.onGotoDate('next')}>&gt;&gt;</a>
          </Col>
          <Col span={3} className={styles.offset}>
            <DatePicker onChange={(d, ds) => this.onDateChange(d, ds, 'end')} value={app.globalTimeRange[1]} allowClear={false} disabledDate={d => this.onDisableDate(d, 'end')} placeholder="结束日期" />
          </Col>
        </Row>
        <Page inner>
          {systemquery.structure && (
            <Tabs animated={false}>
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
