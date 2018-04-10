import { request } from 'utils'
import mapValues from 'lodash/mapValues'
import toString from 'lodash/toString'
import config from 'config'

const { job, jobs } = config.api

// 获取所有数据
export async function getAllSource (params) {
  return request({
    url: jobs,
    method: 'get',
    params,
  })
}

// 获取指定数据
export async function getChoosedSource (params) {
  return request({
    url: job.replace(':taskId', params),
    method: 'get',
  })
}

// 添加数据
export async function addSource (params) {
  return request({
    url: jobs,
    method: 'post',
    data: params,
  })
}

// 删除指定数据
export async function deleteSource (params) {
  console.log('param', params)
  return request({
    url: job.replace(':taskId', params),
    method: 'delete',
  })
}

// 更新指定数据
export async function updateSource (params) {
  return request({
    url: job.replace(':taskId', params.id),
    method: 'put',
    data: params.data,
  })
}

