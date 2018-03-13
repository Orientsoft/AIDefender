import React from 'react'
import { Button, Switch } from 'antd'
import History from '../../../components/TaskModal/History'

class Flow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      checked: false,
      showHistory:false,
    }
  }
  // onChangeSwitch() {
  //   this.setState({
  //     checked: !this.state.checked,
  //   })
  // }
  showHistory() {
    this.setState({
      showHistory: !this.state.showHistory,
    })
  }
  render() {
    const { checked } = this.state
    return (
      <div>
        <Button>修改</Button>
        {/* <Button onClick={() => this.showHistory()}> show history </Button> */}
        {/* {this.state.showHistory && <History onCancel={() => this.showHistory()} />} */}
        {/* <Switch checked={checked} onChange={() => this.onChangeSwitch()} /> */}
        <div>
          {/* flow节点图 */}
        </div>
      </div>
    )
  }
}

export default Flow
