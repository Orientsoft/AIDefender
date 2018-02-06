import React from 'react'
import { DS_CONFIG, KPI_CONFIG } from 'services/consts'
import { Row, Col, Select, Input, Button, Modal, Form } from 'antd'
import get from 'lodash/get'
import { connect } from 'dva'
import styles from './index.less'

const { Option } = Select
const { confirm } = Modal
const FormItem = Form.Item

class EditForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      visibleEdit: props.visible,
      keys: [],
      valuesFilter: {
        field: '',
        operator: '',
        value: '',
      },
      valuesY: {
        field: '',
        operator: '',
        label: '',
      },
      // originMetric: props.metrics.choosedMetric,
      originMetric: {
        name: '',
        source: '',
        filters: [],
        chart: {
          title: '',
          type: '',
          x: {
            field: '@timestamp',
            label: '',
          },
          values: [],
        },
      },
    }
  }

  onSourceEdit(value) {
    this.state.originMetric.filters = []
    this.state.keys = []
    this.state.originMetric.chart.values = []
    this.state.originMetric.source = value
    this.setState({
      originMetric: this.state.originMetric,
    })
  }

  onGetKey() {
    let choosedsource = this.props.singleSource.allSingleSource.filter((item) => {
      return item.name === this.state.originMetric.source
    })
    this.setState({
      keys: choosedsource[0].fields,
    })
  }

  onEditKey(value) {
    this.state.valuesFilter.field = value[0]
    this.state.valuesFilter.fieldChinese = value[1]
    this.setState({
      valuesFilter: this.state.valuesFilter,
    })
  }
  onEditOperator(value) {
    this.state.valuesFilter.operator = value
    this.setState({
      valuesFilter: this.state.valuesFilter,
    })
  }

  onEditValue(value) {
    this.state.valuesFilter.value = value
    this.setState({
      valuesFilter: this.state.valuesFilter,
    })
  }

  onEditFilters() {
    this.state.originMetric.filters.push(this.state.valuesFilter)
    this.setState({
      originMetric: this.state.originMetric,
    })
    this.state.valuesFilter = {
      field: '',
      operator: '',
      value: '',
    }
  }

  onDeleteFilters(value) {
    this.state.originMetric.filters = value
    this.setState({
      originMetric: this.state.originMetric,
    })
  }

  onTypeEdit(e) {
    this.state.originMetric.chart.type = e
    this.setState({
      originMetric: this.state.originMetric,
    })
  }
  onTitleEdit(e) {
    this.state.originMetric.chart.title = e
    this.setState({
      originMetric: this.state.originMetric,
    })
  }

  onTitleXChange(e) {
    this.state.originMetric.chart.x.label = e
    this.setState({
      originMetric: this.state.originMetric,
    })
  }

  onAddYaxis(value) {
    this.state.valuesY.field = value[0]
    this.state.valuesY.fieldChinese = value[1]
    this.setState({
      originMetric: this.state.originMetric,
    })
  }

  onAddOperationY(value) {
    this.state.valuesY.operator = value
    this.setState({
      originMetric: this.state.originMetric,
    })
  }

  onAddTitleY(value) {
    this.state.valuesY.label = value
    this.setState({
      originMetric: this.state.originMetric,
    })
  }

  onAddYValues() {
    this.state.originMetric.chart.values.push(this.state.valuesY)
    this.setState({
      originMetric: this.state.originMetric,
    })
    this.state.valuesY = {
      field: '',
      operator: '',
      label: '',
    }
  }

  onDeleteYValues(value) {
    this.state.originMetric.chart.values = value
    this.setState({
      originMetric: this.state.originMetric,
    })
  }

  onSaveChange() {
    this.props.setVisible(false)
  }
  onCancelChange() {
    this.props.setVisible(false)
  }

  render() {
    const { keys, originMetric, valuesY, valuesFilter } = this.state
    const { allSingleSource } = this.props.singleSource
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

    let antdFormEdit = (<Form horizonal="true">
      <h4>指标选项</h4>
      <FormItem {...formItemLayout} label="指标名:">
        <Input disabled value={originMetric.name} />
      </FormItem>
      <FormItem {...formItemLayout} label="数据源:">
        <Select style={{ width: '100%' }} onChange={value => this.onSourceEdit(value)} value={originMetric.source}>
          {allSingleSource && allSingleSource.map((source, key) => <Option key={key} value={source.name}>{source.name}</Option>)}
        </Select>
      </FormItem>
      <FormItem {...formItemLayout} label="条件：">
        <Row>
          <Col span="7" >
            <Select style={{ width: '100%' }} onChange={e => this.onEditKey(e)} onFocus={() => this.onGetKey()} value={valuesFilter.fieldChinese}>
              {keys.map((item, key) => {
                return <Option key={key} value={[item.field, item.label]} >{item.label}</Option>
              })}
            </Select>
          </Col>
          <Col span="5" offset="1" >
            <Select style={{ width: '100%' }} onChange={value => this.onEditOperator(value)} value={valuesFilter.operator}>
              <Option value=">" key="gt"> &gt; </Option>
              <Option value=">=" key="ge"> &ge; </Option>
              <Option value="<" key="lt"> &lt; </Option>
              <Option value="<=" key="le"> &le; </Option>
              <Option value="=" key="eq"> = </Option>
              <Option value="!=" key="neq"> != </Option>
            </Select>
          </Col>
          <Col span="6" offset="1">
            <Input onChange={e => this.onEditValue(e.target.value)} value={valuesFilter.value} />
          </Col>
          <Col span="1" offset="1">
            <Button onClick={() => this.onEditFilters()}>确定</Button>
          </Col>
        </Row>
      </FormItem>
      <FormItem {...formItemLayout} label="所有条件：">
        <Select
          mode="tags"
          style={{ width: '100%' }}
          onChange={e => this.onDeleteFilters(e)}
          value={originMetric.filters ? originMetric.filters.map((item) => {
            return item.fieldChinese + item.operator + item.value
          }) : []}
        />
      </FormItem>
      <h4>图表选项</h4>
      <FormItem {...formItemLayout} label="类型:">
        <Select style={{ width: '100%' }} onChange={value => this.onTypeEdit(value)} value={originMetric.chart ? originMetric.chart.type : ''}>
          <Option value="bar" key="bar">bar</Option>
          <Option value="line" key="line">line</Option>
        </Select>
      </FormItem>
      <FormItem {...formItemLayout} label="标题:">
        <Input onChange={e => this.onTitleEdit(e.target.value)} value={originMetric.chart ? originMetric.chart.title : ''} />
      </FormItem>
      <Row >
        <Col span="11" offset="2" >
          <FormItem {...formItemLayoutSelect} label="X轴:" >
            <Select style={{ width: '100%' }} disabled value={originMetric.chart ? originMetric.chart.x.field : ''} />
          </FormItem>
        </Col>
        <Col span="11">
          <FormItem {...formItemLayoutSelect} label="标题:" >
            <Input data-xaxis={get(this.source, 'time', '@timestamp')} onChange={e => this.onTitleXChange(e)} value={originMetric.chart ? originMetric.chart.x.label : ''} />
          </FormItem>
        </Col>
      </Row>

      <Row>
        <FormItem {...formItemLayout} label="Y轴：">
          <Row>
            <Col span="7" >
              <Select style={{ width: '100%' }} onChange={value => this.onAddYaxis(value)} onFocus={() => this.onGetKey()} value={valuesY.fieldChinese}>
                {keys.map((item, key) => {
                  return <Option key={key} value={[item.field, item.label]}>{item.label}</Option>
                })}
              </Select>
            </Col>
            <Col span="5" offset="1" >
              <Select style={{ width: '100%' }} onChange={value => this.onAddOperationY(value)} value={valuesY.operator}>
                <Option value="gt" key="gt"> count </Option>
                <Option value="lt" key="lt"> sum </Option>
                <Option value="avg" key="avg"> avg </Option>
                <Option value="max" key="max"> max </Option>
                <Option value="min" key="min"> min </Option>
              </Select>
            </Col>
            <Col span="6" offset="1">
              <Input onChange={e => this.onAddTitleY(e.target.value)} value={valuesY.label} />
            </Col>
            <Col span="1" offset="1">
              <Button onClick={() => this.onAddYValues()}>确定</Button>
            </Col>
          </Row>
        </FormItem>
      </Row>
      <FormItem {...formItemLayout} label="all">
        <Select
          mode="tags"
          style={{ width: '100%' }}
          onChange={e => this.onDeleteYValues(e)}
          value={originMetric.chart ? originMetric.chart.values.map((item) => {
            return `${item.fieldChinese}-->${item.operator}-->${item.label}`
          }) : []}
        />
      </FormItem>
    </Form>)

    return (
      <div>
        <Modal
          width="60%"
          title="修改"
          visible={this.state.visibleEdit}
          onOk={this.onSaveChange.bind(this)}
          onCancel={this.onCancelChange.bind(this)}
          okText="保存"
          cancelText="取消"
        >
          {antdFormEdit}
        </Modal>
      </div>
    )
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visibleEdit: nextProps.visible,
      originMetric: nextProps.metrics.choosedMetric,
    })
  }
}

export default connect((state) => {
  return {
    singleSource: state.singleSource,
    metrics: state.metric,
  }
})(EditForm)
