// @flow
import { formatSecond } from 'utils/datetime'

export default {
  tooltip: {
    formatter: ({ marker, value }: any): string => {
      return `${formatSecond(value[4])}<br>${marker}${value[5]}: ${value[2]}`
    },
  },
  title: {},
  grid: {
    left: 10,
    right: 10,
    bottom: 10,
    containLabel: true,
  },
  xAxis: [{
    type: 'category',
    data: [],
    // boundaryGap: false,
    splitLine: {
      show: true,
    },
    axisLabel: {
      formatter: (label: string): string => formatSecond(label),
    },
  }],
  yAxis: {
    type: 'category',
    data: [],
    splitLine: {
      show: true,
    },
  },
  series: [{
    type: 'scatter',
    symbolSize: (value: Array<number>) => {
      return value[3] ? (value[2] / value[3] * 20) : 0
    },
    data: [],
  }],
}
