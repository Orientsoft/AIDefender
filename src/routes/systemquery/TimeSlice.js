import React from 'react'
import PropTypes from 'prop-types'

export default class Index extends React.Component {
  componentWillMount () {
    
  }

  componentWillReceiveProps (nextProps) {
    
  }

  render () {
    return (
      <div>
        <div style={{ width: '100%', height: chartHeight }} ref={el => this.initChart(el)} />
        <div style={{ width: '100%', height: hourCH }} ref={el => this.initHourChart(el)} />
        <div style={{ width: '100%', height: minuteCH }} ref={el => this.initMinuteChart(el)} />
      </div>
    )
  }
}

Index.propTypes = {
  dispatch: PropTypes.func.isRequired,
  app: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
}
