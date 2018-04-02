import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import capitalize from 'lodash/capitalize'
import { Modal, Icon, Radio, Pagination, Divider, Table, Button } from 'antd'
import styles from './index.less'
import { Page } from 'components'
import AddModal from './AddModal'
import EditModal from './EditModal'
// import Flow from './Flow'
import History from '../../../components/TaskModal/History'

const { confirm } = Modal

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // visible: false,
      page: 1,
      addVisible: false,
      editVisible:false,
    }
  }
  componentWillMount() {
    this.props.dispatch({ type: 'flows/queryFlows' })
  }
  componentWillReceiveProps(nextProps) {
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

  render() {
    const { allFlows = [], pagination = {}, choosedFlow = {} } = this.props.flows
    const { page } = this.state
    console.log('allFlows:', allFlows)
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

    let antdTable = (<Table rowKey={line => line.id}
      columns={antdTableColumns}
      dataSource={allFlows}
      // pagination={paginations}
      // onChange={(e) => this.onGetPage(e)}
      style={{ backgroundColor: 'white' }}
      bordered
    />)

    return (
      <Page inner>
        <p className="headerManager">flows设置</p>
        <div>
          <AddModal visible={this.state.addVisible} setVisible={() => this.setVisible()} />
          {/* <EditModal visible={this.state.editVisible} setVisible={() => this.showEditModal()} /> */}
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

export default connect((state) => { return ({ tasks: state.tasks, flows: state.flows }) })(Index)
