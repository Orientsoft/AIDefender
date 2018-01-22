import { getStructures, getMetaStructure } from 'services/settings'

export default {
  namespace: 'settings',

  state: {
    showModal: false,
    treeData: [],
    metaTreeData: {},
  },

  reducers: {
    setTreeData (state, { payload }) {
      return { ...state, treeData: payload }
    },
    addTreeData (state, { payload }) {
      const treeData = state.treeData.concat(payload)
      return { ...state, treeData }
    },
    deleteTreeData (state, { payload }) {
      state.treeData.splice(payload, 1)
      return { ...state }
    },
    setMetaTreeData (state, { payload }) {
      return { ...state, showModal: true, metaTreeData: payload }
    },
    toggleModal (state, { payload }) {
      return { ...state, showModal: payload }
    },
  },

  effects: {
    * query (_, { call, put }) {
      const response = yield call(getStructures)
      yield put({ type: 'setTreeData', payload: response.data })
    },
    * queryMetaTree (_, { call, put }) {
      const response = yield call(getMetaStructure)
      yield put({ type: 'setMetaTreeData', payload: response.data })
    },
  },
}
