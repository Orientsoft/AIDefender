import React, { Component } from 'react';
import { Modal, Form, Icon, Input, Button } from 'antd'
import noop from 'lodash/noop'
import styles from './TaskModal.less'

const FormItem = Form.Item;

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
                style={{minHeight: 400}}
                onCancel={this._onCancel}
                onOk={this._onOk}
                title="create task"
            >
                <div>
                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <div className={`${styles.basic} ${styles.line}`}>
                            <div className={styles.text}>Basic</div>
                        </div>
                    </Form>
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