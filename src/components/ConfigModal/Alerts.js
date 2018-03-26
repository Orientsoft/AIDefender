import React from 'react'
import PropTypes from 'prop-types'
import noop from 'lodash/noop'
import { Select } from 'antd'
import { esClient } from 'utils/esclient'

const { Option } = Select

export default class Alerts extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.array,
  }

  constructor (props) {
    super(props)
    this.state = {
      indices: [],
      data: props.value,
    }
  }

  componentWillMount () {
    esClient.cat.indices({
      format: 'json',
      h: 'index',
    }).then((result) => {
      this.setState({
        indices: result.map(data => data.index),
      })
    })
  }

  _onChange (indices) {
    const { onChange = noop } = this.props
    const data = indices.map(index => ({ index, name: index }))

    this.setState({ data })
    onChange(data)
  }

  render () {
    const { data = [], indices } = this.state

    return (
      <div>
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="请选择"
          value={data.map(_data => _data.index)}
          onChange={e => this._onChange(e)}
        >
          {indices.map((index, key) => (
            <Option key={key} value={index}>{index}</Option>
          ))}
        </Select>
      </div>
    )
  }
}
