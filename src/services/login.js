import { request } from 'utils'
import config from '../../app.json'

const { userLogin } = config.api

export async function login (data) {
  return request({
    url: userLogin,
    method: 'post',
    data,
  })
}
