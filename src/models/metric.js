import { getAllSource, addSource, deleteSource } from 'services/source'

export default {
  namespace: 'metric',

  state: {
    metrics: [],
  },

  reducers: {
    getAllMetrics (state, { payload }) {
      return { ...state, metrics: payload }
    },

    addAllMetric (state, { payload }) {
      const metrics = state.metrics.concat(payload)
      return { ...state, metrics }
    },

    deleteMetric (state, { payload }) {
      let index = -1
      state.metrics.forEach((src, i) => {
        if (src._id === payload) {
          index = i
        }
      })
      if (index > -1) {
        state.metrics.splice(index, 1)
      }
      return { ...state }
    },
  },

  effects: {
    // query
    * queryMetrics ({ payload }, { call, put }) {
      const response = yield call(getAllSource, payload)
      yield put({ type: 'getAllMetrics', payload: response.data })
    },
    // add
    * addMetric ({ payload }, { call, put }) {
      yield call(addSource, payload)
      yield put({ type: 'addAllMetric', payload })
    },
    // 删除指定数据
    * delChoosedSource ({ payload }, { call, put }) {
      yield call(deleteSource, payload.id)
      yield put({ type: 'deleteMetric', payload: payload.id })
    },
  },
}
