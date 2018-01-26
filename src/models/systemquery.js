import { getQueryResult } from 'services/systemquery'

export default {
  namespace: 'systemquery',

  state: {
    result: [],
  },

  reducers: {
    update (state, { payload }) {
      return { ...state, result: payload }
    }
  },

  effects: {
    * query ({ payload }, { put, call }) {
      const response = yield call(getQueryResult, payload)
      yield put({ type: 'update', payload: response.data })
    },
  },
}
