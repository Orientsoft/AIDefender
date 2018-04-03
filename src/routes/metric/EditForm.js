import React from 'react'
import { Row, Col, Select, Input, Button, Modal, Form } from 'antd'
import get from 'lodash/get'
import merge from 'lodash/merge'
import cloneDeep from 'lodash/cloneDeep'
import { connect } from 'dva'
import { operators, aggs } from 'utils'
import styles from './index.less'

const { Option } = Select
const FormItem = Form.Item

class EditForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      visibleEdit: props.visible,
      keys: [],
      enabledAggList: [],
      disabledOptList: [],
      valuesFilter: {
        field: '',
        operator: '',
        value: '',
      },
      valuesY: {
        field: '',
        operator: '',
        label: '',
        chartType: 'bar',
      },
      // originMetric: props.metrics.choosedMetric,
      originMetric: {
        name: '',
        source: {},
        filters: [],
        chart: {
          title: '',
          type: 'bar',
          x: {
            field: '@timestamp',
            label: '',
          },
          values: [],
        },
      },
    }
  }

  onSourceEdit (value) {
    this.state.originMetric.filters = []
    this.state.keys = []
    this.state.originMetric.chart.values = []
    const choosedsource = this.props.singleSource.allSingleSource.find((item) => {
      return item._id === value
    })
    this.state.originMetric.source = choosedsource
    this.setState({
      originMetric: this.state.originMetric,
    })
  }

  onGetKey () {
    this.setState({
      keys: this.state.originMetric.source.fields,
    })
  }

  onEditKey (value) {
    const { valuesFilter, keys } = this.state
    const key = keys.find(k => k.field === value)
    let disabledOptList = []

    if (['text', 'keyword'].indexOf(key.type) !== -1) {
      disabledOptList = ['<', '<=', '>', '>=']
    }
    valuesFilter.type = key.type
    valuesFilter.field = value
    valuesFilter.operator = []
    valuesFilter.fieldChinese = key.label
    this.setState({
      valuesFilter,
      disabledOptList,
    })
  }

  onEditOperator (value) {
    this.state.valuesFilter.operator = value
    this.setState({
      valuesFilter: this.state.valuesFilter,
    })
  }

  onEditValue (value) {
    this.state.valuesFilter.value = value
    this.setState({
      valuesFilter: this.state.valuesFilter,
    })
  }

  onEditFilters () {
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

  onDeleteFilters (value) {
    this.state.originMetric.filters = value
    this.setState({
      originMetric: this.state.originMetric,
    })
  }

  onTypeEdit (e) {
    this.state.valuesY.chartType = e
    this.setState({
      valuesY: this.state.valuesY,
    })
  }
  onTitleEdit (e) {
    this.state.originMetric.chart.title = e
    this.setState({
      originMetric: this.state.originMetric,
    })
  }

  onTitleXChange (e) {
    this.state.originMetric.chart.x.label = e.target.value
    this.setState({
      originMetric: this.state.originMetric,
    })
  }

  onAddYaxis (value) {
    const { valuesY, keys } = this.state
    const key = keys.find(k => k.field === value)
    const state = {}

    if (['long', 'integer', 'short', 'byte', 'double', 'float', 'half_float', 'scaled_float'].indexOf(key.type) !== -1) {
      state.enabledAggList = ['count', 'sum', 'avg', 'min', 'max']
    // } else if (['text', 'keyword'].indexOf(key.type) !== -1) {
    } else {
      state.enabledAggList = ['count', 'terms']
    }
    valuesY.type = key.type
    valuesY.field = value
    valuesY.fieldChinese = key.label
    this.setState(state)
  }

  onAddOperationY (value) {
    const { valuesY } = this.state

    valuesY.operator = value
    // terms聚合只能使用散点图
    if (value === 'terms') {
      valuesY.chartType = 'scatter'
    }
    this.setState({ valuesY })
  }

  onAddTitleY (value) {
    this.state.valuesY.label = value
    this.setState({
      originMetric: this.state.originMetric,
    })
  }

  onAddYValues () {
    const { valuesY, originMetric } = this.state

    if (valuesY.field && valuesY.operator) {
      originMetric.chart.values.push(this.state.valuesY)
      this.setState({ originMetric })
    }
    this.state.valuesY = {
      field: '',
      operator: '',
      label: '',
    }
  }

  onDeleteYValues (value) {
    this.state.originMetric.chart.values = value
    this.setState({
      originMetric: this.state.originMetric,
    })
  }

  onSaveChange () {
    const { setVisible, dispatch } = this.props

    dispatch({ type: 'metric/updateChoosedSource', payload: cloneDeep(this.state.originMetric) })
    setVisible(false)
  }

  onCancelChange () {
    this.props.setVisible(false)
  }

  render () {
    const {
      keys,
      originMetric,
      valuesY,
      valuesFilter,
      enabledAggList,
      disabledOptList,
    } = this.state
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
        <Select style={{ width: '100%' }} onChange={value => this.onSourceEdit(value)} value={originMetric.source._id}>
          {allSingleSource && allSingleSource.map((source, key) => <Option key={key} value={source._id}>{source.name}</Option>)}
        </Select>
      </FormItem>
      <FormItem {...formItemLayout} label="条件(可选)：">
        <Row>
          <Col span="7" >
            <Select style={{ width: '100%' }} onChange={e => this.onEditKey(e)} onFocus={() => this.onGetKey()} value={valuesFilter.fieldChinese}>
              {keys.map((item, key) => {
                return <Option key={key} value={item.field} >{item.label}</Option>
              })}
            </Select>
          </Col>
          <Col span="5" offset="1" >
            <Select style={{ width: '100%' }} onChange={value => this.onEditOperator(value)} value={valuesFilter.operator}>
              {operators.map(opt => <Option key={opt.value} disabled={disabledOptList.indexOf(opt.label) !== -1} value={opt.value}>{opt.label}</Option>)}
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
      <FormItem {...formItemLayout} label="所有条件(可选)：">
        <Select
          mode="tags"
          style={{ width: '100%' }}
          onChange={e => this.onDeleteFilters(e)}
          value={originMetric.filters ? originMetric.filters.map((item) => {
            const opt = operators.find(o => o.value === item.operator)
            return item.fieldChinese + opt.label + item.value
          }) : []}
        />
      </FormItem>
      <h4>图表选项</h4>
      {/* <FormItem {...formItemLayout} label="类型:">
        <Select style={{ width: '100%' }} onChange={value => this.onTypeEdit(value)} value={originMetric.chart ? originMetric.chart.type : ''}>
          <Option value="bar" key="bar">柱状图</Option>
          <Option value="line" key="line">折线图</Option>
          <Option value="area" key="area">面积图</Option>
          <Option value="scatter" key="scatter">散点图</Option>
        </Select>
      </FormItem> */}
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
            <Col span="7">
              <Select style={{ width: '100%' }} onChange={value => this.onAddYaxis(value)} onFocus={() => this.onGetKey()} value={valuesY.fieldChinese}>
                {keys.map((item, key) => {
                  return <Option key={key} value={item.field}>{item.label}</Option>
                })}
              </Select>
            </Col>
            <Col span="6" offset="1">
              <Select style={{ width: '100%' }} onChange={value => this.onAddOperationY(value)} value={valuesY.operator}>
                {aggs.map(agg => <Option key={agg.value} disabled={enabledAggList.indexOf(agg.value) === -1} value={agg.value}>{agg.label}</Option>)}
              </Select>
            </Col>
            <Col span="5" offset="1">
              {/* <Input onChange={e => this.onAddTitleY(e.target.value)} value={valuesY.label} /> */}
              <Select style={{ width: '100%' }} disabled={valuesY.operator === 'terms'} onChange={value => this.onTypeEdit(value)} value={valuesY.chartType}>
                <Option value="bar" key="bar">柱状图</Option>
                <Option value="line" key="line">折线图</Option>
                <Option value="area" key="area">面积图</Option>
                <Option value="scatter" key="scatter">散点图</Option>
              </Select>
            </Col>
            <Col span="1" offset="1">
              <Button onClick={() => this.onAddYValues()}>确定</Button>
            </Col>
          </Row>
        </FormItem>
      </Row>
      <FormItem {...formItemLayout} label="聚合">
        <Select
          mode="tags"
          style={{ width: '100%' }}
          onChange={e => this.onDeleteYValues(e)}
          value={originMetric.chart ? originMetric.chart.values.map((item) => {
            return `${item.operator}: ${item.fieldChinese}`
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

  componentWillReceiveProps (nextProps) {
    this.setState({
      visibleEdit: nextProps.visible,
      originMetric: merge(this.state.originMetric, nextProps.metrics.choosedMetric)
    })
  }
}

export default connect((state) => {
  return {
    singleSource: state.singleSource,
    metrics: state.metric,
  }
})(EditForm)
