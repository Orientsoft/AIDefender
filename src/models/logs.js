import { getAllSource } from 'services/log'

export default {
  namespace: 'logs',

  state: {
    logs: [],
  },

  reducers: {
    // 获取所有数据
    getAllLogs (state, { payload }) {
      let logs = payload.lines
      logs.reverse()
      return { ...state, logs }
    },
  },

  effects: {
    // 查询数据
    * queryLogs ({ payload }, { call, put }) {
      let response = yield call((args) => {
        return getAllSource(args).catch((err) => {
          if (err.response) {
            err = err.response.data
          }
          payload.toast(err)
        })
      }, payload.source)
      if (response) {
        yield put({ type: 'getAllLogs', payload: response.data })
      }
      // const response = yield call(getAllSource, payload.source)
      // console.log('querylog', response)
      // yield put({ type: 'getAllLogs', payload: response.data })
    },
  },
}
