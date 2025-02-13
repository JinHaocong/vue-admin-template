/*
 * @Author: Jin Haocong
 * @Date: 2022-08-22 10:53:58
 * @LastEditTime: 2022-08-25 17:13:47
 */
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import home from './modules/home'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    home
  },
  getters
})

export default store
