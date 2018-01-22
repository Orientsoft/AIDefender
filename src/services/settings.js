import { request } from 'utils'
import config from 'config'

const { structures } = config.api

export async function getStructures () {
  return request({
    url: structures,
    method: 'get',
  })
}
