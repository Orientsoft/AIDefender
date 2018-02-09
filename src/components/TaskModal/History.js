import React from 'react'
import { connect } from 'dva'
import { Modal, Button, Form, Table, Row, Col, DatePicker } from 'antd'
import moment from 'moment';
import styles from './History.less'

const { RangePicker } = DatePicker;
const FormItem = Form.Item
const ButtonGroup = Button.Group;

class History extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
        }
    }
    render() {
        let antdTableColumns = [
            {
                title: 'Time',
                key: 'Task Name',
                dataIndex: 'name',
            },
            {
                title: 'Level',
                key: 'Post Trigger',
                dataIndex: 'trigger',
            },
            {
                title: 'Code',
                key: 'Code',
                dataIndex: 'Code',
            },
            {
                title: 'Content',
                key: 'Content',
                dataIndex: 'Content',
            },
        ]
        let historyTable = (<Table rowKey={line => line.id}
            columns={antdTableColumns}
        // dataSource={ports}
        />)
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
                    <div className={styles.timepicker}>
                        <RangePicker
                            ranges={{ Today: [moment(), moment()], 'This Month': [moment(), moment().endOf('month')] }}
                            showTime
                            format="YYYY/MM/DD HH:mm:ss"
                            // showTime={{ format: 'HH:mm' }}
                            // format="YYYY-MM-DD HH:mm"
                            placeholder={['Start Time', 'End Time']}
                        // onChange={onChange}
                        // onOk={onOk}
                        />
                    </div>
                </div>
                {historyTable}
            </Form >
        )
        return (
            <div>
                <Modal
                    width="50%"
                    title="日志"
                    footer={null}
                    visible={this.state.visible}

                >
                    {history}
                </Modal>
            </div>
        )
    }
}

export default History
