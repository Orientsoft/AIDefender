import { getAllTasks, addTask, getChoosedTask, deleteTask, updateTask } from 'services/tasks'

export default {
    namespace: 'tasks',

    state: {
        tasks: [],
    },

    reducers: {
        // 获取所有数据
        getAllTasks(state, { payload }) {
            return { ...state, tasks: payload }
        },
        // 添加数据
        add_Task(state, { payload }) {
            const tasks = state.tasks.concat(payload)
            return { ...state, tasks }
        },
        // 删除数据
        deleteTask(state, { payload }) {
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
        update_Task (state, { payload }) {
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
            const response = yield call(getAllTasks)
            yield put({ type: 'getAllTasks', payload: response.data })
        },
        // 添加数据
        * addTask({ payload }, { call, put }) {
            let response = yield call(addTask, payload)
            yield put({ type: 'add_Task', payload: response.data })
        },
        // 获取指定数据
        * queryChoosedTask({ payload }, { call, put }) {
            const response = yield call(getChoosedTask, payload.id)
            yield put({ type: 'getChoosedTask', payload: response.data })
        },
        // 删除指定数据
        * delChoosedTask({ payload }, { call, put }) {
            let response = yield call(deleteTask, payload.id)
            yield put({ type: 'deleteTask', payload: payload.id })
            yield put({ type: 'clearTask'})
        },
        // 更新指定数据
        * updateChoosedTask({ payload }, { call, put }) {
            let response = yield call(updateTask, payload.task)
            yield put({ type: 'update_Task', payload: response.data })
        },
    },
}
