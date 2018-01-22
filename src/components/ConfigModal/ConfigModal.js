import React from 'react'
import PropTypes from 'prop-types'
import noop from 'lodash/noop'
import { Modal, Tabs, Checkbox } from 'antd'
import styles from './ConfigModal.less'

const { TabPane } = Tabs

class ConfigModal extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  }

  constructor (props) {
    super(props)
    this.onCancel = this._onCancel.bind(this)
    this.onOk = this._onOk.bind(this)
  }

  render () {
    const { title = '', visible } = this.props

    return (
      <Modal
        title={title}
        visible={visible}
        onCancel={this.onCancel}
        onOk={this.onOk}
      >
        <Tabs defaultActiveKey="1"
          style={{ height: 220 }}
          type="card"
        >
          <TabPane tab={<div><span className={styles.pdr20}>KPI</span><Checkbox /></div>} key="1">
                          测试数据1
          </TabPane>
          <TabPane tab={<div><span className={styles.pdr20}>Alert</span><Checkbox /></div>} key="2">
                          测试数据2
          </TabPane>
          <TabPane tab={<div><span className={styles.pdr20}>异常</span><Checkbox /></div>} key="3">
                          测试数据3
          </TabPane>
        </Tabs>
      </Modal>
    )
  }

  // 调用父组件的方法改变isVisable隐藏
  _onCancel () {
    const { onCancel = noop } = this.props
    onCancel()
  }
  // 提交配置
  _onOk (data) {
    const { onOk = noop } = this.props
    onOk(data)
  }
}

export default ConfigModal
