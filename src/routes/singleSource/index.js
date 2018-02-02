import React from 'react'
import { Page } from 'components'
import { DS_CONFIG } from 'services/consts'
import { Row, Col, Select, Input, Button, Modal, Form, AutoComplete } from 'antd'
import { connect } from 'dva'
import elasticsearch from 'elasticsearch-browser'
import PropTypes from 'prop-types'
import values from 'lodash/values'
import forEach from 'lodash/forEach'
import flatten from 'lodash/flatten'
import getMappings from 'utils/fields'
import styles from './index.less'
import AddForm from './AddForm'
import EditForm from './EditForm'

const { Option } = Select
const FormItem = Form.Item

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      visibleEdit: false,
      allIndexs: [],
      indices: [],
      allFields: [],
      addData: {
        type: DS_CONFIG,
        name: '',
        host: '',
        index: '',
        fields: [],
        timestamp: '@timestamp',
        allfields: [],
      },
      originSource: props.singleSource.singleSource,
      xfields: {},
    }
  }

  componentWillMount() {
    this.props.dispatch({ type: 'singleSource/querySingleSource', payload: { type: DS_CONFIG, } })
  }

  render() {
    const { index, fields, allSingleSource, singleSource } = this.props.singleSource
    const { addData, originSource } = this.state

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      className: styles.formItem
    }
    const formItemLayoutSelect = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
      className: styles.formItem
    }

    return (
      <Page inner>
        <p className="headerManager">定义单数据源：</p>
        <div>
          <Button type="primary" icon="plus" onClick={() => this.setVisible(true)}>添加数据</Button>
          <div>
            <AddForm visible={this.state.visible} setVisible={() => this.setVisible()} />
            <EditForm visible={this.state.visibleEdit} setVisible={() => this.setEditVisible()} />

            <Row gutter={5} className={styles.sourceContent}>
              <Col span={3} className="gutter-row">主机:</Col>
              <Col span={4} className="gutter-row">索引:</Col>
              <Col span={3} className="gutter-row">时间:</Col>
              <Col span={8} className="gutter-row">字段:</Col>
              <Col span={2} className="gutter-row">名称:</Col>
            </Row>
            <div>
              {allSingleSource && allSingleSource.map((item, key) => {
                return (<Row gutter={5} key={key}>
                  <Col span={3} className="gutter-row">
                    <Input value={item.host} disabled key={key} />
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
                  <Col span={2} className="gutter-row">
                    <Input value={item.name} disabled key={key} />
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

  onDeleteSource(key, id) {
    this.props.dispatch({ type: 'singleSource/delChoosedSource', payload: { id } })
  }

  onEditSource(key, id) {
    this.props.dispatch({ type: 'singleSource/queryChoosedSource', payload: { id } })
    this.setState({
      visibleEdit: true,
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible,
      originSource: nextProps.singleSource.singleSource,
    })
  }
  
  setVisible(visible) {
    this.setState({
      visible: visible,
    })
  }

  setEditVisible(visible) {
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


