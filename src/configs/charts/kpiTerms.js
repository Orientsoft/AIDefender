// @flow
import { formatSecond } from 'utils/datetime'

const colors = [
  '#1890ff',
  '#61a0a8',
  '#d48265',
  '#91c7ae',
  '#749f83',
  '#2f4554',
  '#ca8622',
  '#bda29a',
  '#6e7074',
  '#546570',
  '#c4ccd3',
]
const COLOR_COUNT = colors.length

export default {
  tooltip: {
    formatter: ({ marker, value }: any): string => {
      return `${formatSecond(value[4])}<br>${marker}${value[5]}: ${value[2]}`
    },
  },
  title: {
    x: 'center',
  },
  grid: {
    left: 80,
    right: 10,
    bottom: 20,
  },
  toolbox: {
    feature: {
      dataZoom: {
        iconStyle: {
          opacity: 0,
        },
        yAxisIndex: 'none',
        xAxisIndex: 1,
      },
    },
  },
  xAxis: [{
    type: 'category',
    data: [],
    boundaryGap: false,
    splitLine: {
      show: true,
    },
    axisLabel: {
      formatter: (label: string): string => formatSecond(label),
    },
  }, {
    show: false,
    type: 'category',
    data: [],
  }],
  yAxis: [{
    type: 'category',
    data: [],
    splitLine: {
      show: true,
    },
  }],
  series: [{
    type: 'scatter',
    symbolSize: (value: Array<number>) => {
      return value[3] ? (value[2] / value[3] * 20) : 0
    },
    itemStyle: {
      color: ({ data }: any): string => colors[data[1] % COLOR_COUNT],
    },
    data: [],
  }],
}
