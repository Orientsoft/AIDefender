import ReactEcharts from 'echarts-for-react'
import ContextMenu from '../ContextMenu/ContextMenu'
import $ from 'jquery'

class MapNode extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showContextMenu: false,
    }
    this.chart = {
      events: { click: this._handleNodeClick, dblclick: this._handleNodeDbClick, contextmenu: this._handleNodeContextmenu },
    }
    this._contextMenu = null
    this._menuOptions = [{
      title: '添加',
      callback: this._handleAddNode,
    }, { isSeparator: true }, {
      title: '删除',
      callback: this._handleDeleteNode,
    }]

    this.treeData = this.buildTreeData(this.props.nodes)
  }


  // 点击节点
  _handleNodeClick = (item, e) => {
    console.log(item, e)
  }

  // 双击节点
  _handleNodeDbClick = (item, e) => {

  }
  // 节点上鼠标右键
  _handleNodeContextmenu = (item, chart) => {
    const event = item.event && item.event.event
    this._contextMenu._handleContextMenu(event, { node: item.data, chart, context: this })
  }

  // 添加节点
  _handleAddNode = (data) => {
    const { node, chart, context } = data
    let options = chart.getOption()
    let nodesOption = options.series[0].data[0]
    let item = context.searchNode(nodesOption.children, node.name)
    if (item.children) {
      item.children.push({ name: `test${Math.floor(Math.random() * 100)}`, parent: node.name, level: parseInt(node.level) + 1 })
    } else {
      item.children = [{ name: `test${Math.floor(Math.random() * 100)}`, parent: node.name, level: parseInt(node.level) + 1 }]
    }
    chart.setOption(options, true) // update node chart
  }

  // 删除节点
  _handleDeleteNode = (data) => {
    const { node, chart, context } = data
    // console.log(node)
    let options = chart.getOption()
    let nodesOption = options.series[0].data[0]
    if (node.parent) {
      let parent = context.searchNode(nodesOption.children, node.parent)
      // console.log(parent, '1')
      if (!parent) {
        parent = nodesOption
      }
      // console.log(parent, '2')
      parent.children = parent.children.filter(item => item.name !== node.name)
      chart.setOption(options, false) // update node chart
      console.log('set end....')
    }
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
          symbolSize: 25,
          itemStyle: {
            borderColor: '#03D0B2',
            borderWidth: 2,
          },
          label: {
            normal: {
              position: 'right',
              verticalAlign: 'middle',
              align: 'left',
              fontSize: 10,
            },
          },
          leaves: {
            label: {
              normal: {
                position: 'inside',
                verticalAlign: 'middle',
                align: 'left',
              },
            },
          },
          lineStyle: {
            color: '#03D0B2',
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
    tree.symbolSize = 35
    tree.itemStyle = {
      borderColor: 'brown',
      borderWidth: 2,
    }
    this.rejustNodes(tree)
    return tree
  }

  rejustNodes = (rootNode) => {
    let treeNodes = rootNode.children
    if (!treeNodes || !treeNodes.length) return
    let stack = []
    // 先将第一层节点放入栈
    for (let i = 0, len = treeNodes.length; i < len; i++) {
      treeNodes[i].parent = rootNode.name
      treeNodes[i].symbolSize = 30
      treeNodes[i].itemStyle = { borderColor: '#F17720' }
      treeNodes[i].lineStyle = { color: '#FBBC05' }
      stack.push(treeNodes[i])
    }
    let item
    while (stack.length) {
      item = stack.shift()
      // 如果该节点有子节点，继续添加进入栈顶
      if (item.children && item.children.length) {
        for (let i = 0; i < item.children.length; i++) {
          item.children[i].parent = item.name
        }
        stack = item.children.concat(stack)
      }
    }
  }
  searchNode = (treeNodes, name) => {
    if (!treeNodes || !treeNodes.length) return
    let stack = []
    // 先将第一层节点放入栈
    for (let i = 0, len = treeNodes.length; i < len; i++) {
      stack.push(treeNodes[i])
    }
    let item
    while (stack.length) {
      item = stack.shift()
      if (item.name === name) {
        return item
      }
      // 如果该节点有子节点，继续添加进入栈顶
      if (item.children && item.children.length) {
        stack = item.children.concat(stack)
      }
    }
  }

  render () {
    const opts = this.buildOptions()
    return (
      <div>
        <ReactEcharts option={opts} onEvents={this.chart.events} style={{ height: '650px', width: '100%' }} />
        <ContextMenu ref={(child) => { this._contextMenu = child }} dontMountContextEvt={false} menuOptions={this._menuOptions} />
      </div>
    )
  }
}
export default MapNode
