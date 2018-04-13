/* global window */
/* global document */
/* global location */
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { EnumRoleType } from 'utils/enums'
import { query, logout } from 'services/app'
import * as menusService from 'services/menus'
import queryString from 'query-string'
import moment from 'moment'
import config from '../../app.json'

const { prefix } = config

export default {
  namespace: 'app',
  state: {
    user: {},
    permissions: {
      visit: [],
    },
    menu: [
      {
        id: 1,
        icon: 'laptop',
        name: 'Dashboard',
        router: '/dashboard',
      },
    ],
    menuPopoverVisible: false,
    siderFold: window.localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: window.localStorage.getItem(`${prefix}darkTheme`) !== 'false', // 这里用于设置默认启动的样式
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    locationPathname: '',
    locationQuery: {},
    // 判断当前页面是否需要重新请求数据
    isDirty: false,
    // [0]和[1]是日期组件选择的范围，[2]和[3]是拖动时间滑块选择的范围
    globalTimeRange: [moment().startOf('day'), moment(), moment().startOf('day'), moment()],
  },
  subscriptions: {
    setupHistory ({ dispatch, history }) {
      history.listen((location) => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: queryString.parse(location.search),
          },
        })
      })
    },

    setup ({ dispatch }) {
      dispatch({ type: 'query' })
      let tid
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' })
        }, 300)
      }
    },

  },
  effects: {

    * query ({
      payload,
    }, { call, put, select }) {
      const { data: { success, user } } = yield call(query, payload)
      const { locationPathname } = yield select(_ => _.app)
      if (success && user) {
        const res = yield call(menusService.query)
        const list = res.data
        const { permissions } = user
        let menu = list
        if (permissions.role === EnumRoleType.ADMIN || permissions.role === EnumRoleType.DEVELOPER) {
          permissions.visit = list.map(item => item.id)
        } else {
          menu = list.filter((item) => {
            const cases = [
              permissions.visit.includes(item.id),
              item.mpid ? permissions.visit.includes(item.mpid) || item.mpid === '-1' : true,
              item.bpid ? permissions.visit.includes(item.bpid) : true,
            ]
            return cases.every(_ => _)
          })
        }

        yield put({
          type: 'updateState',
          payload: {
            user,
            permissions,
            menu,
          },
        })

        if (location.pathname === '/login') {
          yield put(routerRedux.push({
            pathname: '/dashboard',
          }))
        }
      } else if (config.openPages && config.openPages.indexOf(locationPathname) < 0) {
        yield put(routerRedux.push({
          pathname: '/login',
          search: queryString.stringify({
            from: locationPathname,
          }),
        }))
      }
    },

    * logout ({
      payload,
    }, { call, put }) {
      const data = yield call(logout, parse(payload))

      if (data.status === 200) {
        yield put({ type: 'query' })
      } else {
        throw (data)
      }
    },

    * changeNavbar (action, { put, select }) {
      const { app } = yield (select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
      }
    },
  },

  reducers: {
    setGlobalTimeRange (state, { payload }) {
      const { globalTimeRange } = state
      payload.forEach((t, i) => {
        globalTimeRange[i] = t
      })
      return {
        ...state,
        globalTimeRange,
      }
    },
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    switchSider (state) {
      window.localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme (state) {
      window.localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar (state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },

    updateSubMenu (state, { payload }) {
      const sub = state.menu.find(m => m.mpid === '3' && m.route.split('/').pop() === payload._id)
      if (sub) {
        sub.name = payload.name
      }
      return { ...state }
    },

    addSubMenu (state, { payload }) {
      const subs = state.menu.filter(m => m.mpid === '3')
      let maxId = 0

      if (subs.length) {
        maxId = Math.max.apply(null, subs.map(sub => sub.id))
      }

      state.menu.push({
        route: `/systemquery/${payload._id}`,
        icon: 'eye-o',
        id: maxId + 1,
        bpid: '3',
        mpid: '3',
        name: payload.name,
      })
      return { ...state }
    },

    deleteSubMenu (state, { payload }) {
      const sub = state.menu.find(m => m.mpid === '3' && m.route.split('/').pop() === payload._id)

      if (sub) {
        const index = state.menu.indexOf(sub)
        state.menu.splice(index, 1)
      }
      return { ...state }
    },

    setDirty (state, { payload }) {
      return { ...state, isDirty: payload }
    },
  },
}
