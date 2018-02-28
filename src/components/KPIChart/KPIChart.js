import React, { Component } from 'react'
import PropTypes from 'prop-types'
import echarts from 'echarts'
import { Card } from 'antd'
import moment from 'moment'
import styles from './KPIChart.less'

class KPIChart extends Component {
  charts = {}

  render () {
    const { chartConfig = { chart: { values: [] } } } = this.props

    return (
      <Card>
        {chartConfig.chart.values.map((v, key) => (
          <div key={key} className={styles.chart} ref={el => el && this.initChart(el, v)} />
        ))}
      </Card>
    )
  }

  initChart (el, { field, fieldChinese }) {
    const { chartConfig: { chart }, dataSource: { buckets = [] } } = this.props

    this.charts[field] = echarts.init(el)
    const option = {
      title: {
        text: fieldChinese,
      },
      xAxis: {
        type: 'category',
        // boundaryGap: false,
        data: buckets.map(b => moment(b.key).format('YYYY-MM-DD')),
        name: chart.x.label,
        nameLocation: 'center',
        nameGap: 35,
        nameTextStyle: {
          fontWeight: 'bold',
          fontSize: 16,
        },
      },
      yAxis: {
        type: 'value',
        nameGap: 30,
      },
      tooltip: {
        trigger: 'axis',
      },
      series: [{
        data: buckets.map(bks => bks[field].buckets.reduce((total, bk) => total + bk.doc_count, 0)),
        type: chart.type,
        areaStyle: {
          normal: {
            color: '#2ec7c9',
            opacity: 0.3,
          },
        },
        lineStyle: {
          normal: {
            color: '#2ec7c9',
          },
        },
        itemStyle: {
          normal: {
            color: '#2ec7c9',
            opacity: 0.6,
          },
        },
      }],
    }
    this.charts[field].setOption(option)
    echarts.connect(Object.values(this.charts))
  }
}

KPIChart.propTypes = {
  chartConfig: PropTypes.object,
  dataSource: PropTypes.object.isRequired,
}

export default KPIChart
