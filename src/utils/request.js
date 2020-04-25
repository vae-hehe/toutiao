/**
 * 基于axios封装的请求模块
 */
import axios from 'axios'
/**
 * 加载json-bigint模块大整数,解决数字过大问题
 */
import JSONbig from 'json-bigint'

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

// 导出请求方法
export default request
