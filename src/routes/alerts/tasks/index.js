import React, { Component } from 'react';
import { TaskModal } from 'components'
import { Button, Icon } from 'antd'

class Index extends Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: false
    }
    this.showTaskModal = this.showTaskModal.bind(this)
    this.onCancel = this.onCancel.bind(this);
    this.onOk = this.onOk.bind(this);
  }

  showTaskModal() {
    this.setState({
      visible: true
    })
  }

  onCancel() {
    this.setState({
      visible: false
    })
  }
  onOk() {
    this.setState({
      visible: false
    })
  }
  render() {
    const { visible } = this.state
    return (
      <div>
        <Button type="primary" icon="plus" onClick={this.showTaskModal}>添加task</Button>
        {visible && <TaskModal onCancel={this.onCancel} onOk={this.onOk}/>}
      </div>
    );
  }
}

export default Index;