import { request } from 'utils'
import config from 'config'

const { logs } = config.api

// 获取指定数据
export async function getAllSource (params) {
  return request({
    url: logs.replace(':jobId', params),
    method: 'get',
  })
}

