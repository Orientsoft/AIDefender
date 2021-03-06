import { getAllSource, addSource, getChoosedSource, deleteSource, updateSource } from 'services/source'

export default {
  namespace: 'singleSource',

  state: {
    allSingleSource: [],
    singleSource: {},
  },

  reducers: {
    // 获取所有数据
    getAllSingleSources (state, { payload }) {
      return { ...state, allSingleSource: payload }
    },
    // 获取指定数据
    getChoosedSource (state, { payload }) {
      return { ...state, singleSource: payload }
    },
    // 添加数据
    addAllSingleSource (state, { payload }) {
      const allSingleSource = state.allSingleSource.concat(payload)
      return { ...state, allSingleSource }
    },
    // 删除指定数据
    deleteSingleSource (state, { payload }) {
      let index = -1
      state.allSingleSource.forEach((src, i) => {
        if (src._id === payload) {
          index = i
        }
      })
      if (index > -1) {
        state.allSingleSource.splice(index, 1)
      }

      return { ...state }
    },
    // 更新指定数据
    updateSource (state, { payload }) {
      const allSingleSource = state.allSingleSource.map((item) => {
        if (item._id === payload._id) {
          item = payload
        }
        return item
      })
      return { ...state, allSingleSource }
    },
  },

  effects: {
    // 获取所有数据
    * querySingleSource ({ payload }, { call, put }) {
      const response = yield call(getAllSource, payload)
      yield put({ type: 'getAllSingleSources', payload: response.data })
    },
    // 获取指定数据
    * queryChoosedSource ({ payload }, { call, put }) {
      const response = yield call(getChoosedSource, payload.id)
      yield put({ type: 'getChoosedSource', payload: response.data })
    },
    // 添加数据
    * addSingleSource ({ payload }, { call, put }) {
      let response = yield call(addSource, payload)
      yield put({ type: 'addAllSingleSource', payload: response.data })
    },
    // 删除指定数据
    * delChoosedSource ({ payload }, { call, put }) {
      yield call(deleteSource, payload.id)
      yield put({ type: 'deleteSingleSource', payload: payload.id })
    },
    // 更新指定数据
    * updateChoosedSource ({ payload }, { call, put }) {
      let response = yield call(updateSource, payload)
      yield put({ type: 'updateSource', payload: response.data })
    },
  },
}
