/*
 * @Author: Jin Haocong
 * @Date: 2022-08-22 10:53:58
 * @LastEditTime: 2022-08-26 10:12:40
 */
// 引入登录 退出登录 用户信息的接口函数
import { login, logout, getInfo } from '@/api/user'
// 引入设置token获取token删除token函数
import { getToken, setToken, removeToken } from '@/utils/auth'
// 引用重置路由的函数 引入异步路由引入 引入任意路由
import { resetRouter, asyncRoutes, anyRoutes, constantRoutes } from '@/router'
import router from '@/router'
import cloneDeep from 'lodash/cloneDeep'
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    // 菜单权限标记
    routes: [],
    // 按钮权限标记
    buttons: [],
    // 角色标记
    roles: [],
    // // 项目中已有的异步路由 与 服务武器返回的标记信息对比 最终需要展示的路由
    resultAsyncRoutes: [],
    // 最终展示的全部路由
    finallRoutes: []
  }
}

const state = getDefaultState()

const mutations = {
  // 重置state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 存储token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 存储用户信息
  SET_USERINFO: (state, userInfo) => {
    state.name = userInfo.name
    state.avatar = userInfo.avatar
    // 菜单权限的标记
    state.routes = userInfo.routes
    // 按钮权限标记
    state.buttons = userInfo.buttons
    // 角色信息
    state.roles = userInfo.roles
  },
  // 最终计算出来的异步路由
  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    // vuex保存当前用户的异步路由
    state.resultAsyncRoutes = asyncRoutes
    state.finallRoutes = [...constantRoutes, ...anyRoutes, ...state.resultAsyncRoutes]
    // 添加新路由
    resetRouter()
    router.addRoutes(state.resultAsyncRoutes)
  }
}

// 定义对比函数
const computedAsyncRoutes = (asyncRoutes, routes) => {
  // 过滤出当根据前用户的路由权限 需要展示的路由
  return asyncRoutes.filter(item => {
    if (routes.indexOf(item.name) !== -1) {
      // 递归 过滤子路由
      if (item.children && item.children.length) {
        item.children = computedAsyncRoutes(item.children, routes)
      }
      return true
    }
  })
}

const actions = {
  // 登陆业务
  async login({ commit }, userInfo) {
    // 解构赋值
    const { username, password } = userInfo
    const result = await login({ username: username.trim(), password: password })
    if (result.code === 20000) {
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'ok'
    } else {
      console.log(result)
      return Promise.reject(new Error('登陆失败'))
    }
  },

  // 获取用户信息 返回的数据包括用户名，头像，和该用户的权限标记
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        commit('SET_USERINFO', data)
        commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(cloneDeep(asyncRoutes), data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

