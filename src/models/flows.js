import { getAllSource, addSource, getChoosedSource, deleteSource, updateSource, getFlowJobs } from 'services/flows'
import moment from 'moment'
import { Message } from 'antd'

export default {
  namespace: 'flows',
  state: {
    allFlows: [],
    choosedFlow: {},
    pagination: {},
    flowJobs: [],
  },
  reducers: {
    // 根据页数获取所有数据
    getAllFlows (state, { payload }) {
      let allFlows = payload.flows
      allFlows.forEach((item) => {
        const { createdAt, updatedAt } = item
        item.createdAt = moment(createdAt).format('YYYY-MM-DD HH:mm:ss')
        item.updatedAt = moment(updatedAt).format('YYYY-MM-DD HH:mm:ss')
      })
      let pagination = payload._metadata
      return { ...state, allFlows, pagination }
    },
    // 添加数据
    addAllFlow (state, { payload }) {
      if (state.allFlows.length < 20) {
        const { createdAt, updatedAt } = payload
        payload.createdAt = moment(createdAt).format('YYYY-MM-DD HH:mm:ss')
        payload.updatedAt = moment(updatedAt).format('YYYY-MM-DD HH:mm:ss')
        const allFlows = state.allFlows.concat(payload)
        let totalCount = state.pagination.totalCount + 1
        state.pagination.totalCount = totalCount
        return { ...state, allFlows }
      } else {
        let totalCount = state.pagination.totalCount + 1
        state.pagination.totalCount = totalCount
        return { ...state }
      }
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
        state.pagination.totalCount -= 1
      }
      return { ...state }
    },
    // 更新指定数据
    updateFlow (state, { payload }) {
      const { createdAt, updatedAt } = payload
      payload.createdAt = moment(createdAt).format('YYYY-MM-DD HH:mm:ss')
      payload.updatedAt = moment(updatedAt).format('YYYY-MM-DD HH:mm:ss')
      for (let key in state.allFlows) {
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
    // 获取展开行flow的运行的tasks状态
    searchFlowJobs (state, { payload }) {
      if (state.flowJobs.length === 0 || !state.flowJobs.find(item => item.flowId === payload.flowId)) {
        state.flowJobs.push(payload)
      } else {
        state.flowJobs.forEach((item) => {
          if (item.flowId === payload.flowId) {
            item = Object.assign(item, payload)
          }
        })
        // var item = state.flowJobs.find(item => item.flowId === payload.flowId)
        // if (item) {
        //   Object.assign(item, payload)
        // }
      }
      return { ...state }
    },
    // 关闭展开行
    deleteSearchFlowJobs (state, { payload }) {
      state.flowJobs = state.flowJobs.filter(item => item.flowId !== payload.id)
      return { ...state }
    },
  },
  effects: {
    // 根据页数查询数据
    * queryFlows ({ payload = {} }, { call, put }) {
      const { current = 1, pageSize = 20 } = payload
      let response = yield call((args) => {
        return getAllSource(args).catch((err) => {
          if (err.response.data.message) {
            err = err.response.data.message
          }
          Message.error(err)
        })
      }, { page: current - 1, pageSize })
      if (response) {
        yield put({ type: 'getAllFlows', payload: response.data })
      }
      // const response = yield call(getAllSource, { page: current - 1, pageSize })
      // yield put({ type: 'getAllFlows', payload: response.data })
    },
    // 添加数据
    * addFlow ({ payload }, { call, put }) {
      let response = yield call((args) => {
        return addSource(args).catch((err) => {
          if (err.response.data.message) {
            err = err.response.data.message
          }
          Message.error(err)
        })
      }, payload.data)
      if (response) {
        const response2 = yield call(getAllSource, { page: payload.page })
        yield put({ type: 'getAllFlows', payload: response2.data })
        payload.modalVisible()
      }

      // let response = yield call(addSource, payload)
      // yield put({ type: 'addAllFlow', payload: response.data })
      // yield call(addSource, payload.data)
      // const response = yield call(getAllSource, { page: payload.page })
      // yield put({ type: 'getAllFlows', payload: response.data })
    },
    // 获取指定数据
    * queryChoosedSource ({ payload }, { call, put }) {
      let response = yield call((args) => {
        return getChoosedSource(args).catch((err) => {
          if (err.response.data.message) {
            err = err.response.data.message
          }
          Message.error(err)
        })
      }, payload.id)
      if (response) {
        yield put({ type: 'getChoosedFlow', payload: response.data })
      }
      // const response = yield call(getChoosedSource, payload.id)
      // yield put({ type: 'getChoosedFlow', payload: response.data })
    },
    // 删除指定数据
    * delChoosedSource ({ payload }, { call, put }) {
      // yield call(deleteSource, payload.id)
      yield call((args) => {
        return deleteSource(args).catch((err) => {
          if (err.response.data.message) {
            err = err.response.data.message
          }
          Message.error(err)
        })
      }, payload.id)
      const response = yield call(getAllSource, { page: payload.page - 1 })
      yield put({ type: 'getAllFlows', payload: response.data })
      // yield call(deleteSource, payload.id)
      // yield put({ type: 'deleteFlow', payload: payload.id })
    },
    // 更新指定数据
    * updateChoosedSource ({ payload }, { call, put }) {
      let data = {
        data: payload.data,
        id: payload.id,
      }
      let response = yield call((args) => {
        return updateSource(args).catch((err) => {
          if (err.response.data.message) {
            err = err.response.data.message
          }
          Message.error(err)
        })
      }, data)
      if (response) {
        // const response2 = yield call(getAllSource, { page: payload.page })
        yield put({ type: 'updateFlow', payload: response.data })
        payload.modalVisible()
      }

      // let response = yield call(updateSource, payload)
      // yield put({ type: 'updateFlow', payload: response.data })
    },
    // 获取flow下的运行的tasks状态
    * getAllflowJobs ({ payload }, { call, put }) {
      let id = payload.id
      let response = yield call(getFlowJobs, payload.id)
      let flow = {
        flowId: id,
        data: response.data,
      }
      yield put({ type: 'searchFlowJobs', payload: flow })
    },
  },
}
