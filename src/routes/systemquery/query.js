import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Input, InputNumber, DatePicker, Modal, Divider, Cascader, Select, Icon, Button } from 'antd'
import { DataTable } from 'components'
import noop from 'lodash/noop'
import get from 'lodash/get'
import isPlainObject from 'lodash/isPlainObject'
import utils from 'utils'
import styles from './index.less'

const { confirm } = Modal
const InputGroup = Input.Group
const { Option } = Select

const FTag = ({ children, onClose }) => {
  return (<div className={styles.tag}>{children} <Icon type="close" onClick={onClose} /></div>)
}

export default class Index extends React.Component {
  activeField = []
  activeOperator = '='

  constructor (props) {
    super(props)
    const { config: { structure, activeNode, currentDataSouce } } = props
    this.allFilters = get(structure.querys, `${activeNode.code}`, [])
    this.state = {
      filters: get(this.allFilters, '0.filters', []),
      disableAdd: true,
      disabledOptList: [],
    }
  }

  componentWillReceiveProps (nextProps) {
    const {
      app: { globalTimeRange },
      config: {
        structure,
        activeNode,
        activeTab,
      },
    } = nextProps

    if (activeTab.payload) {
      this.query()
      return
    }
    if (this.currentTimeRange) {
      const isStartSame = this.currentTimeRange[0].isSame(globalTimeRange[2])
      const isEndSame = this.currentTimeRange[1].isSame(globalTimeRange[3])

      if (!(isStartSame && isEndSame)) {
        this.query()
      }
    }
    if (this.props.config.activeNode.code !== activeNode.code) {
      this.allFilters = get(structure.querys, `${activeNode.code}`, [])
      this.state.filters = get(this.allFilters, '0.filters', [])
      this.query()
    }
  }

  onPaginationChange = (currentPage, pageSize) => {
    const { onPageChange = noop, config: { queryConfig } } = this.props

    onPageChange(this.state.filters, queryConfig, currentPage, pageSize)
  }

  onFieldChange = (value, origin) => {
    const len = value.length
    const state = { disableAdd: !len }
    const field = len > 0 ? origin[len - 1] : { type: 'text' }

    this.activeField = origin

    switch (field.type) {
      case 'long':
      case 'integer':
      case 'short':
      case 'byte':
      case 'double':
      case 'float':
      case 'half_float':
      case 'scaled_float':
        this.buildInputField = val => (<InputNumber
          style={{ width: 200 }}
          placeholder="值"
          value={val}
          onChange={this.onNumberValueChange}
        />)
        state.activeValue = 0
        state.disableAdd = false
        state.disabledOptList = []
        break
      case 'date':
        this.buildInputField = () => (<DatePicker
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="选择日期"
          onChange={this.onDateValueChange}
          onOk={this.onDateValueChange}
        />)
        state.disableAdd = true
        state.disabledOptList = []
        break
      default:
        this.buildInputField = val => (<Input
          style={{ width: 200 }}
          placeholder="值"
          value={val}
          onChange={this.onTextValueChange}
        />)
        state.activeValue = ''
        state.disableAdd = true
        state.disabledOptList = ['<', '<=', '>', '>=']
    }
    this.setState(state)
  }

  onOperatorChange = (_, { props }) => {
    this.activeOperator = props.children
  }

  onTextValueChange = (e) => {
    const state = {
      activeValue: e.target.value.trim(),
    }

    if (state.activeValue.length && this.activeField.length) {
      state.disableAdd = false
    } else {
      state.disableAdd = true
    }
    this.setState(state)
  }

  onNumberValueChange = (value) => {
    this.setState({
      activeValue: value === undefined ? 0 : value,
      disableAdd: false,
    })
  }

  onDateValueChange = (e) => {

  }

  query () {
    const {
      app: { globalTimeRange },
      config: {
        currentDataSouce,
        queryConfig,
      },
      dispatch,
    } = this.props

    this.currentTimeRange = globalTimeRange.filter((_, i) => i === 2 || i === 3)
    if (this.state.filters && this.state.filters.length > 0) {
      dispatch({
        type: 'systemquery/query',
        payload: {
          filters: this.state.filters,
          queryConfig,
          dateRange: this.currentTimeRange,
        },
      })
    } else {
      dispatch({
        type: 'systemquery/query',
        payload: {
          filters: [],
          queryConfig,
          dateRange: this.currentTimeRange,
          dataSource: currentDataSouce,
        },
      })
    }
  }

  onAddFilter = (filter) => {
    const { filters, activeValue } = this.state

    if (isPlainObject(filter)) {
      const oldFilter = filters.find(f => f.type === filter.type)

      if (oldFilter) {
        Object.assign(oldFilter, filter)
      } else {
        filters.push(filter)
      }
      this.setState({ filters }, () => this.query())
    } else if (this.activeField.length && activeValue !== '') {
      filters.push({
        field: this.activeField,
        operator: this.activeOperator,
        value: activeValue,
      })
      this.setState({
        filters,
        disableAdd: true,
        activeValue: '',
      }, () => this.query())
    }
  }

