import { request } from 'utils'
import config from 'config'
import createHash from 'create-hash/browser'

const { user, userChange, userDelete, userList, userSetMenus } = config.api

export async function query (params) {
  return request({
    url: user,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: user.replace('/:id', ''),
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: userDelete,
    method: 'post',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: user,
    method: 'patch',
    data: params,
  })
}

export async function updateRole (params) {
  if (params.password) {
    const hash = createHash('sha256')
    hash.update(params.password)
    params.password = hash.digest('hex').toString()
  }
  return request({
    url: userChange.replace(/:id$/, params.id),
    method: 'put',
    data: params,
  })
}

export async function list () {
  return request({
    url: userList,
    method: 'get',
  })
}

export async function setMenus (params) {
  return request({
    url: userSetMenus,
    method: 'post',
    data: params,
  })
}
