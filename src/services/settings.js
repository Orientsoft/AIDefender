import { request } from 'utils'
import config from '../../app.json'

const { structures } = config.api

export async function getStructures () {
  return request({
    url: structures,
    method: 'get',
  })
}
