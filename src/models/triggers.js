import { getAllSource, addSource, getChoosedSource, deleteSource, updateSource } from 'services/triggers'

export default {
  namespace: 'triggers',
  state: {
    triggers: [],
    triggersId: [],
  },
  reducers: {
    // 添加trigger数据
    addAllTrigger (state, { payload }) {
      const triggers = state.triggers.concat(payload)
      const triggersId = state.triggersId.concat(payload.id)
      return { ...state, triggers, triggersId }
    },
    // 删除trigger数据
    deleteTrigger (state, { payload }) {
      let index = -1
      state.triggers.forEach((src, i) => {
        if (src.id === payload) {
          index = i
        }
      })
      if (index > -1) {
        state.triggers.splice(index, 1)
      }
      let filters = state.triggersId.filter(item => item !== payload)
      console.log('filters', filters)
      state.triggersId = filters
      return { ...state }
    },
    // 清空trigger
    clearTrigger (state) {
      state.triggersId = []
      state.triggers = []
      return { ...state }
    },
  },
  effects: {
    // 添加trigger数据
    * addTrigger ({ payload }, { call, put }) {
      let response = yield call(addSource, payload.data)
      yield put({ type: 'addAllTrigger', payload: response.data })
    },
    // 删除指定trigger数据
    * delChoosedSource ({ payload }, { call, put }) {
      console.log('id', payload.id)
      yield call(deleteSource, payload.id)
      yield put({ type: 'deleteTrigger', payload: payload.id })
    },
  },
}
