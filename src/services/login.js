import { request, api } from 'utils'
import config from '../../app.json'

const { userLogin } = config.api

export async function login (data) {
  return request({
    url: api.from(userLogin),
    method: 'post',
    data,
  })
}
