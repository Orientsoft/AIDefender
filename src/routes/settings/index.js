import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Page, Search, MapNode } from 'components'
import ReactEcharts from 'echarts-for-react'
import {treeData} from '../../mock/structures'
import {Tabs} from 'antd'


const Index = ({
  settings, dispatch, loading, location,
}) => {

  const TabPane = Tabs.TabPane

  return (<Page inner>
     <Tabs type="card">
          <TabPane tab="系统ONE" key="1">
            <MapNode nodes={treeData}/>          
          </TabPane>
          <TabPane tab="Tab 2" key="2">
            <MapNode nodes={treeData}/>          
          </TabPane>
          <TabPane tab="Tab 3" key="3">
          </TabPane>
    </Tabs>
  </Page>)
}

Index.propTypes = {
  singlequery: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ settings, loading }) => ({ settings, loading }))(Index)
