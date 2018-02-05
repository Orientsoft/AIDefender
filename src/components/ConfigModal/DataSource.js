import React from 'react'
import PropTypes from 'prop-types'
import noop from 'lodash/noop'
import { Select, Collapse } from 'antd'

const { Option } = Select
const { Panel } = Collapse

export default class DataSource extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    defaultValue: PropTypes.array,
  }

  constructor (props) {
    super(props)
    this.state = {
      data: [],
      defaultValue: props.defaultValue,
    }
  }

  _onChange (key) {
    const { onChange = noop } = this.props
    const value = key.map(i => this.state.defaultValue[i])

    this.setState({
      data: value,
    })
    onChange(value)
  }

  render () {
    const { defaultValue = [], data } = this.state

    return (
      <div>
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="请选择"
          onChange={value => this._onChange(value)}
        >
          {defaultValue.map((value, key) => (
            <Option key={key} value={key}>{value.name}</Option>
          ))}
        </Select>
        <Collapse style={{ marginTop: '1em' }} bordered={false}>
          {data.map(src => (
            <Panel header={`${src.name} (${src._id})`} key={src._id}>
              {JSON.stringify(src)}
            </Panel>
          ))}
        </Collapse>
      </div>
    )
  }
}
