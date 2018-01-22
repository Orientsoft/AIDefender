import React from 'react'
import PropTypes from 'prop-types'
import capitalize from 'lodash/capitalize'
import { connect } from 'dva'
import { Page, MapNode, ConfigModal } from 'components'
import { Tabs } from 'antd'

const { TabPane } = Tabs

class Index extends React.Component {
  state = {}

  onAdd () {
    this.setState({
      visible: true,
    })
  }

  onRemove (key) {
  
  }

  onOk (data) {
    this.setState({
      visible: false,
    })
  }

  onCancel () {
    this.setState({
      visible: false,
    })
  }

  componentWillMount () {
    this.props.dispatch({ type: 'settings/query' })
  }

  render () {
    const { settings } = this.props
    const { visible = false } = this.state

    return (<Page inner>
      {visible ? <ConfigModal onOk={(data) => this.onOk(data)} onCancel={() => this.onCancel()} /> : null}
      <Tabs type="editable-card" onEdit={(key, action) => this[`on${capitalize(action)}`](key)}>
        {settings.treeData.map((data, key) => (
          <TabPane key={key} tab={data.name}>
            <MapNode nodes={data} maxLevel="4" />
          </TabPane>
        ))}
      </Tabs>
    </Page>)
  }
}

Index.propTypes = {
  settings: PropTypes.object,
  loading: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ settings, loading }) => ({ settings, loading }))(Index)
