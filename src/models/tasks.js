import { getAllTasks, addTask, getChoosedTask, deleteTask, updateTask } from 'services/tasks'

export default {
    namespace: 'tasks',

    state: {
        tasks: [],
        choosedTask: {},
    },

    reducers: {
        // 获取所有数据
        getAllTasks(state, { payload }) {
            return { ...state, tasks: payload }
        },
        // 添加数据
        addTask(state, { payload }) {
            const tasks = state.tasks.concat(payload)
            return { ...state, tasks }
        },
        // 删除数据
        deleteTask(state, { payload }) {
            console.log('ddd', payload)
            let index = -1
            state.tasks.forEach((src, i) => {
                if (src.id === payload) {
                    index = i
                }
            })
            if (index > -1) {
                state.tasks.splice(index, 1)
            }
            return { ...state }
        },
        // 更新指定数据
        updateTask (state, { payload }) {
            for (let key in state.tasks) {
                if (state.tasks[key].id === payload.id) {
                    state.tasks[key] = payload
                }
            }
            return { ...state }
        },
        // 获取指定数据
        getChoosedTask(state, { payload }) {
            return { ...state, choosedTask: payload }
        },
    },

    effects: {
        // 查询所有数据
        * queryTasks(_, { call, put }) {
            const response = yield call(getAllSource)
            yield put({ type: 'getAllTasks', payload: response.data })
        },
        // 添加数据
        * addTask({ payload }, { call, put }) {
            let response = yield call(addTask, payload)
            yield put({ type: 'addTask', payload: response.data })
        },
        // 获取指定数据
        * queryChoosedTask({ payload }, { call, put }) {
            const response = yield call(getChoosedTask, payload.id)
            yield put({ type: 'getChoosedTask', payload: response.data })
        },
        // 删除指定数据
        * delChoosedTask({ payload }, { call, put }) {
            let response = yield call(deleteTask, payload.id)
            console.log(response)
            yield put({ type: 'deleteTask', payload: payload.id })
        },
        // 更新指定数据
        * updateChoosedTask({ payload }, { call, put }) {
            let response = yield call(updateTask, payload)
            yield put({ type: 'updateTask', payload: response.data })
        },
    },
}