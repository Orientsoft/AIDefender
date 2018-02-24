import React, { Component } from 'react';
import { TaskModal } from 'components'
import cloneDeep from 'lodash/cloneDeep'
import forEach from 'lodash/forEach'
import { Button, Icon, Table, Divider, Modal } from 'antd'
import { connect } from 'dva'


const { confirm } = Modal

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      addVisible: false,
      updateVisible: false,
      choosedTask: null,
    }
  }

  componentWillMount() {
    this.props.dispatch({ type: 'tasks/queryTasks'})
  }

  render() {
    const { addVisible, updateVisible, choosedTask } = this.state
    const { tasks: { tasks } } = this.props
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
        dataIndex: 'input.name'
      },
      {
        title: 'Output',
        key: 'Output',
        dataIndex: 'output.name'
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
            <a onClick={() => this.onUpdate(record)}>Edit</a>
            <Divider type="vertical" />
            <a onClick={() => this.onDelete(record)}>Delete</a>
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
        <Button type="primary" icon="plus" onClick={this.showAddTaskModal.bind(this)}>添加task</Button>
        {updateVisible && <TaskModal data={choosedTask} onCancel={this.onUpdateCancel.bind(this)} onOk={this.onUpdateOk.bind(this)}/>}
        {addVisible && <TaskModal onCancel={this.onAddCancel.bind(this)} onOk={this.onAddOk.bind(this)} />}
      </div>
    );
  }
  showAddTaskModal(){
    this.setState({
      addVisible: true
    })
  }
  onAddCancel(){
    this.setState({
      addVisible: false
    })
  }
  onAddOk(task){
    this.props.dispatch({ type: 'tasks/addTask', payload: task})
    this.setState({
      addVisible: false
    })
  }
  onDelete(e) {

    confirm({
      title: '删除',
      content: '确定删除 ' + e.name + ' ?',
      // onOk: ()=>{this.props.dispatch({ type: 'tasks/delChoosedTask', payload: { id : e.id }})},
      onOk: this.onDeleteOk.bind(this, e), 
      onCancel: () => {},
    })
  }
  onDeleteOk(e) {
    this.props.dispatch({ type: 'tasks/delChoosedTask', payload: { id : e.id }})
  }
  onUpdate(e) {
    this.setState({
      updateVisible: true,
      choosedTask: e,
    })
  }
  onUpdateOk(task){
    this.props.dispatch({ type: 'tasks/updateChoosedTask', payload: {task}})
    this.setState({
      updateVisible: false
    })
    
  }
  onUpdateCancel() {
    this.setState({
      updateVisible: false
    })
  }
}

export default connect((state) => { return ({ tasks: state.tasks, ports: state.ports, flows: state.flows }) })(Index)