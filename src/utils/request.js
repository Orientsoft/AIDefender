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
})

export default request
