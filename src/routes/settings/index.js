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
    console.log(treeData)
    this.treeData = treeData
  }

  onAdd = () => {
    this.props.dispatch({ type: 'settings/queryMetaTree' })
  }

  onRemove = (key, treeDataList) => {
    this.props.dispatch({
      type: 'settings/deleteTreeData',
      payload: treeDataList[parseInt(key, 10)],
    })
    this.props.dispatch({
      type: 'app/deleteSubMenu',
      payload: parseInt(key, 10),
    })
  }

  onOk = () => { 
    const { dispatch } = this.props
    dispatch({
      type: 'settings/saveTreeData',
      payload: this.treeData
    })
    dispatch({
      type: 'settings/toggleModal',
      payload: false,
    })
    dispatch({
      type: 'app/updateSubMenus',
      payload: this.treeData
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
          <MapNode nodes={settings.metaTreeData} maxLevel="4" onChange={this.onMetaTreeChange} />
        </Modal>
        <Tabs type="editable-card" onEdit={(key, action) => this[`on${capitalize(action)}`](key, settings.treeData)}>
          {settings.treeData.map((data, key) => (
            <TabPane key={key} tab={data.name}>
              <MapNode nodes={data} maxLevel="4" mapNodeMode="settings" onChange={this.onMetaTreeChange} onDbClick={this.onDbClickNode} />
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
