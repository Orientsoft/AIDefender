import { routerRedux } from 'dva/router'
import { getIndex, getFields, getAllSingleSource, addSingleSource} from 'services/singleSource'
// import { addSingleSource } from '../services/singleSource';

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
  },
  effects: {
    //获取index
    * queryIndex (_, { call, put }) {
      const response = yield call(getIndex)
      yield put({ type: 'setIndex', payload: response.data })
    },
    //获取字段
    * queryFields (_, { call, put }) {
      const response = yield call(getFields)
      yield put({ type: 'setFields', payload: response.data })
    },
    //获取所有数据
    * querySingleSource ({payload}, { call, put }) {
      const response = yield call(getAllSingleSource, payload)
      yield put({ type: 'getAllSingleSources', payload: response.data })
    },
    //获取指定数据
    //添加数据
    * addSingleSource({payload}, { call, put }){
      const response = yield call(addSingleSource, payload)
    }
    //删除指定数据
    //更新指定数据
  }
 

}
