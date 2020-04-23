/**
 * 存放用户的请求方式
 */
// 导入request
import request from '@/utils/request'

// 完成登录接口
export const Login = (data) => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/authorizations',
    data
  })
}
