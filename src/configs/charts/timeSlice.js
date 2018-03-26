// @flow
export type TimeSliceData = {
  xAxis: Array<string>,
  yAxis: Array<string>,
  data: Array<Array<number>>,
}

export default {
  animation: false,
  grid: {
    height: '50%',
    y: '10%',
  },
  xAxis: {
    type: 'category',
    data: [],
    splitArea: {
      show: true,
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
    min: 0,
    max: 10,
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    bottom: '15%',
  },
  series: [{
    name: 'Punch Card',
    type: 'heatmap',
    data: [],
    label: {
      normal: {
        show: true,
      },
    },
    itemStyle: {
      emphasis: {
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
      },
    },
  }],
}
