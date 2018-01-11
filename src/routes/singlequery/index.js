import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Page } from 'components'


const Index = ({
  singlequery, dispatch, loading, location,
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

export default connect(({ singlequery, loading }) => ({ singlequery, loading }))(Index)
