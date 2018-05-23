import React from 'react'
import { connect } from 'dva'
import { Modal, Table, Divider, Message } from 'antd'
import styles from './Log.less'


class Log extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  componentDidMount () {
    this.props.dispatch({
      type: 'logs/queryLogs',
      payload: {
        source: this.props.id,
        toast: e => Message.error(e),
      },
    })
    this.loop = setInterval(() => this.props.dispatch({
      type: 'logs/queryLogs',
      payload: {
        source: this.props.id,
        toast: e => Message.error(e),
      },
    }), 5000)
  }
  componentWillUnmount () {
    clearInterval(this.loop)
  }
  _onCancel () {
    const { onCancel } = this.props
    onCancel()
  }
  render () {
    let { logs = [] } = this.props.logs
    var msgModal
    if (logs.length > 0) {
      msgModal = (
        <Modal
          visible
          width="80%"
          title="日志"
          footer={null}
          onCancel={this._onCancel.bind(this)}
          className={`${styles.log}`}
        >
          <div style={{ height: 400, overflow: 'scroll' }}>
            {logs && logs.map((item) => {
              return (<div>{item}<Divider /></div>)
            })}
          </div>
        </Modal>
      )
    } else {
      msgModal = (
        <Modal
          visible
          width="30%"
          title="日志"
          footer={null}
          onCancel={this._onCancel.bind(this)}
        >
          <div style={{ textAlign: 'center' }}>暂无日志！</div>
        </Modal>
      )
    }
    return (
      <div>
        {msgModal}
      </div>
    )
  }
}

export default connect((state) => { return ({ logs: state.logs }) })(Log)
