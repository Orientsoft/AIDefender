import React from 'react'
import PropTypes from 'prop-types'
import noop from 'lodash/noop'
import { Select, Collapse, Checkbox, Icon } from 'antd'
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc'
import styles from './ConfigModal.less'

const { Option } = Select
const { Panel } = Collapse

export default class KPI extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.array,
    defaultValue: PropTypes.array,
  }

  constructor (props) {
    super(props)
    this.state = {
      data: props.value,
      sortable: false,
    }
  }

  _onChange (ids) {
    const { onChange = noop } = this.props

    this.setState({
      data: ids,
    })
    onChange(ids)
  }

  onSortableChange = (e) => {
    this.setState({
      sortable: e.target.checked,
    })
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { onChange = noop } = this.props

    this.setState({
      data: arrayMove(this.state.data, oldIndex, newIndex),
    }, () => onChange(this.state.data))
  }

  render () {
    const { data = [], sortable } = this.state
    const { defaultValue = [] } = this.props
    const SortableItem = SortableElement(({ value }) => {
      return <li className={styles.item}><Icon type="retweet" />{value}</li>
    })
    const SortableList = SortableContainer(({ style, items }) => {
      return (
        <ul style={style} className={styles.itemContainer}>
          {items.map((item, index) => {
            const dv = defaultValue.find(v => v._id === item)
            return dv && (
              <SortableItem key={dv._id} index={index} value={`${dv.name} (${dv._id})`} />
            )
          })}
        </ul>
      )
    })

    return (
      <div>
        <Select
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
        {data.length > 1 && (
          <div style={{ marginTop: '1em' }}>
            <Checkbox checked={sortable} onChange={this.onSortableChange}>启用排序(拖动下方文字调整图表展示顺序)</Checkbox>
          </div>
        )}
        {sortable ? (
          <SortableList style={{ marginTop: '1em' }} items={data} onSortEnd={this.onSortEnd} />
        ) : (
          <Collapse style={{ marginTop: '1em' }} bordered={false} className="sortable-list">
            {data.map((id) => {
              const dv = defaultValue.find(v => v._id === id)
              return dv && (
                <Panel header={`${dv.name} (${dv._id})`} key={dv._id}>
                  {JSON.stringify(dv)}
                </Panel>
              )
            })}
          </Collapse>
        )}
      </div>
    )
  }
}
