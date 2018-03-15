import React from 'react'
import PropTypes from 'prop-types'
import echarts from 'echarts'
import moment from 'moment'
import cloneDeep from 'lodash/cloneDeep'

const option = {}

export default class Index extends React.Component {
  initChart (el) {
    const { defaultTimeRange, config } = this.props

    if (el) {
      const _option = cloneDeep(option)

      this.chart = echarts.init(el)
      this.chart.setOption(_option)
    } else {
      this.chart && this.chart.dispose()
    }
  }

  queryResult () {
    const { dispatch } = this.props

    dispatch({
      type: 'systemquery/queryAlert',
      payload: {},
    })
  }

  componentWillReceiveProps (nextProps) {
    const { defaultTimeRange } = nextProps
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    return null
  }
}

Index.propTypes = {
  dispatch: PropTypes.func.isRequired,
  defaultTimeRange: PropTypes.array.isRequired,
  config: PropTypes.object.isRequired,
}
