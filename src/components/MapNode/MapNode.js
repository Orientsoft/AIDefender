import React from 'react'
import ReactEcharts from 'echarts-for-react'
import ContextMenu from '../ContextMenu/ContextMenu'
import EditWindow from './EditWindow'
import NodeHelper from './NodeHelper'
import { message, Modal } from 'antd'
import noop from 'lodash/noop'
import isEqual from 'lodash/isEqual'
import $ from 'jquery'

class MapNode extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showContextMenu: false,
      showConfigModal: false,
      nodeName: ''
    }
    this.chart = {
      events: { click: this._handleNodeClick, dblclick: this._handleNodeDbClick, contextmenu: this._handleNodeContextmenu },
      config: {
        nodeDefaultColor: '#03D0B2',
        nodeSelectedColor: 'red'
      }
    }

    this.mapNodeMode = this.props.mapNodeMode || 'settings'

    this._contextMenu = null
    this._editWindow  = null

    this._menuOptions = [{
      title: '添加',
      callback: this._handleAddNode,
    },{
      title: '重命名',
      callback: this._handleRenameNode
    },{
      title: '节点配置',
      callback: this._handleNodeDataConfig,
      visible: this._isShowNodeConfigMenu
    },{
      title: '取消选中',
      callback: this._handleCancelSelectedNode,
      visible: this._isShowCancelSelMenu
    }, { isSeparator: true }, {
      title: '删除',
      callback: this._handleDeleteNode,
    }]

    //最大层数
    this.maxLevel       = this.props.maxLevel || 5
    //能删除的最小层数
    this.canDelMinLevel = this.props.canDelMinLevel || 2
    //可以做节点配置的最小层数 
    this.canConfigMinLevel = this.props.canConfigMinLevel || 2
    //如果有子节点，能否删除父节点
    this.cantDeleteNodeIfHasChildren = this.props.cantDeleteNodeIfHasChildren !== false
    this.startNodeCode = 100
    //构建节点数据
    this.treeData                    = this.buildTreeData(this.props.nodes)
    this.nodeHelper                  = new NodeHelper(this.treeData)
  }

  // 点击节点
  _handleNodeClick = (item, chart) => {
    const { onSelect = noop } = this.props
    if(this.mapNodeMode === 'query') {
      this._handleNodeSelected(item.data, chart)
      onSelect(item.data)
    }
  }

  // 双击节点
  _handleNodeDbClick = (item, chart) => {
    
  }
  //传入configModal控制显示
  hideConfigModal = () => {
    this.setState({
      showConfigModal: false,
    })
  }

  // 节点上鼠标右键
  _handleNodeContextmenu = (item, chart) => {
    if(item.data.level > 0 && this.mapNodeMode === 'settings') {
      const event = item.event && item.event.event
      this._contextMenu._handleContextMenu(event, { node: item.data, chart, context: this })
    }
    
  }

  // 添加节点
  _handleAddNode = (data) => {
    const { node, chart, context } = data
    const level = parseInt(node.level, 10) + 1
    if (level > context.maxLevel) {
      message.error(`不能添加节点，因为节点层次被限制到最多 ${context.maxLevel} 层.`)
      return
    }
    this._editWindow.show('添加节点', data, 'ADD')
    
  }

  // 删除节点
  _handleDeleteNode = (data) => {
    const { node, chart, context } = data
    if (node.level !== undefined && node.level < this.canDelMinLevel) {
      message.error(`该节点不能删除，该树配置成至少保留 ${this.canDelMinLevel} 层.`)
      return 
    }
    if (context.cantDeleteNodeIfHasChildren && node.children && node.children.length > 0) {
      message.error('该节点有子节点，不能删除，请先删除所有子节点.')
      return
    }
    let options = chart.getOption()
    let nodesOption = options.series[0].data[0]
    if (node.parentCode) {
      let parent = context.searchNode(nodesOption.children, node.parentCode)
      if (!parent) {
        parent = nodesOption
      }
      parent.children = parent.children.filter(item => item.name !== node.name)
      // chart.clear()
      chart.setOption(options, true) // update node chart
      if(context.props && context.props.onChange) {
        context.props.onChange(context.getTreeData(chart))
      }
    } else {
      message.error('不能删除根节点.')
    }
  }

  //重命名节点
  _handleRenameNode = (data) => {
    const { node, chart, context } = data
    this._editWindow.show('重命名节点', data, 'MODIFY')

  }

  //处理点击选中节点
  _handleNodeSelected = (node, chart) => {
    if(!node.selected) {
      // console.log(node)
      node.oldBorderColor = (node.itemStyle && node.itemStyle.borderColor) || this.chart.config.nodeDefaultColor
      node.itemStyle = {
        borderColor: this.chart.config.nodeSelectedColor
      }
      node.selected = true

      let nodesOption = chart.getOption().series[0].data[0]
      let rootParentNode = this.__findTopLevelParent(nodesOption, node)
      console.log(rootParentNode)

      this._refreshNodes(chart)
    }
  }
  //获取节点的最顶层节点（除了跟节点)
  __findTopLevelParent = (rootNodes, node) => {
    if(!node.parentCode) {
      console.log(node)
      return node
    } else {
      let parent = this.searchNode(rootNodes.children, node.parentCode)
      if(parent) {
        return this.__findTopLevelParent(rootNodes, parent)
      } else {
        return node
      }
    }
  }
  //处理取消选中节点
  _handleCancelSelectedNode = (data) => {
    const { node, chart, context } = data
    node.selected = false
    node.itemStyle.borderColor = node.oldBorderColor
    if(node.children && node.children.length > 0) {
      node.children.forEach(item => {
        if(item.selected) {
          item.selected = false
          item.itemStyle.borderColor = item.oldBorderColor
        }
      })
    }
    this._refreshNodes(chart)

  }
  //是否显示：取消选中菜单 
  _isShowCancelSelMenu = (node) => {
    if(node && node.selected) {
      return true
    } else {
      return false
    }
  }
  /**
   * 处理节点配置
   */
  _handleNodeDataConfig = (data) => {
    const { node, chart, context } = data
    context.setState({
      nodeName: node.name
    })
    context.props.onDbClick(node)
  }
  /**
   * 是否显示节点配置菜单
   */
  _isShowNodeConfigMenu = (node) => {
    return node.level !== undefined && this.canConfigMinLevel !== undefined && this.canConfigMinLevel <= node.level
  }
  
  /**
   * 刷新节点树
   */
  _refreshNodes = (chart) => {
    let options = chart.getOption()
    chart.setOption(options, false) 
  }
  buildOptions = (data = null) => {
    const options = {
      tooltip: {
        show: false,
      },
      series: [
        {
          type: 'tree',
          data: [data == null ? this.treeData : data],
          initialTreeDepth: 5,
          top: '5%',
          left: '10%',
          bottom: '10%',
          right: '10%',
          layout: 'orthogonal',
          // layout: 'radial',
          // orient: 'vertical',
          orient: 'horizontal',
          symbolSize: 45,
          // symbolOffset: [0, '50%'],
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
                position: 'left',
                verticalAlign: 'middle',
                align: 'center',
              },
            },
          },
          lineStyle: {
            color: '#03D0B2',
            curveness: 0.9
          },
          emphasis: {
            // itemStyle: {
            //   borderColor: 'grey',
            // },
            label: {
              color: 'red'
            }
          },
          expandAndCollapse: true,
          animationDuration: 550,
          animationDurationUpdate: 0,

        },
      ],
    }
    return options
  }

  buildTreeData = (nodes) => {
    let tree = $.extend(true, {}, nodes) // deep copy
    tree.collapsed = false
    tree.symbol = 'circle'
    // tree.symbolSize = 35
    tree.itemStyle = {
      borderColor: 'green',
      borderWidth: 2,
    }
    this.rejustNodes(tree)
    return tree
  }

  rejustNodes = (rootNode) => {
    let treeNodes = rootNode.children
    if (!treeNodes || !treeNodes.length) return
    let stack = []
    rootNode.code = this.startNodeCode 

    // 先将第一层节点放入栈
    for (let i = 0, len = treeNodes.length; i < len; i++) {
      this.startNodeCode ++
      treeNodes[i].parentCode = rootNode.code
      treeNodes[i].code = this.startNodeCode
      treeNodes[i].itemStyle = { borderColor: '#F17720' }
      treeNodes[i].lineStyle = { color: '#FBBC05' }
      stack.push(treeNodes[i])
    }
    let item
    while (stack.length) {
      item = stack.shift()
      // console.log(item)
      // 如果该节点有子节点，继续添加进入栈顶
      if (item.children && item.children.length) {
        for (let i = 0; i < item.children.length; i++) {
          item.children[i].code = ++this.startNodeCode
          item.children[i].parentCode = item.code
        }
        stack = item.children.concat(stack)
      }
    }
  }
  searchNode = (treeNodes, nodeCode) => {
    if (!treeNodes || !treeNodes.length) return
    let stack = []
    // 先将第一层节点放入栈
    for (let i = 0, len = treeNodes.length; i < len; i++) {
      stack.push(treeNodes[i])
    }
    let item
    while (stack.length) {
      item = stack.shift()
      if (item.code === nodeCode) {
        return item
      }
      // 如果该节点有子节点，继续添加进入栈顶
      if (item.children && item.children.length) {
        stack = item.children.concat(stack)
      }
    }
    
  }
  getTreeData = (chart) => {
    let options = chart.getOption()
    let nodesOption = options.series[0].data[0]

    return $.extend(true, {}, nodesOption)
  }

  componentWillMount () {
    const { onChange = noop } = this.props
    onChange($.extend(true, {}, this.treeData))
  }

  shouldComponentUpdate(props) {
    return !isEqual(this.props.nodes, props.nodes)
  }

  _editWindowCallback = (data, mode, nodeText) => {
    const { node, chart, context } = data
    let options = chart.getOption()
    let nodesOption = options.series[0].data[0]
    const item = context.searchNode(nodesOption.children, node.code)
    switch(mode) {
      case "ADD":
        const level = parseInt(node.level, 10) + 1
        if (item.children) {
          item.children.push({ name: nodeText, parentCode: node.code, level })
        } else {
          item.children = [{ name: nodeText, parentCode: node.code, level }]
        }
        chart.setOption(options, true) // update node chart
        if(context.props && context.props.onChange) {
          context.props.onChange(context.getTreeData(chart))
        }
        break
      case "MODIFY":
        item.name = nodeText
        chart.setOption(options, true) 

        break
    }
  }
  render () {
    const opts = this.buildOptions()

    return (
      <div>
        <ReactEcharts option={opts} onEvents={this.chart.events} style={{ height: '600px', width: '100%' }} />
        <ContextMenu ref={(child) => { this._contextMenu = child }} dontMountContextEvt={false} menuOptions={this._menuOptions} />
        <EditWindow ref={(child) => { this._editWindow = child }} handleOk={this._editWindowCallback} />
      </div>
    )
  }
}
export default MapNode
