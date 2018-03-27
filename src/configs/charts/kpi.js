// @flow
import { formatMinute } from 'utils/datetime'

export type KPIData = {|
  title: string,
  xAxis: Array<string>,
  data: Array<number>,
|}

export default {
  tooltip: {
    trigger: 'axis',
    formatter: (params: Array<any>): string => formatMinute(params[0].name),
  },
  title: {},
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
      formatter: (label: string): string => formatMinute(label),
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
