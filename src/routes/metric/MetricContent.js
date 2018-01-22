import React from 'react'
import { Row, Col, Select, Input, Button, Modal, Form } from 'antd'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import values from 'lodash/values'
import styles from './index.less'


const Option = Select.Option
const confirm = Modal.confirm
const FormItem = Form.Item

class MetricContent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: this.props.visible,
      visibleEdit: false,
    }
  }
  componentWillMount () {

  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      visible: nextProps.visible,
    })
  }

  onSourceChanged (key) {

  }

  onNameChange (e) {

  }
  onfieldNameChange (e) {

  }
  onTypeChange (e) {

  }
  onTitleChange (e) {

  }
  onYaxisChange (e) {

  }
  onTitleYChange (e) {

  }
  onTitleXChange (e) {

  }
  onSave (e) {
    this.props.setVisible(false)
  }
  onCancel () {
    this.props.setVisible(false)
  }

  // 修改
  onSourceEdit (key) {

  }

  onfieldNameEdit (e) {

  }
  onTypeEdit (e) {

  }
  onTitleEdit (e) {

  }
  onYaxisEdit (e) {

  }
  onTitleYEdit (e) {

  }
  onTitleXEdit (e) {

  }

  onSaveChange () {
    this.setState({
      visibleEdit: false,
    })
  }
  onCancelChange () {
    this.setState({
      visibleEdit: false,
    })
  }

  onEditSource (key, name) {
    this.setState({
      visibleEdit: true,
    })

    // this.source = this.state.sources[key];
  }

  onDeleteSource (key, name) {

  }

  render () {
    const { sources = [] } = this.state
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      className: styles.FormItem,
    }
    const formItemLayoutSelect = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
      className: styles.FormItem,
    }
    let antdFormAdd = (<Form horizonal="true">
      <h4>指标选项</h4>
      <FormItem {...formItemLayout} label="指标名：">
        <Input onChange={e => this.onNameChange(e.target.value)} />
      </FormItem>
      <FormItem {...formItemLayout} label="数据源：">
        <Select style={{ width: '100%' }} onChange={value => this.onSourceChanged(value)}>
          {/* {this.state.sources && this.state.sources.map((source, key) => <Option key={key} value={key}>{source.name}</Option>)} */}
        </Select>
      </FormItem>
      <FormItem {...formItemLayout} label="条件：">
        <Row>
          <Col span="10" >
            <Select style={{ width: '100%' }} />
          </Col>
          <Col span="5" offset="1" >
            <Select style={{ width: '100%' }}>
              <Option value="gt" key="gt"> &gt; </Option>
              <Option value="lt" key="lt"> &lt; </Option>
              <Option value="eq" key="eq"> = </Option>
            </Select>
          </Col>
          <Col span="7" offset="1">
            <Input />
          </Col>
        </Row>
      </FormItem>
      {/* {this.fields.map((item, key) => (
                <Row key={key}>
                    <Col span="11" offset="2" >
                        <FormItem {...formItemLayoutSelect} label='字段:'  >
                            <Input value={item.field} disabled />
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem {...formItemLayoutSelect} label='值：' >
                            <Input data-field={item.field} onChange={(e) => this.onfieldNameChange(e)} />
                        </FormItem>
                    </Col>
                </Row>
            ))} */}
      <h4>图表选项</h4>
      <FormItem {...formItemLayout} label="类型：">
        <Select style={{ width: '100%' }} onChange={value => this.onTypeChange(value)}>
          <Option value="bar" key="bar">柱状图</Option>
          <Option value="line" key="line">折线图</Option>
        </Select>
      </FormItem>
      <FormItem {...formItemLayout} label="标题：">
        <Input onChange={e => this.onTitleChange(e.target.value)} />
      </FormItem>
      <Row >
        <Col span="11" offset="2" >
          <FormItem {...formItemLayoutSelect} label="X轴：" >
            <Select style={{ width: '100%' }} disabled />
          </FormItem>
        </Col>
        <Col span="11">
          <FormItem {...formItemLayoutSelect} label="标题：" >
            <Input onChange={e => this.onTitleXChange(e)} />
          </FormItem>
        </Col>
      </Row>
      <Row >
        <Col span="11" offset="2" >
          <FormItem {...formItemLayoutSelect} label="Y轴：" >
            <Select style={{ width: '100%' }} onChange={value => this.onYaxisChange(value)}>
              {/* {get(this.source, 'field', []).map((field, key) => {
                                return <Option value={field} key={key}>{field}</Option>
                            }
                            )} */}
            </Select>
          </FormItem>
        </Col>
        <Col span="11">
          <FormItem {...formItemLayoutSelect} label="标题：" >
            <Input onChange={e => this.onTitleYChange(e.target.value)} />
          </FormItem>
        </Col>
      </Row>
    </Form>)

    let antdFormEdit = (<Form horizonal="true">
      <h4>指标选项</h4>
      <FormItem {...formItemLayout} label="指标名:">
        <Input disabled />
      </FormItem>
      <FormItem {...formItemLayout} label="数据源:">
        <Select style={{ width: '100%' }} onChange={value => this.onSourceEdit(value)}>
          {/* {this.state.sources && this.state.sources.map((source, key) => <Option key={key} value={key}>{source.name}</Option>)} */}
        </Select>
      </FormItem>
      {/* {this.data.fields.map((item, key) => (
                <Row key={key}>
                    <Col span="11" offset="2" >
                        <FormItem {...formItemLayoutSelect} label='字段:'  >
                            <Input value={item.field} disabled />
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem {...formItemLayoutSelect} label='值:' >
                            <Input data-field={item.field} onChange={(e) => this.onfieldNameEdit(e)} value={item.value} />
                        </FormItem>
                    </Col>
                </Row>
            ))} */}
      <h4>图表选项</h4>
      <FormItem {...formItemLayout} label="类型:">
        <Select style={{ width: '100%' }} onChange={value => this.onTypeEdit(value)}>
          <Option value="bar" key="bar">bar</Option>
          <Option value="line" key="line">line</Option>
        </Select>
      </FormItem>
      <FormItem {...formItemLayout} label="标题:">
        <Input onChange={e => this.onTitleEdit(e.target.value)} />
      </FormItem>
      <Row >
        <Col span="11" offset="2" >
          <FormItem {...formItemLayoutSelect} label="X轴:" >
            <Select style={{ width: '100%' }} disabled />
          </FormItem>
        </Col>
        <Col span="11">
          <FormItem {...formItemLayoutSelect} label="标题:" >
            <Input data-xaxis={get(this.source, 'time', '@timestamp')} onChange={e => this.onTitleXChange(e)} />
          </FormItem>
        </Col>
      </Row>
      <Row >
        <Col span="11" offset="2" >
          <FormItem {...formItemLayoutSelect} label="Y轴:" >
            <Select style={{ width: '100%' }} onChange={value => this.onYaxisChange(value)}>
              {/* {get(this.source, 'field', []).map((field, key) => {
                                return <Option value={field} key={key}>{field}</Option>
                            }
                            )} */}
            </Select>
          </FormItem>
        </Col>
        <Col span="11">
          <FormItem {...formItemLayoutSelect} label="标题:" >
            <Input onChange={e => this.onTitleYChange(e.target.value)} />
          </FormItem>
        </Col>
      </Row>
    </Form>)

    return (
      <div>
        <Modal
          title="add"
          visible={this.state.visible}
          onOk={this.onSave.bind(this)}
          onCancel={this.onCancel.bind(this)}
        >
          {antdFormAdd}
        </Modal>
        <Modal
          title="edit"
          visible={this.state.visibleEdit}
          onOk={this.onSaveChange.bind(this)}
          onCancel={this.onCancelChange.bind(this)}
        >
          {antdFormEdit}
        </Modal>
        <Row gutter={5} className={styles.metricContent}>
          <Col span={2} className="gutter-row">指标名:</Col>
          <Col span={2} className="gutter-row">数据源:</Col>
          <Col span={4} className="gutter-row">条件:</Col>
          <Col span={2} className="gutter-row">图表类型:</Col>
          <Col span={2} className="gutter-row">标题:</Col>
          <Col span={2} className="gutter-row">X轴字段:</Col>
          <Col span={2} className="gutter-row">X轴标题:</Col>
          <Col span={2} className="gutter-row">Y轴字段:</Col>
          <Col span={2} className="gutter-row">Y轴标题:</Col>
        </Row>
        <div className="contentManager">
          {/* {this.dataSource.slice().map((item, key) => {
                        return (<Row gutter={5} key={key}>
                            <Col span={2} className="gutter-row">
                                <Input value={item.name} disabled key={key} ></Input>
                            </Col>
                            <Col span={2} className="gutter-row">
                                <Input value={item.source} disabled key={key} ></Input>
                            </Col>
                            <Col span={4} className="gutter-row">
                                <Select
                                    mode="tags"
                                    placeholder="Please select"
                                    value={item.fieldShow ? item.fieldShow.slice() : []}
                                    style={{ width: '100%' }}
                                    disabled
                                >
                                </Select>
                            </Col>
                            <Col span={2} className="gutter-row">
                                <Input value={item.chart ? item.chart.type : ''} disabled key={key} />
                            </Col>
                            <Col span={2} className="gutter-row">
                                <Input value={item.chart ? item.chart.title : ''} disabled key={key} />
                            </Col>
                            <Col span={2} className="gutter-row">
                                <Input value={item.chart ? item.chart.x.field : ''} disabled key={key} />
                            </Col>
                            <Col span={2} className="gutter-row">
                                <Input value={item.chart ? item.chart.x.label : ''} disabled key={key} />
                            </Col>
                            <Col span={2} className="gutter-row">
                                <Input value={item.chart ? item.chart.y.field : ''} disabled key={key} />
                            </Col>
                            <Col span={2} className="gutter-row">
                                <Input value={item.chart ? item.chart.y.label : ''} disabled key={key} />
                            </Col>
                            <Col span={4} className="gutter-row">
                                <Button onClick={() => this.onEditSource(key, item.name)} >编辑</Button>
                                <Button onClick={() => this.onDeleteSource(key, item.name)}>删除</Button>
                            </Col>
                        </Row>)
                    })} */}
        </div>
      </div>
    )
  }
}

export default MetricContent
