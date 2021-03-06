import classnames from 'classnames'
import lodash from 'lodash'
import request from './request'
import { color } from './theme'

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  const item = array.filter(_ => _[keyAlias] === key)
  if (item.length) {
    return item[0]
  }
  return null
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
  let data = lodash.cloneDeep(array)
  let result = []
  let hash = {}
  data.forEach((item, index) => {
    hash[data[index][id]] = data[index]
  })

  data.forEach((item) => {
    let hashVP = hash[item[pid]]
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = [])
      hashVP[children].push(item)
    } else {
      result.push(item)
    }
  })
  return result
}

const operators = [
  { value: 'eq', label: '=' },
  { value: 'not', label: '!=' },
  { value: 'lt', label: '<' },
  { value: 'lte', label: '<=' },
  { value: 'gt', label: '>' },
  { value: 'gte', label: '>=' },
]

const aggs = [
  { label: 'count', value: 'count', labelChinese: '条数' },
  { label: 'terms', value: 'terms', labelChinese: '种类' },
  { label: 'avg', value: 'avg', labelChinese: '平均' },
  { label: 'sum', value: 'sum', labelChinese: '总和' },
  { label: 'min', value: 'min', labelChinese: '最小' },
  { label: 'max', value: 'max', labelChinese: '最大' },
]

module.exports = {
  request,
  color,
  classnames,
  queryArray,
  arrayToTree,
  operators,
  aggs,
}
