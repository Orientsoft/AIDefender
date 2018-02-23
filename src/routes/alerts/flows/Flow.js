import React from 'react'
import { Button } from 'antd'
import History from '../../../components/TaskModal/History'

class Flow extends React.Component {
  render () {
    return (
      <div>
        <div>
          <Button>修改</Button>
        </div>
        <div>
          {/* flow节点图 */}
        </div>
      </div>
    )
  }
}

export default Flow
