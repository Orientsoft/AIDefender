// @flow
import { formatSecond } from 'utils/datetime'

export type KPIData = {|
  xAxis: Array<string>,
  yAxis?: Array<string>,
  data: Array<number>,
|}

export default {
  tooltip: {
    formatter: (params: Array<any>): string => {
      const { name, marker, value } = params[0]
      return `${formatSecond(name)}<br>${marker}${value}`
    },
    trigger: 'axis',
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
    boundaryGap: true,
    data: [],
    axisLabel: {
      formatter: (label: string): string => formatSecond(label),
    },
    axisTick: {
      alignWithLabel: true,
    },
  }, {
    show: false,
    type: 'category',
    data: [],
  }],
  yAxis: [{
    type: 'value',
  }],
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
