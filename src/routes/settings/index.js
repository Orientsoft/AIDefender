import React from 'react'
import PropTypes from 'prop-types'
import capitalize from 'lodash/capitalize'
import { connect } from 'dva'
import { Tabs, Modal } from 'antd'
import { Page, MapNode, ConfigModal } from 'components'
import NodeHelper from '../../components/MapNode/NodeHelper'
import './index.less'

const { TabPane } = Tabs
const { confirm } = Modal

class Index extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: false,
      item: {},
    }
    this.currentConfigTree = null
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

    confirm({
      title: '删除',
      content: '确实要删除该配置吗？',
      okText: '确定',
      cancelText: '取消',
      onOk () {
        dispatch({
          type: 'settings/deleteTreeData',
          payload: settings.treeData[index],
        })
        dispatch({
          type: 'app/deleteSubMenu',
          payload: index,
        })
      },
      onCancel () {},
    })
  }

  onOk = () => {
    const { dispatch, settings } = this.props
    dispatch({
      type: 'settings/saveTreeData',
      payload: this.treeData || settings.metaTreeData,
    })
    dispatch({
      type: 'settings/toggleModal',
      payload: false,
    })
  }

  onCancel = () => {
    this.props.dispatch({
      type: 'settings/toggleModal',
      payload: false,
    })
  }

  onDbClickNode = (item, treeData) => {
    this.currentConfigTree = treeData
    this.setState({
      visible: true,
      item,
    })
  }

  /**
   * 节点配置完成后的回调
   */
  onEditFinish = (data) => {
    this.setState({
      visible: false,
    })
    /** 暂时移除节点传递的代码，但是不要删除代码 */
    const nodeHelper = new NodeHelper(this.currentConfigTree)
    const editNode = nodeHelper.searchNode(this.state.item.code)
    console.log('ok',data, this.currentConfigTree, this.state.item.code, editNode)
    if(editNode) {
      console.log(data)
      editNode.data = data
    }
    // if (editNode) {
    //   editNode.data = data
    //   editNode.data.ds = editNode.data.ds || []
    //   editNode.data.alert = editNode.data.alert || []
    //   editNode.data.kpi = editNode.data.kpi || []
    //   let allParents = nodeHelper.getAllParents(editNode)
    //   //配置任意一个节点，均需要刷新传递到父节点
    //   if(allParents && allParents.length > 0) {
    //     for(let i = 0; i < allParents.length; i++) {
    //       allParents[i].data = allParents[i].data || {}
    //       allParents[i].data.ds = allParents[i].data.ds || []
    //       allParents[i].data.kpi = allParents[i].data.kpi || []
    //       allParents[i].data.alert = allParents[i].data.alert || []

    //       if(i == 0) {
    //         //合并值节点数据，并且去除重复
    //         allParents[i].data.ds = (new Set(allParents[i].data.ds.concat(editNode.data.ds))).toJSON()
    //         allParents[i].data.kpi = (new Set(allParents[i].data.kpi.concat(editNode.data.kpi))).toJSON()
    //         allParents[i].data.alert = (new Set(allParents[i].data.alert.concat(editNode.data.alert))).toJSON()
    //       } else {
    //         let childNode = allParents[i - 1]
    //         allParents[i].data.ds = (new Set(allParents[i].data.ds.concat(childNode.data.ds))).toJSON()
    //         allParents[i].data.kpi = (new Set(allParents[i].data.kpi.concat(childNode.data.kpi))).toJSON()
    //         allParents[i].data.alert = (new Set(allParents[i].data.alert.concat(childNode.data.alert))).toJSON()
    //       }
    //     }
    //     console.log(allParents)
    //   }
    // }
    // console.log(this.currentConfigTree, this.treeData)
    this.props.dispatch({
      type: 'settings/updateTreeData',
      payload: this.currentConfigTree,
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
            </TabPane>
          ))}
        </Tabs>
        {visible && <ConfigModal node={item} onOk={this.onEditFinish} onCancel={this.onEditCancel} />}
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
