import React from 'react'
import { connect } from 'dva'
import { Modal, Select, Button, Input, Form, Table, Switch, Row, Col } from 'antd'
import styles from './index.less'

const { Option } = Select
const FormItem = Form.Item

class Add extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: props.visible,
      flow: { // 提交的数据
        name: '',
        tasks: [],
      },
      task: {}, // 添加单个task
      allTasks: props.tasks.tasks || [], // task下拉菜单
    }
  }
  onAddName (e) {
    this.state.flow.name = e
    this.setState({
      flow: this.state.flow,
    })
  }
  onAddType (e) {
    let type = parseInt(e, 10)
    if (type === 0) {
      this.state.task.type = 'Normal'
    } else if (type === 1) {
      this.state.task.type = 'Cron'
    }
    this.setState({
      task: this.state.task,
    })
    this.props.dispatch({ type: 'tasks/queryTasksByType', payload: { type } })
  }

  onAddTask (e) {
    // this.state.trigger.task = e
    let task = this.props.tasks.tasks.filter( item => {
      return item._id == e
    })
    this.state.task.name = task[0].name
    this.state.task._id = task[0]._id
    this.setState({
      task: this.state.task,
    })
  }
  onAdd () {
    this.state.flow.tasks.push(this.state.task)
    this.setState({
      task: {},
      flow: this.state.flow,
    })
  }
  delete (value) {
    const { flow } = this.state

    flow.tasks = value.map(name => flow.tasks.find(task => task.name === name))
    this.setState({ flow })
  }
  onAddFlow () {
    let data = {
      name: this.state.flow.name,
      tasks: this.state.flow.tasks.map(item => item._id),
    }
    console.log('done', data)
    this.props.dispatch({ type: 'flows/addFlow', payload: data })
    this.props.setVisible(false)
    this.setState({
      flow: {
        name: '',
        tasks: [],
      },
      task: {},
    })
  }

  render () {
    const { allTasks = [], task = {}, flow: { name, tasks }, } = this.state
   
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      //   className: styles.FormItem,
    }

    let antdFormAdd = (<Form horizonal="true">
      <FormItem {...formItemLayout} label="名字：">
        <Input value={name} onChange={e => this.onAddName(e.target.value)} />
      </FormItem>
      <FormItem {...formItemLayout} label="添加tasks:">
        <Row>
          <Col span="9" >
            <Select placeholder="Type" value={task.type} onChange={e => this.onAddType(e)}>
              <Option value={0} key="0"> Normal </Option>
              <Option value={1} key="1"> Cron </Option>
            </Select>
          </Col>
          <Col span="9" offset="1" >
            <Select placeholder="Task" value={task.name} onChange={e => this.onAddTask(e)}>
              {allTasks.map((item, key) => <Option key={key} value={item._id}>{item.name}</Option>)}
            </Select>
          </Col>
          <Col span="1" offset="1">
            <Button onClick={() => this.onAdd()}>确定</Button>
          </Col>
        </Row>
      </FormItem>
    <FormItem {...formItemLayout} label="所有tasks：">
      <Select
        mode="tags"
        style={{ width: '100%' }}
        value={tasks.map(_task => _task.name)}
        onChange={e => this.delete(e)}
      />
    </FormItem>
    </Form>
    )
    return (
      <div>
        <Modal
          width="50%"
          visible={this.state.visible}
          onOk={this.onAddFlow.bind(this)}
          onCancel={this.onCancelAdd.bind(this)}
          title="添加"
        >
          {antdFormAdd}
        </Modal>
      </div>
    )
  }

//   componentWillMount () {
//     this.props.dispatch({ type: 'tasks/queryTasks' })
//   }

  componentWillReceiveProps (nextProps) {
    this.setState({
      allTasks: nextProps.tasks.tasks,
      visible: nextProps.visible,
    })
  }

  onCancelAdd () {
    this.props.setVisible(false)
    this.state.flow = {
      name: '',
      tasks: [],
    }
    this.setState({
      flow: {
        name: '',
        tasks: [],
      },
      task: {},
    })
  }
}

export default connect((state) => { return ({ tasks: state.tasks, flows: state.flows }) })(Add)
