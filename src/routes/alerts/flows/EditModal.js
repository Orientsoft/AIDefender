import React from 'react'
import { connect } from 'dva'
import merge from 'lodash/merge'
import { Modal, Select, Button, Input, Form, Table, Switch, Row, Col } from 'antd'
import styles from './index.less'

const { Option } = Select
const FormItem = Form.Item

class EditModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: props.visible,
      choosedFlow: props.flows.choosedFlow,
      name: '',
      originData: {
        name: '',
        tasks: [],
      },
      tasksForShow: [],
      task: {}, // 添加单个task
      AllTasks: props.tasks.tasks || [], // task下拉菜单
      checked: false,
    }
  }
  onAddName(e) {
    this.state.flow.name = e
    this.setState({
      name: e,
    })
  }
  onAddType(e) {
    let type = parseInt(e)
    if (type === 0) {
      this.state.task.type = 'Normal'
    } else if (type === 1) {
      this.state.task.type = 'Cron'
    }
    this.setState({
      task: this.state.task,
    })
    this.props.dispatch({ type: 'tasks/queryTasks', payload: { type: type } })
  }
  onAddTask(e) {
    let task = this.props.tasks.tasks.filter(item => {
      return item._id == e
    })
    this.state.task.taskName = task[0].name
    this.state.task.taskId = task[0]._id
    this.setState({
      task: this.state.task,
    })
  }
  onAdd() {
    this.state.originData.tasks.push(this.state.task.taskId)
    this.state.tasksForShow.push(this.state.task)
    this.setState({
      task: {},
      tasksForShow: this.state.tasksForShow,
    })
  }
  onDeletetask(value) {
    console.log(value)
    
  }


  render() {
    const { AllTasks = [], checked, task = {}, name, choosedFlow = {}, tasksForShow = [], originData = {} } = this.state
    // const { choosedFlow = {} } = this.props.flows
    console.log('dd',tasksForShow, originData)
    let antdFormEdit = (
      <Form horizonal="true">
        <div className={styles.name}>
          <Row>
            <Input placeholder="Name" value={name} onChange={e => this.onAddName(e.target.value)} />
          </Row>
        </div>
        <div className={`${styles.basicTask} ${styles.line}`}>
          <div className={styles.text}>Task</div>
          <div>
            <Row >
              <Col span="7" >
                <FormItem >
                  <Select placeholder="Type" value={task.type} onChange={e => this.onAddType(e)}>
                    <Option value={0} key="0"> Normal </Option>
                    <Option value={1} key="1"> Cron </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="8" offset="1">
                <FormItem>
                  <Select placeholder="Task" value={task.taskName} onChange={e => this.onAddTask(e)}>
                    {AllTasks && AllTasks.map((item, key) => <Option key={key} value={item._id}>{item.name}</Option>)}
                  </Select>
                </FormItem>
              </Col>
              <Col span="5" offset="1">
                <FormItem >
                  <Button>Create</Button>
                </FormItem>
              </Col>
            </Row>
          </div>
        </div>
        <div className={styles.allButton}>
          <Row>
            <Col span="18">
              <FormItem />
            </Col>
            <Col span="3" >
              <Button onClick={() => this.onAdd()}>Add</Button>
            </Col>
            <Col span="3">
              <Button onClick={() => this.onAddFlow()}>Done</Button>
            </Col>
          </Row>
        </div>
        <div className={styles.name}>
          <Row>
            <Select
              mode="tags"
              style={{ width: '100%' }}
              value={tasksForShow ? tasksForShow.map(item => item.name) : []}
              onChange={e => this.onDeletetask(e)}
            />
          </Row>
        </div>
      </Form>
    )
    return (
      <div>
        <Modal
          width="50%"
          visible={this.state.visible}
          onOk={this.onAddOk.bind(this)}
          onCancel={this.onCancelAdd.bind(this)}
          title="添加"
          footer={null}
        >
          {antdFormEdit}
        </Modal>
      </div>
    )
  }

  componentWillMount() {
    this.props.dispatch({ type: 'tasks/queryTasks' })
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps.flows.choosedFlow', nextProps.flows.choosedFlow)
    if (nextProps.flows.choosedFlow.tasks) {
      this.state.originData.name = nextProps.flows.choosedFlow.name
      this.state.originData.tasks = nextProps.flows.choosedFlow.tasks.map(item => item._id)
      this.state.tasksForShow = nextProps.flows.choosedFlow.tasks
    }

    this.setState({
      AllTasks: nextProps.tasks.tasks,
      visible: nextProps.visible,
      choosedFlow: nextProps.flows.choosedFlow,
      originData: this.state.originData,
      tasksForShow: this.state.tasksForShow,
    })
  }

  onAddOk() {
    this.props.setVisible(false)
  }
  onCancelAdd() {
    this.props.setVisible(false)

    this.state.flow = {
      name: '',
      tasks: [],
    }
    this.setState({
      name: '',
      task: {},
      checked: false,
    })
  }
}

export default connect((state) => { return ({ tasks: state.tasks, flows: state.flows, triggers: state.triggers }) })(EditModal)
