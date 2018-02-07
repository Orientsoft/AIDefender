import React from 'react'
import { Icon, Select, Input, Button, Modal, Form, Table } from 'antd'
import { Page } from 'components'

const { Option } = Select
const { confirm } = Modal
const FormItem = Form.Item

class Index extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      addVisible: false,
      editVisible: false,
    }
  }
  showAddModal () {
    this.setState({
      addVisible: true,
    })
  }
  onAddOk () {
    this.setState({
      addVisible: false,
    })
  }
  onAddCancel () {
    this.setState({
      addVisible: false,
    })
  }
  onEditOk () {
   
  }
  onEditCancel () {

  }

  render () {
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
            <a href="#" data-name={record.name} data-id={record.id}>Edit</a>
            <span className="ant-divider" />
            <a href="#" data-name={record.name} data-id={record.id}>Delete</a>
          </span>
        ),
      },
    ]

    let antdTable = (<Table rowKey={line => line.id}
      columns={antdTableColumns}
    // dataSource={this.state.agentCollectorList}
    />)

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    }
    let antdFormAdd = (
      <Form horizonal="true">
        <FormItem {...formItemLayout} label="名字：">
          <Input />
        </FormItem>
        <FormItem {...formItemLayout} label="类型：">
          <Select style={{ width: '100%' }}>
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
          <Input />
        </FormItem>
        <FormItem {...formItemLayout} label="类型：">
          <Select style={{ width: '100%' }}>
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
        >
          {antdFormAdd}
        </Modal>
        <Modal
          title="修改"
          // visible={}
          onOk={this.onEditOk.bind(this)}
          onCancel={this.onEditCancel}
        >
          {antdFormEdit}
        </Modal>
        <div>
          <Button type="primary" icon="plus" onClick={() => this.showAddModal()}>添加数据</Button>
        </div>
        <div>
          { antdTable }
        </div>
      </div>
    )
  }
}

export default Index
