import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Page, Search, MapNode } from 'components'
import { Tabs } from 'antd'

class Index extends React.Component {
  componentWillMount() {
    this.props.dispatch({ type: 'settings/query' })
  }

  render() {
    const TabPane = Tabs.TabPane
    const { settings } = this.props

    return (<Page inner>
      <Tabs type="card">
        {settings.treeData.map((data, key) => (
          <TabPane key={key} tab={data.name}>
            <MapNode nodes={data} />
          </TabPane>
        ))}
      </Tabs>
    </Page>)
  }
}

Index.propTypes = {
  singlequery: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ settings, loading }) => ({ settings, loading }))(Index)
