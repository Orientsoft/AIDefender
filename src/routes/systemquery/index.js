import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Card } from 'antd'
import { Page, ConfigModal, DataTable } from 'components'


const Index = ({
  systemquery, dispatch, loading, location,
}) => {
  return (<Page inner>
    {/* <div>
        <ConfigModal isVisiable={true} nodeName="节点名"/>
      </div> */}
      <div>
        <Card>
          <DataTable />
        </Card>
      </div>
  </Page>)
}

Index.propTypes = {
  singlequery: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ systemquery, loading }) => ({ systemquery, loading }))(Index)
