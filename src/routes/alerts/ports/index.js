import React from 'react'
import { connect } from 'dva'
import { Icon, Select, Input, Button, Modal, Form, Table, Divider } from 'antd'
import { Page } from 'components'

const { Option } = Select
const { confirm } = Modal
const FormItem = Form.Item

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      addVisible: false,
      editVisible: false,
      addData: {
        name: '',
        type: null,
      },
      choosedPort: this.props.ports.choosedPort,
      choosedPortForShow: {
        name: '',
        type: '',
      },
      id: '',
    }
  }
  componentWillMount() {
    this.props.dispatch({ type: 'ports/queryPorts' })
  }
  componentWillReceiveProps(nextProps) {
    let type = nextProps.ports.choosedPort.type
    let choosedPortForShow = this.state.choosedPortForShow
    choosedPortForShow.name = nextProps.ports.choosedPort.name
    if (type === 0) {
      choosedPortForShow.type = 'REDIS_CHANNEL'
    } else if (type === 1) {
      choosedPortForShow.type = 'NSQ_QUEUE'
    } else if (type === 2) {
      choosedPortForShow.type = 'MONGODB_COLLECTION'
    } else if (type === 3) {
      choosedPortForShow.type = 'ES_INDEX'
    }
    this.state.choosedPortForShow = choosedPortForShow
    this.setState({
      choosedPort: nextProps.ports.choosedPort,
      choosedPortForShow: this.state.choosedPortForShow,
    })
  }
  showAddModal() {
    this.setState({
      addVisible: true,
    })
  }
  onAddName(e) {
    this.state.addData.name = e
    this.setState({
      addData: this.state.addData,
    })
  }
  onAddType(e) {
    this.state.addData.type = e
    this.setState({
      addData: this.state.addData,
    })
  }
  onAddOk() {
    this.props.dispatch({ type: 'ports/addPort', payload: this.state.addData })
    this.setState({
      addVisible: false,
      addData: {
        name: '',
        type: null,
      },
    })
  }
  onAddCancel() {
    this.setState({
      addVisible: false,
    })
  }
  showEditModal(e) {
    this.props.dispatch({ type: 'ports/queryChoosedSource', payload: { id: e.target.dataset.id } })
    this.setState({
      editVisible: true,
    })
  }
  onEditName(e) {
    this.state.choosedPortForShow.name = e
    this.state.choosedPort.name = e
    this.setState({
      choosedPortForShow: this.state.choosedPortForShow,
      choosedPort: this.state.choosedPort,
    })
  }
  onEditType(e) {
    if (e === 0) {
      this.state.choosedPortForShow.type = 'REDIS_CHANNEL'
    } else if (e === 1) {
      this.state.choosedPortForShow.type = 'NSQ_QUEUE'
    } else if (e === 2) {
      this.state.choosedPortForShow.type = 'MONGODB_COLLECTION'
    } else if (e === 3) {
      this.state.choosedPortForShow.type = 'ES_INDEX'
    }
    this.state.choosedPort.type = e
    this.setState({
      choosedPortForShow: this.state.choosedPortForShow,
      choosedPort: this.state.choosedPort,
    })
  }
  onEditOk() {
    let id = this.state.choosedPort.id
    let data = {
      name: this.state.choosedPort.name,
      type: this.state.choosedPort.type,
    }
    this.setState({
      editVisible: false,
    })
    this.props.dispatch({ type: 'ports/updateChoosedSource', payload: { data, id } })
  }
  onEditCancel() {
    this.setState({
      editVisible: false,
    })
  }
  delete(e) {
    let id = e.target.dataset.id
    let name = e.target.dataset.name
    this.state.id = id
    confirm({
      title: '删除',
      content: '确定删除 ' + name + ' (' + id + ' ) ?',
      onOk: this.onDeleteOk.bind(this),
      onCancel: this.onDeleteCancel.bind(this),
    })
  }
  onDeleteOk() {
    this.props.dispatch({ type: 'ports/delChoosedSource', payload: { id: this.state.id } })
  }
  onDeleteCancel() {

  }
  render() {
    const { ports = [] } = this.props.ports
    const { choosedPortForShow } = this.state
    let antdTableColumns = [
      {
        title: 'Name',
        key: 'Name',
        dataIndex: 'name',
      },
      {
        title: 'Type',
        key: 'Type',
        dataIndex: 'type',
        render: (type) => {
          let d = ''
          if (type === 0) {
            d = 'REDIS_CHANNEL'
          } else if (type === 1) {
            d = 'NSQ_QUEUE'
          } else if (type === 2) {
            d = 'MONGODB_COLLECTION'
          } else if (type === 3) {
            d = 'ES_INDEX'
          }
          return d
        },
      },
      {
        title: 'CreateAt',
        key: 'CreateAt',
        dataIndex: 'createdAt',
      },
      {
        title: 'UpdateAt',
        key: 'UpdateAt',
        dataIndex: 'updatedAt',
      },
      {
        title: 'Operation',
        render: (text, record) => (
          <span>
            <a data-name={record.name} data-id={record.id} onClick={e => this.showEditModal(e)}>Edit</a>
            <Divider type="vertical" />
            <a data-name={record.name} data-id={record.id} onClick={e => this.delete(e)}>Delete</a>
          </span>
        ),
      },
    ]

    let antdTable = (<Table rowKey={line => line.id}
      columns={antdTableColumns}
      dataSource={ports}
    />)

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    }
    let antdFormAdd = (
      <Form horizonal="true">
        <FormItem {...formItemLayout} label="名字：">
          <Input value={this.state.addData.name} onChange={e => this.onAddName(e.target.value)} />
        </FormItem>
        <FormItem {...formItemLayout} label="类型：">
          <Select style={{ width: '100%' }} value={this.state.addData.type} onChange={e => this.onAddType(e)}>
            <Option value={0}> REDIS_CHANNEL</Option>
            <Option value={1}>NSQ_QUEUE</Option>
            <Option value={2}>MONGODB_COLLECTION</Option>
            <Option value={3}>ES_INDEX</Option>
          </Select>
        </FormItem>
      </Form>
    )
    let antdFormEdit = (
      <Form horizonal="true">
        <FormItem {...formItemLayout} label="名字：">
          <Input value={choosedPortForShow.name} onChange={e => this.onEditName(e.target.value)} />
        </FormItem>
        <FormItem {...formItemLayout} label="类型：">
          <Select style={{ width: '100%' }} value={choosedPortForShow.type} onChange={e => this.onEditType(e)}>
            <Option value={0}> REDIS_CHANNEL</Option>
            <Option value={1}>NSQ_QUEUE</Option>
            <Option value={2}>MONGODB_COLLECTION</Option>
            <Option value={3}>ES_INDEX</Option>
          </Select>
        </FormItem>
      </Form>
    )

    return (
      <div>
        <Modal
          title="添加"
          visible={this.state.addVisible}
          onOk={() => this.onAddOk()}
          onCancel={() => this.onAddCancel()}
          okText="保存"
          cancelText="取消"
        >
          {antdFormAdd}
        </Modal>
        <Modal
          title="修改"
          visible={this.state.editVisible}
          onOk={this.onEditOk.bind(this)}
          onCancel={this.onEditCancel.bind(this)}
          okText="保存"
          cancelText="取消"
        >
          {antdFormEdit}
        </Modal>
        <div>
          <Button type="primary" icon="plus" onClick={() => this.showAddModal()}>添加数据</Button>
        </div>
        <div>
          {antdTable}
        </div>
      </div>
    )
  }
}

export default connect((state) => { return ({ ports: state.ports }) })(Index)
