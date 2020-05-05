/**
 * 图片相关的接口
 */

//  加载request
import request from '@/utils/request'

// 上传图片
export const uploadImages = data => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/user/images',
    // 上传图片之类的文件,要求conten-type为multipart/form-data 传递使用file  使用FormData()
    data
  })
}

// 获取图片素材
export const getImages = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/images',
    params
  })
}

// 收藏用户图片素材
export const collectImage = (imageId, collect = false) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/user/images/${imageId}`,
    data: {
      collect
    }
  })
}

// 删除图片素材
export const deleteImage = imageId => {
  return request({
    method: 'DELETE',
    url: `/mp/v1_0/user/images/${imageId}`
  })
}
