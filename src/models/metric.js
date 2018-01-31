import { routerRedux } from 'dva/router'
import { getAllSource, addSource, deleteSource} from 'services/source'

export default {
  namespace: 'metric',

  state: {
    metrics: []
  },

  reducers: {
    getAllMetrics(state, { payload }) {
      return { ...state, metrics: payload }
    },
  },

  effects: {
    * queryMetrics({ payload }, { call, put }) {
      const response = yield call(getAllSource, payload)
      yield put({ type: 'getAllMetrics', payload: response.data })
    },
    * addMetric({ payload }, { call, put }) {
      const response = yield call(addSource, payload)
    },
    //删除指定数据
    * delChoosedSource({ payload }, { call, put }) {
      const response = yield call(deleteSource, payload.id)
    },
  }
}
