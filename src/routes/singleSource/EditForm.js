import React from 'react'
import { DS_CONFIG } from 'services/consts'
import { Row, Col, Select, Input, Radio, Button, Modal, Form, AutoComplete, Icon } from 'antd'
import { connect } from 'dva'
import uniqBy from 'lodash/uniqBy'
import getMappings from 'utils/fields'
import styles from './index.less'
import { esClient } from '../../utils/esclient'

const { Option } = Select
const FormItem = Form.Item

class EditForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      allIndexs: [],
      indices: [],
      allFields: [],
      allTimeFields: [],
      originSource: props.singleSource.singleSource,
      xfields: {},
      hostStatus: '',
      hostError: '',
    }
  }

  onEditName (name) {
    this.state.originSource.name = name
    this.setState({
      originSource: this.state.originSource,
    })
  }

  onEditHostFinish () {
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
          hostError: '',
          indices: result.map(data => data.index),
        })
        this.isHostLoaded = true
        // this.onEditIndex(this.state.originSource.index)
      })
    }).catch((e) => {
      this.setState({
        hostStatus: 'error',
        hostError: e.message,
      })
    })
  }

  onEditIndex (value) {
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
    this.onGetAllKey()
  }

  onGetAllKey () {
    let { originSource, allFields, allTimeFields } = this.state

    allFields.length = 0
    allTimeFields.length = 0
    if (originSource.index) {
      this.client.indices.get({
        index: originSource.index,
        flatSettings: true,
        ignoreUnavailable: true,
      }).then((result) => {
        allFields = uniqBy(getMappings(result), 'field')
        allTimeFields = allFields.filter(mapping => mapping.type === 'date')

        if (allTimeFields.length) {
          originSource.timestamp = allTimeFields[0].field
        }
        this.setState({
          allFields,
          allTimeFields,
          originSource: this.state.originSource,
        })
      })
    } else {
      this.state.originSource.allfields = []
      this.state.originSource.fields = []
      this.setState({
        originSource: this.state.originSource,
        allFields: [],
        allTimeFields: [],
      })
    }
  }

  onEditKey (value) {
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

  onEditFieldName (e) {
    const { value, dataset: { field } } = e.target
    this.state.originSource.fields.forEach((item) => {
      if (item.field === field) {
        item.label = value
      }
    })
    this.setState({
      originSource: this.state.originSource,
    })
  }

  onCancelEdit () {
    this.props.setVisible(false)
  }

  onSaveChange (key) {
    let data = this.state.originSource
    this.props.dispatch({ type: 'singleSource/updateChoosedSource', payload: { id: data._id, data } })
    this.props.dispatch({ type: 'app/setDirty', payload: true })
    this.props.setVisible(false)
  }

  render () {
    const { singleSource } = this.props.singleSource
    const { originSource, hostStatus, allTimeFields } = this.state

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
          <Input onChange={e => this.onEditName(e.target.value)} value={originSource.name} />
          {/* <p>{originSource.name}</p> */}
        </FormItem>
        <FormItem {...formItemLayout} label='类别:'>
          <label>{originSource.type === DS_CONFIG ? '普通数据' : '告警数据'}</label>
        </FormItem>
        <FormItem {...formItemLayout} label='索引:'>
          <Col span={19}>
            <AutoComplete
              dataSource={this.state.allIndexs}
              placeholder={hostStatus !== 'success' ? '请连接主机' : '请输入'}
              onChange={(value) => { this.onEditIndex(value) }}
              value={originSource.index}
              disabled={hostStatus !== 'success'}
            />
          </Col>
          <Col span={5} className={styles.connect}>
            <Button type="primary" loading={hostStatus === 'validating'} onClick={() => this.onEditHostFinish()}>加载</Button>
          </Col>
        </FormItem>
        <FormItem {...formItemLayout} label='时间:'>
          <Select style={{ width: '100%' }} value={originSource.timestamp}>
            {allTimeFields.map((field, key) => {
              return <Option value={field.field} key={key}>{field.field}</Option>
            })}
          </Select>
        </FormItem>
        {/* {originSource.type === DS_CONFIG && */}
        <FormItem {...formItemLayout} label='字段选择:'>
          <Select
            mode="tags"
            placeholder={hostStatus !== 'success' ? '请连接主机' : '请选择'}
            style={{ width: '100%' }}
            onChange={value => this.onEditKey(value)}
            value={originSource.allfields}
            disabled={hostStatus !== 'success'}
          >
            {this.state.allFields && this.state.allFields.map((field, key) => {
              return <Option value={field.field} key={key}>{field.field}</Option>
            })}
          </Select>
        </FormItem>
        {/* } */}
        {originSource.fields && originSource.fields.map((item, key) => (
          <Row key={key}>
            <Col span="11" offset="2" >
              <FormItem {...formItemLayoutSelect} label='字段'>
                <Input value={item.field} disabled />
              </FormItem>
            </Col>
            <Col span="11">
              <FormItem {...formItemLayoutSelect} label='名称'>
                <Input data-field={item.field} onChange={e => this.onEditFieldName(e)} value={item.label} />
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
          visible
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

  componentWillReceiveProps (nextProps) {
    this.setState({
      originSource: nextProps.singleSource.singleSource,
    })
  }
}

export default connect((state) => { return ({ singleSource: state.singleSource }) })(EditForm)
