import { request } from 'utils'
import config from 'config'

const { userLogin, userRegister } = config.api

export async function login (data) {
  return request({
    url: userLogin,
    method: 'post',
    data,
  })
}

export async function register (data) {
  return request({
    url: userRegister,
    method: 'post',
    data,
  })
}
