import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Page } from 'components';
import { Button, Card } from 'antd';
import MetricContent from './MetricContent'


class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hide: false
    }
  }

  setVisible(visible) {
    this.setState({
      hide: visible
    })
  }


  render() {
    return (
      <Page inner>
          <p className='headerManager'>定义指标：</p>
          <Button type="primary" icon="plus" onClick={() => this.setVisible(true)}>添加数据</Button>
          <MetricContent visible={this.state.hide} setVisible={() => this.setVisible()} />
      </Page>
    )
  }

}

Index.propTypes = {
  metric: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps(state) {
  return { metrics: state.metric };
}

export default connect(mapStateToProps, (dispatch) => ({

}))(Index)

