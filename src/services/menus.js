import { request } from 'utils'
import config from '../../app.json'

const { menus } = config.api

export async function query (params) {
  return request({
    url: menus,
    method: 'get',
    data: params,
  })
}
