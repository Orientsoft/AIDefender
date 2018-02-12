import { request } from 'utils'
import mapValues from 'lodash/mapValues'
import toString from 'lodash/toString'
import config from 'config'

const { tasks, task } = config.api

// 获取所有数据
export async function getAllTasks () {
  return request({
    url: tasks,
    method: 'get',
  })
}

// 获取指定数据
export async function getChoosedTask (params) {
  return request({
    url: task.replace(':taskId', params),
    method: 'get',
  })
}

// 添加数据
export async function addTask (params) {
  return request({
    url: tasks,
    method: 'post',
    data: params,
  })
}

// 删除指定数据
export async function deleteTask (params) {
  return request({
    url: task.replace(':taskId', params),
    method: 'delete',
  })
}

// 更新指定数据
export async function updateTask (params) {
  return request({
    url: task.replace(':taskId', params.id),
    method: 'put',
    data: params,
  })
}

