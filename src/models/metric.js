import { getAllSource, addSource, getchoosedSource, deleteSource, updateSource } from 'services/source'

export default {
  namespace: 'metric',

  state: {
    metrics: [],
    choosedMetric: {},
  },

  reducers: {
    //获取所有数据
    getAllMetrics(state, { payload }) {
      return { ...state, metrics: payload }
    },
    //添加数据
    addAllMetric(state, { payload }) {
      const metrics = state.metrics.concat(payload)
      return { ...state, metrics }
    },
    // 删除数据
    deleteMetric(state, { payload }) {
      let index = -1
      state.metrics.forEach((src, i) => {
        if (src._id === payload) {
          index = i
        }
      })
      if (index > -1) {
        state.metrics.splice(index, 1)
      }
      return { ...state }
    },
    // 更新指定数据
    updateSource(state, { payload }) {
      const metrics = state.metrics.map((item) => {
        if (item._id == payload._id) {
          item = payload
        }
      })
      return { ...state, metrics }
    },
    // 获取指定数据
    getchoosedSource(state, { payload }) {
      return { ...state, choosedMetric: payload }
    }
  },

  effects: {
    // 查询所有数据
    * queryMetrics({ payload }, { call, put }) {
      const response = yield call(getAllSource, payload)
      yield put({ type: 'getAllMetrics', payload: response.data })
    },
    // 添加数据
    * addMetric({ payload }, { call, put }) {
      let response = yield call(addSource, payload)
      yield put({ type: 'addAllMetric', payload: response.data })
    },
    // 获取指定数据
    * queryChoosedSource({ payload }, { call, put }) {
      console.log('id',payload)
      const response = yield call(getchoosedSource, payload.id)
      yield put({ type: 'getchoosedSource', payload: response.data })
    },
    // 删除指定数据
    * delChoosedSource({ payload }, { call, put }) {
      yield call(deleteSource, payload.id)
      yield put({ type: 'deleteMetric', payload: payload.id })
    },
    // 更新指定数据
    * updateChoosedSource({ payload }, { call }) {
      let response = yield call(updateSource, payload)
      yield put({ type: 'updateSource', payload: response.data })
    },
  },
}
