import get from 'lodash/get';
import forEach from 'lodash/forEach';
import compact from 'lodash/compact';
import flattenDeep from 'lodash/flattenDeep';
import isPlainObject from 'lodash/isPlainObject';

/**
 * 获取返回索引中包含的所有字段
 * @param {Object} mappings - 字段映射
 * @param {String} path - 字段层级
 */
function fields(mappings, path = '') {
    const result = [];
    const properties = get(mappings, 'properties');

    if (isPlainObject(properties)) {
        forEach(properties, (mapping, field) => {
            result.push(fields(mapping, compact([path, field]).join('.')));
        });
        return result;
    }
    
    return path;
}

export default mappings => flattenDeep(fields(mappings));
