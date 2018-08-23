import { routerRedux } from 'dva/router'
import { register } from 'services/login'
import { message } from 'antd'

export default {
  namespace: 'register',

  state: {},

  effects: {
    * register ({ payload }, { put, call }) {
      const response = yield call(register, payload)

      if (response.data.success) {
        yield put({ type: 'login/login', payload })
      } else {
        message.error(response.data.message)
        throw response.data
      }
    },
  },

}
