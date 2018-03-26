// @flow
import * as datetime from 'utils/datetime'

// 最小/最大范围值
export const MIN_VALUE: number = 0
export const MAX_VALUE: number = 100

export type TimeSliceData = {|
  xAxis: Array<string>,
  yAxis: Array<string>,
  data: Array<Array<number>>,
|}

export default {
  animation: false,
  grid: {
    height: '70%',
    top: 0,
    right: 0,
  },
  xAxis: {
    type: 'category',
    data: [],
    splitArea: {
      show: true,
    },
    axisLabel: {
      formatter: (label: string): string => datetime.formatMinute(label),
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
