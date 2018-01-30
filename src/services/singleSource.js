import { request } from 'utils'
import config from 'config'

const { indexs, fields, datas } = config.api
//获取index
export async function getIndex () {
  return request({
    url: indexs,
    method: 'get',
  })
}
//获取字段
export async function getFields () {
  return request({
    url: fields,
    method: 'get',
  })
}
//获取所有数据
export async function getAllSingleSource (params) {
  return request({
    url: datas,
    method: 'get',
    data: params,
  })
}
//获取指定数据
export async function getchoosedSingleSource (params) {
  return request({
    url: datas,
    method: 'get',
    data: params,
  })
}
//添加数据
export async function addSingleSource (params) {
  return request({
    url: datas,
    method: 'post',
    data: params,
  })
}
//删除指定数据
export async function deleteSingleSource (params) {
  return request({
    url: datas,
    method: 'delete',
    data: params,
  })
}
//更新指定数据
export async function updateSingleSource (params) {
  return request({
    url: datas,
    method: 'put',
    data: params,
  })
}
