import { request, api } from 'utils'
import config from '../../app.json'

const { menus } = config.api

export async function query (params) {
  return request({
    url: api.from(menus),
    method: 'get',
    data: params,
  })
}
