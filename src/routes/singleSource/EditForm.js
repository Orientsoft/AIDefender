import React from 'react'
import { DS_CONFIG } from 'services/consts'
import { Row, Col, Select, Input, Button, Modal, Form, AutoComplete } from 'antd'
import { connect } from 'dva'
import elasticsearch from 'elasticsearch-browser'
import values from 'lodash/values'
import forEach from 'lodash/forEach'
import flatten from 'lodash/flatten'
import getMappings from 'utils/fields'
import styles from './index.less'

const { Option } = Select
const FormItem = Form.Item

class EditForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visibleEdit: props.visible,
      allIndexs: [],
      indices: [],
      allFields: [],
      originSource: props.singleSource.singleSource,
      xfields: {},
      hostStatus: '',
      hostError: '',
    }
  }

  onEditHost(value) {
    this.state.originSource.host = value
    this.setState({
      originSource: this.state.originSource,
    })
  }

  onEditHostFinish() {
    const { host } = this.state.originSource

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

  onEditIndex(value) {
    this.state.originSource.index = value
    this.state.originSource.allfields = []
    this.state.originSource.fields = []
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
    const { originSource: { index }, allFields } = this.state

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
      this.state.originSource.allfields = []
      this.state.originSource.fields = []
      this.setState({
        originSource: this.state.originSource,
        allFields: [],
      })
    }
  }

  onEditKey(value) {
    this.state.originSource.allfields = value
    const oldFields = this.state.originSource.fields.slice()
    this.state.originSource.fields.length = 0
    value.forEach((name) => {
      let obj = oldFields.find(ob => ob.field === name)
      if (!obj) {
        obj = { field: name, label: '' }
      }
      this.state.originSource.fields.push(obj)
    })

    this.setState({
      originSource: this.state.originSource,
    })
  }

  onEditFieldName(e) {
    let value = e.target.value
    let field = e.target.dataset.field
    this.state.originSource.fields.map((item) => {
      if (item.field == field) {
        item.label = value
      }
    })
    this.setState({
      originSource: this.state.originSource
    })
  }

  onCancelEdit() {
    this.props.setVisible(false)
    this.setState({
      hostStatus: '',
      hostError: '',
    })
  }

  onSaveChange(key) {
    let data = this.state.originSource
    this.props.dispatch({ type: 'singleSource/updateChoosedSource', payload: { id: data._id, data: data } })
    this.props.setVisible(false)
    this.setState({
      hostStatus: '',
      hostError: '',
    })
  }

  render() {
    const { singleSource } = this.props.singleSource
    const { originSource, hostStatus, hostError } = this.state

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      className: styles.formItem
    }
    const formItemLayoutSelect = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
      className: styles.formItem
    }

    //修改数据源
    let editForm = (
      <Form horizonal='true' >
        <FormItem {...formItemLayout} label='名称:'>
          <p>{originSource.name}</p>
        </FormItem>
        {/* <FormItem {...formItemLayout} label='主机:'>
          <Input onChange={(e) => this.onEditHost(e.target.value)} value={originSource.host} />
        </FormItem> */}
        <FormItem {...formItemLayout} label='主机:' validateStatus={hostStatus} help={hostError}>
          <Col span={19}>
            <Input onChange={e => this.onEditHost(e.target.value)} value={originSource.host} />
          </Col>
          <Col span={5} className={styles.connect}>
            <Button type="primary" loading={hostStatus === 'validating'} onClick={() => this.onEditHostFinish()}>连接</Button>
          </Col>
        </FormItem>
        <FormItem {...formItemLayout} label='索引:'>
          <AutoComplete
            dataSource={this.state.allIndexs}
            placeholder={hostStatus !== 'success' ? '请连接主机' : '请输入'}
            onChange={(value) => { this.onEditIndex(value) }}
            value={originSource.index}
            disabled={hostStatus !== 'success'}
          />
        </FormItem>
        <FormItem {...formItemLayout} label='时间:'>
          <Select style={{ width: '100%' }} value={originSource.timestamp}>
          </Select>
        </FormItem>
        <FormItem {...formItemLayout} label='字段选择:'>
          <Select
            mode="tags"
            placeholder={hostStatus !== 'success' ? '请连接主机' : '请选择'}
            style={{ width: '100%' }}
            onChange={value => this.onEditKey(value)}
            onFocus={() => this.onGetAllKey()}
            value={originSource.allfields}
            disabled={hostStatus !== 'success'}
          >
            {
              this.state.allFields && this.state.allFields.map((field, key) => {
                return <Option value={field} key={key}>{field}</Option>
              })
            }
          </Select>
        </FormItem>
        {originSource.fields && originSource.fields.map((item, key) => (
          <Row key={key}>
            <Col span="11" offset="2" >
              <FormItem {...formItemLayoutSelect} label='字段'  >
                <Input value={item.field} disabled />
              </FormItem>
            </Col>
            <Col span="11">
              <FormItem {...formItemLayoutSelect} label='名称' >
                <Input data-field={item.field} onChange={(e) => this.onEditFieldName(e)} value={item.label} />
              </FormItem>
            </Col>
          </Row>
        ))}
      </Form>
    )

    return (
      <div>
        <Modal
          title="修改"
          visible={this.state.visibleEdit}
          onOk={this.onSaveChange.bind(this)}
          onCancel={this.onCancelEdit.bind(this)}
          okText="保存"
          cancelText="取消"
        >
          {editForm}
        </Modal>
      </div>
    )
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      visibleEdit: nextProps.visible,
      originSource: nextProps.singleSource.singleSource,
    })
  }
}

export default connect((state) => { return ({ singleSource: state.singleSource }) })(EditForm)
