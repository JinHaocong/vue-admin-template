<!--
 * @Author: Jin Haocong
 * @Date: 2022-08-22 14:20:58
 * @LastEditTime: 2022-08-23 17:21:14
-->
<template>
  <div>
    <el-card style="margin:20px 0">
      <!-- 三级联动全局组件  -->
      <CategorySelect :show="!show" @getCategory="handler1"></CategorySelect>
    </el-card>
    <!-- 底部这里是会有三部分进行切换 -->
    <el-card>
      <div v-show="scene===0">
        <!-- 展示spu列表 -->
        <el-button type="primary" icon="el-icon-plus" style="marginBottom:20px" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table
          style="width: 100%"
          border
          :data="records"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="spuName"
            label="spu名称"
            width="width"
          >
          </el-table-column>
          <el-table-column
            prop="description"
            label="spu描述"
            width="width"
          >
          </el-table-column>
          <el-table-column
            prop="prop"
            label="操作"
            width="width"
          >
            <template slot-scope="{row}">
              <!-- 这里的按钮将来用hintButton替换 -->
              <HintButton title="添加spu" type="success" icon="el-icon-plus" size="mini"></HintButton>
              <HintButton title="修改spu" type="warning" icon="el-icon-edit" size="mini" @click="updateSpu(row)"></HintButton>
              <HintButton title="查看当前spu的sku列表" type="info" icon="el-icon-info" size="mini"></HintButton>
              <HintButton title="删除spu" type="danger" icon="el-icon-delete" size="mini"></HintButton>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout=" prev, pager, next, jumper,->, sizes, total"
          :total="total"
          style="text-align:center"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <spu-form v-show="scene===1" ref="spu" @changeScene="changeScene"></spu-form>
      <sku-form v-show="scene===2"></sku-form>
    </el-card>
  </div>
</template>

<script>
import SkuForm from './SkuForm/SkuForm.vue'
import SpuForm from './SpuForm/SpuForm.vue'

export default {
  name: 'SpuManage',
  components: { SpuForm, SkuForm },

  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      page: 1,
      limit: 3,
      total: 0,
      records: [],

      // 控制三级联动的可操作性
      show: true,

      // 状态切换 0展示spu列表 1展示spu添加或修改 2添加或修改sku
      scene: 0
    }
  },
  methods: {
    // 三级联动自定义事件 子传父
    // level 用来判断是哪个id
    handler1({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId
        // 当重新选择时 清除二三级id
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        // 清除三级id
        this.category3Id = ''
      } else {
        this.category3Id = categoryId
        // 三个级别的id都有之后进行发送请求
        this.getSpuList()
      }
    },

    // 获取spu列表的请求 点击分页也发送请求
    async getSpuList(pages = 1) {
      this.page = pages
      const { page, limit, category3Id } = this
      const result = await this.$API.spu.reqSpuList(page, limit, category3Id)
      if (result.code === 200) {
        this.total = result.data.total
        this.records = result.data.records
      }
    },

    // 当分页器每页展示数据的条数发生变化时触发
    handleSizeChange(limit) {
      this.limit = limit
      this.getSpuList()
    },

    // 添加spu按钮
    addSpu() {
      this.scene = 1
    },

    // 修改spu按钮
    updateSpu(row) {
      this.scene = 1
      // 获取子组件spuform
      this.$refs.spu.iniSpuData(row)
    },

    // 子组件点击取消按钮 自定义事件
    changeScene(scene) {
      this.scene = scene
    }
  }
}
</script>

<style>

</style>
