import React from 'react'
import { DS_CONFIG } from 'services/consts'
import { Row, Col, Select, Input, Button, Modal, Form, AutoComplete, Icon } from 'antd'
import { connect } from 'dva'
import elasticsearch from 'elasticsearch-browser'
import values from 'lodash/values'
import forEach from 'lodash/forEach'
import flatten from 'lodash/flatten'
import getMappings from 'utils/fields'
import styles from './index.less'

const { Option } = Select
const FormItem = Form.Item

class AddForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: props.visible,
      allIndexs: [],
      indices: [],
      allFields: [],
      addData: {
        type: DS_CONFIG,
        name: '',
        host: '',
        index: '',
        fields: [],
        timestamp: '@timestamp',
        allfields: [],
      },
      hostStatus: '',
      hostError: '',
      xfields: {},
    }
  }

  onAddName (value) {
    this.state.addData.name = value
    this.setState({
      addData: this.state.addData,
    })
  }

  onAddHost (value) {
    this.state.addData.host = value

    this.setState({
      addData: this.state.addData,
    })
  }

  onAddHostFinish () {
    const { host } = this.state.addData

    if (!host) return

    this.setState({
      hostStatus: 'validating',
    })

    this.client = new elasticsearch.Client({ host })
    this.client.ping().then(() => {
      this.client.cat.indices({
        format: 'json',
        h: 'index',
      }).then((result) => {
        this.setState({
          hostStatus: 'success',
          hostError: '',
          indices: result.map(data => data.index),
        })
      })
    }).catch((e) => {
      this.setState({
        hostStatus: 'error',
        hostError: e.message,
      })
    })
  }

  onAddIndex (value) {
    this.state.addData.allfields = []
    this.state.addData.fields = []
    this.state.addData.index = value
    let allindexs = this.state.indices
    let arr = []
    let reg = new RegExp(value)
    if (value) {
      for (let i in allindexs) {
        if (allindexs[i].match(reg)) {
          arr.push(allindexs[i])
        }
      }
    }
    this.setState({
      allFields: [],
      allIndexs: arr,
    })
  }

  onGetAllKey () {
    const { addData: { index }, allFields } = this.state
    if (index) {
      if (!allFields.length) {
        this.client.indices.get({
          index,
          flatSettings: true,
          ignoreUnavailable: true,
        }).then((result) => {
          this.setState({
            allFields: getMappings(result),
          })
        })
      }
    } else {
      this.state.addData.allfields = []
      this.state.addData.fields = []
      this.setState({
        addData: this.state.addData,
        allFields: [],
      })
    }
  }

  onAddKey (value) {
    this.state.addData.allfields = value
    this.setState({
      addData: this.state.addData,
    })
  }

  onAddfieldName (e) {
    const { value, dataset: { field } } = e.target

    let obj = {
      field,
      label: value,
    }
    this.state.xfields[field] = obj
  }

  onSave () {
    let field = values(this.state.xfields)
    this.state.addData.fields = field
    this.setState({
      addData: this.state.addData,
    })

    this.props.dispatch({ type: 'singleSource/addSingleSource', payload: this.state.addData })
    this.props.setVisible(false)
    this.setState({
      addData: {
        type: DS_CONFIG,
        name: '',
        host: '',
        index: '',
        fields: [],
        timestamp: '@timestamp',
        allfields: [],
      },
      xfields: {},
      hostStatus: '',
      hostError: '',
    })
  }

  onCancel () {
    this.props.setVisible(false)
    this.setState({
      addData: {
        type: DS_CONFIG,
        structure: [],
        name: '',
        host: '',
        index: '',
        fields: [],
        timestamp: '@timestamp',
        allfields: [],
      },
      xfields: {},
      hostStatus: '',
      hostError: '',
    })
  }

  render() {
    const { allSingleSource, singleSource } = this.props.singleSource
    const { addData, originSource, hostStatus, hostError } = this.state

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      className: styles.formItem
    }
    const formItemLayoutSelect = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
      className: styles.formItem
    }
   
    let antdFormAdd = (
      <Form horizonal='true'>
        <FormItem {...formItemLayout} label='名称:'>
          <Input onChange={e => this.onAddName(e.target.value)} value={addData.name} />
        </FormItem>
        <FormItem {...formItemLayout} label='主机:' validateStatus={hostStatus} help={hostError}>
          <Col span={19}>
            <Input onChange={e => this.onAddHost(e.target.value)} value={addData.host} />
          </Col>
          <Col span={5} className={styles.connect}>
            <Button type="primary" loading={hostStatus === 'validating'} onClick={() => this.onAddHostFinish()}>连接</Button>
          </Col>
        </FormItem>
        <FormItem {...formItemLayout} label='索引:'>
          <AutoComplete
            dataSource={this.state.allIndexs}
            placeholder={hostStatus !== 'success' ? '请连接主机' : '请输入'}
            onChange={(value) => { this.onAddIndex(value) }}
            value={addData.index}
            disabled={hostStatus !== 'success'}
          />
        </FormItem>
        <FormItem {...formItemLayout} label='时间:'>
          <Select style={{ width: '100%' }} value={addData.timestamp} />
        </FormItem>
        <FormItem {...formItemLayout} label='字段选择:'>
          <Select
            mode="tags"
            placeholder={hostStatus !== 'success' ? '请连接主机' : '请选择'}
            style={{ width: '100%' }}
            onChange={value => this.onAddKey(value)}
            onFocus={() => this.onGetAllKey()}
            value={addData.allfields}
            disabled={hostStatus !== 'success'}
          >
            {
              this.state.allFields && this.state.allFields.map((field, key) => {
                return <Option value={field} key={key}>{field}</Option>
              })
            }
          </Select>
        </FormItem>
        {addData.allfields && addData.allfields.map((field, key) => (
          <Row key={key}>
            <Col span="12" >
              <FormItem {...formItemLayoutSelect} label='字段'>
                <Input value={field} disabled />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem {...formItemLayoutSelect} label='名称' >
                <Input data-field={field} onChange={e => this.onAddfieldName(e)} />
              </FormItem>
            </Col>
          </Row>
        ))}
      </Form>
    )

    return (
      <div>
        <Modal
          title="添加"
          visible={this.state.visible}
          onOk={this.onSave.bind(this)}
          onCancel={this.onCancel.bind(this)}
          okText="保存"
          cancelText="取消"
        >
          {antdFormAdd}
        </Modal>      
      </div>
    )
  }
  
  componentWillReceiveProps (nextProps) {
    this.setState({
      visible: nextProps.visible,
    })
  }
}

export default connect((state) => { return ({ singleSource: state.singleSource }) })(AddForm)
