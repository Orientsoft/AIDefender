import { getQueryResult, getKPIResult, getAlertResult } from 'services/systemquery'
import { getChoosedSource, getChoosedAlertSource } from 'services/source'
import compact from 'lodash/compact'

export default {
  namespace: 'systemquery',

  state: {
    subMenus: [
      { name: '查询' },
      { name: 'KPI' },
      { name: '告警' },
    ],
    queryConfig: [],
    kpiConfig: [],
    alertConfig: [],
    queryResult: [],
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
    setQueryConfig (state, { payload }) {
      return { ...state, queryConfig: payload }
    },
    setKPIConfig (state, { payload }) {
      return { ...state, kpiConfig: payload }
    },
    setAlertConfig (state, { payload }) {
      return { ...state, alertConfig: payload }
    },
  },
  effects: {
    * query ({ payload }, { put, call }) {
      let response = { responses: [] }
      // Don't execute search if conditions is empty
      if (payload.length) {
        response = yield call(getQueryResult, payload)
      }
      yield put({
        type: 'setQueryResult',
        payload: response.responses.map(res => res.hits),
      })
    },
    * queryKPI ({ payload }, { put, call }) {
      const response = yield call(getKPIResult, payload)
      yield put({ type: 'setKPIResult', payload: response.data })
    },
    * queryAlert ({ payload }, { put, call }) {
      const response = yield call(getAlertResult, payload)
      yield put({ type: 'setAlertResult', payload: response.data })
    },
    * queryDSConfig ({ payload }, { put }) {
      const response = yield Promise.all(payload.map(id => getChoosedSource(id).catch(() => null)))
      yield put({ type: 'setQueryConfig', payload: compact(response).map(res => res.data) })
    },
    * queryKPIConfig ({ payload }, { put }) {
      const response = yield Promise.all(payload.map(id => getChoosedSource(id).catch(() => null)))
      yield put({ type: 'setKPIConfig', payload: response.data })
    },
    * queryAlertConfig ({ payload }, { put }) {
      const response = yield Promise.all(payload.map(id => getChoosedAlertSource(id).catch(() => null)))
      yield put({ type: 'setAlertConfig', payload: response.data })
    },
  },
}
