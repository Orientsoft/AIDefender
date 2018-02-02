import React from 'react'
import { DS_CONFIG, KPI_CONFIG } from 'services/consts'
import { Row, Col, Select, Input, Button, Modal, Form } from 'antd'
import get from 'lodash/get'
import { connect } from 'dva'
import styles from './index.less'

const { Option } = Select
const { confirm } = Modal
const FormItem = Form.Item

class AddForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: props.visible,
      addData: {
        type: KPI_CONFIG,
        structure: [],
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
    this.state.addData.source = value
    let choosedsource = this.props.singleSource.allSingleSource.filter((item) => {
      return item.name === value
    })
    this.setState({
      addData: this.state.addData,
      keys: choosedsource[0].fields,
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
    this.state.valuesFilter.field = value[0]
    this.state.valuesFilter.fieldChinese = value[1]

    this.setState({
      addData: this.state.addData,
    })
  }

  onAddOperator (value) {
    this.state.valuesFilter.operator = value
    this.setState({
      addData: this.state.addData,
    })
  }

  onAddValue (value) {
    this.state.valuesFilter.value = value
    this.setState({
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
    this.state.valuesY.field = value[0]
    this.state.valuesY.fieldChinese = value[1]
    this.setState({
      addData: this.state.addData,
    })
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
    this.props.dispatch({ type: 'metric/addMetric', payload: this.state.addData })
    this.props.setVisible(false)
    this.setState({
      addData: {
        type: KPI_CONFIG,
        structure: [],
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
    })
  }

  onCancel () {
    this.props.setVisible(false)
    this.setState({
        addData: {
          type: KPI_CONFIG,
          structure: [],
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
      })
  }

  render () {
    const { addData, keys } = this.state
    const { allSingleSource } = this.props.singleSource
    const { metrics } = this.props.metrics
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
            <Select style={{ width: '100%' }} onChange={e => this.onAddKey(e)}>
              {keys && keys.map((item, key) => {
                return <Option key={key} value={[item.field,item.label]} >{item.label}</Option>
              })}
            </Select>
          </Col>
          <Col span="5" offset="1" >
            <Select style={{ width: '100%' }} onChange={value => this.onAddOperator(value)}>
              <Option value=">" key="gt"> &gt; </Option>
              <Option value=">=" key="ge"> &ge; </Option>
              <Option value="<" key="lt"> &lt; </Option>
              <Option value="<=" key="le"> &le; </Option>
              <Option value="=" key="eq"> = </Option>
              <Option value="!=" key="neq"> != </Option>
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
            return item.fieldChinese + item.operator + item.value
          })}
        />
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
                  return <Option key={key} value={[item.field,item.label]}>{item.label}</Option>
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
              <Button onClick={() => this.onAddYValues()}>确定</Button>
            </Col>
          </Row>
        </FormItem>
      </Row>
      <FormItem {...formItemLayout} label="all">
        <Select
          mode="tags"
          style={{ width: '100%' }}
          value={addData.chart.values.map((item) => {
            return `${item.fieldChinese}-->${item.operator}-->${item.label}`
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