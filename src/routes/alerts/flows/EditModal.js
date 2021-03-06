// @flow
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import get from 'lodash/get'
import { Modal, Select, Button, Input, Form, Row, Col, Message } from 'antd'
import styles from './index.less'
import config from '../../../../app.json'

const { Option } = Select
const FormItem = Form.Item
const { TextArea } = Input

class Edit extends React.Component {
  constructor (props) {
    super(props)
    const { flows, tasks } = props
    this.state = {
      // visible,
      originData: {
        _id: flows.choosedFlow._id,
        name: flows.choosedFlow.name,
        tasks: get(flows, 'choosedFlow.tasks', []).map(task => ({
          _id: task._id,
          name: task.name,
        })),
        // description: flows.choosedFlow.description || '',
      },
      task: {}, // 添加单个task
      allTasks: get(tasks, 'tasksFiltered', []), // task下拉菜单
    }
  }

  onAddName (e) {
    this.state.originData.name = e.trim()
    this.setState({
      originData: this.state.originData,
    })
  }

  onAddType (e) {
    const { task } = this.state
    const type = parseInt(e, 10)

    if (type === 0) {
      task.type = 'Normal'
    } else if (type === 1) {
      task.type = 'Cron'
    }
    this.setState({ task })
    this.props.dispatch({ type: 'tasks/queryTasksByType', payload: { type, pageSize: config.maxSize } })
  }

  onAddTask (e) {
    const { allTasks, task } = this.state
    const currentTask = allTasks.find(_task => _task._id === e)

    task.name = currentTask.name
    task._id = currentTask._id
    this.setState({ task })
  }

  onAdd () {
    const { originData, task } = this.state

    let allTasksName = originData.tasks.map(item => item.name)
    if (!task.name) {
      Message.error('请添加任务')
      return
    }
    if (!allTasksName.find(name => task.name === name)) {
      this.state.originData.tasks.push(this.state.task)
    } else {
      Message.error('请勿重复添加')
    }
    this.setState({
      task: {},
      originData: this.state.originData,
    })
  }

  onDeleteTask (value) {
    const { originData } = this.state

    originData.tasks = value.map(name => originData.tasks.find(task => task.name === name))
    this.setState({ originData })
  }
  // onAddDes (e) {
  //   this.state.originData.description = e
  //   this.setState({
  //     originData: this.state.originData,
  //   })
  // }

  render () {
    const { allTasks = [], task, originData: { name, tasks, description } } = this.state

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    }

    let antdFormEdit = (<Form horizonal="true">
      <FormItem {...formItemLayout} label="名字：">
        <Input value={name} onChange={e => this.onAddName(e.target.value)} />
      </FormItem>
      <FormItem {...formItemLayout} label="添加任务:">
        <Row>
          <Col span="9" >
            <Select placeholder="类型" value={task.type} onChange={e => this.onAddType(e)}>
              <Option value={0} key="0"> Normal </Option>
              <Option value={1} key="1"> Cron </Option>
            </Select>
          </Col>
          <Col span="9" offset="1" >
            <Select showSearch optionFilterProp="children" placeholder="任务" value={task.name} onChange={e => this.onAddTask(e)}>
              {allTasks.map((item, key) => <Option key={key} value={item._id}>{item.name}</Option>)}
            </Select>
          </Col>
          <Col span="1" offset="1">
            <Button onClick={() => this.onAdd()}>确定</Button>
          </Col>
        </Row>
      </FormItem>
      <FormItem {...formItemLayout} label="所有任务：">
        <Select
          mode="tags"
          style={{ width: '100%' }}
          value={tasks.map(_task => _task.name)}
          onChange={e => this.onDeleteTask(e)}
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
          onOk={this.onEditOk.bind(this)}
          onCancel={this.onCancelEdit.bind(this)}
          title="修改流程"
          okText="保存"
          cancelText="取消"
        >
          {antdFormEdit}
        </Modal>
      </div>
    )
  }

  componentWillMount () {
    this.props.dispatch({ type: 'tasks/queryTasks' })
  }

  componentWillReceiveProps (nextProps) {
    const { tasks, flows } = nextProps
    let _tasks = this.state.originData.tasks
    const newTasks = get(flows, 'choosedFlow.tasks', [])

    if (this.props.tasks !== tasks) {
      this.setState({
        allTasks: get(tasks, 'tasksFiltered', []), // task下拉菜单
      })
    }
    if (this.props.flows.choosedFlow !== flows.choosedFlow) {
      _tasks = newTasks.map(task => ({
        _id: task._id,
        name: task.name,
      }))
      this.setState({
        originData: {
          _id: flows.choosedFlow._id,
          name: flows.choosedFlow.name,
          tasks: _tasks,
        },
      })
    }
  }

  onEditOk () {
    let id = this.state.originData._id
    let data = {
      name: this.state.originData.name,
      tasks: this.state.originData.tasks.map(item => item._id),
    }
    if (data.name === '') {
      Message.error('必须填写流程名称')
      return
    }
    if (data.tasks.length === 0) {
      Message.error('任务不能为空')
      return
    }
    this.props.dispatch({
      type: 'flows/updateChoosedSource',
      payload: {
        data,
        id,
        toast: e => Message.error(e),
        modalVisible: () => this.props.setVisible(false),
      },
    })
    // this.props.setVisible(false)
  }

  onCancelEdit () {
    this.props.setVisible(false)
  }
}

Edit.propTypes = {
  // visible: PropTypes.bool,
  flows: PropTypes.object.isRequired,
  tasks: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  setVisible: PropTypes.func.isRequired,
}

export default connect((state) => { return ({ tasks: state.tasks, flows: state.flows, triggers: state.triggers }) })(Edit)
