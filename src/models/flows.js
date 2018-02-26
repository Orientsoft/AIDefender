import { getAllSource, addSource, getChoosedSource, deleteSource, updateSource } from 'services/flows'
import moment from 'moment'

export default {
  namespace: 'flows',
  state: {
    allFlows: [],
    choosedFlow: {},
    pagination: {},
  },
  reducers: {
    // 获取所有数据
    getAllFlows (state, { payload }) {
      let allFlows = payload.flows
      allFlows.forEach(item => {
        const { createdAt, updatedAt } = item
        item.createdAt = moment(createdAt).format('YYYY-MM-DD HH:mm:ss')
        item.updatedAt = moment(updatedAt).format('YYYY-MM-DD HH:mm:ss')
      })

      let pagination = payload._metadata
      return { ...state, allFlows, pagination }
    },
    // 添加数据
    addAllFlow (state, { payload }) {
      const { createdAt, updatedAt } = payload
      payload.createdAt = moment(createdAt).format('YYYY-MM-DD HH:mm:ss')
      payload.updatedAt = moment(updatedAt).format('YYYY-MM-DD HH:mm:ss')
      const allFlows = state.allFlows.concat(payload)
      return { ...state, allFlows }
    },
    // 删除数据
    deleteFlow (state, { payload }) {
      let index = -1
      state.allFlows.forEach((src, i) => {
        if (src._id === payload) {
          index = i
        }
      })
      if (index > -1) {
        state.allFlows.splice(index, 1)
      }
      return { ...state }
    },
    // 更新指定数据
    updateFlow (state, { payload }) {
      const { createdAt, updatedAt } = payload
      payload.createdAt = moment(createdAt).format('YYYY-MM-DD HH:mm:ss')
      payload.updatedAt = moment(updatedAt).format('YYYY-MM-DD HH:mm:ss')
      for (let key in state.ports) {
        if (state.allFlows[key]._id === payload._id) {
          state.allFlows[key] = payload
        }
      }
      return { ...state }
    },
    // 获取指定数据
    getChoosedFlow (state, { payload }) {
      return { ...state, choosedFlow: payload }
    },
  },
  effects: {
    // 查询所有数据
    * queryFlows (_, { call, put }) {
      const response = yield call(getAllSource)
      yield put({ type: 'getAllFlows', payload: response.data })
    },
    // 添加数据
    * addFlow ({ payload }, { call, put }) {
      let response = yield call(addSource, payload)
      yield put({ type: 'addAllFlow', payload: response.data })
    },
    // 获取指定数据
    * queryChoosedSource ({ payload }, { call, put }) {
      const response = yield call(getChoosedSource, payload.id)
      yield put({ type: 'getChoosedFlow', payload: response.data })
    },
    // 删除指定数据
    * delChoosedSource ({ payload }, { call, put }) {
      yield call(deleteSource, payload.id)
      yield put({ type: 'deleteFlow', payload: payload.id })
    },
    // 更新指定数据
    * updateChoosedSource ({ payload }, { call, put }) {
      let response = yield call(updateSource, payload)
      yield put({ type: 'updateFlow', payload: response.data })
    },
  },
}
