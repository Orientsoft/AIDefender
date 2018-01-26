import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon } from 'antd'
import { connect } from 'dva'
import { Link } from 'react-router-dom'

class Menus extends React.Component {
  // 递归生成菜单
  getMenus() {
    const { menu, subMenus, siderFold } = this.props;
    return menu.map((item) => {
      if (item.id == '3' /* 系统查询 */) {
        return (
          <Menu.SubMenu
            key={item.id}
            title={<span>
              <Link to={item.route || '#'}>
                {item.icon && <Icon type={item.icon} />}
                {(!siderFold || !menu.includes(item)) && item.name}
              </Link>
            </span>}
          >
            {
              subMenus.map((sub, key) => {
                return (
                  <Menu.Item key={item.id + key}>
                    <Link to={item.route || '#'}>{sub}</Link>
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

  render() {
    const { darkTheme, siderFold, defaultSelectedKeys } = this.props;
    return (
      <Menu
        mode={siderFold ? 'vertical' : 'inline'}
        theme={darkTheme ? 'dark' : 'light'}
        selectedKeys={defaultSelectedKeys}
      >
        {this.getMenus()}
      </Menu>
    )
  }
}

Menus.propTypes = {
  menus: PropTypes.object,
  menu: PropTypes.array,
  siderFold: PropTypes.bool,
  darkTheme: PropTypes.bool,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
  location: PropTypes.object,
}

export default connect((state) => {
  console.log(state)
  return ({ menus: state.menus })
})(Menus)