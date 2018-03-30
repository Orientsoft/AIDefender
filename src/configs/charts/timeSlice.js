// @flow
import { formatMinute } from 'utils/datetime'

// 最小/最大范围值
export const MIN_VALUE: number = 0
export const MAX_VALUE: number = 100

export type TimeSliceData = {|
  xAxis: Array<string>,
  yAxis: Array<string>,
  data: Array<Array<number>>,
|}

export default {
  tooltip: {
    formatter: ({ data: { name } }: any): string => formatMinute(name),
  },
  animation: false,
  grid: {
    height: '70%',
    top: 0,
    right: 10,
    bottom: 20,
  },
  xAxis: {
    type: 'category',
    data: [],
    splitArea: {
      show: true,
    },
    axisLabel: {
      formatter: (label: string): string => formatMinute(label),
    },
  },
  yAxis: {
    type: 'category',
    data: [],
    splitArea: {
      show: true,
    },
  },
  visualMap: {
    show: false,
    min: MIN_VALUE,
    max: MAX_VALUE,
  },
  series: [{
    type: 'heatmap',
    data: [],
  }],
}
