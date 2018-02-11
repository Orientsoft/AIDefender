import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Icon } from 'antd'
import capitalize from 'lodash/capitalize'
// import styles from './index.less'
import { Tabs, Modal } from 'antd'
import { Page } from 'components'
import AddModal from './AddModal'
import Flow from './Flow'
import Histiry from '../../../components/TaskModal/History'

const { TabPane } = Tabs
const { confirm } = Modal

class Index extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      allflows: [
        { name: 'aa', data: [] },
        { name: 'bb', data: [] },
      ],
      visible: false,
    }
  }
  onAdd () {
    console.log('add')
    this.setState({
      visible: true,
    })
  }

  onRemove(key) {
    console.log('remove', key)
    confirm({
      title: '删除',
      content: '确实要删除该配置吗？',
      okText: '确定',
      cancelText: '取消',
      onOk() {

      },
      onCancel() { },
    })
  }

  setVisible (value) {
    this.setState({
      visible: value,
    })
  }

  render () {
    return (
      <Page inner>
        <AddModal visible={this.state.visible} setVisible={() => this.setVisible()} />
        <Tabs type="editable-card" onEdit={(key, action) => this[`on${capitalize(action)}`](key)}>
          {this.state.allflows.map((data, key) => (
            <TabPane key={key} tab={data.name} >
              <Flow flow={data} />
            </TabPane>
          ))}
        </Tabs>
      </Page>
    )
  }
}

export default Index
