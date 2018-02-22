import React, { Component } from 'react';
import { Modal, Form, Icon, Input, Button, Select } from 'antd'
import noop from 'lodash/noop'
import cloneDeep from 'lodash/cloneDeep'
import styles from './TaskModal.less'
import { connect } from 'dva'

const FormItem = Form.Item;
const { Option } = Select;

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
        this.state = {
            param: '',
            inputs: [taskItem.input] || [],
            outputs: [taskItem.output] || [],
            taskItem,
        }
    }

    render() {
        const { taskItem , param, inputs, outputs } = this.state

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
                            <Option value={1}>NORMAL</Option>
                            <Option value={0}>CRON</Option>
                        </Select>
                        <Input placeholder="Cron" value={taskItem.cron} className={styles.cron} onChange={this.onCronChange.bind(this)} value={taskItem.cron} disabled={taskItem.type ? true : false} />
                    </div>

                    <div className={`${styles.port} ${styles.line}`}>
                        <div className={styles.text}>I/O Port</div>
                        <Select className={styles.typeOdd} value={taskItem.input.type} placeholder="Input Port Type" onSelect={this.inputTypeChange.bind(this)} >
                            <Option value={0}>REDIS_CHANNEL</Option>
                            <Option value={1}>NSQ_QUEUE</Option>
                            <Option value={2}>MONGODB_COLLECTION</Option>
                            <Option value={3}>ES_INDEX</Option>
                        </Select>
                        <Select className={styles.typeEven} value={taskItem.input.id} placeholder="Input Port" onChange={this.inputChange.bind(this)} >
                            {
                                inputs.map((item, key) => {
                                    return <Option value={item.id} key={key}>{item.name}</Option>
                                })
                            }
                        </Select>
                        <Select className={styles.typeOdd} placeholder="Output Port Type" value={taskItem.output.type} onSelect={this.outputTypeChange.bind(this)}>
                            <Option value={0}>REDIS_CHANNEL</Option>
                            <Option value={1}>NSQ_QUEUE</Option>
                            <Option value={2}>MONGODB_COLLECTION</Option>
                            <Option value={3}>ES_INDEX</Option>
                        </Select>
                        <Select className={styles.typeEven} placeholder="Output Port" value={taskItem.output.id} onChange={this.outputChange.bind(this)}>
                            {
                                outputs.map((item, key) => {
                                    return <Option value={item.id} key={key}>{item.name}</Option>
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
        if (type == 1) {
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
        const ports = cloneDeep(this.props.ports.ports)
        let inputType = value
        this.state.inputs = []
        let inputs = []
        for (var i = 0; i < ports.length; i++) {
            if ( ports[i].type === inputType ){
                inputs.push(ports[i])
            }
        }
        if (inputs.length === 0) {
            taskItem.input.id = ''
            taskItem.input.type = inputType
        }else {
            taskItem.input = inputs[0]
        }
        this.setState({
            taskItem,
            inputs,
        })
    }
    inputChange(value) {
        const { taskItem, inputs } = this.state
        taskItem.input = inputs.find(input => input.id === value)
        this.setState({
            taskItem
        })
    }
    outputTypeChange(value) {
        const { taskItem } = this.state
        const ports = cloneDeep(this.props.ports.ports)
        let outputType = value
        
        const outputs = ports.filter((item) => item.type === outputType)
        if (outputs.length === 0) {
            taskItem.output.id = ''
            taskItem.output.type = outputType
        }else{
            taskItem.output = outputs[0]
        }
        this.setState({
            taskItem,
            outputs,
        })
    }
    outputChange(value) {
        const { taskItem, outputs } = this.state
        taskItem.output = outputs.find(output => output.id === value)
        this.setState({
            taskItem: this.state.taskItem
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
        let param = this.state.param
        this.state.taskItem.params.push(param)
        this.setState({
            param: '',
            taskItem: this.state.taskItem
        })
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
        onOk(this.state.taskItem)
    }
    componentWillUnmount() {
        // this.props.dispatch({ type: 'tasks/clearChoosedTask' })
        // this.props.dispatch({ type: 'ports/resetSelectedTypePorts' })
    }
}

export default connect((state) => { return ({ tasks: state.tasks, ports: state.ports }) })(TaskModal)