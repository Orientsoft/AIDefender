import React from 'react'
import { connect } from 'dva'
import { Modal, Select, Input, Button, Form, Table, Switch, Row, Col, } from 'antd'
import styles from './index.less'

const { Option } = Select
const FormItem = Form.Item
const ButtonGroup = Button.Group;

class History extends React.Component {
    render() {
        let history = (
            <Form horizonal="true">
                <div className={`${styles.basicTask} ${styles.line}`}>
                    <div className={styles.text}>Filter</div>
                    <div>
                        <Row >
                            <ButtonGroup>
                                <Button >Debug</Button>
                                <Button >Log</Button>
                                <Button >Warning</Button>
                                <Button >Error</Button>
                            </ButtonGroup>
                        </Row>
                    </div>
                </div>
            </Form>
        )
        return (
            <div>
                <Modal
                    width="50%"
                    title="添加"
                    visible={true}
                    //   visible={this.state.visible}
                    //   onOk={this.onSave.bind(this)}
                    //   onCancel={this.onCancel.bind(this)}
                    okText="保存"
                    cancelText="取消"
                >
                    {history}
                </Modal>
            </div>
        )
    }
}

export default History
