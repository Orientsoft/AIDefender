import React from 'react'
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

class DataSourceItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: props.visible,
      visibleEdit: false,
      allIndexs: [],
      indices: [],
      allFields: [],
      addData: {
        type: 'singleSource',
        name: '',
        host: '',
        index: '',
        fields: [],
        timestamp: '@timestamp',
        allfields: [],
      },
      originSource: props.singleSource.singleSource,
      xfields: {},
    }
  }

  componentWillMount () {
    this.props.dispatch({ type: 'singleSource/querySingleSource', payload: { type: 'singleSource', } })
  }
  // 添加数据
  onAddName (value) {
    this.state.addData.name = value
    this.setState({
      addData: this.state.addData
    })
  }
  onAddHost (value) {
    this.state.addData.host = value
    this.client = new elasticsearch.Client({
      host: value,
    })

    this.setState({
      addData: this.state.addData,
    })
    this.client.ping().then(() => {
      this.client.cat.indices({
        format: 'json',
        h: 'index',
      }).then((result) => {
        this.setState({
          indices: result.map(data => data.index),
        })
      })
    }).catch(e => console.log(e.message))
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
      allIndexs: arr,
    })
  }
  ongetAllKey () {
    const { index } = this.state.addData
    if (index) {
      this.client.indices.get({
        index,
        flatSettings: true,
        ignoreUnavailable: true,
      }).then((result) => {
        const mappings = []

        forEach(result[index].mappings, (value) => {
          mappings.push(getMappings(value))
        })
        this.setState({
          allFields: flatten(mappings),
        })
      })
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
        type: 'singleSource',
        name: '',
        host: '',
        index: '',
        fields: [],
        timestamp: '@timestamp',
        allfields: [],
      },
      xfields: {},
    })
  }
  onCancel () {
    this.props.setVisible(false)
    this.setState({
      addData: {
        type: 'singleSource',
        structure: [],
        name: '',
        host: '',
        index: '',
        fields: [],
        timestamp: '@timestamp',
        allfields: [],
      },
      xfields: {},
    })
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
    this.setState({
      visibleEdit: false
    })
  }
  onSaveChange(key) {
    let data = this.state.originSource
    this.props.dispatch({ type: 'singleSource/updateChoosedSource', payload: { id: data._id, data: data } })
    this.props.dispatch({ type: 'singleSource/querySingleSource', payload: { type: "singleSource", structure: [] } })
    this.setState({
      visibleEdit: false
    })
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
    // 添加数据源
    let antdFormAdd = (
      <Form horizonal='true'>
        <FormItem {...formItemLayout} label='名称:'>
          <Input onChange={(e) => this.onAddName(e.target.value)} value={addData.name} />
        </FormItem>
        <FormItem {...formItemLayout} label='主机:'>
          <Input onChange={(e) => this.onAddHost(e.target.value)} value={addData.host} />
        </FormItem>
        <FormItem {...formItemLayout} label='索引:'>
          <AutoComplete
            dataSource={this.state.allIndexs}
            onChange={(value) => { this.onAddIndex(value) }}
            value={addData.index}
          />
        </FormItem>
        <FormItem {...formItemLayout} label='时间:'>
          <Select style={{ width: '100%' }} value={addData.timestamp}>
          </Select>
        </FormItem>
        <FormItem {...formItemLayout} label='字段选择'>
          <Select
            mode="tags"
            placeholder="Please select"
            style={{ width: '100%' }}
            onChange={(value) => this.onAddKey(value)}
            onFocus={() => this.ongetAllKey()}
            value={addData.allfields}
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
            <Col span="11" offset="2" >
              <FormItem {...formItemLayoutSelect} label='字段'  >
                <Input value={field} disabled />
              </FormItem>
            </Col>
            <Col span="11">
              <FormItem {...formItemLayoutSelect} label='名称' >
                <Input data-field={field} onChange={(e) => this.onAddfieldName(e)} />
              </FormItem>
            </Col>
          </Row>
        ))}
      </Form>
    )
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
          title="添加"
          visible={this.state.visible}
          onOk={this.onSave.bind(this)}
          onCancel={this.onCancel.bind(this)}
          okText="保存"
          cancelText="取消"
        >
          {antdFormAdd}
        </Modal>
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
        <Row gutter={5} className={styles.sourceContent}>
          <Col span={3} className="gutter-row">主机:</Col>
          <Col span={4} className="gutter-row">索引:</Col>
          <Col span={3} className="gutter-row">时间:</Col>
          <Col span={8} className="gutter-row">字段:</Col>
          <Col span={2} className="gutter-row">名称:</Col>
        </Row>
        <div>
          {allSingleSource && allSingleSource.map((item, key) => {
            return (<Row gutter={5} key={key}>
              <Col span={3} className="gutter-row">
                <Input value={item.host} disabled key={key} />
              </Col>
              <Col span={4} className="gutter-row">
                <Input value={item.index} disabled key={key} />
              </Col>
              <Col span={3} className="gutter-row">
                <Input value={item.timestamp} disabled key={key} />
              </Col>
              <Col span={8} className="gutter-row">
                <Select
                  mode="tags"
                  value={item.fields.map(e => `${e.field}=${e.label}`)}
                  style={{ width: '100%' }}
                  disabled
                  key={key}
                />
              </Col>
              <Col span={2} className="gutter-row">
                <Input value={item.name} disabled key={key} />
              </Col>
              <Col span={4} className="gutter-row">
                <Button onClick={() => this.onEditSource(key, item._id)} >编辑</Button>
                <Button onClick={() => this.onDeleteSource(key, item._id)}>删除</Button>
              </Col>
            </Row>)
          })}
        </div>
      </div>
    )
  }

  onDeleteSource (key, id) {
    this.props.dispatch({ type: 'singleSource/delChoosedSource', payload: { id } })
  }
  onEditSource (key, id) {
    this.props.dispatch({ type: 'singleSource/queryChoosedSource', payload: { id } })
    this.setState({
      visibleEdit: true,
    })
  }
  componentWillReceiveProps (nextProps) {
    this.setState({
      visible: nextProps.visible,
      originSource: nextProps.singleSource.singleSource,
      // allFields:nextProps.singleSource.fields,
    })
  }
}

export default connect((state) => { return ({ singleSource: state.singleSource }) })(DataSourceItem)
