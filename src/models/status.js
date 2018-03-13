import { getAllSource, addSource } from 'services/status'
import moment from 'moment'

export default {
  namespace: 'status',

  state: {
    status: [],
    pagination: {},
  },

  reducers: {
    // 获取所有数据
    getAllStatus(state, { payload }) {
      let status = payload.statusList
      status.forEach(item => {
        const { createdAt, updatedAt } = item
        item.createdAt = moment(createdAt).format('YYYY-MM-DD HH:mm:ss')
        item.updatedAt = moment(updatedAt).format('YYYY-MM-DD HH:mm:ss')
      })

      let pagination = payload._metadata
      return { ...state, status, pagination }
    },

  },

  effects: {
    // 根据页数查询数据
    * queryStatus ({ payload = {} }, { call, put }) {
      const { current = 1, pageSize = 20 } = payload
      const response = yield call(getAllSource, { page: current - 1, pageSize })
      console.log('queryStatus', response)
      yield put({ type: 'getAllStatus', payload: response.data })
    },

    // 根据level查询数据
    * queryStatusByLevel ({ payload }, { call, put }) {
      const response = yield call(getAllSource, payload)
      yield put({ type: 'getAllStatus', payload: response.data })
    },
  },
}
