/*
 * @Author: Jin Haocong
 * @Date: 2022-08-22 10:53:58
 * @LastEditTime: 2022-08-22 13:56:06
 */
/* 引入封装后的axios */
import request from '@/utils/request'

/* 对外暴露登录接口 */
export function login(data) {
  return request({
    url: '/admin/acl/index/login',
    method: 'post',
    data
  })
}

/* 对外暴露获取用户信息的函数 */
export function getInfo(token) {
  return request({
    url: '/admin/acl/index/info',
    method: 'get',
    params: { token }
  })
}

/* 对外暴露退出登录的函数 */
export function logout() {
  return request({
    url: '/admin/acl/index/logout',
    method: 'post'
  })
}
