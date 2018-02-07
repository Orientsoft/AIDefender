import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Input, Cascader, Select, Tag, Button } from 'antd'
import { DataTable } from 'components'
import utils from 'utils'
import styles from './index.less'

const InputGroup = Input.Group
const { Option } = Select

export default class Index extends React.Component {
  activeField = []
  activeOperator = '='

  state = {
    filters: [],
    disableAdd: true,
    activeValue: '',
  }

  onPageChange = (currentPage, pageSize) => {

  }

  onFieldChange = (value, origin) => {
    this.activeField = origin

    if (!value.length) {
      this.setState({
        disableAdd: true,
      })
    } else if (this.state.activeValue.length) {
      this.setState({
        disableAdd: false,
      })
    }
  }

  onOperatorChange = (_, { props }) => {
    this.activeOperator = props.children
  }

  onValueChange = (e) => {
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

  onAddFilter = () => {
    const { filters, activeValue } = this.state

    if (this.activeField.length && activeValue) {
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
      this.props.dispatch({ type: 'systemquery/query', payload: filters })
    }
  }

  onRemoveFilter = (target) => {
    const { filters } = this.state
    const remainFilters = filters.filter((filter) => {
      return !((filter.field === target.field) && (filter.operator === target.operator) && (filter.value === target.value))
    })

    this.setState({
      filters: remainFilters,
    })
    this.props.dispatch({ type: 'systemquery/query', payload: remainFilters })
  }

  render () {
    const { queryConfig, queryResult } = this.props.config
    const { filters, disableAdd, activeValue } = this.state

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
                    children: cfg.fields.map(field => ({
                      value: field.field,
                      label: field.label,
                    })),
                  }))}
                  expandTrigger="hover"
                  onChange={this.onFieldChange}
                  placeholder="请选择字段"
                />
                <Input
                  style={{ width: 300 }}
                  placeholder="值"
                  value={activeValue}
                  addonBefore={
                    <Select style={{ width: 60 }} defaultValue="eq" onSelect={this.onOperatorChange}>
                      {utils.operators.map(operator => (
                        <Option key={operator.value} value={operator.value}>{operator.label}</Option>
                      ))}
                    </Select>
                  }
                  onChange={this.onValueChange}
                />
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
        <DataTable data={{}} onPageChange={this.onPageChange} />
      </div>
    )
  }
}

Index.propTypes = {
  config: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
}
