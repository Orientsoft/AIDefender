import { message } from 'antd'
import dva from 'dva'
import createLoading from 'dva-loading'
import createHistory from 'history/createBrowserHistory'
import 'babel-polyfill'
// import { hashHistory } from 'react-router';

// 1. Initialize
const app = dva({
  ...createLoading({
    effects: true,
  }),
  // history: hashHistory,
  history: createHistory(),
  onError (error) {
    // message.error(error.message)
  },
})

// 2. Model
app.model(require('./models/app'))

// 3. Router
app.router(require('./router'))

// 4. Start
app.start('#root')
