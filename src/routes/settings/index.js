import React from 'react'
import PropTypes from 'prop-types'
import capitalize from 'lodash/capitalize'
import { connect } from 'dva'
import { Page, MapNode } from 'components'
import { Tabs, Modal } from 'antd'

const { TabPane } = Tabs

class Index extends React.Component {
  state = {}

  onAdd = () => {
    this.props.dispatch({ type: 'settings/queryMetaTree' })
  }

  onRemove = (key) => {
    this.props.dispatch({
      type: 'settings/addTreeData',
      payload: parseInt(key, 10),
    })
  }

  onOk = () => {
    const { dispatch } = this.props

    dispatch({
      type: 'settings/toggleModal',
      payload: false,
    })
    dispatch({
      type: 'settings/addTreeData',
      payload: this.treeData,
    })
  }

  onCancel = () => {
    this.props.dispatch({
      type: 'settings/toggleModal',
      payload: false,
    })
  }

  componentWillMount () {
    this.props.dispatch({ type: 'settings/query' })
  }

  render () {
    const { settings } = this.props

    return (
      <Page inner>
        <Modal visible={settings.showModal} onOk={this.onOk} onCancel={this.onCancel}>
          <MapNode nodes={settings.metaTreeData} maxLevel="4" />
        </Modal>
        <Tabs type="editable-card" onEdit={(key, action) => this[`on${capitalize(action)}`](key)}>
          {settings.treeData.map((data, key) => (
            <TabPane key={key} tab={data.name}>
              <MapNode nodes={data} maxLevel="4" />
            </TabPane>
          ))}
        </Tabs>
      </Page>
    )
  }
}

Index.propTypes = {
  settings: PropTypes.object,
  loading: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ settings, loading }) => ({ settings, loading }))(Index)
