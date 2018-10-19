import { request } from 'utils'
import config from 'config'

const { user, userDelete, userList, userSetMenus } = config.api

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
