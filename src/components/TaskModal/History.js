import React from 'react'
import { connect } from 'dva'
import { Modal, Button, Form, Table, Row, Col, DatePicker } from 'antd'
import moment from 'moment'
import styles from './History.less'

const { RangePicker } = DatePicker
const FormItem = Form.Item
const ButtonGroup = Button.Group

class History extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      query: {
        level: null,
        from: '',
        to: '',
        source: '',
      },
      page: 1,
      statusList: [],
    }
  }
  componentDidMount(){
    console.log('props',this.props)
  }
  chooseLevel(e) {
    this.state.query.level = e.target.value
  }
  chooseTime(e) {
    this.state.query.from = +e[0]
    this.state.query.to = +e[1]
    let query =  this.state.query
    this.props.dispatch({ type: 'status/queryStatusByLevel', payload: query })
  }
  _onCancel() {
    const { onCancel } = this.props
    onCancel()
  }
  render() {
    let { status = [] } = this.props.status
    let level = ['Debug', 'Log', 'Warning', 'Error']
    let antdTableColumns = [
      {
        title: 'Time',
        key: 'time',
        dataIndex: 'updatedAt',
      },
      {
        title: 'Level',
        key: 'level',
        dataIndex: 'level',
      },
      {
        title: 'Code',
        key: 'code',
        dataIndex: 'code',
      },
      {
        title: 'Content',
        key: 'content',
        dataIndex: 'content',
      },
    ]
    let historyTable = (<Table rowKey={line => line.id}
      columns={antdTableColumns}
      dataSource={status}
    />)
    let history = (
      <Form horizonal="true">
        <div className={`${styles.basicTask} ${styles.line}`}>
          <div className={styles.text}>Filter</div>
          <div>
            <Row >
              <ButtonGroup>
                {level.map((item, index) => {
                  return (<Button onClick={e => this.chooseLevel(e)} value={index} key={index}>{item}</Button>)
                })}
              </ButtonGroup>
            </Row>
          </div>
          <div className={styles.timepicker}>
            <RangePicker
              ranges={{ Today: [moment(), moment()], 'This Month': [moment(), moment().endOf('month')] }}
              showTime
              format="YYYY/MM/DD HH:mm:ss"
              placeholder={['Start Time', 'End Time']}
              // onChange={onChange}
              onOk={e => this.chooseTime(e)}
            />
          </div>
        </div>
        {historyTable}
      </Form >
    )
    return (
      <div>
        <Modal
          visible
          width="50%"
          title="日志"
          footer={null}
          onCancel={this._onCancel.bind(this)}
        >
          {history}
        </Modal>
      </div>
    )
  }
}

export default connect((state) => { return ({ status: state.status }) })(History)
