import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import capitalize from 'lodash/capitalize'
import { Modal, Icon, Radio, Pagination, Divider, Table, Button, Switch } from 'antd'
import styles from './index.less'
import { Page } from 'components'
import EditModal from './EditModal'
import AddModal from './AddModal'
import History from '../../../components/TaskModal/History'

const { confirm } = Modal

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.flowList = []
    this.state = {
      page: 1,
      addVisible: false,
      editVisible: false,
    }
  }
  componentWillMount() {
    this.props.dispatch({ type: 'flows/queryFlows' })
  }
  componentWillReceiveProps(nextProps) {
  }
  componentDidMount() {
    this.loop = setInterval(() => this.flowList.forEach(item => this.props.dispatch({ type: 'flows/getAllflowJobs', payload: { id: item } })), 3000)
  }
  componentWillUnmount() {
    clearInterval(this.loop)
  }
  onGetPage(page, pageSize) {
    let pagination = {
      current: page,
      pageSize,
    }
    this.setState({
      page,
    })
    this.props.dispatch({ type: 'flows/queryFlows', payload: pagination })
  }
  onAdd() {
    this.setState({
      addVisible: true,
    })
  }
  onEdit(id) {
    this.props.dispatch({ type: 'flows/queryChoosedSource', payload: { id } })
    this.setState({
      editVisible: true,
    })
  }

  onRemove(key) {
    const page = this.props.flows.allFlows.length === 1 ? 1 : this.state.page
    const { dispatch } = this.props
    confirm({
      title: '删除',
      content: '确实要删除该配置吗？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'flows/delChoosedSource',
          payload: {
            id: key,
            page,
          },
        })
      },
      onCancel() { },
    })
  }

  setVisible(value) {
    this.setState({
      addVisible: value,
    })
  }

  showEditModal(value) {
    this.setState({
      editVisible: value,
    })
  }

  toggle(value, bool) {
    console.log(bool)
    let allTasks = value.tasks.map(item => item._id)
    if (bool === true) {
      this.props.dispatch({ type: 'jobs/startJobs', payload: { taskId: allTasks } })
    } else {
      this.props.dispatch({ type: 'jobs/stopJobs', payload: { taskId: allTasks } })
    }
  }

  expandRow(expanded, record) {
    let flowId = record._id
    console.log('expand', expanded, record._id)
    if (expanded) {
      this.flowList.push(record._id)
      this.props.dispatch({ type: 'flows/getAllflowJobs', payload: { id: record._id } })
      // this.flowList.map(item => this.props.dispatch({ type: 'flows/getAllflowJobs', payload: { id: item } }))
    } else {
      this.flowList = this.flowList.filter(item => item !== flowId)
      this.props.dispatch({ type: 'flows/deleteSearchFlowJobs', payload: { id: flowId } })
    }
    console.log('flowList', this.flowList)
  }

  render() {
    const { allFlows = [], pagination = {}, choosedFlow = {}, flowJobs = [] } = this.props.flows
    const { taskjobs = [] } = this.props.jobs
    const { page } = this.state
    console.log('allFlows', '------>', flowJobs)
    let antdTableColumns = [
      {
        title: '名字',
        key: 'Name',
        dataIndex: 'name',
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
        title: '启停',
        key: 'start',
        render: (text, record) => (
          <Switch onChange={bool => this.toggle(record, bool)} checked={record.tasks.some(item => item.running)} size="small" />
        ),
      },
      {
        title: '操作',
        key: 'Operation',
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
        title: 'status',
        children: [
          {
            title: 'uptime',
            key: 'uptime',
            // dataIndex: 'uptime',
            render: record => {
              let data = '--'
              if (record.status) {
                data = record.status.uptime
              }
              return data
            },
          },
          {
            title: 'restart',
            key: 'restart',
            // dataIndex: 'restart',
            render: record => {
              let data = '--'
              if (record.status) {
                data = record.status.uptime
              }
              return data
            },
          },
          {
            title: 'status',
            key: 'status',
            // dataIndex: 'status',
            render: record => {
              let data = '--'
              if (record.status) {
                data = record.status.uptime
              }
              return data
            },
          },
          {
            title: 'pid',
            key: 'pid',
            // dataIndex: 'pid',
            render: record => {
              let data = '--'
              if (record.status) {
                data = record.status.uptime
              }
              return data
            },
          },
        ],
      },
    ]

    let antdTable = (<Table rowKey={line => line.id}
      columns={antdTableColumns}
      dataSource={allFlows}
      align="center"
      // pagination={paginations}
      // onChange={(e) => this.onGetPage(e)}
      expandedRowRender={record => {
        let data = flowJobs.filter(item => item.flowId === record._id)[0] ? flowJobs.filter(item => item.flowId === record._id)[0].data : []
        console.log('data', flowJobs)
        let allTasks = record.tasks
        data.forEach(item => {
          allTasks.find(task => {
            if (task._id === item.taskId) {
              item.name = task.name
            }
          })
        })
        return (<Table rowKey={line => line.id}
          columns={expandedColumns}
          dataSource={data} />)
      }
      }
      onExpand={(expanded, record) => this.expandRow(expanded, record)}
      style={{ backgroundColor: 'white' }}
      bordered
    />)

    return (
      <Page inner>
        <p className="headerManager">flows设置</p>
        <div>
          <AddModal visible={this.state.addVisible} setVisible={() => this.setVisible()} />
          <EditModal visible={this.state.editVisible} setVisible={() => this.showEditModal()} />
          <div>
            {antdTable}
          </div>
          <Divider />
          <div>
            <Button type="primary" icon="plus" onClick={() => this.setVisible(true)}>添加数据</Button>
          </div>
        </div>
      </Page>
    )
  }
}

export default connect((state) => { return ({ tasks: state.tasks, flows: state.flows, jobs: state.jobs }) })(Index)
