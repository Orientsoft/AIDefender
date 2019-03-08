// @flow
import { formatSecond } from 'utils/datetime'

// 最小/最大范围值
export const MIN_VALUE: number = 0
export const MAX_VALUE: number = 100

export type TimeSliceData = {|
  xAxis: Array<string>,
  yAxis: Array<string>,
  data: Array<Array<number>>,
  grid: { left: number },
|}

const chartConfig = {
  tooltip: {
    formatter: ({ data: { alertName, name } }: any): string => `${alertName}<br/>${formatSecond(name)}`,
  },
  animation: false,
  grid: {
    height: '55%',
    top: 0,
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
    splitArea: {
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
    splitArea: {
      show: true,
    },
  }],
  // visualMap: {
  //   show: false,
  //   min: MIN_VALUE,
  //   max: MAX_VALUE,
  // },
  series: [{
    type: 'heatmap',
    data: [],
  }],
}

// 图表全屏时的相关样式
export const fullScreenChartConfig = {
  tooltip: {
    formatter: ({ data: { alertName, name } }: any): string => `${alertName}<br/>${formatSecond(name)}`,
  },
  animation: false,
  grid: {
    height: '55%',
    top: 0,
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
    splitArea: {
      show: true,
    },
    axisLabel: {
      formatter: (label: string): string => formatSecond(label),
      color: 'white',
    },
  }, {
    show: false,
    type: 'category',
    data: [],
  }],
  yAxis: [{
    type: 'category',
    data: [],
    splitArea: {
      show: true,
    },
    axisLabel: {
      color: 'white',
    },
  }],
  // visualMap: {
  //   show: false,
  //   min: MIN_VALUE,
  //   max: MAX_VALUE,
  // },
  series: [{
    type: 'heatmap',
    data: [],
  }],
}

export default chartConfig
