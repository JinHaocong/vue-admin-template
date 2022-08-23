/*
 * @Author: Jin Haocong
 * @Date: 2022-08-22 15:02:20
 * @LastEditTime: 2022-08-23 17:23:31
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

