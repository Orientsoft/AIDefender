import { routerRedux } from 'dva/router'
import { login } from 'services/login'
import { message } from 'antd';

export default {
  namespace: 'login',

  state: {},

  effects: {
    * login ({ payload }, { put, call, select }) {
      const response = yield call(login, payload)
      const { locationQuery } = yield select(_ => _.app)

      if (response.data.success) {
        const { from } = locationQuery
        yield put({ type: 'app/query', payload: response.data.data })
        if (from && from !== '/login') {
          yield put(routerRedux.push(from))
        } else {
          yield put(routerRedux.push('/settings'))
        }
      } else {
        message.error(response.data.message)
        throw response.data
      }
    },
  },

}
