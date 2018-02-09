import React from 'react'
import { Page } from 'components'
import { DS_CONFIG, ALERT_CONFIG } from 'services/consts'
import { Row, Col, Select, Input, Button, Modal, Form, AutoComplete, Table, Icon } from 'antd'
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
    this.props.dispatch({ type: 'singleSource/querySingleSource', payload: { type: [DS_CONFIG, ALERT_CONFIG], } })
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
    const columns = [
      {
        title: '类别',
        dataIndex: 'type',
        key: 'type',
        render: text => text === DS_CONFIG ? <span><Icon type="database" /> 普通数据</span> : <span><Icon type="warning" style={{'color': 'red'}} /> 告警数据</span>
      }, {
        title: '名称',
        dataIndex: 'name',
        key: 'name', 
      }, {
        title: '索引',
        dataIndex: 'index',
        key: 'index', 
      }, {
        title: '时间',
        dataIndex: 'timestamp',
        key: 'timestamp', 
      }, {
        title: '字段',
        key: 'fields',
        render: (text, item)  => (
          <div>
            {item.fields.map(e => `${e.field}=${e.label}`).join('  ,  ')}
          </div>
        )
      }, {
        title: '操作',
        key: 'action',
        render: (text, item) => (
          <div>
            <a onClick={() => this.onEditSource(item._id)}>编辑</a>
            <a onClick={() => this.onDeleteSource(item._id)} style={{'marginLeft': '10px'}}>删除</a>
          </div>
        )
      }
    ]
    allSingleSource.forEach((item, i) => item.key = i)
    return (
      <Page inner>
        <p className="headerManager">数据源设置</p>
        <div>
          <div>
            <AddForm visible={this.state.visible} setVisible={() => this.setVisible()} />
            <EditForm visible={this.state.visibleEdit} setVisible={() => this.setEditVisible()} />

            <Table columns={columns} dataSource={allSingleSource} />
            
          </div>
          <Button type="primary" icon="plus" onClick={() => this.setVisible(true)}>添加数据</Button>
        </div>
      </Page>
    )
  }

  onDeleteSource(id) {
    this.props.dispatch({ type: 'singleSource/delChoosedSource', payload: { id } })
  }

  onEditSource(id) {
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


