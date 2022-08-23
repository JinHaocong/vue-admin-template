/*
 * @Author: Jin Haocong
 * @Date: 2022-08-22 15:06:11
 * @LastEditTime: 2022-08-22 15:07:32
 */
// 将四个模块请求的接口函数统一暴露

import * as trademark from './product/tradeMark'
import * as attr from './product/Attr'
import * as spu from './product/Spu'
import * as sku from './product/Sku'

export default {
  trademark,
  attr,
  sku,
  spu
}
