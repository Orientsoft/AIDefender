import React from 'react'
import { Button, Switch } from 'antd'
import History from '../../../components/TaskModal/History'

class Flow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      checked: false,
    }
  }
  onChangeSwitch() {
    this.setState({
      checked: !this.state.checked,
    })
  }
  render() {
    const { checked } = this.state
    return (
      <div>
        <Button>修改</Button>
        <Switch checked={checked} onChange={() => this.onChangeSwitch()} />
        <div>
          {/* flow节点图 */}
        </div>
      </div>
    )
  }
}

export default Flow
