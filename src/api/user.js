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

// 获取用户信息
export const getUserProfile = () => {
  // const user = JSON.parse(window.localStorage.getItem('user'))
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/profile'
    // headers: {
    //   Authorization: `Bearer ${user.token}`
    // }
  })
}

// 获取粉丝列表
export const getFans = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/followers',
    params
  })
}

// 编辑用户资料
export const edituserProfile = data => {
  return request({
    method: 'PATCH',
    url: '/mp/v1_0/user/profile',
    data
  })
}

// 编辑用户头像
export const editUserPhoto = data => {
  return request({
    method: 'PATCH',
    url: '/mp/v1_0/user/photo',
    data
  })
}
