import React, { Component } from 'react';
import { TaskModal } from 'components'
import { Button, Icon, Table, Divider } from 'antd'
import { connect } from 'dva'

class Index extends Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: false
    }
    this.showTaskModal = this.showTaskModal.bind(this)
    this.onCancel = this.onCancel.bind(this);
    this.onOk = this.onOk.bind(this);
  }

  showTaskModal() {
    this.setState({
      visible: true
    })
  }

  onCancel() {
    this.setState({
      visible: false
    })
  }
  onOk(task) { 
    console.log(task); 
    this.setState({
      visible: false
    })
  }
  componentWillMount() {
    this.props.dispatch({ type: 'tasks/queryTasks'})
    this.props.dispatch({ type: 'ports/queryPorts'})
  }
  render() {
    const { visible } = this.state
    const { tasks = [] } = this.props.tasks
    const { ports = [] } = this.props.ports
    for (var i = 0; i < tasks.length; i++) {
      for (var j = 0; j < ports.length; j++) {
        if ( tasks[i].input == ports[j].id ) {
          tasks[i].inputName = ports[j].name
        }
        if ( tasks[i].output == ports[j].id ) {
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
        render: (type)=> {
          let d = ''
          if ( type == 0 ) {
            d = 'CRON'
          }else if ( type == 1 ) {
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
            <a href="javascript:;">Edit</a>
            <Divider type="vertical" />
            <a href="javascript:;">Delete</a>
            <Divider type="vertical" />
          </span>
        ),
      }
     
    ]
    
    return (
      <div>
       
        <Divider />
        <Table columns={columns} dataSource={tasks} style={{backgroundColor: 'white'}} bordered/>
        <Divider />
        <Button type="primary" icon="plus" onClick={this.showTaskModal}>添加task</Button>
        {visible && <TaskModal onCancel={this.onCancel} onOk={this.onOk} ports={ports}/>}
      </div>
    );
  }
}

export default connect((state) => { return ({ tasks: state.tasks, ports: state.ports }) })(Index)