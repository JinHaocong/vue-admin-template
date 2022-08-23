<!--
 * @Author: Jin Haocong
 * @Date: 2022-08-23 15:53:18
 * @LastEditTime: 2022-08-23 15:58:58
-->
<template>
  <a :title="title" style="margin:10px">
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </a>
</template>

<script>
export default {
  name: 'HintButton',
  props: {
    title: {
      type: String,
      default: '提示'
    }
  },
  mounted() {
  }
}
</script>

<style>

</style>
