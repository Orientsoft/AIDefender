import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Input, Checkbox, Button } from 'antd'
import { DataTable } from 'components'
import styles from './index.less'

const CheckboxGroup = Checkbox.Group
const { Search } = Input

const filterFields = [
  { label: '交易码', value: 'TranCode' },
  { label: '耗时', value: 'TranTime' },
  { label: '交易内容', value: 'TranContent' },
  { label: '非成功交易', value: 'TranFailed' },
]

export default class Index extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onPageChange = this.onPageChange.bind(this);
    this.getPageCount = this.getPageCount.bind(this);
  }
  
  render () {
    const { data = {} } = this.props

    return (
      <div>
        <div>
          <Row type="flex" align="middle" className={styles.field}>
            <Col span={2}>
              <label>快速选择：</label>
            </Col>
            <Col span={22}>
              <CheckboxGroup options={filterFields} />
            </Col>
          </Row>
          <Row type="flex" align="middle" className={styles.field}>
            <Col span={2}>
              <label>过滤条件：</label>
            </Col>
            <Col span={22}>
              <Search
                onSearch={value => console.log(value)}
                enterButton
              />
            </Col>
          </Row>
          <Row type="flex" align="middle" className={styles.field}>
            <Col span={2}>
              <label>查询条件：</label>
            </Col>
            <Col span={22}>
              <Button type="primary">保存查询条件</Button>
            </Col>
          </Row>
        </div>
        <DataTable data={data} onPageChange={this.onPageChange} getPageCount={this.getPageCount}/>
      </div>
    )
  }

  onPageChange(currentPage, pageSize){
    this.props.onPageChange(currentPage, pageSize)
  }

  getPageCount(pageCount) {
    this.pageCount = pageCount
    console.log('父组件收到的pageCount=' + this.pageCount);
  }
}

Index.propTypes = {
  data: PropTypes.object,
}
