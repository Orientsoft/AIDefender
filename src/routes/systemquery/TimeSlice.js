import React from 'react'
import PropTypes from 'prop-types'
import echarts from 'echarts'

var data = [];
var dataCount = 10;
var startTime = +new Date();
var categories = ['categoryA', 'categoryB', 'categoryC'];
var types = [
    {name: 'JS Heap', color: '#7b9ce1'},
    {name: 'Documents', color: '#bd6d6c'},
    {name: 'Nodes', color: '#75d874'},
    {name: 'Listeners', color: '#e0bc78'},
    {name: 'GPU Memory', color: '#dc77dc'},
    {name: 'GPU', color: '#72b362'}
];

// Generate mock data
echarts.util.each(categories, function (category, index) {
    var baseTime = startTime;
    for (var i = 0; i < dataCount; i++) {
        var typeItem = types[Math.round(Math.random() * (types.length - 1))];
        var duration = Math.round(Math.random() * 10000);
        data.push({
            name: typeItem.name,
            value: [
                index,
                baseTime,
                baseTime += duration,
                duration
            ],
            itemStyle: {
                normal: {
                    color: typeItem.color
                }
            }
        });
        baseTime += Math.round(Math.random() * 2000);
    }
});

function renderItem(params, api) {
    var categoryIndex = api.value(0);
    var start = api.coord([api.value(1), categoryIndex]);
    var end = api.coord([api.value(2), categoryIndex]);
    var height = api.size([0, 1])[1] * 0.6;

    return {
        type: 'rect',
        shape: echarts.graphic.clipRectByRect({
            x: start[0],
            y: start[1] - height / 2,
            width: end[0] - start[0],
            height: height
        }, {
            x: params.coordSys.x,
            y: params.coordSys.y,
            width: params.coordSys.width,
            height: params.coordSys.height
        }),
        style: api.style()
    };
}

const defaultOption = {
  tooltip: {},
  xAxis: {
    min: startTime,
    scale: true,
    axisLabel: {
      formatter: val => `${Math.max(0, val - startTime)}ms`,
    },
  },
  yAxis: {
    data: categories,
  },
  grid: {
    top: 0,
    bottom: 20,
  },
  series: [{
    type: 'custom',
    renderItem,
    itemStyle: {
      normal: {
        opacity: 0.8,
      },
    },
    encode: {
      x: [1, 2],
      y: 0,
    },
    data,
  }],
}

export default class Index extends React.Component {
  componentWillMount () {
    this.queryResult()
  }

  initChart (el) {
    const { config: { alertResult } } = this.props

    if (el) {
      const chart = echarts.init(el)
      chart.setOption(defaultOption)
    }
  }

  queryResult () {
    const { dispatch, defaultTimeRange } = this.props

    dispatch({
      type: 'systemquery/queryAlert',
      payload: {
        timeRange: defaultTimeRange,
      },
    })
  }

  componentWillReceiveProps (nextProps) {
    const { config, defaultTimeRange } = nextProps
    console.log('time slice:', config.alertResult)
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    return (
      <div ref={el => this.initChart(el)} style={{ height: 120, width: '100%' }} />
    )
  }
}

Index.propTypes = {
  dispatch: PropTypes.func.isRequired,
  defaultTimeRange: PropTypes.array.isRequired,
  config: PropTypes.object.isRequired,
}
