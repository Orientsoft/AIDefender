import { getAllSource, addSource, getChoosedSource, deleteSource, updateSource } from 'services/ports'
import moment from 'moment'
import { Message } from 'antd'

export default {
  namespace: 'ports',

  state: {
    ports: [],
    inputs: [],
    outputs: [],
    choosedPort: {},
    pagination: {},
    portsFiltered: [],
    // allports: [],
  },

  reducers: {
    resetPorts (state) {
      state.inputs = []
      state.outputs = []
      return { ...state }
    },
    // 获取所有数据
    getAllPorts (state, { payload }) {
      let ports = payload.ports
      ports.forEach((item) => {
        const { createdAt, updatedAt } = item
        item.createdAt = moment(createdAt).format('YYYY-MM-DD HH:mm:ss')
        item.updatedAt = moment(updatedAt).format('YYYY-MM-DD HH:mm:ss')
      })

      let pagination = payload._metadata
      return { ...state, ports, pagination }
    },
    getInputs (state, { payload }) {
      let inputs = payload.ports
      return { ...state, inputs }
    },
    getOutputs (state, { payload }) {
      let outputs = payload.ports
      return { ...state, outputs }
    },
    // 添加数据
    addAllPort (state, { payload }) {
      state.allports.push(payload)
      if (state.ports.length < 20) {
        const { createdAt, updatedAt } = payload
        payload.createdAt = moment(createdAt).format('YYYY-MM-DD HH:mm:ss')
        payload.updatedAt = moment(updatedAt).format('YYYY-MM-DD HH:mm:ss')
        const ports = state.ports.concat(payload)
        let totalCount = state.pagination.totalCount + 1
        state.pagination.totalCount = totalCount
        return { ...state, ports }
      } else {
        let totalCount = state.pagination.totalCount + 1
        state.pagination.totalCount = totalCount
        return { ...state }
      }
    },
    // 删除数据
    // deletePort (state, { payload }) {
    //   let index = -1
    //   state.ports.forEach((src, i) => {
    //     if (src._id === payload) {
    //       index = i
    //     }
    //   })
    //   if (index > -1) {
    //     state.ports.splice(index, 1)
    //     state.pagination.totalCount -= 1
    //   }
    //   return { ...state }
    // },
    // 更新指定数据
    updatePort (state, { payload }) {
      const { createdAt, updatedAt } = payload
      payload.createdAt = moment(createdAt).format('YYYY-MM-DD HH:mm:ss')
      payload.updatedAt = moment(updatedAt).format('YYYY-MM-DD HH:mm:ss')
      for (let key in state.ports) {
        if (state.ports[key]._id === payload._id) {
          state.ports[key] = payload
        }
      }
      for (let key in state.allports) {
        if (state.allports[key]._id === payload._id) {
          state.allports[key] = payload
        }
      }
      return { ...state }
    },
    // 获取指定数据
    getChoosedPort (state, { payload }) {
      return { ...state, choosedPort: payload }
    },
    // 根据type获取所有数据
    getPortsByType (state, { payload }) {
      let portsFiltered = payload.ports
      return { ...state, portsFiltered }
    },
    // 获取所有names
    getAllPortNames (state, { payload }) {
      let allports = payload.ports
      return { ...state, allports }
    },
  },

  effects: {
    // 根据页数查询数据
    * queryPorts ({ payload = {} }, { call, put }) {
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
        yield put({ type: 'getAllPorts', payload: response.data })
      }

      // const response = yield call(getAllSource, { page: current - 1, pageSize })
      // yield put({ type: 'getAllPorts', payload: response.data })
    },
    * queryInputs ({ payload }, { call, put }) {
      const response = yield call(getAllSource, payload)
      yield put({ type: 'getInputs', payload: response.data })
    },
    * queryOutputs ({ payload }, { call, put }) {
      const response = yield call(getAllSource, payload)
      yield put({ type: 'getOutputs', payload: response.data })
    },
    // 添加数据
    * addPort ({ payload }, { call, put }) {
      let data = payload.data
      let response = yield call((args) => {
        return addSource(args).catch((err) => {
          if (err.response.data.message) {
            err = err.response.data.message
          }
          Message.error(err)
        })
      }, data)
      if (response) {
        yield put({ type: 'addAllPort', payload: response.data })
        payload.callback()
      }

      // let response = yield call(addSource, payload)
      // yield put({ type: 'addAllPort', payload: response.data })
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
        yield put({ type: 'getChoosedPort', payload: response.data })
      }
      // const response = yield call(getChoosedSource, payload.id)
      // yield put({ type: 'getChoosedPort', payload: response.data })
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
      yield put({ type: 'getAllPorts', payload: response.data })
      payload.callback()
      // yield put({ type: 'deletePort', payload: payload.id })
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
        yield put({ type: 'updatePort', payload: response.data })
        payload.callback()
      }
      // let response = yield call(updateSource, payload)
      // yield put({ type: 'updatePort', payload: response.data })
    },
    // 根据type查询数据
    * queryPortsByType ({ payload }, { call, put }) {
      const response = yield call(getAllSource, payload)
      yield put({ type: 'getPortsByType', payload: response.data })
    },
    * resetInportsOutports ({ payload }, { call, put }) {
      yield put({ type: 'resetPorts' })
    },
    // * AllPorts ({ payload }, { call, put }) {
    //   const response = yield call(getAllSource, payload)
    //   yield put({ type: 'getAllPortNames', payload: response.data })
    // },
  },
}
