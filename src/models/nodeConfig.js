import { DS_CONFIG, KPI_CONFIG, ALERT_CONFIG } from 'services/consts'
import { getAllSource } from 'services/source'

export default {
  namespace: 'nodeConfig',

  state: {
    dataSource: [],
    kpi: [],
    alert: [],
  },

  reducers: {
    updateDataSource (state, { payload }) {
      return { ...state, dataSource: payload }
    },
  },

  effects: {
    * queryDataSource (_, { call, put }) {
      const response = yield call(getAllSource, { type: DS_CONFIG })
      yield put({ type: 'updateDataSource', payload: response.data })
    },
  },
}
