<!--
 * @Author: Jin Haocong
 * @Date: 2022-08-23 16:21:49
 * @LastEditTime: 2022-08-24 10:50:04
-->
<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="sSPU名称">
        <el-input v-model="spu.spuName" placeholder="spu名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option v-for="tm in tradeMarkList" :key="tm.id" :label="tm.tmName " :value="tm.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input v-model="spu.description" type="textarea" rows="4" placeholder="spu描述"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 上传图片  file-list 是照片墙需要展示的数据（数组） 而且里面的元素务必要有name url
        属性-->
        <el-upload
          action="/brand-api/admin/product/upload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handlerSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="attrIdAndAttrName" :placeholder="`还有${unSelectSaleAttr.length}个未选择`">
          <el-option v-for="unselect in unSelectSaleAttr" :key="unselect.id" :label="unselect.name" :value="`${unselect.id}:${unselect.name}`"></el-option>
        </el-select>
        <el-button
          :disabled="!attrIdAndAttrName"
          style="margin: 0 15px"
          type="primary"
          icon="el-icon-plus"
          @click="addSaleAttr"
        >添加销售属性</el-button>
        <!-- 展示的是当前spu属于自己的销售属性 -->
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="saleAttrValueName" label="属性值名称列表" width="width">
            <template slot-scope="{row}">
              <!-- el-tag是用于展示已有的属性值的列表 -->
              <el-tag
                v-for="(tag,index) in row.spuSaleAttrValueList"
                :key="tag.id"
                closable
                :disable-transitions="false"
                @close="handleClose(row,index)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                v-if="row.inputVisible"
                ref="Input"
                v-model="row.inputValue"
                class="input-new-tag"
                size="small"
                @blur="handleInputConfirm(row)"
                @keyup.enter.native="keyup"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="200" align="center">
            <template slot-scope="{$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteSaleAttr($index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
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
      dialogVisible: false,
      // 存储spu信息属性 在修改SPU的时候 会像服务器发送请求 返回的信息是一个兑现 在修改的时候可以利用这个对象来收集最新的数据然后再次发送到服务器
      // 添加SPU 如果是添加spu的时候 并没有现成的解构去收集 所以要给spu设置好对应的字段
      spu: {
        // 三级分类id
        category3Id: 0,
        // 品牌id
        tmId: '',
        // 描述
        description: '',
        // spu图片信息
        spuImageList: [
          {
            id: 0,
            imgName: '',
            imgUrl: '',
            spuId: 0
          }
        ],
        // spu名称
        spuName: '',
        // 平台属性与属性值的收集
        spuSaleAttrList: [
          {
            baseSaleAttrId: 0,
            id: 0,
            saleAttrName: '',
            spuId: 0,
            spuSaleAttrValueList: [
              {
                baseSaleAttrId: 0,
                id: 0,
                isChecked: '',
                saleAttrName: '',
                saleAttrValueName: '',
                spuId: 0
              }
            ]
          }
        ]

      },
      // 存储品牌信息
      tradeMarkList: [],
      // 存储图片信息
      spuImageList: [],
      // 销售属性的数据
      saleAttrList: [],
      // 收集未选择的销售属性id和name
      attrIdAndAttrName: ''
    }
  },
  computed: {
    unSelectSaleAttr() {
      const result = this.saleAttrList.filter(item => {
        return this.spu.spuSaleAttrList.every(item1 => {
          return item.name !== item1.saleAttrName
        })
      })
      return result
    }
  },
  methods: {
    // keyup事件 为了放置时间冲突 在keyup事件中回调blur事件
    keyup(evt) {
      evt.target.blur()
    },
    // 照片墙删除照片的回调
    // file 代表的删除的那张图 filelist 代表剩下的图片
    handleRemove(file, fileList) {
      // 收集照片墙图片
      this.spuImageList = fileList
    },

    handlePictureCardPreview(file) {
      // 将图片的地址赋值
      this.dialogImageUrl = file.url
      // 对话框显示
      this.dialogVisible = true
    },

    // 照片墙图片上传成功的回调
    handlerSuccess(response, file, fileList) {
      this.spuImageList = fileList
    },

    // 自定义事件切换场景 并清空数据
    changeSence(id) {
      this.$emit('changeScene', { scene: 0, flag: id ? '修改' : '添加' })
      // 清理数据
      // es6 中新增的方法合并对象 Object.assign
      // 组件实例的this._data 可以操作data中所有响应式数据
      // this.$options 当前配置对象 中有data函数 data函数一执行 返回data中的初始数据
      Object.assign(this._data, this.$options.data())
    },

    // 初始化spuform数据
    async iniSpuData(spuInfo) {
      const spuResult = await this.$API.spu.reqSpuInfo(spuInfo.id)
      if (spuResult.code === 200) {
        this.spu = spuResult.data
      }
      // 获取品牌信息
      const tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data
      }
      // 获取图片信息
      const spuImageResult = await this.$API.spu.reqImageList(spuInfo.id)
      if (spuImageResult.code === 200) {
        this.spuImageList = spuImageResult.data
        this.spuImageList.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
      }
      // 获取所有销售属性
      const saleResult = await this.$API.spu.reqSaleAttrList()
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data
      }
    },

    // 添加新的销售属性
    addSaleAttr() {
      // split分割之后是个数组
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(':')
      const newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] }
      this.spu.spuSaleAttrList.push(newSaleAttr)
      // 点击添加后清空
      this.attrIdAndAttrName = ''
    },

    // 添加属性值
    addSaleAttrValue(row) {
      // 响应式数据 控制button与input切换
      this.$set(row, 'inputVisible', true)
      this.$nextTick(() => {
        this.$refs.Input.focus()
      })
      // 通过响应式数据inputValue来收集新增的属性值
      this.$set(row, 'inputValue', '')
    },

    // 失焦后操作
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row
      // 新增的销售属性之不能为空
      if (inputValue.trim() === '') {
        this.$message({
          type: 'warning',
          message: '属性值不能为空'
        })
        return
      }
      // 属性值不能重复
      if (row.spuSaleAttrValueList.some(item => item.saleAttrValueName === inputValue)) {
        this.$message({
          type: 'error',
          message: '属性值已存在'
        })
        return
      }
      const newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue }
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      row.inputVisible = false
    },

    // 删除属性值
    handleClose(row, index) {
      row.spuSaleAttrValueList.splice(index, 1)
    },

    // 删除整个属性
    deleteSaleAttr(index) {
      this.spu.spuSaleAttrList.splice(index, 1)
    },

    // 保存按钮的回调
    async addOrUpdateSpu() {
      // 发送请求 首先整理参数 整理照片墙的数据 需要携带imageName imageUrl
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: item.response ? item.response.data : item.url
        }
      })
      const result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if (result.code === 200) {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.changeSence(this.spu.id)
        // 通知父组件改变 scene
      } else {
        this.$message({
          type: 'error',
          message: '操作失败'
        })
      }
      // 清空数据
      Object.assign(this._data, this.$options.data())
    },

    // 父组件点击添加spu 发送请求
    async addSpudate(category3Id) {
      // 清空数据
      Object.assign(this._data, this.$options.data())
      this.spu.spuSaleAttrList.splice(0, 1)
      this.spu.category3Id = category3Id
      // 获取品牌信息
      const tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data
      }
      // 获取所有销售属性
      const saleResult = await this.$API.spu.reqSaleAttrList()
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data
      }
      // 收集数据
    }
  }
}
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
