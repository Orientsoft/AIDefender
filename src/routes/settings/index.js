import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Page } from 'components'


const Index = ({
  settings, dispatch, loading, location,
}) => {


  return (<Page inner>
    
  </Page>)
}

Index.propTypes = {
  singlequery: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ settings, loading }) => ({ settings, loading }))(Index)
