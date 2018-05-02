import React from 'react'
import { connect } from 'dva'
import { Modal, Button, Form, Table, Row, Col, DatePicker, Radio } from 'antd'
import moment from 'moment'
import styles from './History.less'

const { RangePicker } = DatePicker
const FormItem = Form.Item
const ButtonGroup = Button.Group

class History extends React.Component {
  constructor(props) {
    super(props)

    this.msg = [
      {
        code: 1,
        level: 2,
        content: 'String',
        createdAt: '2018-05-02',
        updatedAt: '2018-05-02',
      },
      {
        code: 1,
        level: 2,
        content: 'String',
        createdAt: '2018-05-02',
        updatedAt: '2018-05-02',
      },
      {
        code: 1,
        level: 2,
        content: 'String',
        createdAt: '2018-05-02',
        updatedAt: '2018-05-02',
      },
      {
        code: 1,
        level: 2,
        content: 'String',
        createdAt: '2018-05-02',
        updatedAt: '2018-05-02',
      },
      {
        code: 1,
        level: 2,
        content: 'String',
        createdAt: '2018-05-02',
        updatedAt: '2018-05-02',
      },
      {
        code: 1,
        level: 2,
        content: 'String',
        createdAt: '2018-05-02',
        updatedAt: '2018-05-02',
      },
      {
        code: 1,
        level: 2,
        content: 'String',
        createdAt: '2018-05-02',
        updatedAt: '2018-05-02',
      },
      {
        code: 1,
        level: 2,
        content: 'String',
        createdAt: '2018-05-02',
        updatedAt: '2018-05-02',
      },
      {
        code: 1,
        level: 2,
        content: 'String',
        createdAt: '2018-05-02',
        updatedAt: '2018-05-02',
      },
      {
        code: 1,
        level: 2,
        content: 'String',
        createdAt: '2018-05-02',
        updatedAt: '2018-05-02',
      },
      {
        code: 1,
        level: 2,
        content: 'String',
        createdAt: '2018-05-02',
        updatedAt: '2018-05-02',
      },
    ]
    this.state = {
      query: {
        level: 0,
        from: '',
        to: '',
        source: props.id ? props.id : '',
      },
      page: 1,
      statusList: [],
      msg: this.msg,
    }
  }
  componentDidMount() {
    let query = {
      level: this.state.query.level,
      source: this.state.query.source,
    }
    console.log('props', query)
    this.props.dispatch({ type: 'status/queryStatusByLevel', payload: query })
  }
  chooseLevel(e) {
    console.log('level', e.target.value)
    this.state.query.level = e.target.value
    this.setState({
      query: this.state.query,
    })
  }
  chooseTime(e) {
    this.state.query.from = +e[0]
    this.state.query.to = +e[1]
    let query = this.state.query
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
        title: 'Level',
        key: 'level',
        dataIndex: 'level',
        render: (level) => {
          let d = ''
          if (level === 1) {
            d = 'Log'
          } else if (level === 0) {
            d = 'Debug'
          } else if (level === 2) {
            d = 'Warning'
          } else if (level === 3) {
            d = 'Error'
          }
          return d
        },
      },
      {
        title: 'Code',
        key: 'code',
        dataIndex: 'code',
      },
      {
        title: 'CreatedAt',
        key: 'CreatedAt',
        dataIndex: 'createdAt',
      },
      {
        title: 'UpdatedAt',
        key: 'UpdatedAt',
        dataIndex: 'updatedAt',
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
      scroll={{ y: 300 }}
    />)
    let history = (
      <Form horizonal="true">
        <div className={`${styles.basicTask} ${styles.line}`}>
          <div className={styles.text}>Filter</div>
          <div>
            <Row >
              <Radio.Group value={this.state.query.level} onChange={e => this.chooseLevel(e)}>
                {level.map((item, index) => {
                  return (<Radio.Button value={index} key={index}>{item}</Radio.Button>)
                })}
              </Radio.Group>
              {/* <ButtonGroup>
                {level.map((item, index) => {
                  return (<Button onClick={e => this.chooseLevel(e)} value={index} key={index}>{item}</Button>)
                })}
              </ButtonGroup> */}
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
          width="80%"
          title="日志"
          footer={null}
          onCancel={this._onCancel.bind(this)}
          className={`${styles.history}`}
        >
          {history}
        </Modal>
      </div>
    )
  }
}

export default connect((state) => { return ({ status: state.status }) })(History)
