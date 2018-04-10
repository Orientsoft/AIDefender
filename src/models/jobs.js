import { getAllSource, addSource, getChoosedSource, deleteSource, updateSource } from 'services/jobs'
import moment from 'moment'

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
      let response = yield call(addSource, payload)
      yield put({ type: 'start', payload: response.data })
    },
    // 停止任务
    * stopJobs ({ payload }, { call, put }) {
      console.log('payload', payload.taskId)
      yield call(deleteSource, payload.taskId)
      yield put({ type: 'stop' })
    },
    // 获取指定数据
    * queryChoosedSource({ payload }, { call, put }) {
      const response = yield call(getChoosedSource, payload.id)
      yield put({ type: 'getChoosedTaskJob', payload: response.data })
    },
  },
}
