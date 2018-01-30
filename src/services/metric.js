import { request } from 'utils'
import config from 'config'

const { datas } = config.api

export async function getAllMetrics (params) {
  return request({
    url: datas,
    method: 'get',
    data: params,
  })
}

