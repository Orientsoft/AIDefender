import React, { Component } from 'react';
import { TaskModal } from 'components'
import cloneDeep from 'lodash/cloneDeep'
import { Button, Icon, Table, Divider, Modal } from 'antd'
import { connect } from 'dva'


const { confirm } = Modal

class Index extends Component {
  constructor(props) {
    super(props)
    this.initTaskItem = {
      name: '',
      input: '',
      output: '',
      script: '',
      params: [],
      type: 0,
      cron: '',
      running: false
    }
    this.state = {
      visible: false,
      id: '',
      choosedTask: cloneDeep(this.initTaskItem),
      choosedId: '', 
      isEdit: false
    }
    this.showTaskModal = this.showTaskModal.bind(this)
    this.onCancel = this.onCancel.bind(this);
    this.onOk = this.onOk.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onDeleteOk = this.onDeleteOk.bind(this);
    this.onDeleteCancel = this.onDeleteCancel.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onEditSave = this.onEditSave.bind(this)
  }

  showTaskModal() {
    this.setState({
      visible: true,
      choosedTask: cloneDeep(this.initTaskItem),
    })
  }
  componentWillReceiveProps(nextProps) {
    if ( nextProps.tasks.choosedTask != this.state.choosedTask ) {
      this.setState({
        choosedTask: nextProps.tasks.choosedTask
      })
    }
    
  }
  onEdit(e) {
    let id = e.target.dataset.id
    this.props.dispatch({ type: 'tasks/queryChoosedTask', payload: { id: id } })
     
    console.log('onEdit')
    this.setState({
      visible: true,
      isEdit: true
    })
  }

  onEditSave(task) {
    console.log('onEditSave');
    console.log(task)
    this.props.dispatch({ type: 'tasks/updateChoosedTask', payload: {task: task}})
    this.setState({
      visible: false, 
      isEdit: false, 
      choosedTask: cloneDeep(this.initTaskItem)
    })
  }

  onCancel() {
    this.setState({
      visible: false,
      isEdit: false, 
      choosedTask: cloneDeep(this.initTaskItem)
    })
  }
  onOk(task) {
    this.props.dispatch({ type: 'tasks/addTask', payload: task })
    this.setState({
      visible: false, 
      isEdit: false, 
      choosedTask: cloneDeep(this.initTaskItem)
    })
  }

  onDelete(e) {
    let id = e.target.dataset.id
    let name = e.target.dataset.name
    this.state.id = e.target.dataset.id
    confirm({
      title: '删除',
      content: '确定删除 ' + name + ' ?',
      onOk: this.onDeleteOk,
      onCancel: this.onDeleteCancel
    })
  }

  onDeleteOk() {
    this.props.dispatch({ type: 'tasks/delChoosedTask', payload: { id: this.state.id } })
  }
  onDeleteCancel() {

  }
  componentWillMount() {
    this.props.dispatch({ type: 'tasks/queryTasks' })
    this.props.dispatch({ type: 'ports/queryPorts' })
  }
  render() {
    const { visible, isEdit, choosedTask } = this.state
    const { tasks = [] } = this.props.tasks
    const { ports = [] } = this.props.ports
    for (var i = 0; i < tasks.length; i++) {
      for (var j = 0; j < ports.length; j++) {
        if (tasks[i].input == ports[j].id) {
          tasks[i].inputName = ports[j].name
        }
        if (tasks[i].output == ports[j].id) {
          tasks[i].outputName = ports[j].name
        }

      }

    }
    let columns = [
      {
        title: 'Name',
        key: 'Name',
        dataIndex: 'name'
      },
      {
        title: 'Type',
        key: 'Type',
        dataIndex: 'type',
        render: (type) => {
          let d = ''
          if (type == 0) {
            d = 'CRON'
          } else if (type == 1) {
            d = 'NORMAL'
          }
          return d
        }
      },
      {
        title: 'Input',
        key: 'Input',
        dataIndex: 'inputName'
      },
      {
        title: 'Output',
        key: 'Output',
        dataIndex: 'outputName'
      },
      {
        title: 'Command',
        key: 'Command',
        dataIndex: 'script'
      },
      {
        title: 'CreateAt',
        key: 'CreateAt',
        dataIndex: 'createdAt'
      },
      {
        title: 'UpdateAt',
        key: 'UpdateAt',
        dataIndex: 'updatedAt'
      },
      {
        title: 'status',
        key: 'status',
        dataIndex: 'status'
      },
      {
        title: 'Operation',
        key: 'Operation',
        render: (text, record) => (
          <span>
            <a href="javascript:;" data-id={record.id} data-name={record.name} onClick={this.onEdit}>Edit</a>
            <Divider type="vertical" />
            <a href="javascript:;" data-id={record.id} data-name={record.name} onClick={this.onDelete}>Delete</a>
            <Divider type="vertical" />
          </span>
        ),
      }

    ]

    return (
      <div>

        <Divider />
        <Table columns={columns} dataSource={tasks} style={{ backgroundColor: 'white' }} bordered />
        <Divider />
        <Button type="primary" icon="plus" onClick={this.showTaskModal}>添加task</Button>
        {visible && <TaskModal onCancel={this.onCancel} onOk={this.onOk} ports={ports} data={choosedTask} isEdit={isEdit} onEditSave={this.onEditSave}/>}
      </div>
    );
  }
}

export default connect((state) => { return ({ tasks: state.tasks, ports: state.ports }) })(Index)