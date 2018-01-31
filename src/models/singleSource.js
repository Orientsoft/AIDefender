import { routerRedux } from 'dva/router'
import { getIndex, getFields, getAllSource, addSource, getchoosedSource, deleteSource, updateSource} from 'services/source'

export default {
  namespace: 'singleSource',

  state: {
    index:[],
    fields:[],
    allSingleSource:[],
    singleSource:{},
  },

  reducers: {
    setIndex (state, { payload }) {
      return { ...state, index: payload }
    },
    setFields (state, { payload }) {
      return { ...state, fields: payload }
    },
    getAllSingleSources (state, { payload }) {
      return { ...state, allSingleSource: payload }
    },
    getchoosedSource(state, { payload }){
      return { ...state, singleSource: payload }
    }
  },

  effects: {
    //获取index
    * queryIndex (_, { call, put }) {
      const response = yield call(getIndex)
      yield put({ type: 'setIndex', payload: response.data })
    },
    //获取字段
    * queryFields ({payload}, { call, put }) {
      const response = yield call(getFields,payload)
      yield put({ type: 'setFields', payload: response.data })
    },
    //获取所有数据
    * querySingleSource ({payload}, { call, put }) {
      const response = yield call(getAllSource, payload)
      yield put({ type: 'getAllSingleSources', payload: response.data })
    },
    //获取指定数据
    * queryChoosedSource ({payload}, { call, put }) {
      const response = yield call(getchoosedSource, payload.id)
      yield put({ type: 'getchoosedSource', payload: response.data })
    },
    //添加数据
    * addSingleSource({payload}, { call, put }){
      const response = yield call(addSource, payload)
    },
    //删除指定数据
    * delChoosedSource ({payload}, { call, put }) {
      const response = yield call(deleteSource, payload.id)
    },
    //更新指定数据
    * updateChoosedSource ({payload}, { call, put }) {
      console.log('payload',payload)
      const response = yield call(updateSource, payload)
    },
  }
  
}
