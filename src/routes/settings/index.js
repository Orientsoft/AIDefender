import React from 'react'
import PropTypes from 'prop-types'
import capitalize from 'lodash/capitalize'
import { connect } from 'dva'
import { Page, MapNode, ConfigModal } from 'components'
import { Tabs, Modal } from 'antd'
import './index.less'
import $ from 'jquery'

const { TabPane } = Tabs

class Index extends React.Component {
  state = {
    visible: false,
    item: {},
  }

  onMetaTreeChange = (treeData) => {
    this.treeData = treeData
  }

  onTabNodeTreeChange = (treeData) => {
    this.props.dispatch({
      type: 'settings/updateTreeData',
      payload: treeData,
    })
  }
  onAdd = () => {
    this.props.dispatch({ type: 'settings/queryMetaTree' })
  }

  onRemove = (key) => {
    const { dispatch, settings } = this.props
    const index = parseInt(key, 10)

    dispatch({
      type: 'settings/deleteTreeData',
      payload: settings.treeData[index],
    })
    dispatch({
      type: 'app/deleteSubMenu',
      payload: index,
    })
  }

  onOk = () => { 
    const { dispatch, settings } = this.props
    dispatch({
      type: 'settings/saveTreeData',
      payload: this.treeData || settings.metaTreeData
    })
    dispatch({
      type: 'settings/toggleModal',
      payload: false,
    })
    dispatch({
      type: 'app/updateSubMenus',
      payload: this.treeData || settings.metaTreeData,
    })
    
  }

  onCancel = () => {
    this.props.dispatch({
      type: 'settings/toggleModal',
      payload: false,
    })
  }

  onDbClickNode = (item) => {
    this.setState({
      visible: true,
      item,
    })
  }

  onEditFinish = () => {
    this.setState({
      visible: false,
    })
  }

  onEditCancel = () => {
    this.setState({
      visible: false,
    })
  }

  componentWillMount () {
    this.props.dispatch({ type: 'settings/query' })
  }

  render () {
    const { settings } = this.props
    const { visible, item } = this.state

    return (
      <Page inner>
        <Modal
          width="70%"
          visible={settings.showModal}
          onOk={this.onOk}
          onCancel={this.onCancel}
          okText="保存"
          cancelText="取消"
        >
          {settings.metaTreeData && <MapNode nodes={settings.metaTreeData} maxLevel="4" onChange={this.onMetaTreeChange} />}
        </Modal>
        <Tabs type="editable-card" onEdit={(key, action) => this[`on${capitalize(action)}`](key)}>
          {settings.treeData.map((data, key) => (
            <TabPane key={key} tab={data.name}>
              <MapNode nodes={data} maxLevel="4" mapNodeMode="settings" onChange={this.onTabNodeTreeChange} onDbClick={this.onDbClickNode} />
              <ConfigModal title={item.name} visible={visible} onOk={this.onEditFinish} onCancel={this.onEditCancel} />
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
