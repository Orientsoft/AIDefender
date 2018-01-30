import { routerRedux } from 'dva/router'
import { getAllMetrics } from 'services/metric'

export default {
  namespace: 'metric',

  state: {
    metrics:[]
  },
  reducers: {
    getAllMetrics (state, { payload }) {
      return { ...state, metrics: payload }
    },
  },
  effects: {
    * queryMetrics ({payload}, { call, put }) {
      const response = yield call(getAllMetrics,payload)
      yield put({ type: 'getAllMetrics', payload: response.data })
    }
  }
}
