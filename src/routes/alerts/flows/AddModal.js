import React from 'react'
import { connect } from 'dva'
import { Modal, Select, Button, Input, Form, Table, Switch, Row, Col } from 'antd'
import styles from './index.less'

const { Option } = Select
const FormItem = Form.Item

class AddModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: props.visible,
      name: '',
      flow: { // 提交的数据
        name: '',
        tasks: [],
      },
      task: {}, // 添加单个task
      tasksForTable: [], // 用于表格展示的task
      trigger: {
        name: '',
        type: null,
        task: '',
        action: null,
        target: '',
      }, //用于提交trigger
      AllTasks: props.tasks.tasks || [], // task下拉菜单
      checked: false,
    }
  }
  onAddName (e) {
    this.state.flow.name = e
    this.setState({
      name: e,
    })
  }
  onAddType (e) {
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
  onAddTask (e) {
    this.state.trigger.task = e
    let task = this.props.tasks.tasks.filter( item => {
      return item._id == e
    })
    this.state.task.taskName = task[0].name
    this.state.task.taskId = task[0]._id
    this.setState({
      task: this.state.task,
    })
  }
  onChangeSwitch () {
    this.setState({
      checked: !this.state.checked,
    })
  }
  onAddTriggerType (e) {
    if (e === 0) {
      this.state.task.triggerType = 'PRE'
    } else if (e === 1) {
      this.state.task.triggerType = 'POST'
    }
    this.state.trigger.type = e
    this.setState({
      task: this.state.task,
    })
  }
  onAddOperation (e) {
    if (e === 0) {
      this.state.task.operation = 'START'
    } else if (e === 1) {
      this.state.task.operation = 'STOP'
    } else if (e === 2) {
      this.state.task.operation = 'RESTART'
    }
    this.state.trigger.action = e
    this.setState({
      task: this.state.task,
    })
  }
  onAddTargetType (e) {
    if (e === 0) {
      this.state.task.targetType = 'Normal'
    } else if (e === 1) {
      this.state.task.targetType = 'Cron'
    }
    this.setState({
      task: this.state.task,
    })
    this.props.dispatch({ type: 'tasks/queryTasks', payload: { type: e } })
  }
  onAddTarget (e) {
    let target = this.props.tasks.tasks.filter( item => {
      return item._id == e
    })
    this.state.trigger.target = e
    this.state.task.targetName = target[0].name
    this.setState({
      task: this.state.task,
    })
  }
  onAdd () {
    let task = this.state.task
    //table显示数据
    let table = {}
    if (task.operation && task.targetName) {
      table = {
        name: task.taskName,
        trigger: task.operation + '    ' + task.targetName,
        taskId: task.taskId,
      }
    } else {
      table = {
        name: task.taskName,
        trigger: 'N/A',
        taskId: task.taskId,
      }
    }
    this.state.tasksForTable.push(table)
    this.setState({
      tasksForTable: this.state.tasksForTable,
      task: {},
      checked: false,
    })
    //添加tasksid到flowInRequest中
    let id = task.taskId
    this.state.flow.tasks.push(id)
    //添加trigger
    if (this.state.trigger.action != null && this.state.trigger.target && this.state.trigger.type != null) {
      this.state.trigger.name = this.state.name
      this.props.dispatch({ type: 'triggers/addTrigger', payload: { data: this.state.trigger } })
    }
    this.setState({
      trigger: {
        name: '',
        type: null,
        task: '',
        action: null,
        target: '',
      },
    })
  }
  delete (e) {
    let id = e.taskId
    let tasksForTable = this.state.tasksForTable.filter(item => item.taskId !== id)
    this.state.tasksForTable = tasksForTable
    this.setState({
      tasksForTable: this.state.tasksForTable,
    })
    // 删除flowInRequest中的taskID
    let value = this.state.flow.tasks.filter(item => item !== id)
    this.state.flow.tasks = value
    // 删除对应的trigger
    let trigger = this.props.triggers.triggers.filter(item => item.task === id)
    if (trigger[0]) {
      let triggerId = trigger[0]._id
      this.props.dispatch({ type: 'triggers/delChoosedSource', payload: { id: triggerId } })
    }
  }
  onAddFlow () {
    console.log('done', this.state.flow)
    this.props.dispatch({ type: 'flows/addFlow', payload: this.state.flow })
    this.props.dispatch({ type: 'triggers/clearTrigger' })
    this.props.setVisible(false)
    this.state.flow = {
      name: '',
      tasks: [],
    }
    this.setState({
      name: '',
      tasksForTable: [],
      task: {},
      checked: false,
    })
  }

  render () {
    const { AllTasks = [], checked, task = {}, flow, name, tasksForTable = [] } = this.state
    let antdTableColumns = [
      {
        title: 'Task Name',
        key: 'Task Name',
        dataIndex: 'name',
      },
      // {
      //   title: 'Post Trigger',
      //   key: 'Post Trigger',
      //   dataIndex: 'trigger',
      // },
      {
        title: 'Operation',
        render: (text, record) => (
          <span>
            <a onClick={() => this.delete(record)}>Delete</a>
          </span>
        ),
      },
    ]
    let antdTable = (<Table rowKey={line => line.taskId}
      columns={antdTableColumns}
      dataSource={tasksForTable}
      style={{ backgroundColor: 'white' }}
      bordered
    />)

    let antdFormAdd = (
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
        {/* <div className={`${styles.basicTrigger} ${styles.line}`}>
          <div className={styles.text}>Trigger</div>
          <div>
            <Row>
              <Col span="3" >
                <FormItem>
                  <Switch checked={checked} onChange={() => this.onChangeSwitch()} />
                </FormItem>
              </Col>
              <Col span="10" >
                <FormItem >
                  <Select placeholder="TriggerType" disabled={!checked} value={task.triggerType} onChange={e => this.onAddTriggerType(e)}>
                    <Option value={0} key="0"> PRE </Option>
                    <Option value={1} key="1"> POST </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="10" offset="1">
                <FormItem >
                  <Select placeholder="Operation" disabled={!checked} value={task.operation} onChange={e => this.onAddOperation(e)}>
                    <Option value={0} key="0"> START </Option>
                    <Option value={1} key="1"> STOP </Option>
                    <Option value={2} key="2"> RESTART </Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="10" offset="3">
                <FormItem >
                  <Select placeholder="TargetType" value={task.targetType} disabled={!checked} onChange={e => this.onAddTargetType(e)}>
                    <Option value={0} key="0"> Normal </Option>
                    <Option value={1} key="1"> Cron </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="10" offset="1">
                <FormItem>
                  <Select placeholder="Target" disabled={!checked} value={task.targetName} onChange={e => this.onAddTarget(e)}>
                    {AllTasks && AllTasks.map((item, key) => <Option key={key} value={item._id}>{item.name}</Option>)}
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </div>
        </div> */}
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
        <div className={styles.table}>
          {antdTable}
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
          {antdFormAdd}
        </Modal>
      </div>
    )
  }

  componentWillMount () {
    this.props.dispatch({ type: 'tasks/queryTasks' })
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      AllTasks: nextProps.tasks.tasks,
      visible: nextProps.visible,
    })
  }

  onAddOk () {
    this.props.setVisible(false)
  }
  onCancelAdd () {
    this.props.setVisible(false)
    this.props.dispatch({ type: 'triggers/clearTrigger' })
    this.state.flow = {
      name: '',
      tasks: [],
    }
    this.setState({
      name: '',
      tasksForTable: [],
      task: {},
      checked: false,
    })
  }
}

export default connect((state) => { return ({ tasks: state.tasks, flows: state.flows, triggers: state.triggers }) })(AddModal)
