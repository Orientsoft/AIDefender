import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon } from 'antd'
import { connect } from 'dva'
import { Link } from 'react-router-dom'

class Menus extends React.Component {
  onSubMenuClick (e) {
    this.props.dispatch({ type: 'app/setActiveSubMenu', payload: e.key })
  }

  // 递归生成菜单
  getMenus () {
    const { menu, subMenus, siderFold } = this.props;
    return menu.map((item) => {
      if (item.id === '3'/* 系统查询 */) {
        return (
          <Menu.SubMenu
            key={item.id}
            title={<span>
              {item.icon && <Icon type={item.icon} />}
              {(!siderFold || !menu.includes(item)) && item.name}
            </span>}
          >
            {
              subMenus.map((sub) => {
                return (
                  <Menu.Item key={sub.name}>
                    <Link to={item.route || '#'} replace>{sub.name}</Link>
                  </Menu.Item>
                )
              })
            }
          </Menu.SubMenu >
        )
      }
      return (
        <Menu.Item key={item.id} >
          <Link to={item.route || '#'}>
            {item.icon && <Icon type={item.icon} />}
            {(!siderFold || !menu.includes(item)) && item.name}
          </Link>
        </Menu.Item>
      )
    })
  }

  render () {
    const { darkTheme, siderFold } = this.props
    return (
      <Menu
        mode={siderFold ? 'vertical' : 'inline'}
        theme={darkTheme ? 'dark' : 'light'}
        // selectedKeys={defaultSelectedKeys}
        onClick={e => this.onSubMenuClick(e)}
      >
        {this.getMenus()}
      </Menu>
    )
  }
}

Menus.propTypes = {
  menus: PropTypes.object,
  menu: PropTypes.array,
  subMenus: PropTypes.array,
  siderFold: PropTypes.bool,
  darkTheme: PropTypes.bool,
  dispatch: PropTypes.func,
}

export default connect(state => ({ menus: state.menus }))(Menus)
