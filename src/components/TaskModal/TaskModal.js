import React, { Component } from 'react';
import { Modal, Form, Icon, Input, Button, Select, message } from 'antd'
import noop from 'lodash/noop'
import cloneDeep from 'lodash/cloneDeep'
import trim from 'lodash/trim'
import styles from './TaskModal.less'
import { connect } from 'dva'
const FormItem = Form.Item
const { Option } = Select

class TaskModal extends Component {
    constructor(props, context) {
        super(props, context)
        this.initTaskItem = {
            name: '',
            input: {},
            output: {},
            script: '',
            params: [],
            type: 0,
            cron: '',
            running: false
        }
        const taskItem = props.data || cloneDeep(this.initTaskItem)
        this.isUpdate = props.data ? true : false
        this.state = {
            param: '',
            inputs: [taskItem.input] || [],
            outputs: [taskItem.output] || [],
            taskItem,
        }
    }

    render() {
        const { taskItem, param, isAlertVisible } = this.state
        const inputs = this.props.ports.inputs.length > 0 ?  this.props.ports.inputs : this.state.inputs
        const outputs = this.props.ports.outputs.length > 0 ? this.props.ports.outputs : this.state.outputs

        return (
            <Modal
                visible
                width="40%"
                style={{ minHeight: 400, top: 5 }}
                onCancel={this._onCancel.bind(this)}
                onOk={this._onOk.bind(this)}
                title="create task"
            >
                <div>
                    <div className={`${styles.basic} ${styles.line}`}>
                        <div className={styles.text}>Basic</div>
                        <Input placeholder="Name" className={styles.name} value={taskItem.name} onChange={this.onNameChange.bind(this)} />
                        <Select className={styles.type} value={taskItem.type} placeholder="Type" onChange={this.onTypeChange.bind(this)} >
                            <Option value={0}>NORMAL</Option>
                            <Option value={1}>CRON</Option>
                        </Select>
                        <Input placeholder="Cron" value={taskItem.cron} className={styles.cron} onChange={this.onCronChange.bind(this)} value={taskItem.cron} disabled={taskItem.type ? false : true} />
                    </div>

                    <div className={`${styles.port} ${styles.line}`}>
                        <div className={styles.text}>I/O Port</div>
                        <Select className={styles.typeOdd} value={taskItem.input.type} placeholder="Input Port Type" onSelect={this.inputTypeChange.bind(this)} >
                            <Option value={0}>REDIS_CHANNEL</Option>
                            <Option value={1}>NSQ_QUEUE</Option>
                            <Option value={2}>MONGODB_COLLECTION</Option>
                            <Option value={3}>ES_INDEX</Option>
                        </Select>
                        <Select className={styles.typeEven} value={taskItem.input._id} placeholder="Input Port" onChange={this.inputChange.bind(this)} >
                            {
                                inputs && inputs.map((item, key) => {
                                    return <Option value={item._id} key={key}>{item.name}</Option>
                                })
                            }
                        </Select>
                        <Select className={styles.typeOdd} placeholder="Output Port Type" value={taskItem.output.type} onSelect={this.outputTypeChange.bind(this)}>
                            <Option value={0}>REDIS_CHANNEL</Option>
                            <Option value={1}>NSQ_QUEUE</Option>
                            <Option value={2}>MONGODB_COLLECTION</Option>
                            <Option value={3}>ES_INDEX</Option>
                        </Select>
                        <Select className={styles.typeEven} placeholder="Output Port" value={taskItem.output._id} onChange={this.outputChange.bind(this)}>
                            {
                                outputs.map((item, key) => {
                                    return <Option value={item._id} key={key}>{item.name}</Option>
                                })
                            }
                        </Select>
                    </div>

                    <div className={`${styles.command} ${styles.line}`}>
                        <div className={styles.text}>Command</div>
                        <Input placeholder="Script Path" className={styles.path} value={taskItem.script} onChange={this.onScriptChange.bind(this)} />
                        <Button type="primary" className={styles.btn}>Verify</Button>
                        <Input placeholder="New Param" className={styles.path} value={param} onChange={this.onParamChange.bind(this)} onPressEnter={this.onParamAdd.bind(this)} />
                        <Button type="primary" onClick={this.onParamAdd.bind(this)}>Add</Button>
                        {/* <Input placeholder="Param Tags" /> */}
                        <Select
                            mode="tags"
                            style={{ width: '100%' }}
                            placeholder="Param Tags"
                            onDeselect={this.onParamDel.bind(this)}
                            value={taskItem.params && taskItem.params.map((item) => {
                                return item
                            })}
                        />
                    </div>
                </div>

            </Modal>
        );
    }

