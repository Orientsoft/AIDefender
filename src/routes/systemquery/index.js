import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page, MapNode } from 'components'
import { Tabs, Icon, Row, Col, DatePicker } from 'antd'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import datetime from 'utils/datetime'
import $ from 'jquery'
import 'ion-rangeslider'
import get from 'lodash/get'
import forEach from 'lodash/forEach'
import compact from 'lodash/compact'
import Query from './query'
import Alert from './alert'
import KPI from './kpi'
import styles from './index.less'

const { TabPane } = Tabs

function getChildrenData(node) {
  const data = {
    ds: [],
    alert: [],
    kpi: [],
  }

  if (node && node.data) {
    const { ds, kpi, alert } = node.data

    if (Array.isArray(ds)) {
      data.ds = data.ds.concat(...ds)
    }
    if (Array.isArray(kpi)) {
      data.kpi = data.kpi.concat(...kpi)
    }
    if (Array.isArray(alert)) {
      data.alert = data.alert.concat(...alert)
    }
  }
  if (node && Array.isArray(node.children)) {
    node.children.forEach((child) => {
      const childData = getChildrenData(child)

      data.ds = data.ds.concat(...childData.ds)
      data.kpi = data.kpi.concat(...childData.kpi)
      data.alert = data.alert.concat(...childData.alert)
    })
  }

  return data
}

