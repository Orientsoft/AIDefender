import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page, MapNode } from 'components'
import compact from 'lodash/compact'
import moment from 'moment'
import { Tabs, Icon, Row, Col } from 'antd'
import Query from './query'
import Alert from './alert'
import KPI from './kpi'
import $ from 'jquery'
import 'ion-rangeslider'

const { TabPane } = Tabs

class Index extends React.Component {
  tabs = [
    data => <MapNode nodes={data} maxLevel="4" />,
    () => <Query data={this.props.systemquery.result} />,
    () => <Alert data={this.props.systemquery.result} />,
    () => <KPI data={this.props.systemquery.KPIResult} />,
  ]

  initDateTimeSlider(el) {
    const startMoment = moment()
    const endMoment = moment()

    if (this.slider) {
      this.slider.destroy()
    }
    $(el).ionRangeSlider({
      type: 'double',
      grid: true,
      to_shadow: true,
      force_edges: true,
      to_max: +endMoment,
      max: +endMoment.clone().endOf('day'),
      min: +startMoment.clone().startOf('day'),
      prettify: date => moment(date, 'x').locale('zh-cn').format('HH:mm'),
      onFinish: this.onDateTimeSliderFinish,
    })
    this.slider = $(el).data('ionRangeSlider')
  }

  onDateTimeSliderFinish(data) {
    console.log(data.from, data.to)
  }

  getTabContent (tab, key) {
    if (key === 0) {
      return <MapNode mapNodeMode="query" nodes={tab} maxLevel="4" />
    }
    return <DataTable data={this.props.systemquery.result} />
  }

  componentWillMount() {
    this.props.dispatch({ type: 'systemquery/query' })
    this.props.dispatch({ type: 'systemquery/KPI'})
  }

  render() {
    const { systemquery, app } = this.props

    return (
      <div>
        <Row type="flex" justify="space-between" align="middle">
          <Col span={24}>
            <input ref={el => this.initDateTimeSlider(el)} />
          </Col>
        </Row>
        <Page inner>
          <Tabs>
            {compact([app.activeSubMenu].concat(systemquery.subMenus)).map((tab, key) => {
              return (
                <TabPane key={key} tab={<span><Icon type="setting" />{tab.name}</span>}>
                  {this.tabs[key] && this.tabs[key](tab)}
                </TabPane>
              )
            })}
          </Tabs>
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
}

export default connect(({ systemquery, app, loading }) => ({ app, systemquery, loading }))(Index)
