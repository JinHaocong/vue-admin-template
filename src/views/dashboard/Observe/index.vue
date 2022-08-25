<!--
 * @Author: Jin Haocong
 * @Date: 2022-08-25 14:46:41
 * @LastEditTime: 2022-08-25 15:09:27
-->
<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12">
        <Search></Search>
      </el-col>
      <el-col :span="12">
        <Category></Category>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Search from './Search'
import Category from './Category'
export default {
  name: 'Observe',
  components: {
    Category,
    Search
  }
}
</script>

<style>

</style>
