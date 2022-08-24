<!--
 * @Author: Jin Haocong
 * @Date: 2022-08-23 16:21:19
 * @LastEditTime: 2022-08-24 15:38:28
-->
<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称"> <b>{{ spu.spuName }} </b></el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="SKU名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input v-model="skuInfo.price" placeholder="价格(元)" type="number"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight" placeholder="重量(千克)"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input v-model="skuInfo.skuDesc" type="textarea" rows="4" placeholder="规格描述"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item v-for="attr in attrInfoList" :key="attr.id" :label="attr.attrName" style="margin-bottom:20px">
            <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
              <el-option v-for="attrValue in attr.attrValueList" :key="attrValue.id" :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id" :label="saleAttr.saleAttrName">
            <el-select v-model="saleAttr.attrIdAndValueId" placeholder="请选择">
              <el-option v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id" :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table style="width: 100%" border :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="60" align="center"> </el-table-column>
          <el-table-column prop="prop" label="图片" width="width" align="center">
            <template slot-scope="{row}">
              <img :src="row.imgUrl" alt="" style="width:100px;height:100px">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width" align="center">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width" align="center">
            <template slot-scope="{row}">
              <el-button v-show="row.isDefault==0" type="primary" round @click="changeDefault(row)">设为默认</el-button>
              <el-button v-show="row.isDefault==1" type="success" plain round>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      // 存储图片信息
      spuImageList: [],
      // 存储销售属性
      spuSaleAttrList: [],
      // 存储平台销售属性
      attrInfoList: [],
      // 收集sku信息
      // 第一类收集的数据是父组件给的数据
      skuInfo: {
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 第二类数据 需要双向绑定 v-model收集
        price: 0,
        skuName: '',
        weight: '',
        skuDesc: '',
        // 默认图片
        skuDefaultImg: '',
        // 平台属性
        skuAttrValueList: [
          // {
          //   // 平台属性id
          //   attrId: 0,
          //   // 平台属性值id
          //   valueId: 0
          // }
        ],
        // 图片信息
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: '',
          //   imgUrl: '',
          //   isDefault: '',
          //   skuId: 0,
          //   spuImgId: 0
          // }
        ],
        // sku销售属性列别
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: '',
          //   saleAttrValueId: 0,
          //   saleAttrValueName: '',
          //   skuId: 0,
          //   spuId: 0
          // }
        ]
      },
      spu: {},
      // 收集图片的
      imageList: []
    }
  },
  methods: {
    // 获取初始化信息
    async getData(category1Id, category2Id, spu) {
      this.spu = spu
      // 收集父组件给的数据
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      // 获取图片
      const imageResult = await this.$API.spu.reqSpuImageList(spu.id)
      if (imageResult.code === 200) {
        const list = imageResult.data
        list.forEach(item => {
          item.isDefault = 0
        })
        this.spuImageList = list
      }
      // 获取销售属性数据
      const spuSaleAttrListResult = await this.$API.spu.reqSpuSaleAttrList(
        spu.id
      )
      if (spuSaleAttrListResult.code === 200) {
        this.spuSaleAttrList = spuSaleAttrListResult.data
      }
      // 获取平台基础属性
      const attrInfoListResult = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      )
      if (attrInfoListResult.code === 200) {
        this.attrInfoList = attrInfoListResult.data
      }
    },

    // table勾选框触发
    handleSelectionChange(selection) {
      // 可以获取到用户选中的图片信息 但是缺少一个 isDefault
      this.imageList = selection
    },

    // 设置默认 排他
    changeDefault(row) {
      this.spuImageList.forEach(item => {
        item.isDefault = 0
      })
      row.isDefault = 1
      this.skuInfo.skuDefaultImg = row.imgUrl
    },

    // 取消按钮
    cancel() {
      // 自定义事件让父组件切换场景
      this.$emit('changeScenes')
      // 清除数据
      Object.assign(this._data, this.$options.data())
    },

    // 保存按钮
    async save() {
      // 整理数据
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':')
          prev.push({ attrId, valueId })
        }
        return prev
      }, [])

      // 整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(':')
          prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev
      }, [])

      // 整理图片
      skuInfo.skuImageList = imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.spuId
        }
      })

      // 发送请求
      const result = await this.$API.spu.reqAddSku(skuInfo)
      if (result.code === 200) {
        this.cancel()
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      } else {
        this.$message({
          type: 'error',
          message: '保存失败'
        })
      }
    }

  }
}
</script>

<style>
</style>
