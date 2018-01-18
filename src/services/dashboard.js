import { request, api } from 'utils'
import config from '../../app.json'

const { dashboard } = config.api

export async function query (params) {
  return request({
    url: api.from(dashboard),
    method: 'get',
    data: params,
  })
}
