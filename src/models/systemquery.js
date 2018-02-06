import { getQueryResult, getKPIResult, getAlertResult } from 'services/systemquery'

export default {
  namespace: 'systemquery',

  state: {
    subMenus: [
      { name: '查询' },
      { name: '告警' },
      { name: 'KPI' },
    ],
    queryResult: {},
    kpiResult: {},
    alertResult: {},
    activeNode: null,
  },

  reducers: {
    setQueryResult (state, { payload }) {
      return { ...state, queryResult: payload }
    },
    setKPIResult (state, { payload }) {
      return { ...state, kpiResult: payload }
    },
    setAlertResult (state, { payload }) {
      return { ...state, alertResult: payload }
    },
    setActiveNode (state, { payload }) {
      return { ...state, activeNode: payload }
    },
  },
  effects: {
    * query ({ payload }, { put, call }) {
      const response = yield call(getQueryResult, payload)
      yield put({ type: 'setQueryResult', payload: response.data })
    },
    * queryKPI ({ payload }, { put, call }) {
      const response = yield call(getKPIResult, payload)
      yield put({ type: 'setKPIResult', payload: response.data })
    },
    * queryAlert ({ payload }, { put, call }) {
      const response = yield call(getAlertResult, payload)
      yield put({ type: 'setAlertResult', payload: response.data })
    },
  },
}
