import axios from 'axios'
import config from '../../app.json'

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
  if (error.response.status === 500) {
    console.error('内部错误，请联系管理员')
  }

  return Promise.reject(error)
})

export default request
