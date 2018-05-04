// @flow
import { getQueryResult, getKPIResult, getAlertResult, getAlertData } from 'services/systemquery'
import { getChoosedSource, getChoosedAlertSource } from 'services/source'
import { getStructure, updateStructure } from 'services/settings'
import merge from 'lodash/merge'
import compact from 'lodash/compact'

export type AlertData = {
  name: string,
  index: string,
}

function findChildByCode (structure, code) {
  if (structure && code && Array.isArray(structure.children)) {
    return structure.children.find((child) => {
      if (child.code === code) {
        return child
      }
      return findChildByCode(child, code)
    })
  }

  return null
}

export default {
  namespace: 'systemquery',

  state: {
    subMenus: [
      { name: 'KPI' },
      { name: '告警' },
      { name: '查询' },
    ],
    // 当前激活的Tab，范围从0到3
    activeTab: {
      key: '0',
      payload: null,
    },
    structure: null,
    queryConfig: [],
    kpiConfig: [],
    alertConfig: [],
    queryResult: [],
    kpiResult: {},
    alertResult: [],
    alertData: {},
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
      state.alertData = {}
      state.queryCondition.length = 0
      state.queryConfig.length = 0
      state.kpiConfig.length = 0
      state.alertConfig.length = 0

      return state
    },
    setActiveTab (state, { payload }) {
      const activeTab = {}

      if (typeof payload === 'number' || typeof payload === 'string') {
        activeTab.key = payload.toString()
      } else {
        activeTab.key = payload.key.toString()
        activeTab.payload = payload.payload
      }

      return { ...state, activeTab }
    },
    setStructure (state, { payload }) {
      return { ...state, structure: payload }
    },
    setQueryResult (state, { payload }) {
      state.activeTab.payload = null
      return {
        ...state,
        queryResult: payload.result,
        queryCondition: payload.condition,
      }
    },
    setKPIResult (state, { payload }) {
      return { ...state, kpiResult: payload }
    },
    setAlertResult (state, { payload }) {
      return { ...state, alertResult: payload }
    },
    setAlertData (state, { payload }) {
      return { ...state, alertData: payload }
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
    * query ({ payload, currentPage = 0, pageSize = 20, index }, { put, call }) {
      let response = { responses: [] }
      const from = currentPage * pageSize
      const {
        filters,
        queryConfig,
        dateRange,
        dataSource,
      } = payload
      // Don't execute search if conditions is empty
      // if (filters && filters.length) {
      response = yield call(getQueryResult, {
        payload: filters,
        from,
        size: pageSize,
        dataSource,
        queryConfig,
        index,
        filters: {
          dateRange,
        },
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
      const { id, forceUpdate } = payload
      const response = yield call(getStructure, id)

      if (forceUpdate) {
        const child = findChildByCode(response.data, forceUpdate.code)

        if (child && child.data) {
          if (Array.isArray(child.data.kpi)) {
            yield put({ type: 'queryKPIConfig', payload: child.data.kpi })
          }
          if (Array.isArray(child.data.alert)) {
            yield put({ type: 'queryAlertConfig', payload: child.data.alert })
          }
          if (Array.isArray(child.data.ds)) {
            yield put({ type: 'queryDSConfig', payload: child.data.ds })
          }
        }
      }

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
      yield put({ type: 'setAlertResult', payload: response.responses })
    },
    * queryAlertData ({ payload }, { put, call }) {
      const response = yield call(getAlertData, payload)
      yield put({ type: 'setAlertData', payload: response })
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
