import React from 'react'
import { DS_CONFIG, ALERT_CONFIG } from 'services/consts'
import { Row, Col, Select, Input, Radio, Button, Modal, Form, AutoComplete } from 'antd'
import { connect } from 'dva'
import values from 'lodash/values'
import uniqBy from 'lodash/uniqBy'
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
      allIndexs: [],
      indices: [],
      allFields: [],
      allTimeFields: [],
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
    if (this.isHostLoaded) {
      return
    }
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
        this.isHostLoaded = true
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
    this.state.xfields = {}
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
    this.onGetAllKey()
  }

  onGetAllKey () {
    let { addData, allFields, allTimeFields } = this.state

    allFields.length = 0
    allTimeFields.length = 0
    if (addData.index) {
      this.client.indices.get({
        index: addData.index,
        flatSettings: true,
        ignoreUnavailable: true,
      }).then((result) => {
        allFields = uniqBy(getMappings(result), 'field')
        allTimeFields = allFields.filter(mapping => mapping.type === 'date')

        if (allTimeFields.length) {
          addData.timestamp = allTimeFields[0].field
        }
        this.setState({
          allFields,
          allTimeFields,
          addData: this.state.addData,
        })
      })
    } else {
      this.state.addData.allfields = []
      this.state.addData.fields = []
      this.setState({
        allFields,
        allTimeFields,
        addData: this.state.addData,
      })
    }
  }

  onTimeChange = (e) => {
    this.state.addData.timestamp = e.trim()
    this.setState({
      addData: this.state.addData,
    })
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
      default:
      case 'normal':
        this.state.addData.type = DS_CONFIG
        break
      case 'alert':
        this.state.addData.type = ALERT_CONFIG
        break
    }
    this.setState({
      addData: this.state.addData,
    })

    this.props.dispatch({ type: 'singleSource/addSingleSource', payload: this.state.addData })
    this.props.setVisible(false)
  }

  onCancel () {
    this.props.setVisible(false)
  }

  render () {
    const { addData, hostStatus, dsType } = this.state

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
          <RadioGroup onChange={(e) => { this.setState({ dsType: e.target.value }) }} value={dsType}>
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
        <FormItem {...formItemLayout} label="时间:">
          <Select
            style={{ width: '100%' }}
            onChange={this.onTimeChange}
            value={addData.timestamp}
          >
            {this.state.allTimeFields.map((field, key) => {
              return <Option value={field.field} key={key}>{field.field}</Option>
            })}
          </Select>
        </FormItem>
        {/* {this.state.dsType === 'normal' && */}
        <FormItem {...formItemLayout} label="字段选择:">
          <Select
            mode="tags"
            placeholder={hostStatus !== 'success' ? '请连接主机' : '请选择'}
            style={{ width: '100%' }}
            onChange={value => this.onAddKey(value)}
            value={addData.allfields}
            disabled={hostStatus !== 'success'}
          >
            {this.state.allFields && this.state.allFields.map((field, key) => {
              return <Option value={field.field} key={key}>{field.field}</Option>
            })}
          </Select>
        </FormItem>
        {/* } */}

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
          visible
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
}

export default connect((state) => { return ({ singleSource: state.singleSource }) })(AddForm)
