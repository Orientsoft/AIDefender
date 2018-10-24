import React from 'react'
import { Row, Col, Icon } from 'antd'
// import { Page } from 'components'

export default class Index extends React.Component {
  render () {
    return (
      <Row type="flex" justify="center" align="middle">
        <Col>
          <div style={{ textAlign: 'center', marginTop: 100 }}>
            <Icon type="info-circle" theme="outlined" style={{ color: 'rgba(0,0,0,.45)', fontSize: 60 }} />
            <p style={{ marginTop: 10, color: 'rgba(0,0,0,.45)', fontSize: 18 }}>没有可见系统</p>
          </div>
        </Col>
      </Row>
    )
  }
}
