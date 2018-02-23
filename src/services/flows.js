import { request } from 'utils'
import mapValues from 'lodash/mapValues'
import toString from 'lodash/toString'
import config from 'config'

const { flow, flows } = config.api

// 获取所有flow数据
export async function getAllSource (params) {
  return request({
    url: flows,
    method: 'get',
    params,
  })
}

// 获取指定flow数据
export async function getChoosedSource (params) {
  return request({
    url: flow.replace(':flowId', params),
    method: 'get',
  })
}

// 添加flow数据
export async function addSource (params) {
  return request({
    url: flows,
    method: 'post',
    data: params,
  })
}

// 删除指定flow数据
export async function deleteSource (params) {
  return request({
    url: flow.replace(':flowId', params),
    method: 'delete',
  })
}

// 更新指定flow数据
export async function updateSource (params) {
  return request({
    url: flow.replace(':flowId', params.id),
    method: 'put',
    data: params.data,
  })
}

