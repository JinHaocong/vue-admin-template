<!--
 * @Author: Jin Haocong
 * @Date: 2022-08-22 22:34:11
 * @LastEditTime: 2022-08-23 14:34:09
-->
<template>
  <div>
    <!-- inline代表的是行内表单一行可以放多个表单元素
    :model收集数据
    -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <!-- v-model收集信息 收集到的是 下面的 :value -->
        <el-select v-model="cForm.category1Id" placeholder="请选择一级分类" :disabled="show" @change="handler1">
          <el-option v-for="c1 in list1" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="cForm.category2Id" placeholder="请选择二级分类" :disabled="show" @change="handler2">
          <el-option v-for="c2 in list2" :key="c2.id" :label="c2.name" :value="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="cForm.category3Id" placeholder="请选择三级分类" :disabled="show" @change="handler3">
          <el-option v-for="c3 in list3" :key="c3.id" :label="c3.name" :value="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: {
    show: {
      type: Boolean
    }
  },
  data() {
    return {
      // 一级分类
      list1: [],
      // 二级分类
      list2: [],
      // 三级分类
      list3: [],
      // 相应的一级，二级，三级分类的id
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    }
  },
  mounted() {
    // 组件挂载完毕 发请求 获取一级分类
    this.getCategory1List()
  },
  methods: {
    async getCategory1List() {
      const result = await this.$API.attr.reqCategory1List()
      if (result.code === 200) {
        this.list1 = result.data
      }
    },

    // 选择一级分类的事件回调  当一级分类的option发生变化的时候 出发回调
    async  handler1() {
      // 清空二三级费雷的数据
      this.list2 = []
      this.list3 = []
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      const { category1Id } = this.cForm
      this.$emit('getCategory', { categoryId: category1Id, level: 1 })
      const result = await this.$API.attr.reqCategory2List(category1Id)
      if (result.code === 200) {
        this.list2 = result.data
      }
    },

    // 选择二级分类的事件回调  当二级分类的option发生变化的时候 出发回调
    async handler2() {
      this.list3 = []
      this.cForm.category3Id = ''
      const { category2Id } = this.cForm
      this.$emit('getCategory', { categoryId: category2Id, level: 2 })
      const result = await this.$API.attr.reqCategory3List(category2Id)
      if (result.code === 200) {
        this.list3 = result.data
      }
    },

    // 选择三级分类的事件回调  当三级分类的option发生变化的时候 出发回调
    handler3() {
      // 子传父
      const { category3Id } = this.cForm
      // this.$emit('getCategory', this.cForm)
      this.$emit('getCategory', { categoryId: category3Id, level: 3 })
    }
  }

}
</script>

<style>

</style>