class Index extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.onPageChange = this.onPageChange.bind(this)
  }

  componentWillMount () {
    const { match } = this.props

    if (match && match.params && match.params.uid) {
      this.updateStructure(match.params.uid)
    }
  }

  componentWillUnmount () {
    this.props.dispatch({ type: 'systemquery/setActiveNode', payload: null })
    this.props.dispatch({ type: 'systemquery/setStructure', payload: null })
    this.props.dispatch({ type: 'systemquery/setActiveTab', payload: { key: 0 } })
  }

  updateStructure (id) {
    const { dispatch, systemquery: { activeNode } } = this.props

    if (id) {
      dispatch({
        type: 'systemquery/getStructure',
        payload: {
          id,
          forceUpdate: activeNode,
        },
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    const { match } = nextProps
    const { systemquery, dispatch } = this.props
    const cid = get(systemquery.structure, '_id', '')
    const nid = get(nextProps.systemquery.structure, '_id', '')

    if (match && match.params && match.params.uid && this.props.match && this.props.match.params) {
      if (match.params.uid !== this.props.match.params.uid) {
        this.updateStructure(match.params.uid)
        return
      }
    }
    if (cid && nid && cid !== nid) {
      dispatch({
        type: 'systemquery/resetResult',
        payload: {
          activeNode: null,
        },
      })
    }
    if (!nextProps.systemquery.activeNode) {
      if (nextProps.systemquery.activeTab.key !== '0') {
        this.onActiveTabChange(0)
      }
    }
  }

  setDirty (isDirty) {
    this.props.dispatch({ type: 'app/setDirty', payload: isDirty })
  }

  getTab (key, type) {
    const { app, systemquery, dispatch } = this.props

    if (key === 0) {
      return (
        <MapNode
          nodes={systemquery.structure}
          mapNodeMode="query"
          onSelect={node => this.onSelectNode(node)}
          maxLevel="4"
          onContextMenuChange={() => this.setDirty(true)}
        />
      )
    }
    switch (type) {
      case 'kpi':
        return <KPI dispatch={dispatch} app={app} config={systemquery} />
      case 'alert':
        return <Alert dispatch={dispatch} app={app} config={systemquery} />
      case 'ds':
      default:
        return <Query dispatch={dispatch} app={app} config={systemquery} onPageChange={this.onPageChange} />
    }
  }

  onSelectNode (node) {
    const { dispatch, systemquery } = this.props
    // const { data = {} } = node
    const data = getChildrenData(node)

    node.data = data
    dispatch({ type: 'systemquery/setActiveNode', payload: node })

    if (!systemquery.activeNode
        || (systemquery.activeNode && (systemquery.activeNode.code !== node.code))) {
      dispatch({ type: 'systemquery/resetResult' })
    }
    if (data.ds && data.ds.length) {
      // dispatch({ type: 'systemquery/getCurrentSource', payload: data.ds[0] })
      dispatch({ type: 'systemquery/queryDSConfig', payload: data.ds })
    }
    if (data.kpi && data.kpi.length) {
      dispatch({ type: 'systemquery/queryKPIConfig', payload: data.kpi })
    }
    if (data.alert && data.alert.length) {
      dispatch({ type: 'systemquery/queryAlertConfig', payload: data.alert })
    }
  }

  initDateTimeSlider (el) {
    const { app: { globalTimeRange } } = this.props
    const max = +globalTimeRange[1].clone().endOf('day')
    const min = +globalTimeRange[0]

    if (this.slider) {
      this.slider.destroy()
    }
    if (!el) return

    $(el).ionRangeSlider({
      type: 'double',
      grid: true,
      to_shadow: true,
      force_edges: true,
      to_max: datetime().isSame(globalTimeRange[1], 'day') ? +datetime().endOf('day') : max,
      max,
      min,
      prettify: date => datetime(date, 'x').locale('zh-cn').format('YYYY-MM-DD HH:mm'),
      onFinish: this.onDateTimeSliderFinish.bind(this),
    })
    this.slider = $(el).data('ionRangeSlider')
    if (this.slider) {
      this.slider.update({
        from: +globalTimeRange[2],
        to: +globalTimeRange[3],
      })
    }
  }

  onDateTimeSliderFinish (data) {
    const { app: { globalTimeRange }, dispatch } = this.props

    globalTimeRange[2] = datetime(data.from)
    globalTimeRange[3] = datetime(data.to)

    // globalTimeRange[0].set({
    //   hour: from.hour(),
    //   minute: from.minute(),
    //   second: from.second(),
    // })
    // globalTimeRange[1].set({
    //   hour: to.hour(),
    //   minute: to.minute(),
    //   second: to.second(),
    // })
    dispatch({ type: 'app/setGlobalTimeRange', payload: globalTimeRange })
  }

  onDisableDate = (date, partial) => {
    const { globalTimeRange } = this.props.app
    const shouldDisable = date && date.isAfter(datetime())

    if (partial === 'start') {
      return shouldDisable || date.isAfter(globalTimeRange[1])
    }
    return shouldDisable || date.isBefore(globalTimeRange[0])
  }

  onDateChange = (date, dateString, partial) => {
    let { app: { globalTimeRange }, dispatch } = this.props

    if (partial === 'start') {
      globalTimeRange[0] = date
      globalTimeRange[2] = date
    } else {
      const now = datetime()
      globalTimeRange[1] = date
      globalTimeRange[3] = date.isSame(now, 'day') ? now : date.endOf('day')
    }
    dispatch({ type: 'app/setGlobalTimeRange', payload: globalTimeRange })
  }

  onGotoDate = (partial) => {
    const { app: { globalTimeRange }, dispatch } = this.props
    const end = globalTimeRange[1].clone()

    if (partial === 'prev') {
      globalTimeRange[0].subtract(1, 'days')
    } else if (end.add(1, 'days').isBefore(datetime())) {
      globalTimeRange[1].add(1, 'days')
    }
    dispatch({ type: 'app/setGlobalTimeRange', payload: globalTimeRange })
  }

  onPageChange (payload, queryConfig, currentPage, pageSize, index) {
    const { dispatch, app: { globalTimeRange } } = this.props
    dispatch({
      type: 'systemquery/query',
      payload: {
        filters: payload,
        queryConfig,
        dateRange: [globalTimeRange[2], globalTimeRange[3]],
      },
      currentPage,
      pageSize,
      index,
    })
  }

  componentWillUpdate () {
    const { dispatch, app: { isDirty }, systemquery } = this.props

    if (isDirty) {
      dispatch({ type: 'app/setDirty', payload: false })
      if (systemquery.structure) {
        this.updateStructure(systemquery.structure._id)
      }
    }
  }

  onActiveTabChange (key) {
    this.props.dispatch({
      type: 'systemquery/setActiveTab',
      payload: { key },
    })
  }

  render () {
    const { systemquery, app } = this.props
    let subMenus = []
    let activeTabKey = systemquery.activeTab.key
    const iTabKey = parseInt(activeTabKey, 10)

    if (systemquery.activeNode) {
      const data = getChildrenData(systemquery.activeNode)
      forEach(/* systemquery.activeNode. */data, (values, type) => {
        if (Array.isArray(values) && values.length) {
          const subMenu = systemquery.subMenus.find(menu => menu.type === type)

          if (subMenu) {
            subMenus.push({
              name: systemquery.activeNode.name + subMenu.name,
              type: subMenu.type,
            })
          }
        }
      })
      const sortMenus = []
      subMenus.forEach((menu) => {
        if (menu.type === 'kpi') {
          sortMenus[0] = menu
        } else if (menu.type === 'alert') {
          sortMenus[1] = menu
        } else if (menu.type === 'ds') {
          sortMenus[2] = menu
        } else {
          sortMenus.push(menu)
        }
      })
      subMenus = compact(sortMenus)
    }
    if (iTabKey > subMenus.length) {
      activeTabKey = `${subMenus.length}`
    }
    // 修正Tab跳转
    // subMenus.forEach(({ type }, i) => {
    //   if ((type === 'ds' && activeTabKey == '3')
    //     || (type === 'alert' && activeTabKey == '2')
    //     || (type === 'kpi' && activeTabKey == '1')) {
    //   }
    // })

    return (
      <div>
        <Row type="flex" justify="space-between" align="middle">
          <Col span={3} className={styles.offset}>
            <DatePicker locale={locale} onChange={(d, ds) => this.onDateChange(d, ds, 'start')} value={app.globalTimeRange[0]} allowClear={false} disabledDate={d => this.onDisableDate(d, 'start')} placeholder="开始日期" />
          </Col>
          <Col span={1} className={styles.offset}>
            <a title="前一天" className={styles.goto} onClick={() => this.onGotoDate('prev')}>&lt;&lt;</a>
          </Col>
          <Col span={16}>
            <input ref={el => this.initDateTimeSlider(el)} />
          </Col>
          <Col span={1} className={styles.offset} justify="center">
            <a title="后一天" className={styles.goto} onClick={() => this.onGotoDate('next')}>&gt;&gt;</a>
          </Col>
          <Col span={3} className={styles.offset}>
            <DatePicker locale={locale} onChange={(d, ds) => this.onDateChange(d, ds, 'end')} value={app.globalTimeRange[1]} allowClear={false} disabledDate={d => this.onDisableDate(d, 'end')} placeholder="结束日期" />
          </Col>
        </Row>
        <Page inner>
          {systemquery.structure && (
            <Tabs animated activeKey={activeTabKey} onChange={key => this.onActiveTabChange(key)}>
              {[systemquery.structure].concat(subMenus).map((tab, key) => {
                return (
                  <TabPane key={key} tab={<span><Icon type="setting" />{tab.name}</span>}>
                    {this.getTab(key, tab.type)}
                  </TabPane>
                )
              })}
            </Tabs>
          )}
        </Page>
      </div>
    )
  }
}

Index.propTypes = {
  systemquery: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  match: PropTypes.object,
}

export default connect(({ systemquery, app, loading }) => ({ app, systemquery, loading }))(Index)
