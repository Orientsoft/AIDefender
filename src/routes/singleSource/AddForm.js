import React from 'react'
import { DS_CONFIG, ALERT_CONFIG } from 'services/consts'
import { Row, Col, Select, Input, Radio, Button, Modal, Form, AutoComplete, message } from 'antd'
import { connect } from 'dva'
import get from 'lodash/get'
import values from 'lodash/values'
import uniqBy from 'lodash/uniqBy'
import getMappings from 'utils/fields'
import styles from './index.less'
import { esClient } from '../../utils/esclient'

const { Option } = Select
const FormItem = Form.Item
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

function isAlertIndex (index = '') {
  return /^alter_/.test(index)
}

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
      isAlert: false,
    }
  }

  onAddName (value) {
    this.state.addData.name = value.trim()
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
  }

  onAddIndex (value) {
    const index = value.trim()
    const { addData, indices, isAlert } = this.state

    addData.allfields = []
    addData.fields = []
    addData.index = index
    this.state.xfields = {}
    const allIndexs = []
    let reg = new RegExp(value)
    if (value) {
      for (let idx of indices) {
        if (idx.match(reg)) {
          allIndexs.push(idx)
        }
      }
    }
    if (isAlert) {
      this.client.search({
        index,
        body: {
          query: {
            match_all: {},
          },
          size: 1,
        },
      }).then((res) => {
        const hit = res.hits.hits[0]

        if (hit) {
          this.state.addData.name = get(hit, '_source.name', '')
          this.setState({ addData })
        }
      })
    }
    this.setState({
      allFields: [],
      allIndexs,
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

  onTypeChange = (e) => {
    switch (e) {
      case 'alert':
        this.setState({
          dsType: e,
          isAlert: true,
        })
        break
      default:
        this.setState({
          dsType: e,
          isAlert: false,
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
    Object.keys(this.state.xfields).forEach((key) => {
      if (value.indexOf(key) === -1) {
        delete this.state.xfields[key]
      }
    })
    this.state.addData.allfields = value
    this.setState({
      addData: this.state.addData,
    })
  }

  onAddfieldName (e, field) {
    const { value } = e.target
    const originField = this.state.allFields.find(f => f.field === field)

    this.state.xfields[field] = Object.assign({ label: value }, originField)
  }

  onSave () {
    let fields = values(this.state.xfields)
    const { dispatch, setVisible } = this.props
    const { dsType, addData, allFields } = this.state

    addData.allfields.forEach((name) => {
      const thisField = allFields.find(f => f.field === name)
      const addedField = fields.find(f => f.field === name)
      // 如果存在未命名字段
      if (thisField && !(addedField && addedField.label.trim())) {
        fields.push(Object.assign({
          label: name,
        }, thisField))
      }
    })
    addData.fields = fields

    switch (dsType) {
      default:
      case 'normal':
        addData.type = DS_CONFIG
        break
      case 'alert':
        addData.type = ALERT_CONFIG
        break
    }
    // 如果名字或者索引为空，不保存它
    if (!(addData.index && addData.name)) {
      message.error('数据源名字或索引不能为空')
      return null
    }
    this.setState({ addData }, () => {
      dispatch({ type: 'singleSource/addSingleSource', payload: this.state.addData })
      setVisible(false)
    })
  }

  onCancel () {
    this.props.setVisible(false)
  }

  render () {
    const {
      addData,
      hostStatus,
      dsType,
      isAlert,
      allIndexs,
      indices,
    } = this.state

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
        <FormItem {...formItemLayout} label="名称(必须):">
          <Input
            disabled={isAlert}
            onChange={e => this.onAddName(e.target.value)}
            value={addData.name}
            placeholder="一个以上字符，不包含空格"
          />
        </FormItem>
        <FormItem {...formItemLayout} label="类别:">
          <RadioGroup onChange={e => this.onTypeChange(e.target.value)} value={dsType}>
            <RadioButton value="normal">普通</RadioButton>
            <RadioButton value="alert">告警</RadioButton>
          </RadioGroup>
        </FormItem>

        <FormItem {...formItemLayout} label="索引(必须):">
          <Col span={19}>
            {isAlert ? (
              <Select
                style={{ width: '100%' }}
                onChange={(value) => { this.onAddIndex(value) }}
                placeholder="请加载数据"
                disabled={hostStatus !== 'success'}
              >
                {indices.filter(isAlertIndex).map((index, key) => (
                  <Option key={key} value={index}>{index}</Option>
                ))}
              </Select>
            ) : (
              <AutoComplete
                dataSource={allIndexs}
                placeholder={hostStatus !== 'success' ? '请加载数据' : '输入索引名，可包含通配符'}
                onChange={(value) => { this.onAddIndex(value) }}
                value={addData.index}
                disabled={hostStatus !== 'success'}
              />
            )}
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
              if (field.field !== addData.timestamp) {
                return <Option value={field.field} key={key}>{field.field}</Option>
              }
              return null
            }).filter(f => f)}
          </Select>
        </FormItem>
        {/* } */}

        {addData.allfields && addData.allfields.map(field => (
          <Row key={field}>
            <Col span="12" >
              <FormItem {...formItemLayoutSelect} label="字段">
                <Input value={field} disabled />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem {...formItemLayoutSelect} label="名称">
                <Input onChange={e => this.onAddfieldName(e, field)} />
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
          maskClosable={false}
          onOk={this.onSave.bind(this)}
          onCancel={this.onCancel.bind(this)}
          okText="保存"
          cancelText="取消"
          wrapClassName="vertical-center-modal"
          bodyStyle={{ height: 480, overflow: 'scroll' }}
        >
          {antdFormAdd}
        </Modal>
      </div>
    )
  }
}

export default connect((state) => { return ({ singleSource: state.singleSource }) })(AddForm)
