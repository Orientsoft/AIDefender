import { DS_CONFIG, KPI_CONFIG, ALERT_CONFIG } from 'services/consts'
import {
  getAllSource,
  getAllAlertSource,
  getChoosedSource,
  getChoosedAlertSource,
} from 'services/source'
import merge from 'lodash/merge'
import compact from 'lodash/compact'
import mapValues from 'lodash/mapValues'

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
    resetConfig (state) {
      state.dataSource.length = 0
      state.kpi.length = 0
      state.alert.length = 0
      state.data = {
        ds: [],
        kpi: [],
        alert: [],
      }

      return { ...state }
    },
    setDataSource (state, { payload }) {
      return { ...state, dataSource: payload }
    },
    setAllMetrics (state, { payload }) {
      return { ...state, kpi: payload }
    },
    setAllAlerts (state, { payload }) {
      return { ...state, alert: payload }
    },
    saveKPI (state, { payload }) {
      state.data.kpi = payload
      return { ...state }
    },
    saveDataSource (state, { payload }) {
      state.data.ds = payload
      return { ...state }
    },
    savaAlerts (state, { payload }) {
      state.data.alert = payload
      return { ...state }
    },
    updateConfig (state, { payload }) {
      return merge({ ...state }, { data: payload })
    },
  },

  effects: {
    * queryDataSource (_, { call, put }) {
      const response = yield call(getAllSource, { type: DS_CONFIG })
      yield put({ type: 'setDataSource', payload: response.data })
    },
    * queryMetrics (_, { call, put }) {
      const response = yield call(getAllSource, { type: KPI_CONFIG })
      yield put({ type: 'setAllMetrics', payload: response.data })
    },
    * queryAlerts (_, { call, put }) {
      const response = yield call(getAllAlertSource, { type: ALERT_CONFIG })
      yield put({ type: 'setAllAlerts', payload: response.data.alerts })
    },
    * queryChoosedSource ({ payload }, { put }) {
      const { ds = [], kpi = [], alert = [] } = payload.data
      const dsResponse = yield Promise.all(ds.map(id => getChoosedSource(id).catch(() => null)))
      const kpiResponse = yield Promise.all(kpi.map(id => getChoosedSource(id).catch(() => null)))
      const alertResponse = yield Promise.all(alert.map(id => getChoosedAlertSource(id).catch(() => null)))

      yield put({
        type: 'updateConfig',
        payload: mapValues({
          ds: dsResponse,
          kpi: kpiResponse,
          alert: alertResponse,
        }, response => compact(response.map(res => res && res.data && res.data._id))),
      })
    },
  },
}
