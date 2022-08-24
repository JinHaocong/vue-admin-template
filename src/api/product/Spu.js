/*
 * @Author: Jin Haocong
 * @Date: 2022-08-22 15:02:20
 * @LastEditTime: 2022-08-24 15:54:31
 */
// spu接口
import request from '@/utils/brand-request'

// 获取spu列表接口
export const reqSpuList = (page, limit, category3Id) => request({
  url: `/admin/product/${page}/${limit}`,
  method: 'get',
  // kv一致省略v
  params: { category3Id }
})

// 获取spu信息接口
export const reqSpuInfo = (spuId) => request({
  url: `/admin/product/getSpuById/${spuId}`,
  method: 'get'
})

// 获取品牌信息接口
export const reqTradeMarkList = () => request({
  url: '/admin/product/baseTrademark/getTrademarkList',
  method: 'get'
})

// 获取spu图片的接口
export const reqImageList = (spuId) => request({
  url: `/admin/product/spuImageList/${spuId}`,
  method: 'get'
})

// 获取所有销售属性 一共三个
export const reqSaleAttrList = () => request({
  url: '/admin/product/baseSaleAttrList',
  method: 'get'
})

// 修改或添加spu保存按钮 带id是修改 不带id是添加
export const reqAddOrUpdateSpu = (spuInfo) => {
  if (spuInfo.id) {
    // 带id是更新
    return request({
      url: '/admin/product/updateSpuInfo',
      method: 'post',
      data: spuInfo
    })
  } else {
    // 不带id是添加
    return request({
      url: '/admin/product/saveSpuInfo',
      method: 'post',
      data: spuInfo
    })
  }
}

// 删除spu接口
export const reqDeleteSpu = (spuId) => request({
  url: `/admin/product/deleteSpu/${spuId}`,
  method: 'delete'
})

// 获取图片接口
export const reqSpuImageList = (spuId) => request({
  url: `/admin/product/spuImageList/${spuId}`,
  method: 'get'
})

// 获取销售属性列表
export const reqSpuSaleAttrList = (spuId) => request({
  url: `/admin/product/spuSaleAttrList/${spuId}`,
  method: 'get'
})

// 获取平台属性接口
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({
  url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  method: 'get'
})

// 添加sku
export const reqAddSku = (skuInfo) => request({
  url: '/admin/product/saveSkuInfo',
  method: 'post',
  data: skuInfo
})

// 获取sku列表数据
export const reqSkuList = (spuId) => request({
  url: `/admin/product/findBySpuId/${spuId}`,
  method: 'get'
})
