import React from 'react'
import { connect } from 'dva'
import { Modal, Select, Input, Button, Form, Table, Switch, Row, Col, } from 'antd'
import styles from './index.less'

const { Option } = Select
const FormItem = Form.Item

class AddModal extends React.Component {
    render() {
        let antdTableColumns = [
            {
                title: 'Task Name',
                key: 'Task Name',
                dataIndex: 'name',
            },
            {
                title: 'Post Trigger',
                key: 'Post Trigger',
                dataIndex: 'trigger',
            },
            {
                title: 'Operation',
                render: (text, record) => (
                    <span>
                        <a data-name={record.name} data-id={record.id} onClick={e => this.delete(e)}>Delete</a>
                    </span>
                ),
            },
        ]
        let antdTable = (<Table rowKey={line => line.id}
            columns={antdTableColumns}
        // dataSource={ports}
        />)

        let antdFormAdd = (
            <Form horizonal="true">
                <div className={`${styles.basicTask} ${styles.line}`}>
                    <div className={styles.text}>Task</div>
                    <div>
                        <Row >
                            <Col span="7" >
                                <FormItem  >
                                    <Select placeholder='Type'>
                                        <Option value="Normal" key="Normal"> Normal </Option>
                                        <Option value="Cron" key="Cron"> Cron </Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="8" offset="1">
                                <FormItem  >
                                    <Select placeholder='Task'>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="5" offset="1">
                                <FormItem   >
                                    <Button>Create</Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className={`${styles.basicTrigger} ${styles.line}`}>
                    <div className={styles.text}>Trigger</div>
                    <div>
                        <Row >
                            <Switch />
                        </Row>
                        <Row>
                            <Col span="7" >
                                <FormItem >
                                    <Select placeholder='TriggerType'>
                                        <Option value="0" key="0"> PRE </Option>
                                        <Option value="1" key="1"> POST </Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="8" offset="1">
                                <FormItem>
                                    <Select placeholder='Target'>

                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="7" offset="1">
                                <FormItem >
                                    <Select placeholder='Operation'>
                                        <Option value="0" key="0"> START </Option>
                                        <Option value="1" key="1"> STOP </Option>
                                        <Option value="2" key="2"> RESTART </Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                </div>
                <Row>
                    <Col span="18">
                        <FormItem  >

                        </FormItem>
                    </Col>
                    <Col span="3" >
                        <FormItem >
                            <Button>Add</Button>
                        </FormItem>
                    </Col>
                    <Col span="3">
                        <FormItem   >
                            <Button>Done</Button>
                        </FormItem>
                    </Col>
                </Row>
                <div >
                    {antdTable}
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
                    {antdFormAdd}
                </Modal>
            </div>
        )
    }
}

export default AddModal
