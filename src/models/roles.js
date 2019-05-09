import modelExtend from 'dva-model-extend'
import { remove, setMenus, list, updateRole } from 'services/user'
import { pageModel } from './common'

export default modelExtend(pageModel, {
  namespace: 'roles',

  state: {
    users: [],
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const res = yield call(list, payload)
      if (res.data.success) {
        yield put({
          type: 'setUsers',
          payload: res.data.users,
        })
      }
    },

    * delete ({ payload }, { call, put }) {
      const res = yield call(remove, { id: payload })
      if (res.data.success) {
        yield put({ type: 'removeUsers', payload })
      }
    },

    * update ({ payload }, { call, put }) {
      const res = yield call(setMenus, { id: payload.id, menus: payload.menus })
      if (res.data.success) {
        yield put({ type: 'updateUsers', payload })
      }
    },

    * updateRole ({ payload }, { call }) {
      yield call(updateRole, payload)
    },

  },

  reducers: {
    setUsers (state, { payload }) {
      return { ...state, users: payload }
    },

    removeUsers (state, { payload }) {
      state.users = state.users.filter(u => u._id !== payload)
      return { ...state }
    },

    updateUsers (state, { payload }) {
      const { id, menus } = payload
      const user = state.users.find(u => u._id === id)
      if (user) {
        user.menus = menus
      }
      return { ...state }
    },
  },
})
