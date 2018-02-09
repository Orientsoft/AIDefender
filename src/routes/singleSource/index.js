import React from 'react'
import { Page } from 'components'
import { DS_CONFIG, ALERT_CONFIG } from 'services/consts'
import { Row, Col, Select, Input, Button, Form } from 'antd'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import styles from './index.less'
import AddForm from './AddForm'
import EditForm from './EditForm'

class Index extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: false,
      visibleEdit: false,
    }
  }

  componentWillMount () {
    this.props.dispatch({ type: 'singleSource/querySingleSource', payload: { type: [DS_CONFIG, ALERT_CONFIG], } })
  }

  render () {
    const { allSingleSource } = this.props.singleSource

    return (
      <Page inner>
        <p className="headerManager">定义单数据源：</p>
        <div>
          <Button type="primary" icon="plus" onClick={() => this.setVisible(true)}>添加数据</Button>
          <div>
            <AddForm visible={this.state.visible} setVisible={() => this.setVisible()} />
            <EditForm visible={this.state.visibleEdit} setVisible={() => this.setEditVisible()} />

            <Row gutter={5} className={styles.sourceContent}>
              <Col span={3} className="gutter-row">类别:</Col>
              <Col span={2} className="gutter-row">名称:</Col>
              <Col span={4} className="gutter-row">索引:</Col>
              <Col span={3} className="gutter-row">时间:</Col>
              <Col span={8} className="gutter-row">字段:</Col>
            </Row>
            <div>
              {allSingleSource && allSingleSource.map((item, key) => {
                return (<Row gutter={5} key={key}>
                  <Col span={3} className="gutter-row">
                    <Input value={item.type === DS_CONFIG ? '普通数据' : '告警数据'} disabled key={key} />
                  </Col>
                  <Col span={2} className="gutter-row">
                    <Input value={item.name} disabled key={key} />
                  </Col>
                  <Col span={4} className="gutter-row">
                    <Input value={item.index} disabled key={key} />
                  </Col>
                  <Col span={3} className="gutter-row">
                    <Input value={item.timestamp} disabled key={key} />
                  </Col>
                  <Col span={8} className="gutter-row">
                    <Select
                      mode="tags"
                      value={item.fields.map(e => `${e.field}=${e.label}`)}
                      style={{ width: '100%' }}
                      disabled
                      key={key}
                    />
                  </Col>
                 
                  <Col span={4} className="gutter-row">
                    <Button onClick={() => this.onEditSource(key, item._id)} >编辑</Button>
                    <Button onClick={() => this.onDeleteSource(key, item._id)}>删除</Button>
                  </Col>
                </Row>)
              })}
            </div>
          </div>
        </div>
      </Page>
    )
  }

  onDeleteSource (key, id) {
    this.props.dispatch({ type: 'singleSource/delChoosedSource', payload: { id } })
  }

  onEditSource (key, id) {
    this.props.dispatch({ type: 'singleSource/queryChoosedSource', payload: { id } })
    this.setState({
      visibleEdit: true,
    })
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      visible: nextProps.visible,
    })
  }

  setVisible (visible) {
    this.setState({
      visible,
    })
  }

  setEditVisible (visible) {
    this.setState({
      visibleEdit: visible,
    })
  }
}

Index.propTypes = {
  singleSource: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect((state) => { return ({ singleSource: state.singleSource }) })(Index)
