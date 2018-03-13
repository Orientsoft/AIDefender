import { request } from 'utils'
import mapValues from 'lodash/mapValues'
import toString from 'lodash/toString'
import config from 'config'

const { status } = config.api

// 获取所有数据
export async function getAllSource (params) {
  return request({
    url: status,
    method: 'get',
    params,
  })
}

// 添加数据
export async function addSource (params) {
  return request({
    url: status,
    method: 'post',
    data: params,
  })
}

