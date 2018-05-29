import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { color } from 'utils'
import { Page, Vizceral } from 'components'
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
  }],
}

function Dashboard ({ dashboard, loading }) {
  return (
    <Page className={styles.dashboard}>
      <Vizceral traffic={trafficData} />
    </Page>
  )
}

Dashboard.propTypes = {
  dashboard: PropTypes.object,
  loading: PropTypes.object,
}

export default connect(({ dashboard, loading }) => ({ dashboard, loading }))(Dashboard)
