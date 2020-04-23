/**
 * 基于axios封装的请求模块
 */
import axios from 'axios'

// 创建axios实例,复制axios
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
})

// 请求拦截器

// 导出请求方法
export default request
