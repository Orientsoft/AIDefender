import axios from 'axios'
import { message } from 'antd'
import config from '../../app.json'

const request = axios.create({
  baseURL: process.env['PROXY_API'] || config.apiBaseURL,
})

request.interceptors.response.use((response) => {
  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText,
  }
}, (error) => {
  if (error.response) {
    const { status, data } = error.response

    if (status === 500) {
      console.error('内部错误，请联系管理员')
    } else if (status === 400 && data) {
      message.error(data.message)
    }
  }

  return Promise.reject(error)
})

export default request
