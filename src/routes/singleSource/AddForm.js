import React from 'react'
import { DS_CONFIG, ALERT_CONFIG } from 'services/consts'
import { Row, Col, Select, Input, Radio, Button, Modal, Form, AutoComplete } from 'antd'
import { connect } from 'dva'
import values from 'lodash/values'
import getMappings from 'utils/fields'
import styles from './index.less'
import { esClient } from '../../utils/esclient'

const { Option } = Select
const FormItem = Form.Item
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

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
      xfields: {},
      dsType: 'normal',
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
    this.setState({
      hostStatus: 'validating',
    })

    this.client = esClient
    this.client.ping().then(() => {
      this.client.cat.indices({
        format: 'json',
        h: 'index',
      }).then((result) => {
        this.setState({
          hostStatus: 'success',
          indices: result.map(data => data.index),
        })
      })
    }).catch(() => {
      this.setState({
        hostStatus: 'error',
      })
    })

    return true
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
    const originField = this.state.allFields.find(f => f.field === field)

    this.state.xfields[field] = Object.assign({ label: value }, originField)
  }

  onSave () {
    let field = values(this.state.xfields)

    this.state.addData.fields = field
    switch (this.state.dsType) {
      case 'normal':
        this.state.addData.type = DS_CONFIG
        break
      case 'alert':
        this.state.addData.type = ALERT_CONFIG
        break
      default:
        this.state.addData.type = DS_CONFIG
    }
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
    })
  }

  render () {
    const { addData, hostStatus } = this.state

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      className: styles.formItem,
    }
    const formItemLayoutSelect = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
      className: styles.formItem,
    }

    let antdFormAdd = (
      <Form horizonal="true">
        <FormItem {...formItemLayout} label="名称:">
          <Input onChange={e => this.onAddName(e.target.value)} value={addData.name} />
        </FormItem>
        <FormItem {...formItemLayout} label="类别:">
          <RadioGroup onChange={(e) => { this.setState({ dsType: e.target.value }) }} defaultValue="normal">
            <RadioButton value="normal">普通</RadioButton>
            <RadioButton value="alert">告警</RadioButton>
          </RadioGroup>
        </FormItem>

        <FormItem {...formItemLayout} label="索引:">
          <Col span={19}>
            <AutoComplete
              dataSource={this.state.allIndexs}
              placeholder={hostStatus !== 'success' ? '请加载数据' : '请输入'}
              onChange={(value) => { this.onAddIndex(value) }}
              value={addData.index}
              disabled={hostStatus !== 'success'}
            />
          </Col>
          <Col span={5} className={styles.connect}>
            <Button type="primary" loading={hostStatus === 'validating'} onClick={() => this.onAddHostFinish()}>加载</Button>
          </Col>
        </FormItem>
        {this.state.dsType === 'normal' &&
          <div>
            <FormItem {...formItemLayout} label="时间:">
              <Select style={{ width: '100%' }} value={addData.timestamp} />
            </FormItem>
            <FormItem {...formItemLayout} label="字段选择:">
              <Select
                mode="tags"
                placeholder={hostStatus !== 'success' ? '请连接主机' : '请选择'}
                style={{ width: '100%' }}
                onChange={value => this.onAddKey(value)}
                onFocus={() => this.onGetAllKey()}
                value={addData.allfields}
                disabled={hostStatus !== 'success'}
              >
                {this.state.allFields && this.state.allFields.map((field, key) => {
                  return <Option value={field.field} key={key}>{field.field}</Option>
                })}
              </Select>
            </FormItem>
          </div>
        }

        {addData.allfields && addData.allfields.map((field, key) => (
          <Row key={key}>
            <Col span="12" >
              <FormItem {...formItemLayoutSelect} label="字段">
                <Input value={field} disabled />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem {...formItemLayoutSelect} label="名称">
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
