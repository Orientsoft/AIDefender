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
    }
  }

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
    this.props.setVisible(false)
  }
  onCancelChange () {
    this.props.setVisible(false)
  }

  render () {
      console.log('visible',this.state.visibleEdit)
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

  onEditSource (key, name) {
    this.setState({
      visibleEdit: true,
    })
  }

  onDeleteSource (key, id) {
    this.props.dispatch({ type: 'metric/delChoosedSource', payload: { id } })
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
        visibleEdit: nextProps.visible,
    })
  }
}

// export default MetricContent
export default connect((state) => {
  return {
    singleSource: state.singleSource,
    metrics: state.metric,
  }
})(EditForm)
