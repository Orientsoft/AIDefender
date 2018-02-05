import { DS_CONFIG, KPI_CONFIG, ALERT_CONFIG } from 'services/consts'
import { getAllSource } from 'services/source'

export default {
  namespace: 'nodeConfig',

  state: {
    dataSource: [],
    kpi: [],
    alert: [],
    data: {
      ds: [],
      kpi: [],
      alert: [],
    },
  },

  reducers: {
    updateDataSource (state, { payload }) {
      return { ...state, dataSource: payload }
    },
    getAllMetrics (state, { payload }) {
      return { ...state, kpi: payload }
    },
    saveKPI (state, { payload }) {
      state.data.kpi = payload.map(item => item._id)
      return { ...state }
    },
    saveDataSource (state, { payload }) {
      state.data.ds = payload.map(item => item._id)
      return { ...state }
    },
  },

  effects: {
    * queryDataSource (_, { call, put }) {
      const response = yield call(getAllSource, { type: DS_CONFIG })
      yield put({ type: 'updateDataSource', payload: response.data })
    },
    * queryMetrics (_, { call, put }) {
      const response = yield call(getAllSource, { type: KPI_CONFIG })
      yield put({ type: 'getAllMetrics', payload: response.data })
    },
  },
}
