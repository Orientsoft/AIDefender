import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'
import moment from 'moment'
import { Tabs, Icon, Row, Col } from 'antd'

const { TabPane } = Tabs

class Index extends React.Component {

  initDateTimeSlider (el) {
    const startMoment = moment()
    const endMoment = moment()

    if (this.slider) {
      this.slider.destroy()
    }
    jQuery(el).ionRangeSlider({
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
    this.slider = jQuery(el).data('ionRangeSlider')
  }

  onDateTimeSliderFinish (data) {
    console.log(data.from, data.to)
  }

  componentWillMount () {
    this.props.dispatch({ type: 'systemquery/query' })
  }

  render () {
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
            {app.subMenus.map((tab, key) => {
              return (
                <TabPane key={key} tab={<span><Icon type="settings" />{tab}</span>}>
                  {null}
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
