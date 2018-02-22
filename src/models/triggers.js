import { getAllSource, addSource, getChoosedSource, deleteSource, updateSource } from 'services/triggers'

export default {
  namespace: 'triggers',
  state: {
    allFlows: [],
    choosedFlow: {},
    triggerInResponse: '',
    triggers: [],
    triggersId: [],
  },
  reducers: {
    // 添加数据
    addAllTrigger (state, { payload }) {
      const triggers = state.triggers.concat(payload)
      const triggersId = state.triggersId.concat(payload.id)
      return { ...state, triggers, triggersId }
    },
    // 删除数据
    deleteTrigger (state, { payload }) {
      let index = -1
      state.allFlows.forEach((src, i) => {
        if (src.id === payload) {
          index = i
        }
      })
      if (index > -1) {
        state.allFlows.splice(index, 1)
      }
      return { ...state }
    },
  },
  effects: {
    // 添加数据
    * addTrigger ({ payload }, { call, put }) {
      console.log('ss', payload)
      let response = yield call(addSource, payload.data)
      yield put({ type: 'addAllTrigger', payload: response.data })
    },
    // 删除指定数据
    * delChoosedSource ({ payload }, { call, put }) {
      let response = yield call(deleteSource, payload.id)
      yield put({ type: 'deleteTrigger', payload: payload.id })
    },
  },
}
