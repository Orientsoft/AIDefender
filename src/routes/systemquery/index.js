import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page, MapNode } from 'components'
import moment from 'moment'
import { Tabs, Icon, Row, Col } from 'antd'
import $ from 'jquery'
import 'ion-rangeslider'
import Query from './query'
import Alert from './alert'
import KPI from './kpi'

const { TabPane } = Tabs

class Index extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.onPageChange = this.onPageChange.bind(this)
  }

  getTab (key) {
    const { app, systemquery, dispatch } = this.props
    const tabs = [
      <MapNode nodes={app.activeSubMenu} mapNodeMode="query" onSelect={node => this.onSelectNode(node)} maxLevel="4" />,
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

  onPageChange (payload, currentPage, pageSize) {
    this.props.dispatch({
      type: 'systemquery/query',
      payload,
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
          <Col span={24}>
            <input ref={el => this.initDateTimeSlider(el)} />
          </Col>
        </Row>
        <Page inner>
          {app.activeSubMenu && (
            <Tabs>
              {[app.activeSubMenu].concat(subMenus).map((tab, key) => {
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
}

export default connect(({ systemquery, app, loading }) => ({ app, systemquery, loading }))(Index)
