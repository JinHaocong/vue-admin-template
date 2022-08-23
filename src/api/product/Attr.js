/*
 * @Author: Jin Haocong
 * @Date: 2022-08-22 15:02:17
 * @LastEditTime: 2022-08-23 14:46:40
 */

// 平台属性的请求接口
import request from '@/utils/brand-request'

// 获取一级分类
export const reqCategory1List = () => request({
  url: '/admin/product/getCategory1',
  method: 'get'
})

// 获取二级分类
export const reqCategory2List = (category1Id) => request({
  url: `/admin/product/getCategory2/${category1Id}`,
  method: 'get'
})

// 获取三级分类
export const reqCategory3List = (category2Id) => request({
  url: `/admin/product/getCategory3/${category2Id}`,
  method: 'get'
})

// 获取平台属性
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({
  url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  method: 'get'
})

// 添加属性与属性值
export const reqAddorUpdateAttr = (data) => request({
  url: '/admin/product/saveAttrInfo',
  method: 'post',
  data
})

// 删除整条属性
export const reqDeleteAttr = (attrId) => request({
  url: `/admin/product/deleteAttr/${attrId}`,
  method: 'delete'
})

