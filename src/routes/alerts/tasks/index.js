import React, { Component } from 'react'
import { TaskModal, Page, History, Log } from 'components'
import cloneDeep from 'lodash/cloneDeep'
import forEach from 'lodash/forEach'
import { Button, Icon, Table, Divider, Modal, Switch, Message } from 'antd'
import { connect } from 'dva'
import styles from './index.less'
import config from '../../../../app.json'


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
      cloneVisible: false,
      logVisible: false,
      choosedTask: null,
      page: 1,
      pageCount: 0,
      id: '',
    }
  }
  onPageChange (pagination) {
    this.state.page = pagination.current
    this.state.pageCount = pagination.pageCount
    this.props.dispatch({ type: 'tasks/queryTasks', payload: pagination })
  }
  componentWillMount () {
    this.props.dispatch({ type: 'tasks/queryTasks' })
    this.props.dispatch({ type: 'flows/queryFlows', payload: { pageSize: config.maxSize } })
  }

  render () {
    const { addVisible, updateVisible, cloneVisible, choosedTask, logVisible, id } = this.state
    const { tasks = [], pagination = {} } = this.props.tasks
    this.paginations = {
      current: pagination.page + 1,
      total: pagination.totalCount,
      pageSize: pagination.pageSize,
      pageCount: pagination.pageCount,
    }

    let columns = [
      {
        title: '名字',
        key: 'Name',
        dataIndex: 'name',
        width: 150,
        fixed: 'left',
      },
      {
        title: '描述',
        key: 'Description',
        dataIndex: 'description',
        width: 150,
        fixed: 'left',
      },
      {
        title: '指标名',
        key: 'Metric Name',
        dataIndex: 'metric',
        // width: 150,
      },
      {
        title: '类型',
        key: 'Type',
        dataIndex: 'type',
        width: 100,
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
        // width: 100,
      },
      {
        title: '输出',
        key: 'Output',
        dataIndex: 'output.name',
        // width: 100,
      },
      {
        title: '脚本',
        key: 'Command',
        dataIndex: 'script',
        // width: 200,
      },
      {
        title: '创建',
        key: 'CreateAt',
        dataIndex: 'createdAt',
        width: 160,
      },
      {
        title: '更新',
        key: 'UpdateAt',
        dataIndex: 'updatedAt',
        width: 160,
      },
      {
        title: '状态',
        fixed: 'right',
        width: 100,
        align: 'center',
        key: 'running',
        render: (text, record) => (
          <Icon spin={record.running ? true : false} type="setting" style={{ fontSize: 20 }} />
          // <Switch checked={record.running} size="small" />
        ),
      },
      {
        title: '操作',
        width: 190,
        fixed: 'right',
        key: 'Operation',
        render: (text, record) => (
          <span>
            <a onClick={() => this.onUpdate(record)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.onDelete(record)}>删除</a>
            <Divider type="vertical" />
            <a onClick={() => this.onClone(record)}>克隆</a>
            <Divider type="vertical" />
            <a onClick={() => this.onShowLog(record)}>日志</a>
          </span>
        ),
      },
    ]

    return (
      <Page inner>
        <p className="headerManager">
          <Button type="primary" icon="plus" onClick={this.showAddTaskModal.bind(this)}>添加任务</Button>
        </p>
        <div>
          <Table columns={columns} scroll={{ x: columns.length * 200 }} dataSource={tasks} style={{ backgroundColor: 'white' }} pagination={this.paginations} onChange={(e) => this.onPageChange(e)} />
          {updateVisible && <TaskModal data={choosedTask} onCancel={this.onUpdateCancel.bind(this)} onOk={this.onUpdateOk.bind(this)} />}
          {addVisible && <TaskModal onCancel={this.onAddCancel.bind(this)} onOk={this.onAddOk.bind(this)} />}
          {cloneVisible && <TaskModal cloneData={choosedTask} onCancel={this.onCloneCancel.bind(this)} onOk={this.onCloneOk.bind(this)} />}
          {logVisible && <Log id={id} onCancel={this.onLogCancel.bind(this)} />}
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
    this.props.dispatch({
      type: 'tasks/addTask',
      payload: {
        task,
        page: this.state.page,
        modalVisible: () => this.setState({ addVisible: false }),
      },
    })
  }
  onDelete (e) {
    // console.log('del', e, this.props.flows.allFlows)
    let allflows = this.props.flows.allFlows.map(item => item.tasks)
    let used = false
    if (allflows.length > 0) {
      allflows.filter((item) => {
        item.filter((every) => {
          if (every._id === e._id) {
            used = true
          }
        })
      })
    }
    if (used) {
      confirm({
        title: '删除',
        content: '流程中使用了 ' + e.name + ' (' + e._id + ' ),' + '请先修改流程',
        okText: '确定',
        cancelText: '取消',
      })
    } else {
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
    let page = this.state.page
    this.props.dispatch({
      type: 'tasks/updateChoosedTask',
      payload: {
        task,
        id,
        page,
        modalVisible: () => this.setState({ updateVisible: false }),
      },
    })
  }
  onUpdateCancel () {
    this.setState({
      updateVisible: false,
    })
  }
  onClone (e) {
    let data = {
      name: '',
      metric: '',
      description: e.description,
      input: { type: e.input.type, _id: e.input._id },
      output: { type: e.output.type, _id: e.output._id },
      script: e.script,
      params: e.params,
      type: e.type,
      cron: e.cron,
      running: false,
    }
    this.setState({
      cloneVisible: true,
      choosedTask: data,
    })
  }
  onCloneCancel () {
    this.setState({
      cloneVisible: false,
    })
  }
  onCloneOk (task) {
    this.props.dispatch({
      type: 'tasks/addTask',
      payload: {
        task,
        page: this.state.page,
        modalVisible: () => this.setState({ cloneVisible: false }),
      },
    })
  }
  onShowLog (record) {
    this.setState({
      logVisible: true,
      id: record._id,
    })
  }
  onLogCancel () {
    this.setState({
      logVisible: false,
    })
  }
}

export default connect((state) => { return ({ tasks: state.tasks, ports: state.ports, flows: state.flows }) })(Index)
