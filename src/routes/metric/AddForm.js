import React from 'react'
import { KPI_CONFIG } from 'services/consts'
import { Row, Col, Select, Input, Button, Modal, Form } from 'antd'
import { connect } from 'dva'
import { operators, aggs } from 'utils'
import styles from './index.less'

const { Option } = Select
const FormItem = Form.Item

class AddForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      enabledAggList: [],
      disabledOptList: [],
      visible: props.visible,
      addData: {
        type: KPI_CONFIG,
        structure: [],
        name: '',
        source: {},
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
    }
  }

  onAddName (value) {
    this.state.addData.name = value
    this.setState({
      addData: this.state.addData,
    })
  }

  onAddSource (value) {
    this.state.addData.filters = []
    this.state.keys = []
    const choosedsource = this.props.singleSource.allSingleSource.find((item) => {
      return item._id === value
    })
    this.state.addData.source = choosedsource
    if (!this.state.addData.chart.title) {
      this.state.addData.chart.title = choosedsource.name
    }
    this.state.addData.chart.x.field = choosedsource.timestamp
    this.setState({
      addData: this.state.addData,
      keys: choosedsource.fields,
    })
  }

  onAddType (value) {
    this.state.addData.chart.type = value
    this.setState({
      addData: this.state.addData,
    })
  }

  onAddTitle (value) {
    this.state.addData.chart.title = value
    this.setState({
      addData: this.state.addData,
    })
  }

  onAddKey (value) {
    const { valuesFilter, keys } = this.state
    const key = keys.find(k => k.field === value)
    let disabledOptList = []

    if (['text', 'keyword'].indexOf(key.type) !== -1) {
      disabledOptList = ['<', '<=', '>', '>=']
    }
    valuesFilter.type = key.type
    valuesFilter.field = value
    valuesFilter.fieldChinese = key.label

    this.setState({
      valuesFilter,
      addData: this.state.addData,
      disabledOptList,
    })
  }

  onAddOperator (value) {
    this.state.valuesFilter.operator = value
    this.setState({
      valuesFilter: this.state.valuesFilter,
      addData: this.state.addData,
    })
  }

  onAddValue (value) {
    this.state.valuesFilter.value = value
    this.setState({
      valuesFilter: this.state.valuesFilter,
      addData: this.state.addData,
    })
  }

  onAddFilters () {
    this.state.addData.filters.push(this.state.valuesFilter)
    this.setState({
      addData: this.state.addData,
    })
    this.state.valuesFilter = {
      field: '',
      operator: '',
      value: '',
    }
  }

  onAddTitleX (value) {
    this.state.addData.chart.x.label = value
    this.setState({
      addData: this.state.addData,
    })
  }

  onAddYaxis (value) {
    const { valuesY, keys } = this.state
    const key = keys.find(k => k.field === value)
    const state = { valuesY }

    if (['long', 'integer', 'short', 'byte', 'double', 'float', 'half_float', 'scaled_float'].indexOf(key.type) !== -1) {
      state.enabledAggList = ['count', 'sum', 'avg', 'min', 'max']
    // } else if (['text', 'keyword'].indexOf(key.type) !== -1) {
    } else {
      state.enabledAggList = ['count', 'terms']
    }
    state.valuesY.type = key.type
    state.valuesY.field = value
    state.valuesY.fieldChinese = key.label
    this.setState(state)
  }

  onAddOperationY (value) {
    this.state.valuesY.operator = value
    this.setState({
      addData: this.state.addData,
    })
  }

  onAddTitleY (value) {
    this.state.valuesY.label = value
    this.setState({
      addData: this.state.addData,
    })
  }

  onAddYValues () {
    this.state.addData.chart.values.push(this.state.valuesY)
    this.setState({
      addData: this.state.addData,
    })
    this.state.valuesY = {
      field: '',
      operator: '',
      label: '',
    }
  }

  onSave () {
    const { dispatch, setVisible } = this.props

    dispatch({ type: 'metric/addMetric', payload: this.state.addData })
    setVisible(false)
    this.setState({
      addData: {
        type: KPI_CONFIG,
        name: '',
        source: {},
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
    })
  }

  onCancel () {
    this.props.setVisible(false)
    this.setState({
      addData: {
        type: KPI_CONFIG,
        name: '',
        source: {},
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
    })
  }

  render () {
    const {
      addData,
      keys,
      valuesFilter,
      valuesY,
      disabledOptList,
      enabledAggList,
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
    let antdFormAdd = (<Form horizonal="true">
      <h4>指标选项</h4>
      <FormItem {...formItemLayout} label="指标名：">
        <Input onChange={e => this.onAddName(e.target.value)} value={addData.name} />
      </FormItem>
      <FormItem {...formItemLayout} label="数据源：">
        <Select style={{ width: '100%' }} onChange={value => this.onAddSource(value)} value={addData.source._id}>
          {allSingleSource && allSingleSource.map((source, key) => <Option key={key} value={source._id}>{source.name}</Option>)}
        </Select>
      </FormItem>
      <FormItem {...formItemLayout} label="条件(可选)：">
        <Row>
          <Col span="7" >
            <Select style={{ width: '100%' }} onChange={e => this.onAddKey(e)} value={valuesFilter.fieldChinese}>
              {keys && keys.map((item, key) => {
                return <Option key={key} value={item.field}>{item.label}</Option>
              })}
            </Select>
          </Col>
          <Col span="5" offset="1" >
            <Select style={{ width: '100%' }} onChange={value => this.onAddOperator(value)} value={valuesFilter.operator}>
              {operators.map(opt => <Option key={opt.value} disabled={disabledOptList.indexOf(opt.label) !== -1} value={opt.value}>{opt.label}</Option>)}
            </Select>
          </Col>
          <Col span="6" offset="1">
            <Input onChange={e => this.onAddValue(e.target.value)} value={valuesFilter.value} />
          </Col>
          <Col span="1" offset="1">
            <Button onClick={() => this.onAddFilters()}>确定</Button>
          </Col>
        </Row>
      </FormItem>
      <FormItem {...formItemLayout} label="所有条件(可选)：">
        <Select
          mode="tags"
          style={{ width: '100%' }}
          value={addData.filters.map((item) => {
            const opt = operators.find(o => o.value === item.operator)
            return item.fieldChinese + opt.label + item.value
          })}
        />
      </FormItem>
      <h4>图表选项</h4>
      <FormItem {...formItemLayout} label="类型：">
        <Select style={{ width: '100%' }} onChange={value => this.onAddType(value)} value={addData.chart.type}>
          <Option value="bar" key="bar">柱状图</Option>
          <Option value="line" key="line">折线图</Option>
          <Option value="area" key="area">面积图</Option>
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
            <Input onChange={e => this.onAddTitleX(e.target.value)} value={addData.chart.x.label} placeholder="时间" />
          </FormItem>
        </Col>
      </Row>
      <Row >

        <FormItem {...formItemLayout} label="Y轴：">
          <Row>
            <Col span="10" >
              <Select style={{ width: '100%' }} onChange={value => this.onAddYaxis(value)} value={valuesY.fieldChinese}>
                {keys && keys.map((item, key) => {
                  return <Option key={key} value={item.field}>{item.label}</Option>
                })}
              </Select>
            </Col>
            <Col span="9" offset="1" >
              <Select style={{ width: '100%' }} onChange={value => this.onAddOperationY(value)} value={valuesY.operator}>
                {aggs.map(agg => <Option key={agg.value} disabled={enabledAggList.indexOf(agg.value) === -1} value={agg.value}>{agg.label}</Option>)}
              </Select>
            </Col>
            {/* <Col span="6" offset="1">
              <Input onChange={e => this.onAddTitleY(e.target.value)} value={valuesY.label} />
            </Col> */}
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
          value={addData.chart.values.map((item) => {
            return `${item.operator}: ${item.fieldChinese}`
          })}
        />
      </FormItem>
    </Form>)

    return (
      <div>
        <Modal
          width="60%"
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

// export default MetricContent
export default connect((state) => {
  return {
    singleSource: state.singleSource,
    metrics: state.metric,
  }
})(AddForm)
