import React from 'react'
import PropTypes from 'prop-types'
import noop from 'lodash/noop'
import cloneDeep from 'lodash/cloneDeep'
import { connect } from 'dva'
import { Modal, Tabs } from 'antd'
import DataSource from './DataSource'
import styles from './ConfigModal.less'
import KPI from './KPI'
import Alerts from './Alerts'

const { TabPane } = Tabs

class ConfigModal extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    nodeConfig: PropTypes.object,
    node: PropTypes.object.isRequired,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  }

  render () {
    const { node, nodeConfig } = this.props
    const dataSource = [].concat(nodeConfig.dataSource).concat(nodeConfig.alert)

    return (
      <Modal
        title={node.name}
        maskClosable={false}
        visible
        width="50%"
        onCancel={() => this._onCancel()}
        onOk={() => this._onOk()}
        okText="保存"
        cancelText="取消"
      >
        <Tabs defaultActiveKey="1"
          style={{ minHeight: 320 }}
          type="card"
        >
          <TabPane tab={<div><span className={styles.pdr20}>数据源</span></div>} key="1">
            <DataSource defaultValue={dataSource} value={nodeConfig.data.ds} onChange={value => this.onDataSourceChange(value)} />
          </TabPane>
          <TabPane tab={<div><span className={styles.pdr20}>KPI</span></div>} key="2">
            <KPI defaultValue={nodeConfig.kpi} value={nodeConfig.data.kpi} onChange={value => this.onMetricChange(value)} />
          </TabPane>
          <TabPane tab={<div><span className={styles.pdr20}>Alert</span></div>} key="3">
            <Alerts defaultValue={nodeConfig.alert} value={nodeConfig.data.alert} onChange={value => this.onAlertChange(value)} />
          </TabPane>
        </Tabs>
      </Modal>
    )
  }

  onDataSourceChange (value) {
    this.props.dispatch({ type: 'nodeConfig/saveDataSource', payload: value })
  }

  onMetricChange (value) {
    this.props.dispatch({ type: 'nodeConfig/saveKPI', payload: value })
  }

  onAlertChange (value) {
    this.props.dispatch({ type: 'nodeConfig/saveAlerts', payload: value })
  }

  componentWillMount () {
    const { dispatch, node } = this.props

    if (node.data) {
      dispatch({ type: 'nodeConfig/queryChoosedSource', payload: node })
    }
    dispatch({ type: 'nodeConfig/queryDataSource' })
    dispatch({ type: 'nodeConfig/queryMetrics' })
    dispatch({ type: 'nodeConfig/queryAlerts' })
  }
  // 调用父组件的方法改变isVisable隐藏
  _onCancel () {
    this._onOk()
  }
  // 提交配置
  _onOk () {
    const { onOk = noop, dispatch, nodeConfig } = this.props
    const data = cloneDeep(nodeConfig.data)

    dispatch({ type: 'nodeConfig/resetConfig' })
    dispatch({ type: 'app/setDirty', payload: true })
    onOk(data)
  }
}

export default connect(state => ({
  app: state.app,
  nodeConfig: state.nodeConfig,
}))(ConfigModal)
