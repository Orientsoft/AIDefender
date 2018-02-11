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

    render() {
        return (
            <div>
                <div>
                    < Button>修改</Button>
                </div>
                <div>
                    {/* flow节点图 */}
                </div>
            </div>
        )
    }
}

export default Flow
