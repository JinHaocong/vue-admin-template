/*
 * @Author: Jin Haocong
 * @Date: 2022-08-22 15:02:24
 * @LastEditTime: 2022-08-24 17:21:12
 */
// sku接口
import request from '@/utils/brand-request'

// 获取sku列表
export const reqSkuList = (page, limit) => request({
  url: `/admin/product/list/${page}/${limit}`,
  method: 'get'
})

// 上架
export const reqOnSale = (skuId) => request({
  url: `/admin/product/onSale/${skuId}`,
  method: 'get'
})

// 下架
export const reqCancelSale = (skuId) => request({
  url: `/admin/product/cancelSale/${skuId}`,
  method: 'get'
})

// 查看详情
export const reqSkuInfo = (skuId) => request({
  url: `/admin/product/getSkuById/${skuId}`,
  method: 'get'
})

// 删除sku
export const reqDeleteSku = (skuId) => request({
  url: `/admin/product/deleteSku/${skuId}`,
  method: 'delete'
})
