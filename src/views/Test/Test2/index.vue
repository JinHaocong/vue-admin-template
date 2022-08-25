<!--
 * @Author: Jin Haocong
 * @Date: 2022-08-25 19:46:40
 * @LastEditTime: 2022-08-25 19:46:53
-->
<template>
  <div>
    <el-button v-show="$store.state.user.buttons.indexOf('btn.Add3')!=-1" type="primary">添加按钮3</el-button>
  </div>
</template>

<script>
export default {
  name: ''
}
</script>

<style scoped>

</style>

