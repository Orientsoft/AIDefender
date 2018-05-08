import React from 'react'
import { connect } from 'dva'
import get from 'lodash/get'
import { Modal, Select, Button, Input, Form, Row, Col, Message } from 'antd'
import styles from './index.less'

const { Option } = Select
const FormItem = Form.Item
const { TextArea } = Input

class Add extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      // visible: props.visible,
      flow: { // 提交的数据
        name: '',
        tasks: [],
        // description: '',
      },
      task: {}, // 添加单个task
      allTasks: get(props.tasks, 'tasksFiltered', []), // task下拉菜单
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
    this.props.dispatch({ type: 'tasks/queryTasksByType', payload: { type, pageSize: 500 } })
  }

  onAddTask (e) {
    const { allTasks, task } = this.state
    let currentTask = allTasks.find(item => item._id === e)

    task.name = currentTask.name
    task._id = currentTask._id
    this.setState({ task })
  }
  onAdd () {
    const { flow, task } = this.state

    let allTasksName = flow.tasks.map(item => item.name)
    if (!task.name) {
      Message.error('请添加task!')
      // Modal.warning({
      //   title: '警告提示',
      //   content: '请添加task!',
      // })
      return
    }
    if (!allTasksName.find(name => task.name === name)) {
      this.state.flow.tasks.push(this.state.task)
    } else {
      Message.error('请勿重复添加')
      // Modal.warning({
      //   title: '警告提示',
      //   content: '请勿重复添加',
      // })
    }
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
  // onAddDes (e) {
  //   this.state.flow.description = e
  //   this.setState({
  //     flow: this.state.flow,
  //   })
  // }
  onAddFlow () {
    let data = {
      name: this.state.flow.name,
      tasks: this.state.flow.tasks.map(item => item._id),
    }
    if (data.name === '') {
      Message.error('必须填写 flow name')
      // Modal.warning({
      //   title: '警告提示',
      //   content: '必须填写 flow name',
      // })
      return
    }
    if (data.tasks.length === 0) {
      Message.error('tasks 不能为空')
      // Modal.warning({
      //   title: '警告提示',
      //   content: 'tasks 不能为空',
      // })
      return
    }

    let page = this.props.flows.pagination.page
    this.props.dispatch({
      type: 'flows/addFlow',
      payload: {
        data,
        page,
        toast: e => Message.error(e),
        modalVisible: () => {
          this.props.setVisible(false)
          this.setState({
            flow: {
              name: '',
              tasks: [],
            },
            task: {},
          })
        },
      },
    })
    // this.props.setVisible(false)
    // this.setState({
    //   flow: {
    //     name: '',
    //     tasks: [],
    //   },
    //   task: {},
    // })
  }

  render () {
    const { allTasks = [], task = {}, flow: { name, tasks, description } } = this.state
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
      {/* <FormItem {...formItemLayout} label="描述：">
        <TextArea rows={4} value={description} onChange={e => this.onAddDes(e.target.value)}/>
      </FormItem> */}
    </Form>
    )
    return (
      <div>
        <Modal
          width="50%"
          visible
          maskClosable={false}
          onOk={this.onAddFlow.bind(this)}
          onCancel={this.onCancelAdd.bind(this)}
          title="添加flow"
          okText="保存"
          cancelText="取消"
        >
          {antdFormAdd}
        </Modal>
      </div>
    )
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      allTasks: nextProps.tasks.tasksFiltered,
      // visible: nextProps.visible,
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
