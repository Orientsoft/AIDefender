import { request, api } from 'utils'
import config from '../../app.json'

const { user } = config.api

export async function query (params) {
  return request({
    url: api.from(user),
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: api.from(user.replace('/:id', '')),
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: api.from(user),
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: api.from(user),
    method: 'patch',
    data: params,
  })
}