    onNameChange(e) {
        let name = e.target.value
        this.state.taskItem.name = name
        this.setState({
            taskItem: this.state.taskItem
        })
    }
    onTypeChange(value) {
        let type = value
        if (type == 0) {
            this.state.taskItem.cron = ''
        }
        this.state.taskItem.type = type
        this.setState({
            taskItem: this.state.taskItem
        })
    }
    onCronChange(e) {
        let cron = e.target.value
        this.state.taskItem.cron = cron
        this.setState({
            taskItem: this.state.taskItem
        })
    }
    inputTypeChange(value) {
        const { taskItem } = this.state
        let inputType = value
        this.props.dispatch({ type: 'ports/queryInputs', payload: { type: inputType}})
        taskItem.input.type = inputType
        taskItem.input._id = ''
        this.setState({
            taskItem: taskItem
        })
    }
    inputChange(value) {
        const { taskItem } = this.state
        const { inputs } = this.props.ports
        taskItem.input = inputs.find(input => input._id === value)
        this.setState({
            taskItem
        })
    }
    outputTypeChange(value) {
        const { taskItem } = this.state
        let outputType = value
        this.props.dispatch({ type: 'ports/queryOutputs', payload: { type: outputType}})
        taskItem.output.type = outputType
        taskItem.output._id = ''
        this.setState({
            taskItem: taskItem
        })
    }
    outputChange(value) {
        const { taskItem } = this.state
        const { outputs } = this.props.ports
        taskItem.output = outputs.find(output => output._id === value)
        this.setState({
            taskItem: taskItem
        })
    }
    onScriptChange(e) {
        let script = e.target.value
        this.state.taskItem.script = script
        this.setState({
            taskItem: this.state.taskItem
        })
    }
    onParamChange(e) {
        let param = e.target.value
        this.setState({
            param: param
        })
    }
    onParamAdd(e) {
        let param = trim(this.state.param)
        const { taskItem } = this.state
        const params = taskItem.params
        if (params.indexOf(param) != -1){
            Modal.warning({
                title: '警告提示',
                content: '请勿重复添加',
            });
            return
        }else{
            taskItem.params.push(param)
            this.setState({
                param: '',
                taskItem: taskItem
            })
        }
    }
    onParamDel(value) {
        let param = value
        let index = this.state.taskItem.params.indexOf(value)
        this.state.taskItem.params.splice(index, 1)
        this.setState({
            taskItem: this.state.taskItem
        })
    }
    _onCancel() {
        const { onCancel = noop } = this.props

        onCancel()
    }

    _onOk() {
        const { onOk = noop } = this.props
        let taskItem = cloneDeep(this.state.taskItem)
        taskItem.input = taskItem.input._id
        taskItem.output = taskItem.output._id
        taskItem.name = trim(taskItem.name)
        taskItem.script = trim(taskItem.script)
        taskItem.cron = trim(taskItem.cron)
        //验证name
        if ( !taskItem.name ){
            Modal.warning({
                title: '警告提示',
                content: '必须填写task name',
            });
            return 
        }
        // else if (!this.isNameCanUse(taskItem.name)) {
        //     if ( !this.isUpdate ) {   
        //         Modal.warning({
        //             title: '警告提示',
        //             content: 'task name 已经存在，请输入其他name',
        //         });
        //         return
        //     }
        // }

        //验证cron
        if ( taskItem.type == 0 ){
            taskItem.cron = ''
        }else if ( taskItem.type == 1 ){
            //cron表达式验证
            if ( !taskItem.cron ){
                Modal.warning({
                    title: '警告提示',
                    content: 'task是cron类型，必须指定cron',
                });

                return 
            }else {  
                    
            }
        }

        //验证input和output
        if (!taskItem.input || !taskItem.output) {
            Modal.warning({
                title: '警告提示',
                content: '须指定input port 和 output port',
            });
            return
        }else if ( taskItem.input == taskItem.output ){
            Modal.warning({
                title: '警告提示',
                content: 'input port 和 output port 不能指定为同一个',
            });
            return
        }

        //验证script
        if ( !taskItem.script ){
            Modal.warning({
                title: '警告提示',
                content: '必须填写task script',
            });
            return 
        }else if (!this.isScriptValid(taskItem.script)) {
            Modal.warning({
                title: '警告提示',
                content: '输入的路径格式不正确，请重新输入',
            });
            return
        }

        onOk(taskItem)
    }

    // isNameCanUse(name) {
    //     const tasks = cloneDeep(this.props.tasks.tasks)
    //     let len = tasks.length
    //     for(var i = 0; i < len; i++){
    //         if(tasks[i].name == name){
    //             return false
    //         }
    //     }
    //     return true
    // }
    isScriptValid(path){
        let g = /^\/\w*(\/\w+)*\.\w+$/
        return g.test(path)
    }
    componentWillUnmount() {
        // this.props.dispatch({ type: 'tasks/clearChoosedTask' })
        // this.props.dispatch({ type: 'ports/resetSelectedTypePorts' })
    }
}

export default connect((state) => { return ({ tasks: state.tasks, ports: state.ports }) })(TaskModal)