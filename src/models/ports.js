import { getAllSource, addSource, getChoosedSource, deleteSource, updateSource } from 'services/ports'

export default {
    namespace: 'ports',

    state: {
        ports: [],
        choosedPort: {},
    },

    reducers: {
        // 获取所有数据
        getAllPorts(state, { payload }) {
            return { ...state, ports: payload }
        },
        // 添加数据
        addAllPort(state, { payload }) {
            const ports = state.ports.concat(payload)
            return { ...state, ports }
        },
        // 删除数据
        deletePort(state, { payload }) {
            console.log('ddd', payload)
            let index = -1
            state.ports.forEach((src, i) => {
                if (src.id === payload) {
                    index = i
                }
            })
            if (index > -1) {
                state.ports.splice(index, 1)
            }
            return { ...state }
        },
        // 更新指定数据
        updatePort (state, { payload }) {
            for (let key in state.ports) {
                if (state.ports[key].id === payload.id) {
                    state.ports[key] = payload
                }
            }
            return { ...state }
        },
        // 获取指定数据
        getChoosedPort(state, { payload }) {
            return { ...state, choosedPort: payload }
        },
    },

    effects: {
        // 查询所有数据
        * queryPorts({ payload }, { call, put }) {
            const response = yield call(getAllSource, payload)
            yield put({ type: 'getAllPorts', payload: response.data })
        },
        // 添加数据
        * addPort({ payload }, { call, put }) {
            console.log('ss', payload)
            let response = yield call(addSource, payload)
            yield put({ type: 'addAllPort', payload: response.data })
        },
        // 获取指定数据
        * queryChoosedSource({ payload }, { call, put }) {
            const response = yield call(getChoosedSource, payload.id)
            yield put({ type: 'getChoosedPort', payload: response.data })
        },
        // 删除指定数据
        * delChoosedSource({ payload }, { call, put }) {
            let response = yield call(deleteSource, payload.id)
            console.log(response)
            yield put({ type: 'deletePort', payload: payload.id })
        },
        // 更新指定数据
        * updateChoosedSource({ payload }, { call, put }) {
            let response = yield call(updateSource, payload)
            yield put({ type: 'updatePort', payload: response.data })
        },
    },
}
