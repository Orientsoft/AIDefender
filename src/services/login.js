import { request } from 'utils'
import config from 'config'
import createHash from 'create-hash/browser'

const { userLogin, userRegister } = config.api

export async function login (data) {
  const hash = createHash('sha256')
  hash.update(data.password)
  data.password = hash.digest('hex').toString()

  return request({
    url: userLogin,
    method: 'post',
    data,
  })
}

export async function register (data) {
  const hash = createHash('sha256')
  hash.update(data.password)
  data.password = hash.digest('hex').toString()

  return request({
    url: userRegister,
    method: 'post',
    data,
  })
}
