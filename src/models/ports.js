import { getAllSource, addSource, getChoosedSource, deleteSource, updateSource } from 'services/ports'
import moment from 'moment'

export default {
  namespace: 'ports',

  state: {
    ports: [],
    inputs:[],
    outputs: [],  
    choosedPort: {},
    pagination: {},
  },

  reducers: {
    // 获取所有数据
    getAllPorts(state, { payload }) {
      let ports = payload.ports
      ports.forEach(item => {
        const { createdAt, updatedAt } = item
        item.createdAt = moment(createdAt).format('YYYY-MM-DD HH:mm:ss')
        item.updatedAt = moment(updatedAt).format('YYYY-MM-DD HH:mm:ss')
      })

      let pagination = payload._metadata
      return { ...state, ports, pagination }
    },
    getInputs(state, { payload }) {
      let inputs = payload.ports
      return { ...state, inputs }
    },
    getOutputs(state, { payload }) {
      let outputs = payload.ports
      return { ...state, outputs }
    },
    // 添加数据
    addAllPort(state, { payload }) {
      const { createdAt, updatedAt } = payload
      payload.createdAt = moment(createdAt).format('YYYY-MM-DD HH:mm:ss')
      payload.updatedAt = moment(updatedAt).format('YYYY-MM-DD HH:mm:ss')
      const ports = state.ports.concat(payload)
      return { ...state, ports }
    },
    // 删除数据
    deletePort(state, { payload }) {
      let index = -1
      state.ports.forEach((src, i) => {
        if (src._id === payload) {
          index = i
        }
      })
      if (index > -1) {
        state.ports.splice(index, 1)
      }
      return { ...state }
    },
    // 更新指定数据
    updatePort(state, { payload }) {
      const { createdAt, updatedAt } = payload
      payload.createdAt = moment(createdAt).format('YYYY-MM-DD HH:mm:ss')
      payload.updatedAt = moment(updatedAt).format('YYYY-MM-DD HH:mm:ss')
      for (let key in state.ports) {
        if (state.ports[key]._id === payload._id) {
          state.ports[key] = payload
        }
      }
      return { ...state }
    },
    // 获取指定数据
    getChoosedPort(state, { payload }) {
      return { ...state, choosedPort: payload }
    },
  },

  effects: {
    // 查询所有数据
    * queryPorts({ payload }, { call, put }) {
      const response = yield call(getAllSource, payload)
      yield put({ type: 'getAllPorts', payload: response.data })
    },
    * queryInputs({ payload }, { call, put }) {
      const response = yield call(getAllSource, payload)
      yield put({ type: 'getInputs', payload: response.data })
    },
    * queryOutputs({ payload }, { call, put }) {
      const response = yield call(getAllSource, payload)
      yield put({ type: 'getOutputs', payload: response.data })
    },
    // 添加数据
    * addPort({ payload }, { call, put }) {
      let response = yield call(addSource, payload)
      yield put({ type: 'addAllPort', payload: response.data })
    },
    // 获取指定数据
    * queryChoosedSource({ payload }, { call, put }) {
      const response = yield call(getChoosedSource, payload.id)
      yield put({ type: 'getChoosedPort', payload: response.data })
    },
    // 删除指定数据
    * delChoosedSource({ payload }, { call, put }) {
      yield call(deleteSource, payload.id)
      yield put({ type: 'deletePort', payload: payload.id })
    },
    // 更新指定数据
    * updateChoosedSource({ payload }, { call, put }) {
      let response = yield call(updateSource, payload)
      yield put({ type: 'updatePort', payload: response.data })
    },
  },
}
