<!--
 * @Author: Jin Haocong
 * @Date: 2022-08-22 14:20:58
 * @LastEditTime: 2022-08-24 16:17:42
-->
<template>
  <div>
    <el-card style="margin:20px 0">
      <!-- 三级联动全局组件  -->
      <CategorySelect :show="scene!==0" @getCategory="handler1"></CategorySelect>
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
            align="center"
          >
            <template slot-scope="{row}">
              <!-- 这里的按钮将来用hintButton替换 -->
              <HintButton title="添加sku" type="success" icon="el-icon-plus" size="mini" @click="addSku(row)"></HintButton>
              <HintButton title="修改spu" type="warning" icon="el-icon-edit" size="mini" @click="updateSpu(row)"></HintButton>
              <HintButton title="查看当前spu的sku列表" type="primary" icon="el-icon-view" size="mini" @click="handler(row)"></HintButton>
              <el-popconfirm
                :title="`确定要删除 “${row.spuName}” 吗？`"
                @onConfirm="deleteSpu(row)"
              >
                <HintButton slot="reference" title="删除spu" type="danger" icon="el-icon-delete" size="mini"></HintButton>
              </el-popconfirm>
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
      <sku-form v-show="scene===2" ref="sku" @changeScenes="changeScenes"></sku-form>
    </el-card>
    <el-dialog :title="` “${spu.spuName}” 的SKU列表`" :visible.sync="dialogTableVisible" @close="close">
      <el-table
        v-loading="loading"
        :data="skuList"
        style="width: 100%"
        border
      >
        <el-table-column
          prop="skuName"
          label="名称"
          width="width"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          width="width"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="weight"
          label="重量"
          width="width"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="默认图片"
          width="width"
          align="center"
        >
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
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

      // 状态切换 0展示spu列表 1展示spu添加或修改 2添加或修改sku
      scene: 0,

      // 控制对话框的显示与隐藏
      dialogTableVisible: false,

      // 存储spu
      spu: [],

      // 存储sku列表
      skuList: [],

      // loading
      loading: true
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

    // 添加spu按钮 通知子组件发送请求
    addSpu() {
      this.scene = 1
      this.$refs.spu.addSpudate(this.category3Id)
    },

    // 修改spu按钮
    updateSpu(row) {
      this.scene = 1
      // 获取子组件spuform
      this.$refs.spu.iniSpuData(row)
    },

    // 子组件点击取消按钮 自定义事件
    // flag是为了去分添加还是修改
    changeScene({ scene, flag }) {
      this.scene = scene
      if (flag === '修改') {
        this.getSpuList(this.page)
      } else {
        this.getSpuList(1)
      }
    },

    // 删除spu 按钮
    async deleteSpu(row) {
      const result = await this.$API.spu.reqDeleteSpu(row.id)
      if (result.code === 200) {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
      }
    },

    // 添加sku 按钮
    addSku(row) {
      this.scene = 2
      // 父组件调用子组件的方法 让子组件发请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row)
    },

    // skuform通知父组件改变scene
    changeScenes() {
      this.scene = 0
    },

    // 查看当前spu的sku列表的按钮
    async handler(spu) {
      this.dialogTableVisible = true
      this.spu = spu
      // 获取数据
      const result = await this.$API.spu.reqSkuList(spu.id)
      if (result.code === 200) {
        this.skuList = result.data
        // 隐藏loading
        this.loading = false
      }
    },

    // 关闭对话框
    close() {
      this.loading = true
      this.skuList = []
    }
  }
}
</script>

<style>

</style>
