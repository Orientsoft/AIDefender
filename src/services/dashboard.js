import { request } from 'utils'
import config from 'config'

const { dashboard } = config.api

export async function query (params) {
  return request({
    url: dashboard,
    method: 'get',
    data: params,
  })
}
