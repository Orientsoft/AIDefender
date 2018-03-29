// @flow
import { formatSecond } from 'utils/datetime'

export type KPIData = {|
  xAxis: Array<string>,
  yAxis?: Array<string>,
  data: Array<number>,
|}

export default {
  tooltip: {
    formatter: ({ name, marker, value }: any): string => {
      return `${formatSecond(name)}<br>${marker}${value}`
    },
  },
  title: {},
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
    boundaryGap: true,
    data: [],
    axisLabel: {
      formatter: (label: string): string => formatSecond(label),
    },
  }, {
    show: false,
    type: 'category',
    data: [],
  }],
  yAxis: {
    type: 'value',
  },
  series: [{
    type: 'bar',
    itemStyle: {
      normal: {
        color: '#1890ff',
      },
    },
    data: [],
  }],
}
