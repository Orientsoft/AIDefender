import { request, api } from 'utils'
import config from '../../app.json'

const { user, userLogout, userLogin } = config.api

export async function login (params) {
  return request({
    url: api.from(userLogin),
    method: 'post',
    data: params,
  })
}

export async function logout (params) {
  return request({
    url: api.from(userLogout),
    method: 'get',
    data: params,
  })
}

export async function query (params) {
  return request({
    url: api.from(user.replace('/:id', '')),
    method: 'get',
    data: params,
  })
}
