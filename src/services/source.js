import { request } from 'utils'
import mapValues from 'lodash/mapValues'
import toString from 'lodash/toString'
import config from 'config'

const { datas, data, alerts } = config.api

// 获取所有数据
export async function getAllSource (params) {
  return request({
    url: datas,
    method: 'get',
    params: mapValues(params, v => toString(v)),
  })
}

export async function getAllAlertSource (params) {
  return request({
    url: alerts,
    method: 'get',
    params: mapValues(params, v => toString(v)),
  })
}
// 获取指定数据
export async function getChoosedSource (params) {
  return request({
    url: data.replace(':dataId', params),
    method: 'get',
  })
}
export async function getChoosedAlertSource (params) {
  return request({
    url: `${alerts}/${params}`,
    method: 'get',
  })
}
// 添加数据
export async function addSource (params) {
  return request({
    url: datas,
    method: 'post',
    data: params,
  })
}
export async function addAlertSource (params) {
  return request({
    url: alerts,
    method: 'post',
    data: params,
  })
}
// 删除指定数据
export async function deleteSource (params) {
  return request({
    url: data.replace(':dataId', params),
    method: 'delete',
  })
}
export async function deleteAlertSource (params) {
  return request({
    url: `${alerts}/${params}`,
    method: 'delete',
  })
}
// 更新指定数据
export async function updateSource (params) {
  return request({
    url: data.replace(':dataId', params._id),
    method: 'put',
    data: params,
  })
}
export async function updateAlertSource (params) {
  return request({
    url: `${alerts}/${params}`,
    method: 'put',
    data: params,
  })
}
