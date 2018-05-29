import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { color } from 'utils'
import { Page, Vizceral } from 'components'
import { Breadcrumb } from 'antd'
import styles from './index.less'

const trafficData = {
  renderer: 'global',
  name: 'root',
  nodes: [{
    name: 'A',
  }, {
    name: 'B',
    renderer: 'region',
    nodes: [{
      name: 'BB',
      renderer: 'focusedChild',
    }, {
      name: 'BC',
      renderer: 'focusedChild',
    }],
    connections: [{
      source: 'BB',
      target: 'BC',
      metrics: {
        normal: 500,
        danger: 200,
      },
    }],
  }, {
    name: 'C',
    renderer: 'region',
  }, {
    name: 'D',
  }, {
    name: 'E',
  }, {
    name: 'F',
  }, {
    name: 'G',
  }],
  connections: [{
    source: 'A',
    target: 'B',
    metrics: {
      normal: 500,
      danger: 200,
    },
  }, {
    source: 'A',
    target: 'C',
    metrics: {
      normal: 500,
      danger: 200,
    },
  }, {
    source: 'B',
    target: 'D',
  }, {
    source: 'B',
    target: 'E',
  }, {
    source: 'B',
    target: 'F',
  }, {
    source: 'D',
    target: 'G',
  }],
}

class Dashboard extends React.Component {
  state = {
    views: [],
  }

  onViewChanged = (data) => {
    this.state.views = data.view
    this.setState(this.state)
  }

  onViewClick = (index) => {
    const { views } = this.state
    const newViews = ['global']

    if (index > 0) {
      for (let i = 0; i <= index; i++) {
        newViews[i] = views[i]
      }
    }
    this.setState({ views: newViews })
  }

  render () {
    const { views } = this.state

    if (views[0] === 'global') {
      views.shift()
    }

    return (
      <Page className={styles.dashboard}>
        <Breadcrumb separator=">">
          <Breadcrumb.Item
            href="javascript:void(0)"
            onClick={() => this.onViewClick(0)}
          >全部系统</Breadcrumb.Item>
          {views.map((view, i) => (
            <Breadcrumb.Item
              key={i}
              href="javascript:void(0)"
              onClick={() => this.onViewClick(i + 1)}
            >{view}</Breadcrumb.Item>
          ))}
        </Breadcrumb>
        <Vizceral
          traffic={trafficData}
          view={views}
          viewChanged={this.onViewChanged}
        />
      </Page>
    )
  }
}

Dashboard.propTypes = {
  dashboard: PropTypes.object,
  loading: PropTypes.object,
}

export default connect(({ dashboard, loading }) => ({ dashboard, loading }))(Dashboard)
