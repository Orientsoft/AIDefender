import { request } from 'utils'
import mapValues from 'lodash/mapValues'
import toString from 'lodash/toString'
import config from 'config'

const { datas, data, alerts } = config.api

//获取所有数据
export async function getAllSource (params) {
  return request({
    url: datas,
    method: 'get',
    params: mapValues(params, v => toString(v))
  })
}

export async function getAllAlertSource (params) {
  return request({
    url: alerts,
    method: 'get',
    data: params
  })
}
//获取指定数据
export async function getchoosedSource (params) {
  return request({
    url: data.replace(':dataId', params),
    method: 'get',
  })
}
//添加数据
export async function addSource (params) {
  return request({
    url: datas,
    method: 'post',
    data: params,
  })
}
//删除指定数据
export async function deleteSource (params) {
  return request({
    url: data.replace(':dataId', params),
    method: 'delete',
  })
}
//更新指定数据
export async function updateSource (params) {
  return request({
    url: data.replace(':dataId', params.id),
    method: 'put',
    data: params.data,
  })
}
