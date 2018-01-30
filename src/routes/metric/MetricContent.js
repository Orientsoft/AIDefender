import React from 'react'
import { Row, Col, Select, Input, Button, Modal, Form } from 'antd'
import get from 'lodash/get'
import { connect } from 'dva';
import cloneDeep from 'lodash/cloneDeep'
import values from 'lodash/values'
import styles from './index.less'


const Option = Select.Option
const confirm = Modal.confirm
const FormItem = Form.Item

class MetricContent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: this.props.visible,
      visibleEdit: false,
      addData: {
        type: 'metrics',
        structure: [],
        name: '',
        source: '',
        filters: [],
        chart: {
          title: '',
          type: '',
          x: {
            field: '',
            label: ''
          },
          values: []
        },
      },
      keys: [],
      valuesFilter: {
        field: '',
        operator: '',
        value: ''
      },
      valuesY: {
        field: '',
        operator: '',  
        label: ''
      },
    }
  }
  componentWillMount() {
    this.props.dispatch({ type: 'singleSource/querySingleSource', payload: { type: "singleSource", structure: [] } })
    this.props.dispatch({ type: 'metric/queryMetrics', payload: { type: "metrics", structure: [] } })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible,
    })
  }

  onAddSource(value) {
    this.state.addData.filters = []
    this.state.keys = []
    this.state.addData.source = value
    let choosedsource = this.props.singleSource.allSingleSource.filter((item) => {
      return item.name == value
    })
    this.setState({
      addData: this.state.addData,
      keys: choosedsource[0].fields
    })
  }

  onAddName(value) {
    this.state.addData.name = value
    this.setState({
      addData: this.state.addData
    })
  }
  onfieldNameChange(e) {

  }
  onAddType(value) {
    this.state.addData.chart.type = value
    this.setState({
      addData: this.state.addData
    })
  }
  onAddTitle(value) {
    this.state.addData.chart.title = value
    this.setState({
      addData: this.state.addData
    })
  }
  onAddKey(value) {
    this.state.valuesFilter.field = value
    this.setState({
      addData: this.state.addData
    })
  }
  onAddOperator(value) {
    this.state.valuesFilter.operator = value
    this.setState({
      addData: this.state.addData
    })
  }
  onAddValue(value) {
    this.state.valuesFilter.value = value
    this.setState({
      addData: this.state.addData
    })
  }
  //
  onAddFilters() {
    this.state.addData.filters.push(this.state.valuesFilter)
    this.setState({
      addData: this.state.addData
    })
    this.state.valuesFilter = {
      field: '',
      operator: '',
      value: ''
    }
  }
  onAddTitleX(value) {
    this.state.addData.chart.x.label = value
    this.setState({
      addData: this.state.addData
    })

  }
  onAddYaxis(value) {
    this.state.valuesY.field = value
    this.setState({
      addData: this.state.addData
    })
  }
  onAddOperationY(value) {
    this.state.valuesY.operator = value
    this.setState({
      addData: this.state.addData
    })
  }
  onAddTitleY(value) {
    this.state.valuesY.label = value
    this.setState({
      addData: this.state.addData
    })
  }
  onAddYValues(){
    this.state.addData.chart.values.push(this.state.valuesY)
    this.setState({
      addData: this.state.addData
    })
    this.state.valuesY = {
      field: '',
      operator: '',  
      label: ''
    }
  }
  

  onSave(e) {
    this.props.setVisible(false)
  }
  onCancel() {
    this.props.setVisible(false)
  }

  // 修改
  onSourceEdit(key) {

  }

  onfieldNameEdit(e) {

  }
  onTypeEdit(e) {

  }
  onTitleEdit(e) {

  }
  onYaxisEdit(e) {

  }
  onTitleYEdit(e) {

  }
  onTitleXEdit(e) {

  }

  onSaveChange() {
    this.setState({
      visibleEdit: false,
    })
  }
  onCancelChange() {
    this.setState({
      visibleEdit: false,
    })
  }

  onEditSource(key, name) {
    this.setState({
      visibleEdit: true,
    })

    // this.source = this.state.sources[key];
  }

  onDeleteSource(key, name) {

  }

  render() {
    const { addData, keys } = this.state
    const { allSingleSource } = this.props.singleSource
    console.log('all',this.props)
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
        <Input onChange={e => this.onAddName(e.target.value)} value={addData.name} />
      </FormItem>
      <FormItem {...formItemLayout} label="数据源：">
        <Select style={{ width: '100%' }} onChange={value => this.onAddSource(value)} value={addData.source}>
          {allSingleSource && allSingleSource.map((source, key) => <Option key={key} value={source.name}>{source.name}</Option>)}
        </Select>
      </FormItem>
      <FormItem {...formItemLayout} label="条件：">
        <Row>
          <Col span="7" >
            <Select style={{ width: '100%' }} onChange={value => this.onAddKey(value)}>
              {keys && keys.map((item, key) => {
                return <Option key={key} value={item.field}>{item.label}</Option>
              })}
            </Select>
          </Col>
          <Col span="5" offset="1" >
            <Select style={{ width: '100%' }} onChange={value => this.onAddOperator(value)}>
              <Option value=">" key="gt"> &gt; </Option>
              <Option value="<" key="lt"> &lt; </Option>
              <Option value="=" key="eq"> = </Option>
            </Select>
          </Col>
          <Col span="6" offset="1">
            <Input onChange={e => this.onAddValue(e.target.value)} />
          </Col>
          <Col span="1" offset="1">
            <Button onClick={() => this.onAddFilters()}>确定</Button>
          </Col>
        </Row>
      </FormItem>
      <FormItem {...formItemLayout} label="所有条件：">
        <Select
          mode="tags"
          style={{ width: '100%' }}
          value={addData.filters.map((item) => {
            return item.field + item.operator + item.value
          })}
        // onChange={(value) => this.onAddKey(value)}  
        >
        </Select>
      </FormItem>
      <h4>图表选项</h4>
      <FormItem {...formItemLayout} label="类型：">
        <Select style={{ width: '100%' }} onChange={value => this.onAddType(value)} value={addData.chart.type}>
          <Option value="bar" key="bar">柱状图</Option>
          <Option value="line" key="line">折线图</Option>
        </Select>
      </FormItem>
      <FormItem {...formItemLayout} label="标题：">
        <Input onChange={e => this.onAddTitle(e.target.value)} value={addData.chart.title} />
      </FormItem>
      <Row >
        <Col span="11" offset="2" >
          <FormItem {...formItemLayoutSelect} label="X轴：" >
            <Select style={{ width: '100%' }} disabled value={addData.chart.x.field} />
          </FormItem>
        </Col>
        <Col span="11">
          <FormItem {...formItemLayoutSelect} label="标题：" >
            <Input onChange={e => this.onAddTitleX(e.target.value)} value={addData.chart.x.label} />
          </FormItem>
        </Col>
      </Row>
      <Row >

        <FormItem {...formItemLayout} label="Y轴：">
          <Row>
            <Col span="7" >
              <Select style={{ width: '100%' }} onChange={value => this.onAddYaxis(value)} >
                {keys && keys.map((item, key) => {
                  return <Option key={key} value={item.field}>{item.label}</Option>
                })}
              </Select>
            </Col>
            <Col span="5" offset="1" >
              <Select style={{ width: '100%' }} onChange={value => this.onAddOperationY(value)} >
                <Option value="gt" key="gt"> count </Option>
                <Option value="lt" key="lt"> sum </Option>
                <Option value="avg" key="avg"> avg </Option>
                <Option value="max" key="max"> max </Option>
                <Option value="min" key="min"> min </Option>
              </Select>
            </Col>
            <Col span="6" offset="1">
              <Input onChange={e => this.onAddTitleY(e.target.value)} />
            </Col>
            <Col span="1" offset="1">
              <Button onClick={ () => this.onAddYValues()}>确定</Button>
            </Col>
          </Row>
        </FormItem>
      </Row>
      <FormItem {...formItemLayout} label="all">
        <Select
          mode="tags"
          style={{ width: '100%' }}
          value = { addData.chart.values.map( (item) =>{
            return item.field + "-->" + item.operator +  "-->" + item.label
          })}
        // onChange={(value) => this.onAddKey(value)}  
        >
          {/* {
                        fields && fields.map((field, key) => {
                            return <Option value={field} key={key}>{field}</Option>
                        })
                    } */}
        </Select>
      </FormItem>
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
          width='60%'
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
          onCancel={this.onCancelChange.bind(this)}
          okText="保存"
          cancelText="取消"
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
          <Col span={4} className="gutter-row">Y轴:</Col>         
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

// export default MetricContent
export default connect((state) => {
  return (
    {
      singleSource: state.singleSource,
      metrics:state.metric
    }
  )
})(MetricContent)

