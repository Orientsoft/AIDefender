import React from 'react'
import PropTypes from 'prop-types'
import Plotly from 'react-plotly.js'

const layout = {
  margin: {
    t: 10,
    b: 10,
    r: 10,
  },
  yaxis: {
    visible: false,
    fixedrange: true,
  },
  xaxis: {
    visible: false,
    fixedrange: true,
  },
  showTips: false,
  showlegend: false,
  doubleClick: false,
}

const config = {
  displayModeBar: false,
}

export default class Index extends React.Component {
  initChart (el) {
    
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
    return (
      <Plotly
        data={[]}
        layout={layout}
        config={config}
        onRelayout={this.onChartUpdate}
        style={{ height: 200, width: '100%' }}
      />
    )
  }
}

Index.propTypes = {
  dispatch: PropTypes.func.isRequired,
  defaultTimeRange: PropTypes.array.isRequired,
  config: PropTypes.object.isRequired,
}
