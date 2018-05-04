import React from 'react'
import { DS_CONFIG, KPI_CONFIG, ALERT_CONFIG } from 'services/consts'
import { Button, Modal, Table } from 'antd'
import { Page } from 'components'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { operators } from 'utils'
import AddForm from './AddForm'
import EditForm from './EditForm'

const { confirm } = Modal

class Index extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: false,
      visibleEdit: false,
    }
  }

  componentWillMount () {
    this.props.dispatch({ type: 'singleSource/querySingleSource', payload: { type: [DS_CONFIG, ALERT_CONFIG] } })
    this.props.dispatch({ type: 'metric/queryMetrics', payload: { type: KPI_CONFIG } })
  }

  render () {
    const { metrics } = this.props.metrics

    let columns = [
      {
        title: '指标名',
        dataIndex: 'name',
        key: 'name',
        width: 160,
        fixed: 'left',
      }, {
        title: '数据源',
        dataIndex: 'source.name',
        key: 'source',
        width: 120,
      }, {
        title: '条件',
        dataIndex: 'filters',
        key: 'filters',
        render: (text, item) => (
          <div>
            {item.filters.map((e) => {
              const opt = operators.find(o => o.value === e.operator)
              if (opt) {
                return e.fieldChinese + opt.label + e.value
              }
              return e.fieldChinese
            }).join(', ')}
          </div>
        ),
      }, {
        title: '图表类型',
        dataIndex: 'chart.type',
        key: 'chart.type',
        render: (text) => {
          const chart = [{
            type: 'bar',
            name: '柱状图',
          }, {
            type: 'line',
            name: '折线图',
          }, {
            type: 'area',
            name: '面积图',
          }, {
            type: 'scatter',
            name: '散点图',
          }].find(({ type }) => type === text)
          return chart ? chart.name : text
        },
        width: 100,
      }, {
        title: '标题',
        dataIndex: 'chart.title',
        key: 'chart.title',
      }, {
        title: 'X轴字段',
        dataIndex: 'chart.x.field',
        key: 'chart.x.field',
        width: 120,
      },
      // {
      //   title: 'X轴标题',
      //   dataIndex: 'chart.x.label',
      //   key: 'chart.x.label',
      //   width: 100,
      // },
      {
        title: 'Y轴',
        dataIndex: 'chart.values',
        key: 'chart.values',
        render: (text, item) => (
          <div>
            {item.chart.values.map(v => `${v.operator}: ${v.fieldChinese}`).join(', ')}
          </div>
        ),
      }, {
        title: '操作',
        key: 'action',
        fixed: 'right',
        render: (text, item) => (
          <div>
            <a onClick={() => this.onEditSource(item._id)}>编辑</a>
            <a onClick={() => this.onDeleteSource(item._id)} style={{ marginLeft: '10px' }}>删除</a>
          </div>
        ),
        width: 100,
      },
    ]
    metrics.forEach((item, i) => { item.key = i })

    return (
      <Page inner>
        <p className="headerManager">指标设置</p>
        <div>
          <AddForm visible={this.state.visible} setVisible={this.setVisible} />
          <EditForm visible={this.state.visibleEdit} setVisible={this.setEditVisible} />
          {metrics.length ? (
            <Table scroll={{ x: columns.length * 220 }} style={{ textAlign: 'center' }} columns={columns} dataSource={metrics} />
          ) : null}
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

  componentWillReceiveProps (nextProps) {
    this.setState({
      visible: nextProps.visible,
      // originSource: nextProps.singleSource.singleSource,
    })
  }

  setVisible = visible => this.setState({ visible })
  setEditVisible = visibleEdit => this.setState({ visibleEdit })
}

Index.propTypes = {
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  visible: PropTypes.bool,
  metrics: PropTypes.object.isRequired,
}

// export default MetricContent
export default connect((state) => {
  return {
    singleSource: state.singleSource,
    metrics: state.metric,
  }
})(Index)
