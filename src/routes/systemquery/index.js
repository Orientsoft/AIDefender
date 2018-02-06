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


  tabs = [
    data => <MapNode nodes={data} mapNodeMode="query" onSelect={node => this.onSelectNode(node)} maxLevel="4" />,
    () => <Query data={this.props.systemquery.queryResult} onPageChange={this.onPageChange} />,
    () => <Alert data={this.props.systemquery.alertResult} />,
    () => <KPI data={this.props.systemquery.kpiResult} />,
  ]

  onSelectNode (node) {
    this.props.dispatch({ type: 'systemquery/setActiveNode', payload: node })
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

  componentWillMount () {

  }

  onPageChange (currentPage, pageSize) {
    this.props.dispatch({ type: 'systemquery/query', payload: { currentPage, pageSize } })
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
                    {this.tabs[key] && this.tabs[key](tab)}
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
