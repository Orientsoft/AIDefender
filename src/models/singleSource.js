import { getAllSource, addSource, getchoosedSource, deleteSource, updateSource } from 'services/source'

export default {
  namespace: 'singleSource',

  state: {
    allSingleSource: [],
    singleSource: {},
  },

  reducers: {
    getAllSingleSources (state, { payload }) {
      return { ...state, allSingleSource: payload }
    },
    getchoosedSource (state, { payload }) {
      return { ...state, singleSource: payload }
    },
    addAllSingleSource (state, { payload }) {
      const allSingleSource = state.allSingleSource.concat(payload)
      return { ...state, allSingleSource }
    },
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
  },

  effects: {
    // 获取所有数据
    * querySingleSource ({ payload }, { call, put }) {
      const response = yield call(getAllSource, payload)
      yield put({ type: 'getAllSingleSources', payload: response.data })
    },
    // 获取指定数据
    * queryChoosedSource ({ payload }, { call, put }) {
      const response = yield call(getchoosedSource, payload.id)
      yield put({ type: 'getchoosedSource', payload: response.data })
    },
    // 添加数据
    * addSingleSource ({ payload }, { call, put }) {
      let response = yield call(addSource, payload)
      yield put({ type: 'addAllSingleSource', payload:response.data })
    },
    // 删除指定数据
    * delChoosedSource ({ payload }, { call, put }) {
      yield call(deleteSource, payload.id)
      yield put({ type: 'deleteSingleSource', payload: payload.id })
    },
    // 更新指定数据
    * updateChoosedSource ({ payload }, { call }) {
      yield call(updateSource, payload)
    },
  },
}
