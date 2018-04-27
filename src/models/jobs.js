import { getAllSource, addSource, getChoosedSource, deleteSource, updateSource } from 'services/jobs'

export default {
  namespace: 'jobs',

  state: {
    taskjobs: [],
    choosedTaskJob: {},
  },

  reducers: {
    // 启动任务
    start (state, { payload }) {
      let taskjobs = payload
      return { ...state, taskjobs }
    },
    // 停止任务
    stop (state) {
      state.taskjobs = []
      return { ...state }
    },
    // 获取指定数据
    getChoosedTaskJob (state, { payload }) {
      return { ...state, choosedTaskJob: payload }
    },
  },

  effects: {
    // 启动任务
    * startJobs ({ payload }, { call, put }) {
      let response = yield call(addSource, { taskId: payload.taskId })
      if (response.status === 200) {
        yield put({ type: 'start', payload: response.data })
        payload.callback()
      } else {
        payload.toast(JSON.stringify(response.data))
        payload.callback()
      }
    },
    // 停止任务
    * stopJobs ({ payload }, { call, put }) {
      let response = yield call(deleteSource, { taskId: payload.taskId })
      if (response.status === 200) {
        yield put({ type: 'stop' })
        payload.callback()
      } else {
        payload.toast(JSON.stringify(response.data))
        payload.callback()
      }
    },
    // 获取指定数据
    * queryChoosedSource ({ payload }, { call, put }) {
      const response = yield call(getChoosedSource, payload.id)
      yield put({ type: 'getChoosedTaskJob', payload: response.data })
    },
  },
}
