import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken, getExpireTimeToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api的base_url
  timeout: 15000 // 请求超时时间
})

// 用于记录是否正在刷新 token，以免同时刷新
window.isRefreshing = false

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    const expireTime = getExpireTimeToken()
    if (!window.isRefreshing && !expireTime) {
      window.isRefreshing = true
      return store.dispatch('user/refreshToken', config)
    }
    if (!window.isRefreshing) {
      config.headers['Authorization'] = 'Bearer ' + getToken()// 让每个请求携带自定义token 请根据实际情况自行修改
    }
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    console.log(response)
    debugger
    const res = response.data
    // if the custom code is not 00000, it is judged as an error.
    if (res.code && res.code !== '00000') {
      Message({
        message: res.data || res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 'A0230' || res.code === 'A0311') {
        // to re-login
        MessageBox.confirm('您已经登出，您可以取消停留在这个页面，或再次登录', '确认登出?', {
          confirmButtonText: '再次登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
        // 令牌无效！
      } else if (res.code === 'A1100') {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    }
    return res
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
