
export default class NodeHelper {
  constructor(rootNode) {
    this.rootNode = rootNode
  }
  searchNode (nodeCode, parentNodes) {
    parentNodes = parentNodes || this.rootNode.children 
    if (!parentNodes || !parentNodes.length) return
    let stack = []
    // 先将第一层节点放入栈
    for (let i = 0, len = parentNodes.length; i < len; i++) {
      stack.push(parentNodes[i])
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
    parentNodes = parentNodes || this.rootNode.children
    if (!parentNodes || !parentNodes.length) return
    let stack  = []
    let childs = []
    // 先将第一层节点放入栈
    for (let i = 0, len = parentNodes.length; i < len; i++) {
      stack.push(parentNodes[i])
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
  findTopLevelParent = (node) => {
    if(!node.parentCode) {
      console.log(node)
      return node
    } else {
      let parent = this.searchNode(node.parentCode, this.rootNode.children)
      if(parent) {
        return this.findTopLevelParent(parent)
      } else {
        return node
      }
    }
  }
  /**
   * 获取除开某个分支的其他分支所有 nodes
   */
  getAllNodesExceptSomeBranch = (branchParentNode, newRootNode, isSelected) => {
    let stack  = []
    let nodes = []
    newRootNode = newRootNode || this.rootNode
    // 先将第一层节点放入栈
    stack = newRootNode.children.filter(item => item.code !== branchParentNode.code)

    let item
    while (stack.length) {
      item = stack.shift()
      if(isSelected === true) {
        if(item.selected) {
          nodes.push(item)
        }
      } else {
          nodes.push(item)
      }
      // 如果该节点有子节点，继续添加进入栈顶
      if (item.children && item.children.length) {
        stack = item.children.concat(stack)
      }
    }
    return nodes
  }
}