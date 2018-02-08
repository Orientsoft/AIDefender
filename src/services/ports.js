import { request } from 'utils'
import mapValues from 'lodash/mapValues'
import toString from 'lodash/toString'
import config from 'config'

const { port, ports } = config.api

// 获取所有数据
export async function getAllSource () {
  return request({
    url: ports,
    method: 'get',
  })
}

// 获取指定数据
export async function getChoosedSource (params) {
  return request({
    url: port.replace(':portId', params),
    method: 'get',
  })
}

// 添加数据
export async function addSource (params) {
  return request({
    url: ports,
    method: 'post',
    data: params,
  })
}

// 删除指定数据
export async function deleteSource (params) {
  return request({
    url: port.replace(':portId', params),
    method: 'delete',
  })
}

// 更新指定数据
export async function updateSource (params) {
  return request({
    url: port.replace(':portId', params.id),
    method: 'put',
    data: params.data,
  })
}

