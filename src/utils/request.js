import axios from 'axios'
import config from '../../app.json'
import { message, Modal } from 'antd'

const request = axios.create({
  baseURL: config.apiBaseURL,
})

request.interceptors.response.use((response) => {
  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText,
  }
}, (error) => {
  const response = error.response
  console.log('ERROR:' ,error.response)
  if(response.status === 400) {
    message.error(response.data.message)
  } else if(response.status === 500) {
    message.error('内部错误，请联系管理员')
  }
  // return Promise.reject(error)
  return Promise.reject(error)
})

export default request
