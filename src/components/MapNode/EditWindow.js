import { message, Modal, Input } from 'antd'

class EditWindow extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      mode: '',  //ADD: 表示添加，MODIFY: 表示修改
      visible: false,
      title: '',
      nodeText: ''
    }
    this.parentData = null
  }
  _handleOk = () => {
    if(this.props.handleOk) {
      this.props.handleOk(this.parentData, this.state.mode, this.state.nodeText)
    }
    this.setState({visible: false})
  }
  _handleCancel = () => {
    if(this.props.handleCancel) {
      this.props.handleCancel(this.parentData, this.state.mode, this.state.nodeText)
    }
    this.setState({visible: false})
  }
  onChangeNodeText = (e) => {
    this.setState({nodeText: e.target.value})
  }
  show = (title, data, mode) => {
    this.parentData = data
    this.setState({visible: true, title: title, mode: mode, nodeText: mode === 'MODIFY'? data.node.name : ''})
  }
  render () {
    
    return (
      <Modal width="300px" title={this.state.title} visible={this.state.visible} 
        onOk={this._handleOk} 
        onCancel={this._handleCancel} 
        okText="保存"
        cancelText="取消" >
       <Input placeholder="请输入节点名称" autoFocus={true} value={this.state.nodeText} onChange={this.onChangeNodeText} onPressEnter={this._handleOk} />
      </Modal>
    )
  }
}
export default EditWindow