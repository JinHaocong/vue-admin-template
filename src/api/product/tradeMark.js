/*
 * @Author: Jin Haocong
 * @Date: 2022-08-22 15:02:12
 * @LastEditTime: 2022-08-22 22:23:13
 */
import request from '@/utils/brand-request'
// 获取的是品牌管理数据

// 获取品牌列表接口
export const reqTradeMark = (page, limit) => request({
  url: `/admin/product/baseTrademark/${page}/${limit}`,
  method: 'get'
})

// 添加品牌
export const reqAddorUpdateTradeMark = (tradeMark) => {
  // 带有id是修改
  if (tradeMark.id) {
    return request({
      url: '/admin/product/baseTrademark/update',
      method: 'put',
      data: tradeMark
    })
  } else {
    // 添加品牌
    return request({
      url: '/admin/product/baseTrademark/save',
      method: 'post',
      data: tradeMark
    })
  }
}

// 删除品牌
export const reqDeleteTradeMark = (id) => request({
  url: `/admin/product/baseTrademark/remove/${id}`,
  method: 'delete'
})
