<!--
 * @Author: Jin Haocong
 * @Date: 2022-08-22 14:21:27
 * @LastEditTime: 2022-08-24 19:35:29
-->
<template>
  <div>
    <!-- 表格 -->
    <el-table :data="skuList" style="width: 100%" border>
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column label="默认图片" width="140" align="center">
        <template slot-scope="{ row }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="100" align="center">
      </el-table-column>
      <el-table-column prop="price" label="价格(元)" width="100" align="center">
      </el-table-column>
      <el-table-column label="操作" width="400" align="center">
        <template slot-scope="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            content="下架"
            placement="bottom"
          >
            <el-button
              v-if="row.isSale === 1"
              type="info"
              icon="el-icon-bottom"
              circle
              @click="cancelSale(row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="上架"
            placement="bottom"
          >
            <el-button
              v-if="row.isSale === 0"
              type="success"
              icon="el-icon-top"
              circle
              @click="onSale(row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="编辑"
            placement="bottom"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="edeit"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="查看"
            placement="bottom"
          >
            <el-button
              type="warning"
              icon="el-icon-view"
              circle
              @click="getSkuInfo(row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="删除"
            placement="bottom"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteSku(row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      style="text-align: center"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>
    <!-- 抽屉效果 -->
    <el-drawer
      :visible.sync="drawer"
      size="50%"
      :show-close="false"
    >
      <el-row>
        <el-col :span="5">名称：</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述：</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格：</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性：</el-col>
        <el-col :span="16">
          <template>
            <el-tag v-for="item in skuInfo.skuAttrValueList" :key="item.id" type="success" style="margin:0 10px">{{ item.attrId }}-{{ item.valueId }}</el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片：</el-col>
        <el-col :span="16">
          <el-carousel height="750px">
            <el-carousel-item v-for="item in skuInfo.skuImageList " :key="item.id">
              <img :src="item.imgUrl" alt="" style="width:100%;height:100%">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'SkuManage',
  data() {
    return {
      page: 1,
      limit: 10,
      // 存储sku列表数据
      skuList: [],
      // 分页器总条数
      total: 0,
      // skuInfo详细信息
      skuInfo: {},
      // 控制抽屉显示
      drawer: false
    }
  },
  mounted() {
    this.getSkuList()
  },
  methods: {
    // 获取sku列表
    async getSkuList(pages = 1) {
      this.page = pages
      const { page, limit } = this
      const result = await this.$API.sku.reqSkuList(page, limit)
      if (result.code === 200) {
        this.skuList = result.data.records
        this.total = result.data.total
      }
    },

    // 点击页数
    handleCurrentChange(page) {
      this.getSkuList(page)
    },

    // 改变每页条数
    handleSizeChange(limit) {
      this.limit = limit
      this.getSkuList()
    },

    // 上架
    async onSale(row) {
      const result = await this.$API.sku.reqOnSale(row.id)
      if (result.code === 200) {
        this.$message({
          type: 'success',
          message: '上架成功'
        })
        this.getSkuList(this.page)
      } else {
        this.$message({
          type: 'error',
          message: '上架失败'
        })
      }
    },

    // 下架
    async cancelSale(row) {
      const result = await this.$API.sku.reqCancelSale(row.id)
      if (result.code === 200) {
        this.$message({
          type: 'success',
          message: '下架成功'
        })
        this.getSkuList(this.page)
      } else {
        this.$message({
          type: 'error',
          message: '下架失败'
        })
      }
    },

    // 查看按钮的回调
    edeit() {
      this.$message({
        type: 'info',
        message: '正在开发中'
      })
    },

    // 获取sku详情信息
    async getSkuInfo(row) {
      // 展示抽屉
      this.drawer = true
      const result = await this.$API.sku.reqSkuInfo(row.id)
      if (result.code === 200) {
        this.skuInfo = result.data
      }
    },

    // 删除sku
    deleteSku(row) {
      this.$API.sku
        .reqDeleteSku(row.id)
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getSkuList(this.page)
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '删除失败'
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-row {
  line-height: 54.5px;
  .el-col-5 {
    font-size: 30px;
    font-weight: 1000;
    text-align: right;
  }
}
.el-col {
  margin: 10px;
}
</style>
<style>
    .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }
  .el-carousel__button{
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
</style>