  onRemoveFilter = (target) => {
    const { filters } = this.state
    const remainFilters = filters.filter((filter) => {
      return !((filter.field === target.field) && (filter.operator === target.operator) && (filter.value === target.value))
    })

    this.state.filters = remainFilters
    this.props.dispatch({
      type: 'systemquery/query',
      payload: {
        filters: remainFilters,
        dateRange: this.props.app.globalTimeRange,
      },
    })
  }

  showSaveModal = (placeholder, onNameChange, onOk) => confirm({
    title: '保存查询条件',
    content: (
      <Row type="flex" align="middle" style={{ marginTop: '1.5em' }}>
        <Col span={4}><span>名称：</span></Col>
        <Col span={20}>
          <Input onChange={onNameChange} placeholder={placeholder} />
        </Col>
      </Row>
    ),
    onOk,
    okText: '确认',
    cancelText: '取消',
    destroyOnClose: true,
  })

  onSaveQuery = () => {
    const { dispatch, config: { structure, activeNode } } = this.props
    const placeholder = new Date().toJSON()
    let condName = ''

    structure.querys = structure.querys || {}
    if (!structure.querys[activeNode.code]) {
      structure.querys[activeNode.code] = []
    }

    this.showSaveModal(placeholder, (e) => {
      condName = e.target.value.trim()
    }, () => {
      if (!condName) condName = placeholder
      const historys = structure.querys[activeNode.code]
      const cond = historys.find(h => h.name === condName)

      if (cond) {
        cond.filters = this.state.filters
      } else {
        if (historys.length > 9) {
          historys.pop()
        }
        historys.unshift({
          name: condName,
          filters: this.state.filters,
        })
      }
      dispatch({ type: 'systemquery/saveQuery', payload: structure })
    })
  }

  onHistoryQueryChange = (name) => {
    const filters = this.allFilters.find(f => f.name === name)
    this.setState({ filters }, () => this.query())
  }

  componentWillMount () {
    this.onFieldChange([], [])
    this.query()
  }

  render () {
    const { queryConfig, queryResult } = this.props.config
    const {
      filters,
      disableAdd,
      disabledOptList,
      activeValue,
    } = this.state

    return (
      <div>
        <div>
          <Row type="flex" align="middle" className={styles.field}>
            <Col span={2}>
              <label>条件设置：</label>
            </Col>
            <Col span={22}>
              <InputGroup compact>
                <Cascader
                  options={queryConfig.map(cfg => ({
                    value: cfg.index,
                    label: cfg.name,
                    children: cfg.fields.map(({ field, label, type }) => ({
                      value: field,
                      label,
                      type,
                    })),
                  }))}
                  expandTrigger="hover"
                  onChange={this.onFieldChange}
                  placeholder="请选择字段"
                />
                <Select style={{ width: 60 }} defaultValue="eq" onSelect={this.onOperatorChange}>
                  {utils.operators.map(operator => (
                    <Option key={operator.value} disabled={disabledOptList.indexOf(operator.label) !== -1} value={operator.value}>{operator.label}</Option>
                  ))}
                </Select>
                {this.buildInputField(activeValue)}
                <Button type="primary" disabled={disableAdd} onClick={this.onAddFilter}>添加</Button>
              </InputGroup>
            </Col>
          </Row>
          <Row type="flex" align="middle" className={styles.field}>
            <Col span={2}>
              <label>查询条件：</label>
            </Col>
            <Col span={22}>
              <InputGroup compact>
                <Select
                  style={{ width: 170 }}
                  defaultValue={get(this.allFilters, '0.name', '')}
                  onSelect={this.onHistoryQueryChange}
                  placeholder="暂无查询历史"
                >
                  {this.allFilters.map(filter => (
                    <Option key={filter.name} value={filter.name}>{filter.name}</Option>
                  ))}
                </Select>
                <Button type="primary" onClick={this.onSaveQuery}>保存查询条件</Button>
              </InputGroup>
            </Col>
          </Row>
          <Row type="flex" align="middle" className={styles.field}>
            <Col>
              {filters.map((filter, key) => (
                <FTag key={key} onClose={() => this.onRemoveFilter(filter)}>
                  {filter.field && filter.field.map(origin => origin.label).join('/')}<span style={{ color: '#1890ff' }}>{filter.operator}</span>{filter.value}
                </FTag>
              ))}
            </Col>
          </Row>
        </div>
        <Divider />
        <p>找到 <span style={{ color: '#1890ff' }}>{queryResult.reduce((total, qr) => total + qr.total, 0)}</span> 条结果：</p>
        <DataTable data={{ columns: queryConfig, dataSource: queryResult }} onPageChange={this.onPaginationChange} />
      </div>
    )
  }
}

Index.propTypes = {
  config: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  onPageChange: PropTypes.func,
  app: PropTypes.object.isRequired,
}
