/* eslint-disable */
const fs = require('fs')
const path = require('path')

/**
 * 修复 echarts tree 删除最后一个节点的 bug
 */
const fix_echarts_tree_bug = () => {
  const filepath = `${path.resolve(__dirname)}/node_modules/echarts/lib/chart/tree/TreeView.js`
  let lines = []
  let marker = false

  var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(filepath)
  });

  lineReader.on('line', function (line) {
    if (marker) {
      if (line.match(/getNodeByDataIndex/) && line.indexOf('data.tree.getNodeByDataIndex(dataIndex - 1)') < 0) {
        line = `${line}   if(!node) {node = data.tree.getNodeByDataIndex(dataIndex - 1);}`
        marker = false
        // console.log(line)
      }
    }
    if (line.match(/function[\s]+removeNode/)) {
      marker = true
    }

    lines.push(line)
  })
  lineReader.on('close', () => {
    fs.writeFile(filepath, lines.join('\n'), 'utf8', function (err) {
      if (err) return console.log(err);
    });
  })
}
// 如果以后 echarts 已经修复了该BUG，请移除该方法的调用
fix_echarts_tree_bug()
