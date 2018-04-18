import React, { Component } from 'react'
import { TaskModal, Page } from 'components'
import cloneDeep from 'lodash/cloneDeep'
import forEach from 'lodash/forEach'
import { Button, Icon, Table, Divider, Modal, Switch } from 'antd'
import { connect } from 'dva'
import styles from './index.less'


const { confirm } = Modal

class Index extends Component {
  constructor (props) {
    super(props)
    this.paginations = {
      current: 0,
      total: 0,
      pageSize: 0,
    }
    this.state = {
      addVisible: false,
      updateVisible: false,
      choosedTask: null,
      page: 1,
      pageCount: 0,
    }
  }
  onPageChange (pagination) {
    this.state.page = pagination.current
    this.state.pageCount = pagination.pageCount
    this.props.dispatch({ type: 'tasks/queryTasks', payload: pagination })
  }
  componentWillMount () {
    this.props.dispatch({ type: 'tasks/queryTasks' })
  }

  render () {
    const { addVisible, updateVisible, choosedTask } = this.state
    const { tasks = [], pagination = {} } = this.props.tasks
    this.paginations = {
      current: pagination.page + 1,
      total: pagination.totalCount,
      pageSize: pagination.pageSize,
      pageCount: pagination.pageCount,
    }
    console.log('tasks', tasks)
    let columns = [
      {
        title: '名字',
        key: 'Name',
        dataIndex: 'name',
      },
      {
        title: '类型',
        key: 'Type',
        dataIndex: 'type',
        render: (type) => {
          let d = ''
          if (type === 1) {
            d = 'CRON'
          } else if (type === 0) {
            d = 'NORMAL'
          }
          return d
        },
      },
      {
        title: '输入',
        key: 'Input',
        dataIndex: 'input.name',
      },
      {
        title: '输出',
        key: 'Output',
        dataIndex: 'output.name',
      },
      {
        title: '脚本',
        key: 'Command',
        dataIndex: 'script',
      },
      {
        title: '创建',
        key: 'CreateAt',
        dataIndex: 'createdAt',
      },
      {
        title: '更新',
        key: 'UpdateAt',
        dataIndex: 'updatedAt',
      },
      {
        title: '状态',
        key: 'running',
        render: (text, record) => (
          <Icon type="setting" id={record.running ? 'settingIcon' : ''} style={{ fontSize: 20 }} />
          // <Switch checked={record.running} size="small" />
        ),
      },
      {
        title: '操作',
        width: 110,
        key: 'Operation',
        render: (text, record) => (
          <span>
            <a onClick={() => this.onUpdate(record)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.onDelete(record)}>删除</a>
          </span>
        ),
      },
    ]

    return (
      <Page inner>
        <p className="headerManager">tasks设置</p>
        <div>
          <Table columns={columns} dataSource={tasks} style={{ backgroundColor: 'white' }} bordered pagination={this.paginations} onChange={(e) => this.onPageChange(e)} />
          <Divider />
          <Button type="primary" icon="plus" onClick={this.showAddTaskModal.bind(this)}>添加task</Button>
          {updateVisible && <TaskModal data={choosedTask} onCancel={this.onUpdateCancel.bind(this)} onOk={this.onUpdateOk.bind(this)} />}
          {addVisible && <TaskModal onCancel={this.onAddCancel.bind(this)} onOk={this.onAddOk.bind(this)} />}
        </div>
      </Page>
    )
  }
  showAddTaskModal () {
    this.setState({
      addVisible: true,
    })
  }
  onAddCancel () {
    this.setState({
      addVisible: false,
    })
  }
  onAddOk (task) {
    // let isAppend = 1
    // let count = ( this.paginations.current ) * this.paginations.pageSize - this.paginations.total
    // if (count >= 20 || count == 0) {
    //   this.state.pageCount++
    // }
    // if (count >= 20) {
    //   this.state.pageCount++
    // }
    this.props.dispatch({ type: 'tasks/addTask', payload: { task: task, page: this.state.page } })
    this.setState({
      addVisible: false,
    })
  }
  onDelete (e) {
    confirm({
      title: '删除',
      content: '确定删除 ' + e.name + ' ?',
      okText: '确定',
      cancelText: '取消',
      // onOk: ()=>{this.props.dispatch({ type: 'tasks/delChoosedTask', payload: { id : e.id }})},
      onOk: this.onDeleteOk.bind(this, e),
      onCancel: () => { },
    })
  }
  onDeleteOk (e) {
    const page = this.props.tasks.tasks.length === 1 ? 1 : this.state.page
    this.props.dispatch({ type: 'tasks/delChoosedTask', payload: { id: e._id, page } })
    // if ( this.props.tasks.tasks.length === 1 ) {
    //   this.state.page --
    // }
    // this.props.dispatch({ type: 'tasks/delChoosedTask', payload: { id: e._id, page: this.state.page } })
  }
  onUpdate (e) {
    this.setState({
      updateVisible: true,
      choosedTask: e,
    })
  }
  onUpdateOk (task) {
    let id = task._id
    console.log('updatetask', task)
    this.props.dispatch({ type: 'tasks/updateChoosedTask', payload: { task, id } })
    this.setState({
      updateVisible: false,
    })
  }
  onUpdateCancel () {
    this.setState({
      updateVisible: false,
    })
  }
}

export default connect((state) => { return ({ tasks: state.tasks, ports: state.ports, flows: state.flows }) })(Index)