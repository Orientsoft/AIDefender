import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Input, InputNumber, DatePicker, Cascader, Select, Tag, Button } from 'antd'
import { DataTable } from 'components'
import moment from 'moment'
import noop from 'lodash/noop'
import isPlainObject from 'lodash/isPlainObject'
import utils from 'utils'
import styles from './index.less'

const InputGroup = Input.Group
const { Option } = Select
const { RangePicker } = DatePicker
const initialDateRangeOptions = {
  今天: [moment().startOf('day'), moment()],
  本周: [moment().startOf('week'), moment()],
  本月: [moment().startOf('month'), moment()],
  最近三月: [moment().subtract(3, 'month'), moment()],
  最近半年: [moment().subtract(6, 'month'), moment()],
  最近一年: [moment().startOf('year'), moment()],
}

export default class Index extends React.Component {
  activeField = []
  activeOperator = '='

  constructor (props) {
    super(props)
    this.state = {
      filters: props.config.queryCondition,
      disableAdd: true,
      disabledOptList: [],
    }
  }

  onPaginationChange = (currentPage, pageSize) => {
    const { onPageChange = noop } = this.props

    onPageChange(this.state.filters, currentPage, pageSize)
  }

  onDisableRangeDate = (date) => {
    return date && date.isAfter(moment())
  }

  onDisableRangeTime = (_, partial) => {
    if (partial === 'end') {
      const now = moment()
      const range = start => Array(60 - start).fill(0).map((_, i) => start + i + 1)

      return {
        disabledHours: () => range(now.hour()),
        disabledMinutes: () => range(now.minute()),
        disabledSeconds: () => range(now.second()),
      }
    }
    return null
  }

  onDateRangeChange = (dates, dateString) => {
    this.props.dispatch({ type: 'systemquery/setDateRange', payload: dates })
    this.onAddFilter({
      type: 'dateRange',
      field: [{ label: '@timestamp', value: dates }],
      operator: '=',
      value: `${dateString[0]} ~ ${dateString[1]}`,
    })
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

  onAddFilter = (filter) => {
    const { filters, activeValue } = this.state

    if (isPlainObject(filter)) {
      const oldFilter = filters.find(f => f.type === filter.type)

      if (oldFilter) {
        Object.assign(oldFilter, filter)
      } else {
        filters.push(filter)
      }
      this.setState({ filters })
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
      })
    }
    this.props.dispatch({ type: 'systemquery/query', payload: filters })
  }

  onRemoveFilter = (target) => {
    const { filters } = this.state
    const remainFilters = filters.filter((filter) => {
      return !((filter.field === target.field) && (filter.operator === target.operator) && (filter.value === target.value))
    })
    console.log('remain: ', remainFilters)

    this.setState({
      filters: remainFilters,
    })
    this.props.dispatch({ type: 'systemquery/query', payload: remainFilters })
  }

  componentWillMount () {
    const { dateRange } = this.props.config

    this.onFieldChange([], [])
    this.onAddFilter({
      type: 'dateRange',
      field: [{ label: '@timestamp', value: dateRange }],
      operator: '=',
      value: `${dateRange[0].format('YYYY-MM-DD HH:mm:ss')} ~ ${dateRange[1].format('YYYY-MM-DD HH:mm:ss')}`,
    })
  }

  render () {
    const { queryConfig, queryResult, dateRange } = this.props.config
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
              <label>时间范围：</label>
            </Col>
            <Col span={22}>
              <RangePicker
                ranges={initialDateRangeOptions}
                showTime
                defaultValue={dateRange}
                placeholder={['开始日期', '结束日期']}
                format="YYYY/MM/DD HH:mm:ss"
                onChange={this.onDateRangeChange}
                disabledDate={this.onDisableRangeDate}
                disabledTime={this.onDisableRangeTime}
              />
            </Col>
          </Row>
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
              {filters.map((filter, key) => (
                <Tag key={key} closable onClose={() => this.onRemoveFilter(filter)}>
                  {filter.field.map(origin => origin.label).join('/')}<span style={{ color: '#1890ff', margin: '0 1em' }}>{filter.operator}</span>{filter.value}
                </Tag>
              ))}
              <Button type="primary">保存查询条件</Button>
            </Col>
          </Row>
        </div>
        <DataTable data={{ columns: queryConfig, dataSource: queryResult }} onPageChange={this.onPaginationChange} />
      </div>
    )
  }
}

Index.propTypes = {
  config: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  onPageChange: PropTypes.func,
}
