import axios from 'axios'
import { ElMessage } from 'element-plus'
import { setItem, getItem, removeItem } from '@/utils/useLocalStorage'

const instance = axios.create({
  timeout: 10000, // 超时时间
  withCredentials: true
})

// 请求时拦截
instance.interceptors.request.use(config => {
  // 权限控制, 当登录后才能操作其他请求
  if(config.url.indexOf('login') === -1) { // 拦截除登录之外的接口
    const token = getItem('token')
    if(token === null) { // 没权限访问
      ElMessage({
        type: 'error',
        message: '请先登录 !',
        duration: 2000
      })
      setTimeout(() => { // 未登录则自动跳转登录页面
        location.href = '/login'
      }, 1000)
    } else { // 有了token访问权限, 请求时自动携带token
      config.headers.token = token // token放在请求头中
      return config
    }
  } else return config
})
// 响应时拦截
instance.interceptors.response.use(res => {
  if(res.config.url.indexOf('login') !== -1) { // 当登录后, 将 token 存入本地存储
    setItem('token', res.headers.token)
  }
  if(res.data.msg === 'expired') {
    ElMessage({
      type: 'error',
      message: '登录过期, 请重新登录 !',
      duration: 2000
    })
    removeItem('token') // 过期后删除 token
    removeItem('userInfo')
    setTimeout(() => { // 登录过期则自动跳转登录页面
      location.href = '/login'
    }, 2000)
  } else return res.data
})

export default (config) => {
  return instance(config)
}