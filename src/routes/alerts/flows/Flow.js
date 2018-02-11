import React from 'react'
import { Button, Modal } from 'antd'
import AddModal from './AddModal'
import Histiry from '../../../components/TaskModal/History'


class Flow extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            showAddModal: false,
        }
    }
    onAddFlow () {
        this.setState({
            showAddModal: true,
        })
    }
    onAddOk () {
        this.setState({
            showAddModal: false,
        })
    }
    onCancelAdd () {
        this.setState({
            showAddModal: false,
        })
    }

    render() {
        return (
            <div>
                <Modal
                    width="60%"
                    visible={this.state.showAddModal}
                    onOk={this.onAddOk.bind(this)}
                    onCancel={this.onCancelAdd.bind(this)}
                    okText="保存"
                    cancelText="取消"
                >
                    <AddModal />
                </Modal>
                <div>
                    < Button onClick={() => this.onAddFlow()}>添加</Button>
                    < Button>修改</Button>
                    < Button>删除</Button>
                </div>
                <div>
                    {/* flow节点图 */}
                </div>
            </div>
        )
    }
}

export default Flow
