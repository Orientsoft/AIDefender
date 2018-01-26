import { request } from 'utils'
import config from 'config'

const { query } = config.api

export async function getQueryResult (params) {
  return request({
    url: query,
    method: 'post',
    data: params,
  })
}