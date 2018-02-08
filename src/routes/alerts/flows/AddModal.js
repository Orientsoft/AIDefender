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
        const formItemLayoutSelect = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
            className: styles.FormItem,
        }
        let antdFormAdd = (
            <Form horizonal="true">
                <Row >
                    <Col span="8" >
                        <FormItem label="Type:" {...formItemLayoutSelect} >
                            <Select>
                                <Option value="Normal" key="Normal"> Normal </Option>
                                <Option value="Cron" key="Cron"> Cron </Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="Task：" {...formItemLayoutSelect} >
                            <Select>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="5" offset="3">
                        <FormItem  {...formItemLayoutSelect} >
                            <Button>Create</Button>
                        </FormItem>
                    </Col>
                </Row>
                {/* <Row>
                    <Col span="4">
                        <FormItem  {...formItemLayoutSelect}>
                            <p>Trigger:</p>
                        </FormItem>
                    </Col>
                    <Col span="4">
                        <FormItem  >
                            <Switch />
                        </FormItem>
                    </Col>
                </Row> */}

                <Row>
                    <Col span="8" >
                        <FormItem label="Type:" {...formItemLayoutSelect}>
                            <Select>
                                <Option value="0" key="0"> PRE </Option>
                                <Option value="1" key="1"> POST </Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="Operation:" {...formItemLayoutSelect} >
                            <Select>
                                <Option value="0" key="0"> START </Option>
                                <Option value="1" key="1"> STOP </Option>
                                <Option value="2" key="2"> RESTART </Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="Target：" {...formItemLayoutSelect} >
                            <Select>

                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="18">
                        <FormItem  {...formItemLayoutSelect} >

                        </FormItem>
                    </Col>
                    <Col span="3" >
                        <FormItem  {...formItemLayoutSelect} >
                            <Button>Add</Button>
                        </FormItem>
                    </Col>
                    <Col span="3">
                        <FormItem  {...formItemLayoutSelect} >
                            <Button>Done</Button>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                  {antdTable}
                </Row>
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
