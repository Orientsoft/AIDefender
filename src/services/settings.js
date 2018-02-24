import { request } from 'utils'
import config from 'config'

const { structures, structure,  metaStructure } = config.api

export async function getStructures () {
  return request({
    url: structures,
    method: 'get',
  })
}

export async function getStructure (data) {
  return request({
    url: structure.replace(':structureId', data),
    method: 'get',
  })
}

export async function saveStructure (data) {
  return request({
    url: structures,
    method: 'post',
    data,
  })
}

export async function deleteStructure (data) {
  return request({
    url: structure.replace(':structureId', data._id),
    method: 'delete',
  })
}

export async function updateStructure (data) {
  return request({
    url: structure.replace(':structureId', data._id),
    method: 'put',
    data,
  })
}

export async function getMetaStructure () {
  return request({
    url: metaStructure,
    method: 'get',
  })
}
