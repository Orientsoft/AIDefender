import { request } from 'utils'
import config from 'config'

const { structures, metaStructure } = config.api

export async function getStructures () {
  return request({
    url: structures,
    method: 'get',
  })
}

export async function getMetaStructure () {
  return request({
    url: metaStructure,
    method: 'get',
  })
}
