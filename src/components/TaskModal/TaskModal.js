import React, { Component } from 'react';
import { Modal, Form, Icon, Input, Button, Select } from 'antd'
import noop from 'lodash/noop'
import styles from './TaskModal.less'

const FormItem = Form.Item;
const { Option } = Select; 

class TaskModal extends Component {
	constructor(props, context) {
        super(props, context);
        this.state = {
            inputArr : [],
            outputArr : [], 
            taskItem : {
                name: '', 
                input: '', 
                output: '', 
                script: '', 
                params: [], 
                type: '', 
                cron: '', 
                running: false
            } //存储新增的task
        }
         
		
		this._onCancel = this._onCancel.bind(this);
        this._onOk = this._onOk.bind(this);
        this.inputTypeChange = this.inputTypeChange.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.outputTypeChange = this.outputTypeChange.bind(this);
        this.outputChange = this.outputChange.bind(this);
	}

	render() {
        const { ports } = this.props;
        const { inputArr, outputArr, taskItem } = this.state; 
		return(
			<Modal
                visible
                width="40%"
                style={{minHeight: 400, top: 5}}
                onCancel={this._onCancel}
                onOk={this._onOk}
                title="create task"
            >
                <div>
                    <div className={`${styles.basic} ${styles.line}`}>
                        <div className={styles.text}>Basic</div>
                            <Input placeholder="Name" className={styles.name} />
                            <Select className={styles.type} placeholder="Type">
                                <Option value={0}> NORMAL</Option>
                                <Option value={1}>CRON</Option>
                            </Select>
                            <Input placeholder="Cron" className={styles.cron}/>
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
                            <Select className={styles.typeOdd} placeholder="Output Port Type"  onChange={this.outputTypeChange}>
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
                            <Input placeholder="Script Path" className={styles.path}/>
                            <Button type="primary" className={styles.btn}>Verify</Button>
                            <Input placeholder="New Param" className={styles.path}/>
                            <Button type="primary">Add</Button>
                            <Input placeholder="Param Tags" />
                    </div>
                </div>
                            
            </Modal>
		);
	}

	_onCancel() {
		const { onCancel = noop } = this.props
		onCancel()
	}

	_onOk() {
		const { onOk = noop } = this.props
		onOk()
    }
    
    inputTypeChange(value) {
        const { ports } = this.props
        this.state.inputArr = []
        for (var i = 0; i < ports.length; i++) {
            if ( ports[i].type == value ) {
                this.state.inputArr.push(ports[i]);
            }
        }
        if (this.state.inputArr.length > 0) {
            this.state.taskItem.input = this.state.inputArr[0].id
            this.setState({
                inputArr:this.state.inputArr,
                taskItem: this.state.taskItem
            })
        }else {
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
            if ( ports[i].type == value ) {
                this.state.outputArr.push(ports[i]);
            }
        }
        if (this.state.outputArr.length > 0) {
            this.state.taskItem.output = this.state.outputArr[0].id
            this.setState({
                outputArr:this.state.outputArr,
                taskItem: this.state.taskItem
            })
        }else {
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
}

export default TaskModal;