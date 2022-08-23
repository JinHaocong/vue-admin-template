<!--
 * @Author: Jin Haocong
 * @Date: 2022-08-23 16:21:49
 * @LastEditTime: 2022-08-23 17:21:46
-->
<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="spu名称">
        <el-input placeholder="spu名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" value="">
          <el-option label="label" value="value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="spu描述">
        <el-input type="textarea" rows="4" placeholder="spu描述"></el-input>
      </el-form-item>
      <el-form-item label="spu图片">
        <el-upload
          action="/brand-api/admin/product/upload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select placeholder="还有三个未选择" value="">
          <el-option label="label" value="value"></el-option>
        </el-select>
        <el-button
          style="margin: 0 15px"
          type="primary"
          icon="el-icon-plus"
        >添加销售属性</el-button>
        <el-table style="width: 100%" border>
          <el-table-column style="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="prop" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button @click="changeSence">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    // 自定义事件切换场景
    changeSence() {
      this.$emit('changeScene', 0)
    },

    // 初始化spuform数据
    iniSpuData(spuInfo) {
      console.log('发请求', spuInfo)
    }
  }
}
</script>

<style>
</style>
