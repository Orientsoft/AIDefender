import React from 'react'
import { Row, Col } from 'antd'
// import { Page } from 'components'

export default class Index extends React.Component {
  render () {
    return (
      <Row type="flex" justify="center" align="middle">
        <Col>
          <div style={{ textAlign: 'center', marginTop: 100 }}>
            <h2>智能运维工作站</h2>
          </div>
        </Col>
      </Row>
    )
  }
}
