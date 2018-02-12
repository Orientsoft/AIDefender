import React, { Component } from 'react';
import { Modal, Form, Icon, Input, Button, Select } from 'antd'
import noop from 'lodash/noop'
import cloneDeep from 'lodash/cloneDeep'
import assign from 'lodash/assign'
import styles from './TaskModal.less'

const FormItem = Form.Item;
const { Option } = Select;

class TaskModal extends Component {
    constructor(props, context) {
        super(props, context);
        this.initTaskItem = {
            name: '',
            input: '',
            output: '',
            script: '',
            params: [],
            type: 0,
            cron: '',
            running: false
        }
        this.isEdit = this.props.isEdit
        this.state = {
            inputArr: [],
            outputArr: [],
            param: '',  
            taskItem: assign(cloneDeep(this.initTaskItem), this.props.data)//存储新增的task
        }

        this._onCancel = this._onCancel.bind(this);
        this._onOk = this._onOk.bind(this);
        this.inputTypeChange = this.inputTypeChange.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.outputTypeChange = this.outputTypeChange.bind(this);
        this.outputChange = this.outputChange.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onTypeChange = this.onTypeChange.bind(this);
        this.onCronChange = this.onCronChange.bind(this);
        this.onParamAdd = this.onParamAdd.bind(this);
        this.onParamChange = this.onParamChange.bind(this);
        this.onParamDel = this.onParamDel.bind(this);
        this.onScriptChange = this.onScriptChange.bind(this);
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.data.name != this.state.taskItem.name){
            this.setState({
                taskItem: assign(cloneDeep(this.initTaskItem), nextProps.data)
            })
        }
    }
    render() {
        const { ports } = this.props;
        const { inputArr, outputArr, taskItem, param } = this.state;
        return (
            <Modal
                visible
                width="40%"
                style={{ minHeight: 400, top: 5 }}
                onCancel={this._onCancel}
                onOk={this._onOk}
                title="create task"
            >
                <div>
                    <div className={`${styles.basic} ${styles.line}`}>
                        <div className={styles.text}>Basic</div>
                        <Input placeholder="Name" className={styles.name} value={taskItem.name} onChange={this.onNameChange} />
                        <Select className={styles.type} placeholder="Type" onChange={this.onTypeChange} value={taskItem.type}>
                            <Option value={1}>NORMAL</Option>
                            <Option value={0}>CRON</Option>
                        </Select>
                        <Input placeholder="Cron" value={taskItem.cron} className={styles.cron} onChange={this.onCronChange} value={taskItem.cron} disabled={taskItem.type ? true : false } />
                    </div>

                    <div className={`${styles.port} ${styles.line}`}>
                        <div className={styles.text}>I/O Port</div>
                        <Select className={styles.typeOdd} placeholder="Input Port Type" onChange={this.inputTypeChange}>
                            <Option value={0}> REDIS_CHANNEL</Option>
                            <Option value={1}>NSQ_QUEUE</Option>
                            <Option value={2}>MONGODB_COLLECTION</Option>
                            <Option value={3}>ES_INDEX</Option>
                        </Select>
                        <Select className={styles.typeEven} value={taskItem.input} placeholder="Input Port" onChange={this.inputChange}>
                            {
                                inputArr.length > 0 && inputArr.map((item, key) => {
                                    return <Option value={item.id} key={key}>{item.name}</Option>
                                })
                            }
                        </Select>
                        <Select className={styles.typeOdd} placeholder="Output Port Type" onChange={this.outputTypeChange}>
                            <Option value={0}> REDIS_CHANNEL</Option>
                            <Option value={1}>NSQ_QUEUE</Option>
                            <Option value={2}>MONGODB_COLLECTION</Option>
                            <Option value={3}>ES_INDEX</Option>
                        </Select>
                        <Select className={styles.typeEven} placeholder="Output Port" value={taskItem.output} onChange={this.outputChange}>
                            {
                                outputArr.length > 0 && outputArr.map((item, key) => {
                                    return <Option value={item.id} key={key}>{item.name}</Option>
                                })
                            }
                        </Select>
                    </div>

                    <div className={`${styles.command} ${styles.line}`}>
                        <div className={styles.text}>Command</div>
                        <Input placeholder="Script Path" className={styles.path} value={taskItem.script} onChange={this.onScriptChange}/>
                        <Button type="primary" className={styles.btn}>Verify</Button>
                        <Input placeholder="New Param" className={styles.path} value={param} onChange={this.onParamChange} onPressEnter={this.onParamAdd}/>
                        <Button type="primary" onClick={this.onParamAdd}>Add</Button>
                        {/* <Input placeholder="Param Tags" /> */}
                        <Select
                            mode="tags"
                            style={{ width: '100%' }}
                            placeholder="Param Tags"
                            onDeselect={this.onParamDel}
                            value={taskItem.params && taskItem.params.map((item) => {
                                return item
                            })}
                        />
                    </div>
                </div>

            </Modal>
        );
    }

    _onCancel() {
        const { onCancel = noop } = this.props
        this.setState({
            taskItem: cloneDeep(this.initTaskItem)
        })
        onCancel()
    }

    _onOk() {
        const { onOk = noop, onEditSave } = this.props
        const { taskItem } = this.state
        taskItem.input = Number(taskItem.input)
        taskItem.output = Number(taskItem.output)
        if (this.isEdit) {
            onEditSave(taskItem)
            this.setState({
                taskItem: cloneDeep(this.initTaskItem)
            })
        }else {
            onOk(taskItem)
        }
        this.setState({
            taskItem: cloneDeep(this.initTaskItem)
        })
        
    }

    onNameChange(e) {
        this.state.taskItem.name = e.target.value
        this.setState({
            taskItem: this.state.taskItem
        })
    }
    onScriptChange(e) {
        this.state.taskItem.script = e.target.value
        this.setState({
            taskItem: this.state.taskItem 
        })
    }
    onTypeChange(value) {
        this.state.taskItem.type = Number(value)
        if (value == 0) {//type is cron
            this.setState({
                taskItem: this.state.taskItem

            })
        } else {
            this.state.taskItem.cron = ''//type is normal
            this.setState({
                taskItem: this.state.taskItem
            })
        }

    }

    onCronChange(e) {
        this.state.taskItem.cron = e.target.value
        this.setState({
            taskItem: this.state.taskItem
        })
    }
    inputTypeChange(value) {
        const { ports } = this.props
        this.state.inputArr = []
        for (var i = 0; i < ports.length; i++) {
            if (ports[i].type == value) {
                this.state.inputArr.push(ports[i]);
            }
        }
        if (this.state.inputArr.length > 0) {
            this.state.taskItem.input = this.state.inputArr[0].id
            this.setState({
                inputArr: this.state.inputArr,
                taskItem: this.state.taskItem
            })
        } else {
            this.state.taskItem.input = ''
            this.setState({
                inputArr: [],
                taskItem: this.state.taskItem
            })
        }
    }

    inputChange(value) {
        this.state.taskItem.input = value
        this.setState({
            taskItem: this.state.taskItem
        })
    }

    outputTypeChange(value) {
        const { ports } = this.props
        this.state.outputArr = []
        for (var i = 0; i < ports.length; i++) {
            if (ports[i].type == value) {
                this.state.outputArr.push(ports[i]);
            }
        }
        if (this.state.outputArr.length > 0) {
            this.state.taskItem.output = this.state.outputArr[0].id
            this.setState({
                outputArr: this.state.outputArr,
                taskItem: this.state.taskItem
            })
        } else {
            this.state.taskItem.output = ''
            this.setState({
                outputArr: [],
                taskItem: this.state.taskItem
            })
        }
    }

    outputChange(value) {
        this.state.taskItem.output = value
        this.setState({
            taskItem: this.state.taskItem
        })
    }

    onParamChange(e) {
        this.setState({
            param: e.target.value
        })
    }

    onParamAdd() {
        const { param } = this.state
        if (!param) {
            alert('param为空');
        } else { 
            this.state.taskItem.params.push(param);
            this.setState({
                taskItem: this.state.taskItem,
                param: ''
            })
        }
    }
    onParamDel(value) {
        const { params } = this.state.taskItem
        var newParams = []
        for (var i = 0; i < params.length; i++) {
            if (params[i] != value) {
                newParams.push(params[i])
            }
        }
        this.state.taskItem.params = newParams
        this.setState({
            taskItem: this.state.taskItem
        })
    }
}

export default TaskModal;