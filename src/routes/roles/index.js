import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Modal, Transfer } from 'antd'
import { Page } from 'components'

class Index extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: false,
      user: null,
      menus: [],
      targetKeys: [],
      selectedKeys: [],
    }
  }

  columns = [{
    title: '用户名',
    key: 'username',
    dataIndex: 'username',
    width: 180,
    fixed: 'left',
  }, {
    title: '菜单',
    key: 'menus',
    dataIndex: 'menus',
    render: item => item.map(m => m.name).join(', '),
  }, {
    title: '操作',
    render: item => (
      <div>
        <a onClick={() => this.onEdit(item)}>编辑</a>
        <a onClick={() => this.onDelete(item)} style={{ marginLeft: '10px' }}>删除</a>
      </div>
    ),
    width: 100,
    fixed: 'right',
  }]

  componentDidMount () {
    this.props.dispatch({ type: 'roles/query' })
  }

  handleChange = (nextTargetKeys) => {
    this.setState({ targetKeys: nextTargetKeys })
  }

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] })
  }

  onEdit (item) {
    const { app: { menu } } = this.props

    this.setState({
      visible: true,
      user: item,
      menus: menu.filter(m => m.mpid == 3/* 系统查询子菜单 */ && m.owner !== item._id),
    })
  }

  onDelete (item) {
    const { dispatch } = this.props
    Modal.confirm({
      title: '确定删除？',
      content: '',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk () {
        dispatch({ type: 'roles/delete', payload: item._id })
      },
    })
  }

  handleOk () {
    const { user, menus, targetKeys } = this.state
    this.props.dispatch({
      type: 'roles/update',
      payload: {
        id: user._id,
        menus: targetKeys.map(k => menus.find(m => m.id == k)),
      },
    })
    setTimeout(() => this.setEditModalVisible(false), 0)
  }

  setEditModalVisible (visible) {
    const state = { visible }

    if (!visible) {
      Object.assign(state, {
        user: null,
        menus: [],
        targetKeys: [],
        selectedKeys: [],
      })
    }
    this.setState(state)
  }

  render () {
    const { roles, app } = this.props
    const { menus, visible, targetKeys, selectedKeys } = this.state

    return (
      <Page inner>
        {/* <p className="headerManager">
          <Button type="primary" icon="plus" onClick={() => this.setVisible(true)}>添加角色</Button>
        </p> */}
        <Table columns={this.columns} dataSource={roles.users.map((u, i) => ({ key: i, ...u }))} pagination={false} />
        <Modal
          title="编辑"
          width={620}
          visible={visible}
          onOk={() => this.handleOk()}
          onCancel={() => this.setEditModalVisible(false)}
          okText="确认"
          cancelText="取消"
        >
          <Transfer
            dataSource={menus}
            rowKey={row => row.id}
            titles={['全部', '已选择']}
            locale={{ itemUnit: '项', itemsUnit: '项', notFoundContent: '列表为空' }}
            targetKeys={targetKeys}
            selectedKeys={selectedKeys}
            onChange={this.handleChange}
            onSelectChange={this.handleSelectChange}
            render={item => item.name}
            listStyle={{
              width: 260,
            }}
          />
        </Modal>
      </Page>
    )
  }
}

Index.propTypes = {
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  roles: PropTypes.object,
  app: PropTypes.object,
}

export default connect(({ app, roles }) => { return ({ roles, app }) })(Index)
