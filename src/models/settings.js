import { getStructures } from 'services/settings'

export default {
  namespace: 'settings',

  state: {
    treeData: [],
  },

  reducers: {
    updateState (state, { payload }) {
      return { ...state, treeData: payload }
    },
  },

  effects: {
    * query (_, { call, put }) {
      const response = yield call(getStructures)
      yield put({ type: 'updateState', payload: response.data })
    },
  },
}
