import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Page } from 'components'
import ReactEcharts from 'echarts-for-react'


const Index = ({
  settings, dispatch, loading, location,
}) => {
  let onEvents = {
    click: (e, data) => {
      console.log(e.data, data, 'click')
    },
    dblclick: (e) => {
      console.log(e.data, 'dbclick')
    },
    contextmenu: (e) => {
      console.log(e.data, 'menu')
    },
  }
  const data = {
    name: 'APP监控',
    collapsed: false,
    symbol: 'roundRect',
    // layout: 'radial',
    // orient: 'vertical',
    children: [{
      name: 'Java VM',
      // symbol: 'arrow',
      value: 100,
    }, {
      name: 'Nginx',
      value: 200,
      // orient: 'vertical',
      children: [{
        name: 'Worker1',
      }, {
        name: 'Worker2',
      },
      ],
    }, {
      name: 'test1',
    }],
  }
  const options = {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
    },
    series: [
      {
        type: 'tree',
        data: [data],
        top: '1%',
        left: '7%',
        bottom: '1%',
        right: '20%',
        // orient: 'vertical',
        orient: 'horizontal',
        symbolSize: 50,
        itemStyle: {
          borderColor: '#03D0B2',
          borderWidth: 2,
        },
        label: {
          normal: {
            position: 'inside',
            verticalAlign: 'middle',
            align: 'center',
            fontSize: 10,
          },
        },
        leaves: {
          label: {
            normal: {
              position: 'right',
              verticalAlign: 'middle',
              align: 'left',
            },
          },
        },

        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750,

      },
    ],

  }

  return (<Page inner>
    <ReactEcharts option={options} onEvents={onEvents} />
  </Page>)
}

Index.propTypes = {
  singlequery: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ settings, loading }) => ({ settings, loading }))(Index)
