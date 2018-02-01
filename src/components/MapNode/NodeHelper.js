
export default class NodeHelper {
  constructor(rootNodes) {
    this.rootNodes = rootNodes
  }
  searchNode (nodeCode, parentNodes) {
    parentNodes = parentNodes || this.rootNodes 
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
  getAllChild (parentNodes) {
    parentNodes = parentNodes || this.rootNodes
    if (!treeNodes || !treeNodes.length) return
    let stack  = []
    let childs = []
    // 先将第一层节点放入栈
    for (let i = 0, len = treeNodes.length; i < len; i++) {
      stack.push(treeNodes[i])
    }
    let item
    while (stack.length) {
      item = stack.shift()
      if(item) {
        childs.push(item)
      }
      // 如果该节点有子节点，继续添加进入栈顶
      if (item.children && item.children.length) {
        stack = item.children.concat(stack)
      }
    }
    return childs
  }
   //获取节点的最顶层节点（除了根节点)
  findTopLevelParent = (rootNodes, node) => {
    if(!node.parentCode) {
      console.log(node)
      return node
    } else {
      let parent = this.searchNode(rootNodes.children, node.parentCode)
      if(parent) {
        return this.findTopLevelParent(rootNodes, parent)
      } else {
        return node
      }
    }
  }
}