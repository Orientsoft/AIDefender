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
  constructor (props) {
    super(props)
    this.state = {
      visibleEdit: props.visible,
      allIndexs: [],
      indices: [],
      allFields: [],
      originSource: props.singleSource.singleSource,
      xfields: {},
    }
  }

  componentWillMount () {
    this.props.dispatch({ type: 'singleSource/querySingleSource', payload: { type: DS_CONFIG, } })
  }
 
  // 修改数据
  onEditIndex (index) {
    this.state.originSource.index = index
    this.state.originSource.allfields = []
    this.state.originSource.fields = []
    this.setState({
      originSource: this.state.originSource,
    })
  }

  onEditHost (value) {
    this.state.originSource.host = value
    this.setState({
      originSource: this.state.originSource,
    })
  }

  ongetKey () {
    this.props.dispatch({ type: 'singleSource/queryFields', payload: { source: this.state.originSource.index } })
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
    // this.setState({
    //   visibleEdit: false
    // })
  }
  onSaveChange(key) {
    let data = this.state.originSource
    this.props.dispatch({ type: 'singleSource/updateChoosedSource', payload: { id: data._id, data: data } })
    // this.setState({
    //   visibleEdit: false
    // })
    this.props.setVisible(false)
  }

  render() {
    const { index, fields, allSingleSource, singleSource } = this.props.singleSource
    const { addData, originSource } = this.state

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
        <FormItem {...formItemLayout} label='主机:'>
          <Input onChange={(e) => this.onEditHost(e.target.value)} value={originSource.host} />
        </FormItem>
        <FormItem {...formItemLayout} label='索引:'>
          <Select style={{ width: '100%' }} onChange={(value) => this.onEditIndex(value)} value={originSource.index}>
            {
              index && index.map((index, key) => {
                return <Option value={index} key={key}>{index}</Option>
              })
            }
          </Select>
        </FormItem>
        <FormItem {...formItemLayout} label='时间:'>
          <Select style={{ width: '100%' }} value={originSource.timestamp}>
          </Select>
        </FormItem>
        <FormItem {...formItemLayout} label='字段选择'>
          <Select
            mode="tags"
            placeholder="Please select"
            value={originSource.allfields}
            // value={originSource.fields && originSource.fields.map((item) => {
            //     return item.field
            // })}
            style={{ width: '100%' }}
            onChange={(value) => this.onEditKey(value)}
            onFocus={() => this.ongetKey()}
          >
            {
              fields && fields.map((field, key) => {
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
  componentWillReceiveProps (nextProps) {
    this.setState({
      visibleEdit: nextProps.visible,
      originSource: nextProps.singleSource.singleSource,
    })
  }
}

export default connect((state) => { return ({ singleSource: state.singleSource }) })(EditForm)
