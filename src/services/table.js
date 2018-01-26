import { request } from 'utils'
import config from 'config'

const { table } = config.api

export async function query (params) {
  return request({
    url: table,
    method: 'get',
    data: params,
  })
}