import { getQueryResult, getKPIResult, getAlertResult } from 'services/systemquery'
import { getChoosedSource, getChoosedAlertSource } from 'services/source'
import { getStructure } from 'services/settings'
import moment from 'moment'
import compact from 'lodash/compact'

export default {
  namespace: 'systemquery',

  state: {
    subMenus: [
      { name: '查询' },
      { name: 'KPI' },
      { name: '告警' },
    ],
    structure: null,
    dateRange: [moment().startOf('day'), moment()],
    queryConfig: [],
    kpiConfig: [],
    alertConfig: [],
    queryResult: [],
    kpiResult: {},
    alertResult: {},
    queryCondition: [],
    activeNode: null,
  },

  reducers: {
    resetResult (state) {
      state.queryResult.length = 0
      state.kpiResult.length = 0
      state.alertResult.length = 0
      state.queryCondition.length = 0

      return { ...state }
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
    setDateRange (state, { payload }) {
      return { ...state, dateRange: payload }
    },
  },
  effects: {
    * query ({ payload, currentPage = 0, pageSize = 20 }, { put, call }) {
      let response = { responses: [] }
      const from = currentPage * pageSize
      // Don't execute search if conditions is empty
      if (payload && payload.length) {
        const filters = {}
        const conditions = []

        payload.forEach((data) => {
          if (data.type) {
            filters[data.type] = data.field[0].value
          } else {
            conditions.push(data)
          }
        })
        response = yield call(getQueryResult, {
          payload: conditions,
          from,
          size: pageSize,
          filters,
        })
      }
      yield put({
        type: 'setQueryResult',
        payload: {
          condition: payload,
          result: response.responses.map(res => res.hits),
        },
      })
    },
    * getStructure ({ payload }, { put, call }) {
      const response = yield call(getStructure, payload)
      yield put({ type: 'setStructure', payload: response.data })
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
