import { getQueryResult, getKPIResult } from 'services/systemquery'

export default {
  namespace: 'systemquery',

  state: {
    subMenus: [
      { name: '查询' },
      { name: '告警' },
      { name: 'KPI' },
    ],
    result: [],
    KPIResult: {}
  },

  reducers: {
    update (state, { payload }) {
      return { ...state, result: payload }
    }, 
    updateKPIResult ( state, { payload}) {
      return { ...state, KPIResult: payload }
    },

  },
  effects: {
    * query ({ payload }, { put, call }) {
      const response = yield call(getQueryResult, payload)
      yield put({ type: 'update', payload: response.data })
    },

    * KPI ({ payload }, { put, call }) {
      const response = yield call(getKPIResult, payload)
      yield put({type: 'updateKPIResult', payload: response.data})
    },
  }
}
