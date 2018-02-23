import React from 'react'
import { DS_CONFIG, KPI_CONFIG } from 'services/consts'
import { Row, Col, Select, Input, Button, Modal, Form, Table, Icon } from 'antd'
import get from 'lodash/get'
import { connect } from 'dva'
import styles from './index.less'
import { Page } from 'components'
import PropTypes from 'prop-types'
import AddForm from './AddForm'
import EditForm from './EditForm'

const { Option } = Select
const { confirm } = Modal
const FormItem = Form.Item

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      visibleEdit: false,
    }
  }

  componentWillMount() {
    this.props.dispatch({ type: 'singleSource/querySingleSource', payload: { type: DS_CONFIG } })
    this.props.dispatch({ type: 'metric/queryMetrics', payload: { type: KPI_CONFIG } })
  }

  render() {
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

    let columns = [
      {
        title: '指标名',
        dataIndex: 'name',
        key: 'name',
      },{
        title: '数据源',
        dataIndex: 'source',
        key: 'source',
      },{
        title: '条件',
        dataIndex: 'filters',
        key: 'filters',
        render: (text, item)  => (
          <div>
            {item.filters.map(e => e.fieldChinese + e.operator + e.value).join('  ,  ')}
          </div>
        )
      },{
        title: '图表类型',
        dataIndex: 'chart.type',
        key: 'chart.type',
      },{
        title: '标题',
        dataIndex: 'chart.title',
        key: 'chart.title',
      },{
        title: 'X轴字段',
        dataIndex: 'chart.x.field',
        key: 'chart.x.field',
      },{
        title: 'X轴标题',
        dataIndex: 'chart.x.label',
        key: 'chart.x.label',
      },{
        title: 'Y轴',
        dataIndex: 'chart.values',
        key: 'chart.values',
        render: (text, item)  => (
          <div>
            {item.chart.values.map(v => `${v.fieldChinese}-->${v.operator}-->${v.label}`).join('  ,  ')}
          </div>
        )
      },{
        title: '操作',
        key: 'action',
        render: (text, item) => (
          <div>
            <a onClick={() => this.onEditSource(item._id)}>编辑</a>
            <a onClick={() => this.onDeleteSource(item._id)} style={{'marginLeft': '10px'}}>删除</a>
          </div>
        )
      }
    ]
    metrics.forEach((item, i) => item.key = i)

    return (
      <Page inner>
        <p className="headerManager">指标设置</p>
        <div>
            <AddForm visible={this.state.visible} setVisible={() => this.setVisible()} />
            <EditForm visible={this.state.visibleEdit} setVisible={() => this.setEditVisible()} />

            <Table columns={columns} dataSource={metrics} />

            {/* <Row gutter={5} className={styles.metricContent}>
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
              {metrics.map((item, key) => {
                return (<Row gutter={5} key={key}>
                  <Col span={2} className="gutter-row">
                    <Input value={item.name} disabled key={key} />
                  </Col>
                  <Col span={2} className="gutter-row">
                    <Input value={item.source} disabled key={key} />
                  </Col>
                  <Col span={4} className="gutter-row">
                    <Select
                      mode="tags"
                      placeholder="Please select"
                      value={item.filters.map((item) => {
                        return item.fieldChinese + item.operator + item.value
                      })}
                      style={{ width: '100%' }}
                      disabled
                    />
                  </Col>
                  <Col span={2} className="gutter-row">
                    <Input value={item.chart.type} disabled key={key} />
                  </Col>
                  <Col span={2} className="gutter-row">
                    <Input value={item.chart.title} disabled key={key} />
                  </Col>
                  <Col span={2} className="gutter-row">
                    <Input value={item.chart.x.field} disabled key={key} />
                  </Col>
                  <Col span={2} className="gutter-row">
                    <Input value={item.chart.x.label} disabled key={key} />
                  </Col>
                  <Col span={4} className="gutter-row">
                    <Input
                      value={item.chart.values.map(v => `${v.fieldChinese}-->${v.operator}-->${v.label}`)}
                      disabled
                      key={key}
                    />
                  </Col>

                  <Col span={4} className="gutter-row">
                    <Button onClick={() => this.onEditSource(key, item._id)} >编辑</Button>
                    <Button onClick={() => this.onDeleteSource(key, item._id)}>删除</Button>
                  </Col>
                </Row>)
              })}
            </div> */}

            <Button type="primary" icon="plus" onClick={() => this.setVisible(true)}>添加数据</Button>
        </div>
      </Page >
    )
  }

  onEditSource (id) {
    this.props.dispatch({ type: 'metric/queryChoosedSource', payload: { id } })
    this.setState({
      visibleEdit: true,
    })
  }
  
  onDeleteSource (id) {
    const { dispatch } = this.props
    confirm({
      title: '删除',
      content: '确实要删除该指标吗？',
      okText: '确定',
      cancelText: '取消',
      onOk () {
        dispatch({ type: 'metric/delChoosedSource', payload: { id } })
      },
      onCancel () {},
    })

  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible,
      // originSource: nextProps.singleSource.singleSource,
    })
  }
  setVisible(visible) {
    this.setState({
      visible: visible,
    })
  }

  setEditVisible(visible) {
    this.setState({
      visibleEdit: visible,
    })
  }
}

Index.propTypes = {
  singleSource: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

// export default MetricContent
export default connect((state) => {
  return {
    singleSource: state.singleSource,
    metrics: state.metric,
  }
})(Index)
