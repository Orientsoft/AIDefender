import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Page } from 'components';
import { Button, Card } from 'antd';
import DataSourceItem from './DataSourceItem';

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
          <p className='headerManager'>定义单数据源：</p>
          <Button type="primary" icon="plus" onClick={() => this.setVisible(true)}>添加数据</Button>
          <DataSourceItem visible={this.state.hide} setVisible={() => this.setVisible()} />
      </Page>
    )
  }

}

Index.propTypes = {
  singleSource: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps(state) {
  return { singlesource: state.singleSource };
}

export default connect(mapStateToProps, (dispatch) => ({

}))(Index)

