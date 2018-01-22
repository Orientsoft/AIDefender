import { request } from 'utils'
import config from 'config'

const { userLogin } = config.api

export async function login (data) {
  return request({
    url: userLogin,
    method: 'post',
    data,
  })
}
