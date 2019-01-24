import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Input, Icon } from 'antd'
import { token } from '../../services/login'
// import { Link } from 'dva/router'
import config from '../../../app.json'
import styles from './index.less'

const FormItem = Form.Item

class Index extends React.Component {
  constructor (props) {
    super(props)
    let form = sessionStorage.getItem('AiDefenderLogin') /* eslint-disable-line */
    if (form) {
      try {
        form = JSON.parse(form)
        sessionStorage.removeItem('AiDefenderLogin') /* eslint-disable-line */
        this.props.dispatch({ type: 'login/login', payload: form })
      } catch (err) {
        // Ignore
      }
    }
  }

  genCodeImg = (el) => {
    if (!el) return

    token().then(({ data }) => {
      const ctx = el.getContext('2d')

      ctx.fillStyle = 'white'
      ctx.font = '25px Arial'
      ctx.textBaseline = 'top'
      ctx.lineWidth = 2
      ctx.fillRect(0, 0, el.width, el.height)
      for (let i = 4 + Math.ceil(Math.random() * 6); i > 0; i--) {
        ctx.beginPath()
        ctx.strokeStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
        ctx.moveTo(Math.ceil(Math.random() * el.width / 2), Math.ceil(Math.random() * el.height))
        ctx.lineTo(el.width / 2 + Math.ceil(Math.random() * el.width / 2), Math.ceil(Math.random() * el.height))
        ctx.stroke()
      }
      ctx.strokeText(data.token, 20, 4)
    })
  };

  handleOk () {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      this.props.dispatch({ type: 'login/login', payload: values })
    })
  }

  render () {
    const {
      getFieldDecorator,
      validateFieldsAndScroll,
    } = this.props.form
    return (
      <div className={styles.login}>
      <div className={styles.box}>
        <div className={styles.form}>
          <div className={styles.title}>
            {/* <img alt="logo" src={config.logo} /> */}
            <span>登录</span>
          </div>
          <form>
            <FormItem hasFeedback>
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input autoComplete="username"  onPressEnter={() => this.handleOk()} placeholder="用户名" prefix={<Icon type="user" style={{ color: 'rgba(255,255,255,.65)' }} />} />)}
            </FormItem>
            <FormItem hasFeedback>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input type="password" autoComplete="current-password" onPressEnter={() => this.handleOk()} placeholder="密码" prefix={<Icon type="key" style={{ color: 'rgba(255,255,255,.65)' }} />} />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('token', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input
                onPressEnter={() => this.handleOk()}
                placeholder="验证码"
                suffix={<canvas ref={this.genCodeImg} width="100" height="30" />}
              />)}
            </FormItem>
            <Row>
              <Button type="primary" onClick={() => this.handleOk()} >
                登录
              </Button>
            </Row>
            {/* <Row>
              <p style={{justifyContent: 'flex-end'}}><Link to="/register">注册账户</Link></p>
            </Row> */}
          </form>
        </div>
        <div className={styles.logo} style={{ backgroundColor: 'rgba(12,24,28,.68)' }}>
          <div>
            <img alt="logo" src={config.logo} />
            <p >{config.name}</p>
          </div>
        </div>
      </div>
      </div>
    )
  }
}
Index.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}
Index = Form.create({})(Index)
export default connect((state) => { return ({ login: state.login }) })(Index)

// const Login = ({
//   loading,
//   dispatch,
//   form: {
//     getFieldDecorator,
//     validateFieldsAndScroll,
//   },
// }) => {
//   function handleOk () {
//     validateFieldsAndScroll((errors, values) => {
//       if (errors) {
//         return
//       }
//       dispatch({ type: 'login/login', payload: values })
//     })
//   }

//   return (
//     <div className={styles.form}>
//       <div className={styles.logo}>
//         <img alt="logo" src={config.logo} />
//         <span>{config.name}</span>
//       </div>
//       <form>
//         <FormItem hasFeedback>
//           {getFieldDecorator('username', {
//             rules: [
//               {
//                 required: true,
//               },
//             ],
//           })(<Input autoComplete="username" onPressEnter={handleOk} placeholder="用户名" />)}
//         </FormItem>
//         <FormItem hasFeedback>
//           {getFieldDecorator('password', {
//             rules: [
//               {
//                 required: true,
//               },
//             ],
//           })(<Input type="password" autoComplete="current-password" onPressEnter={handleOk} placeholder="密码" />)}
//         </FormItem>
//         <Row>
//           <Button type="primary" onClick={handleOk} loading={loading.effects.login}>
//             登录
//           </Button>
//         </Row>
//       </form>
//     </div>
//   )
// }

// Login.propTypes = {
//   form: PropTypes.object,
//   dispatch: PropTypes.func,
//   loading: PropTypes.object,
// }

// export default connect(({ loading }) => ({ loading }))(Form.create()(Login))
