import React, { Component } from 'react';
import { Modal, Form, Icon, Input, Button, Select } from 'antd'
import noop from 'lodash/noop'
import styles from './TaskModal.less'

const FormItem = Form.Item;
const { Option } = Select; 

class TaskModal extends Component {
	constructor(props, context) {
		super(props, context);

		this.taskItem = {} //存储新增的task
		this._onCancel = this._onCancel.bind(this);
		this._onOk = this._onOk.bind(this);
	}

	render() {
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
                            <Input placeholder="Name" className={styles.name}/>
                            <Select className={styles.type} placeholder="Type">
                                <Option value={0}> REDIS_CHANNEL</Option>
                                <Option value={1}>NSQ_QUEUE</Option>
                                <Option value={2}>MONGODB_COLLECTION</Option>
                                <Option value={3}>ES_INDEX</Option>
                            </Select>
                            <Input placeholder="Cron" className={styles.cron}/>
                    </div>

                    <div className={`${styles.port} ${styles.line}`}>
                        <div className={styles.text}>I/O Port</div>
                            <Select className={styles.typeOdd} placeholder="Input Port Type">
                                <Option value={0}> REDIS_CHANNEL</Option>
                                <Option value={1}>NSQ_QUEUE</Option>
                                <Option value={2}>MONGODB_COLLECTION</Option>
                                <Option value={3}>ES_INDEX</Option>
                            </Select>
                            <Select className={styles.typeEven} placeholder="Input Port">
                                <Option value={0}> REDIS_CHANNEL</Option>
                                <Option value={1}>NSQ_QUEUE</Option>
                                <Option value={2}>MONGODB_COLLECTION</Option>
                                <Option value={3}>ES_INDEX</Option>
                            </Select>
                            <Select className={styles.typeOdd} placeholder="Output Port Type">
                                <Option value={0}> REDIS_CHANNEL</Option>
                                <Option value={1}>NSQ_QUEUE</Option>
                                <Option value={2}>MONGODB_COLLECTION</Option>
                                <Option value={3}>ES_INDEX</Option>
                            </Select>
                            <Select className={styles.typeEven} placeholder="Output Port">
                                <Option value={0}> REDIS_CHANNEL</Option>
                                <Option value={1}>NSQ_QUEUE</Option>
                                <Option value={2}>MONGODB_COLLECTION</Option>
                                <Option value={3}>ES_INDEX</Option>
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
}

export default TaskModal;