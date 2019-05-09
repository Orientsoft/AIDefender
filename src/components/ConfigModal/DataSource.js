import React from 'react'
import PropTypes from 'prop-types'
import noop from 'lodash/noop'
import { Select, Collapse } from 'antd'

const { Option } = Select
const { Panel } = Collapse

export default class DataSource extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.array,
    defaultValue: PropTypes.array,
  }

  constructor (props) {
    super(props)
    this.state = {
      data: props.value,
    }
  }

  _onChange (ids) {
    const { onChange = noop } = this.props

    this.setState({
      data: ids,
    })
    onChange(ids)
  }

  render () {
    const { data = [] } = this.state
    const { defaultValue = [] } = this.props

    return (
      <div>
        <Select
          showSearch
          optionFilterProp="children"
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="请选择"
          value={data}
          onChange={e => this._onChange(e)}
        >
          {defaultValue.map((dv, key) => (
            <Option key={key} value={dv._id}>{dv.name}</Option>
          ))}
        </Select>
        <Collapse style={{ marginTop: '1em' }} bordered={false}>
          {data.map((id) => {
            const dv = defaultValue.find(v => v._id === id)
            return dv && (
              <Panel header={`${dv.name} (${dv._id})`} key={dv._id}>
                {JSON.stringify(dv)}
              </Panel>
            )
          })}
        </Collapse>
      </div>
    )
  }
}
