import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Table, Modal, Transfer, Input, message } from 'antd'
import { Page } from 'components'
import { register } from 'services/login'

const siderMenus = [
  { id: 4, name: '(菜单)数据源设置', route: '/singleSource' },
  { id: 5, name: '(菜单)指标设置', route: '/metric' },
  { id: 6, name: '(菜单)告警设置', route: '' },
  { id: 7, name: '(菜单)系统设置', route: '/settings' },
  // { id: 2, name: '(菜单)角色管理' },
]

class Index extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: false,
      user: null,
      menus: [],
      item: null,
      username: '',
      password: '',
      isAdding: false,
      isModifying: false,
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
        <a onClick={() => this.setState({ item, isModifying: true })}>修改密码</a>
        <a onClick={() => this.onEdit(item)}>编辑</a>
        <a onClick={() => this.onDelete(item)} style={{ marginLeft: '10px' }}>删除</a>
      </div>
    ),
    width: 240,
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

  onUpdatePassword () {
    const { password, item } = this.state

    if (/^[0-9a-zA-Z]{1,}[^\s]{5,}$/.test(password)) {
      this.props.dispatch({ type: 'roles/update', payload: { id: item._id, password } })
      this.setState({ item: null, password: '', isModifying: false })
    } else {
      message.error('密码格式错误')
    }
  }

  onEdit (item) {
    const { app: { menu } } = this.props
    const menus = menu.filter(m => m.mpid == 3/* 系统查询子菜单 */ && m.owner !== item._id)

    siderMenus.forEach((sm) => {
      if (!item.menus.find(m => m.id == sm.id)) {
        menus.unshift(sm)
      }
    })
    this.setState({
      visible: true,
      user: item,
      menus,
      targetKeys: item.menus.map(m => m.id),
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

  changeUsername = (e) => {
    this.setState({
      username: e.target.value.trim(),
    })
  };

  changePassword = (e) => {
    this.setState({
      password: e.target.value.trim(),
    })
  };

  handleOk () {
    const { user, menus, targetKeys } = this.state
    this.props.dispatch({
      type: 'roles/update',
      payload: {
        id: user._id,
        menus: targetKeys.map(k => menus.find(m => m.id == k)).filter(m => m),
      },
    })
    setTimeout(() => this.setEditModalVisible(false), 0)
  }

  handleAddOk = () => {
    const { username, password } = this.state

    if (/^\w{6,}$/.test(username) && /^[0-9a-zA-Z]{1,}[^\s]{5,}$/.test(password)) {
      register({ username, password }).then(() => {
        this.setState({ isAdding: false })
        this.props.dispatch({ type: 'roles/query' })
      })
    } else {
      message.error('用户名或密码格式错误')
    }
  };

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
    const { menus, visible, targetKeys, selectedKeys, isAdding, isModifying, username, password } = this.state

    return (
      <Page inner>
        <p className="headerManager">
          <Button type="primary" icon="plus" onClick={() => this.setState({ isAdding: true })}>添加角色</Button>
        </p>
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
        <Modal
          title="添加用户"
          width={420}
          visible={isAdding}
          onOk={() => this.handleAddOk()}
          onCancel={() => this.setState({ isAdding: false })}
          okText="确认"
          cancelText="取消"
        >
          <Input autoComplete="username" value={username} onChange={this.changeUsername} placeholder="用户名长度必须大于6" />
          <div style={{ marginTop: 20 }}>
            <Input type="password"value={password} onChange={this.changePassword} placeholder="密码长度必须大于6且同时包含数字、字母或符号" />
          </div>
        </Modal>
        <Modal
          title="修改密码"
          width={420}
          visible={isModifying}
          onOk={() => this.onUpdatePassword()}
          onCancel={() => this.setState({ isModifying: false })}
          okText="确认"
          cancelText="取消"
        >
          <Input type="password" value={password} onChange={this.changePassword} placeholder="密码长度必须大于6且同时包含数字、字母或符号" />
        </Modal>
      </Page>
    )
  }
}

Index.propTypes = {
  dispatch: PropTypes.func,
  roles: PropTypes.object,
  app: PropTypes.object,
}

export default connect(({ app, roles }) => { return ({ roles, app }) })(Index)
