import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import capitalize from 'lodash/capitalize'
// import styles from './index.less'
import { Tabs, Modal, Icon } from 'antd'
import { Page } from 'components'
import AddModal from './AddModal'
import Flow from './Flow'
import History from '../../../components/TaskModal/History'

const { TabPane } = Tabs
const { confirm } = Modal

class Index extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      // allflows: [
      //   { name: 'aa', data: [] },
      //   { name: 'bb', data: [] },
      // ],
      visible: false,
    }
  }
  componentWillMount () {
    this.props.dispatch({ type: 'flows/queryFlows' })
  }
  componentWillReceiveProps (nextProps) {
    // this.setState({
    //   allflows: nextProps.flows.allflows,
    // })
  }
  onAdd () {
    this.setState({
      visible: true,
    })
  }

  onRemove (key) {
    console.log('remove', key)
    const { dispatch } = this.props
    confirm({
      title: '删除',
      content: '确实要删除该配置吗？',
      okText: '确定',
      cancelText: '取消',
      onOk () {
        dispatch({
          type: 'flows/delChoosedSource',
          payload: { id: key },
        })
      },
      onCancel () {},
    })
  }

  setVisible (value) {
    this.setState({
      visible: value,
    })
  }

  render () {
    const { allFlows = [] } = this.props.flows
    return (
      <Page inner>
        <AddModal visible={this.state.visible} setVisible={() => this.setVisible()} />
        <Tabs type="editable-card" onEdit={(key, action) => this[`on${capitalize(action)}`](key)}>
          { allFlows.map(data => (
            <TabPane key={data.id} tab={data.name} >
              <Flow flow={data} />
            </TabPane>
          ))}
        </Tabs>
      </Page>
    )
  }
}

export default connect((state) => { return ({ tasks: state.tasks, flows: state.flows }) })(Index)
