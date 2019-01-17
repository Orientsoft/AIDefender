import { request } from 'utils'
import config from 'config'
import createHash from 'create-hash/browser'

const { userLogin, userRegister } = config.api
let retryCount = 0
let totalSecond = 0
let retryTimer = null

export async function login (data) {
  const hash = createHash('sha256')
  hash.update(data.password)
  data.password = hash.digest('hex').toString()

  if (totalSecond !== 0) {
    return Promise.resolve({
      data: {
        success: false,
        message: `请等待${totalSecond}秒后重试`,
      },
    })
  }

  return request({
    url: userLogin,
    method: 'post',
    data,
  }).then((res) => {
    if (res && res.data && !res.data.success) {
      retryCount += 1
      totalSecond = retryCount * 3

      retryTimer = setInterval(() => {
        if (--totalSecond <= 0) {
          clearInterval(retryTimer)
        }
      }, 1000)
    } else {
      retryCount = 0
      totalSecond = 0
      clearInterval(retryTimer)
    }

    return res
  })
}

export async function register (data) {
  const hash = createHash('sha256')
  hash.update(data.password)
  data.password = hash.digest('hex').toString()

  return request({
    url: userRegister,
    method: 'post',
    data,
  })
}
