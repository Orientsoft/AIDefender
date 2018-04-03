// @flow
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import get from 'lodash/get'
import without from 'lodash/without'
import { Modal, Select, Button, Input, Form, Row, Col } from 'antd'
import styles from './index.less'

const { Option } = Select
const FormItem = Form.Item

class EditModal extends React.Component {
  constructor (props) {
    super(props)
    const { visible, flows, tasks } = props
    this.state = {
      visible,
      originData: {
        _id: flows.choosedFlow._id,
        name: flows.choosedFlow.name,
        tasks: get(flows, 'choosedFlow.tasks', []).map(task => ({
          _id: task._id,
          name: task.name,
        })),
      },
      task: {}, // 添加单个task
      allTasks: get(tasks, 'tasks', []), // task下拉菜单
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
    this.props.dispatch({ type: 'tasks/queryTasksByType', payload: { type } })
  }

  onAddTask (e) {
    const { allTasks, task } = this.state
    const currentTask = allTasks.find(_task => _task._id === e)

    task.name = currentTask.name
    task._id = currentTask._id
    this.setState({ task })
  }

  onAdd () {
    this.state.originData.tasks.push(this.state.task)
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

  render () {
    const { allTasks = [], task, originData: { name, tasks } } = this.state
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
                  <Select placeholder="Task" value={task.name} onChange={e => this.onAddTask(e)}>
                    {allTasks.map((item, key) => <Option key={key} value={item._id}>{item.name}</Option>)}
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
              <Button onClick={() => this.onEditOk()}>Done</Button>
            </Col>
          </Row>
        </div>
        <div className={styles.name}>
          <Row>
            <Select
              mode="tags"
              style={{ width: '100%' }}
              value={tasks.map(_task => _task.name)}
              onChange={e => this.onDeleteTask(e)}
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
          onOk={this.onEditOk.bind(this)}
          onCancel={this.onCancelEdit.bind(this)}
          title="添加"
          footer={null}
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
    this.setState({
      allTasks: get(tasks, 'tasks', []), // task下拉菜单
      visible: nextProps.visible,
      originData: {
        _id: flows.choosedFlow._id,
        name: flows.choosedFlow.name,
        tasks: get(flows, 'choosedFlow.tasks', []).map(task => ({
          _id: task._id,
          name: task.name,
        })),
      },
    })
  }

  onEditOk () {
    let id = this.state.originData._id
    let data = {
      name: this.state.originData.name,
      tasks: this.state.originData.tasks.map(item => item._id),
    }
    this.props.dispatch({ type: 'flows/updateChoosedSource', payload: { data, id } })
    this.props.setVisible(false)
  }

  onCancelEdit () {
    this.props.setVisible(false)
  }
}

EditModal.propTypes = {
  visible: PropTypes.bool,
  flows: PropTypes.object.isRequired,
  tasks: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  setVisible: PropTypes.func.isRequired,
}

export default connect((state) => { return ({ tasks: state.tasks, flows: state.flows, triggers: state.triggers }) })(EditModal)
