/**
 * 基于axios封装的请求模块
 */
import axios from 'axios'
/**
 * 加载json-bigint模块大整数,解决数字过大问题
 */
import JSONbig from 'json-bigint'
// 在非组价中使用message
import { Message } from 'element-ui'
// 直接加载router
import router from '@/router'

// 创建axios实例,复制axios
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/',
  // 定义data就是后端返回的原始数据
  transformResponse: [function (data) {
    // 判断是不是过大的数据,不是直接返回,是转换
    try {
      return JSONbig.parse(data)
    } catch (err) {
      return data
    }
  }]

})

// 请求拦截器
request.interceptors.request.use(
  function (config) {
    const user = JSON.parse(window.localStorage.getItem('user'))
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 响应拦截器
// Add a response interceptor
request.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  if (error.response && error.response.status === 401) {
    // 跳转到登录界面
    // 清除本地本地存储中的用户登录状态
    window.localStorage.removeItem('user')
    router.push('/login')
    Message.error('登录状态无效,请重新登录')
  } else if (error.response.status === 400) {
    // 客户端请求参数错误
    Message.error('请求参数错误')
  } else if (error.response.status === 403) {
    // 没有操作权限,token未携带或过期
    Message({
      type: 'warning',
      message: '没有操作权限'
    })
  } else if (error.response.status >= 500) {
    // 服务端异常
    Message.error('服务端参数异常,请稍后重试')
  }
  return Promise.reject(error)
})

// 导出请求方法
export default request
