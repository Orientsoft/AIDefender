import get from 'lodash/get'
import forEach from 'lodash/forEach'
import compact from 'lodash/compact'
import flattenDeep from 'lodash/flattenDeep'
import isPlainObject from 'lodash/isPlainObject'
import uniq from 'lodash/uniq'
import isString from 'lodash/isString'

/**
 * 获取返回索引中包含的所有字段
 * @param {Object} mappings - 字段映射
 * @param {String} path - 字段层级
 */
function fields (mappings, path = '') {
  const result = []
  const properties = get(mappings, 'properties')

  if (properties) {
    if (isPlainObject(properties)) {
      forEach(properties, (mapping, field) => {
        const fieldPath = fields(mapping, compact([path, field]).join('.'))

        if (isString(fieldPath)) {
          result.push({ field: fieldPath, type: mapping.type })
        } else {
          result.push(fieldPath)
        }
      })
      return result
    }
  } else {
    // for Elasticsearch version >= 7
    forEach(mappings, (mapping, field) => {
      result.push({ field, type: mapping.type })
    })
    return result
  }

  return path
}

export default (allMappings) => {
  const result = []

  forEach(allMappings, (mappingsValue) => {
    forEach(mappingsValue.mappings, (mappings) => {
      result.push(flattenDeep(fields(mappings)))
    })
  })

  return uniq(flattenDeep(result))
}
