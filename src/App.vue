<!--
 * @Author: Jin Haocong
 * @Date: 2022-08-22 10:53:58
 * @LastEditTime: 2022-08-26 10:16:47
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { resetRouter } from '@/router'
export default {
  name: 'App',
  beforeUpdate() {
    resetRouter()
    this.$router.addRoutes(this.$store.state.user.resultAsyncRoutes)
  }
}
</script>
