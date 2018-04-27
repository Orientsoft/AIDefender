import { getAllTasks, addTask, getChoosedTask, deleteTask, updateTask } from 'services/tasks'
import moment from 'moment'
export default {
  namespace: 'tasks',

  state: {
    tasks: [],
    pagination: {},
    tasksFiltered: [],
  },

  reducers: {
    // 获取所有数据
    getAllTasks (state, { payload }) {
      let tasks = payload.tasks
      tasks.forEach((item) => {
        const { createdAt, updatedAt } = item
        item.createdAt = moment(createdAt).format('YYYY-MM-DD HH:mm:ss')
        item.updatedAt = moment(updatedAt).format('YYYY-MM-DD HH:mm:ss')
      })

      let pagination = payload._metadata
      return { ...state, tasks, pagination }
    },
    // 添加数据
    add_Task (state, { payload }) {
      const { createdAt, updatedAt } = payload
      payload.createdAt = moment(createdAt).format('YYYY-MM-DD HH:mm:ss')
      payload.updatedAt = moment(updatedAt).format('YYYY-MM-DD HH:mm:ss')
      const tasks = state.tasks.concat(payload)
      let totalCount = state.pagination.totalCount + 1
      state.pagination.totalCount = totalCount
      return { ...state, tasks }
    },
    // 删除数据
    deleteTask (state, { payload }) {
      let index = -1
      state.tasks.forEach((src, i) => {
        if (src._id === payload.id) {
          index = i
        }
      })
      if (index > -1) {
        state.tasks.splice(index, 1)
        state.pagination.totalCount -= 1
      }
      return { ...state }
    },
    // 更新指定数据
    update_Task (state, { payload }) {
      for (let key in state.tasks) {
        if (state.tasks[key]._id === payload._id) {
          state.tasks[key] = payload
        }
      }
      return { ...state }
    },
    // 获取指定数据
    getChoosedTask (state, { payload }) {
      return { ...state, choosedTask: payload }
    },
    // 根据type获取所有数据
    getTasksByType (state, { payload }) {
      let tasksFiltered = payload.tasks
      return { ...state, tasksFiltered }
    },
  },

  effects: {
    // 查询所有数据
    * queryTasks ({ payload = {} }, { call, put }) {
      const { current = 1, pageSize = 20 } = payload
      const response = yield call(getAllTasks, { page: current - 1, pageSize })
      yield put({ type: 'getAllTasks', payload: response.data })
    },
    // 添加数据
    * addTask ({ payload = {} }, { call, put }) {
      let response2 = yield call(addTask, payload.task)
      console.log('addTask', response2)
      // const response = yield call(getAllTasks, { page: payload.page })
      const response = yield call(getAllTasks, { page: payload.page - 1 })
      yield put({ type: 'getAllTasks', payload: response.data })
    },
    // 获取指定数据
    * queryChoosedTask ({ payload }, { call, put }) {
      const response = yield call(getChoosedTask, payload.id)
      yield put({ type: 'getChoosedTask', payload: response.data })
    },
    // 删除指定数据
    * delChoosedTask ({ payload }, { call, put }) {
      yield call(deleteTask, payload.id)
      const response = yield call(getAllTasks, { page: payload.page - 1 })
      yield put({ type: 'getAllTasks', payload: response.data })
    },
    // 更新指定数据
    * updateChoosedTask ({ payload }, { call, put }) {
      let data = {
        task: payload.task,
        id: payload.id,
      }
      yield call(updateTask, data)
      const response = yield call(getAllTasks, { page: payload.page - 1 })
      yield put({ type: 'getAllTasks', payload: response.data })
      // yield put({ type: 'update_Task', payload: response.data })
    },
    // 根据type获取tasks
    * queryTasksByType ({ payload }, { call, put }) {
      const response = yield call(getAllTasks, payload)
      console.log('queryTasksByType', response.data)
      yield put({ type: 'getAllTasks', payload: response.data })
    },
  },
}
