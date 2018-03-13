import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import capitalize from 'lodash/capitalize'
import styles from './index.less'
import { Tabs, Modal, Icon, Radio, Pagination } from 'antd'
import { Page } from 'components'
import AddModal from './AddModal'
import Flow from './Flow'
import History from '../../../components/TaskModal/History'

const { TabPane } = Tabs
const { confirm } = Modal

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      page: 1,
    }
  }
  componentWillMount() {
    this.props.dispatch({ type: 'flows/queryFlows' })
  }
  componentWillReceiveProps(nextProps) {
  }

  onGetPage(page, pageSize) {
    let pagination = {
      current: page,
      pageSize,
    }
    this.setState({
      page,
    })
    this.props.dispatch({ type: 'flows/queryFlows', payload: pagination })
  }
  onAdd() {
    this.setState({
      visible: true,
    })
  }

  onRemove(key) {
    const page = this.props.flows.allFlows.length === 1 ? 1 : this.state.page
    const { dispatch } = this.props
    confirm({
      title: '删除',
      content: '确实要删除该配置吗？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'flows/delChoosedSource',
          payload: {
            id: key,
            page,
          },
        })
      },
      onCancel() { },
    })
  }

  setVisible(value) {
    this.setState({
      visible: value,
    })
  }

  render() {
    const { allFlows = [], pagination = {} } = this.props.flows
    const { page } = this.state
    console.log('paginations', allFlows)
    return (
      <div>
        <Page inner>
          <AddModal visible={this.state.visible} setVisible={() => this.setVisible()} />
          <Tabs type="editable-card" onEdit={(key, action) => this[`on${capitalize(action)}`](key)}>
            {allFlows.map(data => (
              <TabPane key={data._id} tab={data.name} >
                <Flow flow={data} />
              </TabPane>
            ))}
          </Tabs>
        </Page>
        <Pagination onChange={(pages, pageSize) => this.onGetPage(pages, pageSize)} total={pagination.totalCount} current={page} pageSize={pagination.pageSize} className={styles.pagination} />
      </div>
    )
  }
}

export default connect((state) => { return ({ tasks: state.tasks, flows: state.flows }) })(Index)
