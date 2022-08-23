<!--
 * @Author: Jin Haocong
 * @Date: 2022-08-22 14:21:49
 * @LastEditTime: 2022-08-23 14:48:49
-->
<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect :show="!isShowTable" @getCategory="handler1"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
        >添加属性</el-button>
        <!-- table表格 展示平台属性 -->
        <el-table style="width: 100%" border :data="attrInfoList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="150"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                v-for="arrtValue in row.attrValueList"
                :key="arrtValue.id"
                type="success"
                disable-transitions:true
                :hit="true"
                style="margin: 0 10px"
              >
                {{ arrtValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150" align="center">
            <template slot-scope="{ row,$index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                style="margin:10px"
                @click="updateAttr(row)"
              ></el-button>
              <!-- 气泡确认框 -->
              <el-popconfirm :key="$index" :title=" `确定要删除 “${row.attrName}” 吗` " @onConfirm="deleteAttr(row)">
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加修改属性 的结构 -->
      <div v-show="!isShowTable">
        <el-form ref="form" :inline="true" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              v-model="attrInfo.attrName"
              placeholder="请输入属性名"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrInfo.attrName"
          @click="addAttrValue"
        >添加属性值</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          style="width: 100%; margin: 20px 0"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column label="属性值名称" width="width">
            <template slot-scope="{ row,$index }">
              <!-- 这里的结构需要span与input进行切换 -->
              <el-input
                v-if="row.flag"
                :ref="$index"
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                @blur="tolook(row)"
                @keyup.native.enter="tolook(row)"
              ></el-input>
              <span v-else @click="toEdit(row,$index)">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width" align="center">
            <template slot-scope="{ row,$index }">
              <!-- 气泡确认框 -->
              <el-popconfirm :key="$index" :title=" `确定要删除 “${row.valueName}” 吗` " @onConfirm="deleteAttrValue($index)">
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" :disabled="!attrInfo.attrValueList.length" @click="addOrUpdateAttr">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入 lodash的深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'AttrManage',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrInfoList: [],
      // 控制table的显示与隐藏
      isShowTable: true,
      cForm: [],

      // 收集新增或修改属性
      attrInfo: {
        attrName: '', // 属性名
        // 属性值数组
        attrValueList: [],
        categoryId: 0, // 三级分类id
        categoryLevel: 3
      }
    }
  },
  methods: {
    handler1({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        this.category3Id = categoryId
        this.getAttrList()
      }
    },

    // handler1(cForm) {
    //   this.cForm = cForm
    //   const { category1Id, category2Id, category3Id } = cForm
    //   this.getAttrList(category1Id, category2Id, category3Id)
    // },

    // 请求函数
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this
      const result = await this.$API.attr.reqAttrInfoList(
        category1Id,
        category2Id,
        category3Id
      )
      if (result.code === 200) {
        this.attrInfoList = result.data
      }
    },

    // 添加属性值
    addAttrValue() {
      // 向属性值数组中添加元素
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, // 属性值对应的id 和属性名对应,
        valueName: '',
        // 给每一个属性值添加标记，用于切换查看模式与编辑模式，每个属性值可以控制自己的模式
        // flag 是个响应式属性
        flag: true
      })

      // 自动聚焦
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },

    // 添加属性按钮
    addAttr() {
      // 切换table显示与隐藏
      this.isShowTable = false
      // 清除收集到的新增属性的属性
      this.attrInfo = {
        attrName: '', // 属性名
        // 属性值数组
        attrValueList: [],
        categoryId: 0, // 三级分类id
        categoryLevel: 3
      }
      // 收集三级分类的id
      this.attrInfo.categoryId = this.category3Id
    },

    // 修改属性按钮
    updateAttr(row) {
      console.log(row)
      this.isShowTable = false
      // 将选中的属性赋值给attrInfo
      // 深拷贝(数据结构存在对象套数组数组套对象)
      this.attrInfo = cloneDeep(row)
      // 为了进行模式切换，再点击修改按钮之后给每个属性值加上标记
      // item.flag = false不能直接赋值添加 这样添加的不是响应式数据
      this.attrInfo.attrValueList.forEach(item => {
        this.$set(item, 'flag', false)
      })
    },

    // 切换模式 与校验
    tolook(row) {
      // row是当前用户添加的最新的属性值
      // 删除首尾空格后进行判断属性值是否为空，为空的话不能保存
      if (row.valueName.trim() === '') {
        this.$message(
          { message: '属性值不能为空',
            type: 'warning'
          }
        )
        return
      }

      // 新增的属性值不能与已有的属性值重复
      const isRepeat = this.attrInfo.attrValueList.some(item => {
        // 因为item中本身就包含row 所以在判断的时候要把row从item中去除
        if (row !== item) {
          return item.valueName === row.valueName
        }
      })
      if (isRepeat) {
        this.$message(
          { message: '属性值已存在',
            type: 'error'
          }
        )
        return
      }
      // 编辑模式变为查看模式
      row.flag = false
    },

    // 点击span切换编辑模式后的回调
    toEdit(row, index) {
      row.flag = true
      // 获取当前点击的input节点，然后实现自动对焦
      // $nextTick 一定要等节点更新完之后再进行自动聚焦的处理 渲染节点是要时间的
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },

    // 删除按钮 气泡确认框框确认回调
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },

    // 保存按钮回调
    async  addOrUpdateAttr() {
      // 整理参数； 删除空数据 并且把后加的flag标志属性删除
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        // 过滤不为空的
        if (item.valueName !== '') {
          // 删除flag
          delete item.flag
          return item
        }
      })
      try {
        // 发送请求
        await this.$API.attr.reqAddorUpdateAttr(this.attrInfo)
        // 却换到列表页面
        this.isShowTable = true
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.getAttrList()
      } catch (error) {
        this.$message({
          type: 'error',
          message: '保存失败'
        })
      }
    },

    // 删除整条属性 气泡确认框框确认回调
    deleteAttr(row) {
      this.$API.attr.reqDeleteAttr(row.id).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.getAttrList()
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '删除失败'
        })
      })
    }
  }

}
</script>

<style lang="less" scoped>
</style>
