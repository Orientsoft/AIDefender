import { request } from 'utils'
import config from 'config'

const { query, kpi } = config.api

export async function getQueryResult (params) {
  return request({
    url: query,
    method: 'post',
    data: params,
  })
}

export async function getKPIResult(params) {
  return request({
    url: kpi, 
    method: 'get', 
    data: params
  })
}