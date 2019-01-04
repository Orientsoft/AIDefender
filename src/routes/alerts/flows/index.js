import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { connect } from 'dva'
import { Modal, Pagination, Divider, Table, Button, Switch, Message } from 'antd'
import styles from './index.less'
import { Page } from 'components'
import EditModal from './EditModal'
import AddModal from './AddModal'


const { confirm } = Modal

class Index extends React.Component {
  constructor (props) {
    super(props)
    this.flowList = []
    this.state = {
      page: 1,
      addVisible: false,
      editVisible: false,
    }
  }
  componentWillMount () {
    this.props.dispatch({ type: 'flows/queryFlows' })
  }
  componentWillReceiveProps (nextProps) {
  }
  componentDidMount () {
    this.loop = setInterval(() => this.flowList.forEach(item => this.props.dispatch({ type: 'flows/getAllflowJobs', payload: { id: item } })), 3000)
  }
  componentWillUnmount () {
    clearInterval(this.loop)
  }
  onGetPage (page, pageSize) {
    let pagination = {
      current: page,
      pageSize,
    }
    this.setState({
      page,
    })
    this.props.dispatch({ type: 'flows/queryFlows', payload: pagination })
  }
  onAdd () {
    this.setState({
      addVisible: true,
    })
  }
  onEdit (id) {
    this.props.dispatch({ type: 'flows/queryChoosedSource', payload: { id } })
    this.setState({
      editVisible: true,
    })
  }

  onRemove (key) {
    this.props.flows.allFlows.filter((item) => {
      if (item._id === key) {
        if (item.tasks.some(task => task.running)) {
          Message.error('流程正在进行中，请先关闭！')
        } else {
          const page = this.props.flows.allFlows.length === 1 ? 1 : this.state.page
          this.flowList = this.flowList.filter(flowid => flowid !== key)
          const { dispatch } = this.props
          confirm({
            title: '删除',
            content: '确实要删除该配置吗？',
            okText: '确定',
            cancelText: '取消',
            onOk () {
              dispatch({
                type: 'flows/delChoosedSource',
                payload: {
                  id: key,
                  page,
                },
              })
            },
            onCancel () { },
          })
        }
      }
    })
  }

  setVisible (value) {
    this.setState({
      addVisible: value,
    })
  }

  showEditModal (value) {
    this.setState({
      editVisible: value,
    })
    this.props.dispatch({ type: 'flows/queryFlows', payload: { current: this.state.page, pageSize: 20 } })
  }

  toggle (value, bool) {
    let allTasks = value.tasks.map(item => item._id)
    if (bool) {
      this.props.dispatch({
        type: 'jobs/startJobs',
        payload: {
          taskId: allTasks,
          callback: () => this.props.dispatch({ type: 'flows/queryFlows', payload: { current: this.state.page, pageSize: 20 } }),
          toast: e => Message.error(e),
        },
      })
    } else {
      this.props.dispatch({
        type: 'jobs/stopJobs',
        payload: {
          taskId: allTasks,
          callback: () => this.props.dispatch({ type: 'flows/queryFlows', payload: { current: this.state.page, pageSize: 20 } }),
          toast: e => Message.error(e),
        },
      })
      // this.props.dispatch({ type: 'flows/queryFlows' })
    }
  }

  expandRow (expanded, record) {
    let flowId = record._id
    if (expanded) {
      this.flowList.push(record._id)
      this.props.dispatch({ type: 'flows/getAllflowJobs', payload: { id: record._id } })
      // this.props.dispatch({ type: 'flows/queryFlows', payload: { current: this.state.page, pageSize: 20 } })
      // this.flowList.map(item => this.props.dispatch({ type: 'flows/getAllflowJobs', payload: { id: item } }))
    } else {
      this.flowList = this.flowList.filter(item => item !== flowId)
      this.props.dispatch({ type: 'flows/deleteSearchFlowJobs', payload: { id: flowId } })
    }
  }

  render () {
    const { allFlows = [], pagination = {}, choosedFlow = {}, flowJobs = [] } = this.props.flows
    const { taskjobs = [] } = this.props.jobs
    const { page } = this.state
    // let paginations = {
    //   current: pagination.page + 1,
    //   total: pagination.totalCount,
    //   pageSize: pagination.pageSize,
    // }
    let antdTableColumns = [
      {
        title: '名字',
        key: 'Name',
        dataIndex: 'name',
      },
      // {
      //   title: '描述',
      //   key: 'Description',
      //   // dataIndex: 'name',
      // },
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
        title: '启停',
        key: 'start',
        render: (text, record) => (
          <Switch onChange={bool => this.toggle(record, bool)} checked={record.tasks.some(item => item.running)} size="small" />
        ),
      },
      {
        title: '操作',
        key: 'Operation',
        width: 110,
        render: (text, record) => (
          <span>
            <a onClick={() => this.onEdit(record._id)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.onRemove(record._id)}>删除</a>
          </span>
        ),
      },
    ]

    let expandedColumns = [
      {
        title: 'taskId',
        key: 'taskId',
        dataIndex: 'taskId',
      },
      {
        title: 'name',
        key: 'name',
        dataIndex: 'name',
      },
      {
        title: 'uptime',
        key: 'uptime',
        render: (record) => {
          let data = '--'
          if (record.status) {
            data = moment(record.status.uptime).format('YYYY-MM-DD HH:mm:ss')
          }
          return data
        },
      },
      {
        title: 'restart',
        key: 'restart',
        render: (record) => {
          let data = '--'
          if (record.status) {
            data = record.status.restart
          }
          return data
        },
      },
      {
        title: 'status',
        key: 'status',
        render: (record) => {
          let data = '--'
          if (record.status) {
            let status = record.status.status
            if (status === 0) {
              data = 'online'
            } else if (status === 1) {
              data = 'stopping'
            } else if (status === 2) {
              data = 'stopped'
            } else if (status === 3) {
              data = 'launching'
            } else if (status === 4) {
              data = 'errored'
            } else if (status === 5) {
              data = 'one-launch-status'
            }
          }
          return data
        },
      },
      {
        title: 'pid',
        key: 'pid',
        render: (record) => {
          let data = '--'
          if (record.status) {
            data = record.status.pid
          }
          return data
        },
      },
    ]

    let antdTable = (<Table rowKey={line => line.id}
      columns={antdTableColumns}
      dataSource={allFlows}
      align="center"
      // pagination={paginations}
      onChange={(e) => this.onGetPage(e)}
      expandedRowRender={(record) => {
        let data = flowJobs.filter(item => item.flowId === record._id)[0] ? flowJobs.filter(item => item.flowId === record._id)[0].data : []
        let allTasks = record.tasks
        data.forEach((item) => {
          allTasks.find((task) => {
            if (task._id === item.taskId) {
              item.name = task.name
            }
          })
        })
        return (<Table rowKey={line => line.id}
          columns={expandedColumns}
          dataSource={data}
        />)
      }
      }
      onExpand={(expanded, record) => this.expandRow(expanded, record)}
      style={{ backgroundColor: 'white' }}
      bordered
    />)

    return (
      <Page inner>
        <p className="headerManager">
          <Button type="primary" icon="plus" onClick={() => this.setVisible(true)}>添加流程</Button>
        </p>
        <div>
          {this.state.addVisible && <AddModal setVisible={() => this.setVisible()} />}
          {this.state.editVisible && <EditModal setVisible={() => this.showEditModal()} />}
          <div>
            {antdTable}
          </div>
        </div>
      </Page>
    )
  }
}

export default connect((state) => { return ({ tasks: state.tasks, flows: state.flows, jobs: state.jobs }) })(Index)
