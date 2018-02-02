import { getStructures, saveStructure, updateStructure, deleteStructure, getMetaStructure } from 'services/settings'

export default {
  namespace: 'settings',

  state: {
    showModal: false,
    treeData: [],
    metaTreeData: null,
  },

  reducers: {
    setTreeData (state, { payload }) {
      return { ...state, treeData: payload }
    },
    addTreeData (state, { payload }) {
      const treeData = state.treeData.concat(payload)
      return { ...state, treeData }
    },
    removeTreeData (state, { payload }) {
      const treeData = []
      state.treeData.forEach((data) => {
        if (data._id !== payload._id) {
          treeData.push(data)
        }
      })
      return { ...state, treeData }
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
    * saveTreeData ({ payload }, { call, put }) {
      yield put({ type: 'setMetaTreeData', payload: null })
      const response = yield call(saveStructure, payload)
      yield put({ type: 'addTreeData', payload: response.data })
      yield put({ type: 'app/updateSubMenus', payload: response.data })
    },
    * updateTreeData ({ payload }, { call, put }) {
      const response = yield call(updateStructure, payload)
      // yield put({ type: 'updateTreeData', payload: response.data })
    },
    * deleteTreeData ({ payload }, { call, put }) {
      yield call(deleteStructure, payload)
      yield put({ type: 'removeTreeData', payload })
    },
  },
}
