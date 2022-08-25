/*
 * @Author: Jin Haocong
 * @Date: 2022-08-25 17:13:30
 * @LastEditTime: 2022-08-25 17:25:49
 */
import request from '@/utils/mock-request'
const state = {
  list: {}
}
const mutations = {
  GETDATE(state, list) {
    state.list = list
  }
}
const actions = {
  // 获取首页模拟数据
  async  getData({ commit }) {
    const result = await request.get('/home/list')
    if (result.code === 20000) {
      commit('GETDATE', result.data)
    }
  }
}
const getters = {}

export default {
  state,
  mutations,
  actions,
  getters
}
