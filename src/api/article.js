/**
 * 获取文章的接口系列
 */
import request from '@/utils/request'
// 获取文章列表
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/articles',
    // 处理query的数据需要用params
    params
  })
}
