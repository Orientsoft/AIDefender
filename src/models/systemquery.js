import { getQueryResult, getKPIResult, getAlertResult } from 'services/systemquery'
import { getChoosedSource, getChoosedAlertSource } from 'services/source'
import { getStructure, updateStructure } from 'services/settings'
import merge from 'lodash/merge'
import compact from 'lodash/compact'

export default {
  namespace: 'systemquery',

  state: {
    subMenus: [
      { name: 'KPI' },
      { name: '告警' },
      { name: '查询' },
    ],
    structure: null,
    queryConfig: [],
    kpiConfig: [],
    alertConfig: [],
    queryResult: [],
    kpiResult: {},
    alertResult: [],
    queryCondition: [],
    activeNode: null,
    currentDataSouce: null,
  },

  reducers: {
    resetResult (state, { payload }) {
      merge(state, payload)
      state.queryResult.length = 0
      state.kpiResult = {}
      state.alertResult.length = 0
      state.queryCondition.length = 0
      state.queryConfig.length = 0
      state.kpiConfig.length = 0
      state.alertConfig.length = 0

      return state
    },
    setStructure (state, { payload }) {
      return { ...state, structure: payload }
    },
    setQueryResult (state, { payload }) {
      return { ...state, queryResult: payload.result, queryCondition: payload.condition }
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
    setCurrentDatasource (state, { payload }) {
      return { ...state, currentDataSouce: payload }
    },
  },
  effects: {
    * query ({ payload, currentPage = 0, pageSize = 20 }, { put, call }) {
      let response = { responses: [] }
      const from = currentPage * pageSize
      const { filters, dateRange, datasource } = payload
      // Don't execute search if conditions is empty
      // if (filters && filters.length) {
      response = yield call(getQueryResult, {
        payload: filters,
        from,
        size: pageSize,
        datasource,
        filters: { dateRange },
      })
      // }
      yield put({
        type: 'setQueryResult',
        payload: {
          condition: filters,
          result: response.responses.map(res => res.hits),
        },
      })
    },
    * saveQuery ({ payload }, { call }) {
      yield call(updateStructure, payload)
    },
    * getStructure ({ payload }, { put, call }) {
      const response = yield call(getStructure, payload)
      yield put({ type: 'setStructure', payload: response.data })
    },
    * queryKPI ({ payload }, { put, call }) {
      const response = yield call(getKPIResult, payload)
      yield put({
        type: 'setKPIResult',
        payload: response.responses.reduce((aggs, res) => Object.assign(aggs, res.aggregations), {}),
      })
    },
    * queryAlert ({ payload }, { put, call }) {
      const response = yield call(getAlertResult, payload)
      yield put({ type: 'setAlertResult', payload: response.hits.hits })
    },
    * queryDSConfig ({ payload }, { put }) {
      const response = yield Promise.all(payload.map(id => getChoosedSource(id).catch(() => null)))
      yield put({ type: 'setQueryConfig', payload: compact(response).map(res => res.data) })
    },
    * queryKPIConfig ({ payload }, { put }) {
      const response = yield Promise.all(payload.map(id => getChoosedSource(id).catch(() => null)))
      yield put({ type: 'setKPIConfig', payload: compact(response).map(res => res.data) })
    },
    * queryAlertConfig ({ payload }, { put }) {
      const response = yield Promise.all(payload.map(id => getChoosedAlertSource(id).catch(() => null)))
      yield put({ type: 'setAlertConfig', payload: compact(response).map(res => res.data) })
    },
    * getCurrentSource ({ payload }, { put, call }) {
      const response = yield call(getChoosedSource, payload)
      yield put({ type: 'setCurrentDatasource', payload: response.data })
    },
  },
}
