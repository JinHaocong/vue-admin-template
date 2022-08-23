<!--
 * @Author: Jin Haocong
 * @Date: 2022-08-22 14:20:05
 * @LastEditTime: 2022-08-22 22:28:50
-->
<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0" @click="showDialog">添加</el-button>
    <!--
      表格组件
      data是表格组件将来要展示的数据-----数组类型
      border 给表格和添加边框
      column属性
        label；显示的标题
        width；对应列的宽度
        align；对齐方式
        注意element当中的table组件 是以列展示的
     -->
    <el-table
      :data="list"
      style="width: 100%"
      border
    >
      <el-table-column
        label="序号"
        width="80px"
        align="center"
        type="index"
      />
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width"
      />
      <el-table-column
        prop="prop"
        label="品牌LOGO"
        width="width"
      >
        <template slot-scope="{row}">
          <img :src="row.logoUrl" style="width:100px;height:100px">
        </template>
      </el-table-column>
      <el-table-column
        prop="prop"
        label="操作"
        width="width"
      >
        <template slot-scope="{row}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--
      分页器
      当前页，数据总条数
      current-page；当前第几页
      total；共几页
      page-size；每页展示多少条
      page-sizes；可以设置每一页展示多少条数据
      layout；实现分页器布局 取决于顺序
      pager-count；页码按钮的数量
    -->
    <el-pagination
      style="margin-top:20px;text-align:center"
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[3, 5, 10,20 ]"
      :pager-count="7"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="getPageList"
      @size-change="handleSizeChange"
    />
    <!--
      对话框
      :visible.sync 控制对话框显示与隐藏用的
      Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可。
      -->
    <el-dialog :title="tmForm.id? '修改品牌':'添加品牌' " :visible.sync="dialogFormVisible">
      <!--
        form 展示表单元素
        model 这个属性的作用是把表单的数据收集到哪个对象的身上，表单验证的时候也需要这个属性
       -->
      <el-form ref="ruleform" style="width:80%" :model="tmForm" :rules="rules">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!--
            这里收集数据不能使用v-model 不是表单元素
            action设置图片上传的地址
            on-success 可以检测到图片上传成功 当图片上传成功执行一次
            before-upload 上传之前执行一次
             -->
          <el-upload
            class="avatar-uploader"
            action="/brand-api/admin/product/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TradeMark',
  data() {
    // 自定义校验规则
    var validateTmName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('品牌名称不能为空'))
      } else if (value.length < 2 || value.length > 15) {
        callback(new Error('请输入2-15位的汉字'))
      } else {
        callback()
      }
    }
    return {

      // 当前页数
      page: 1,
      // 每页多少条
      limit: 5,
      // 总共数据条数
      total: 0,
      // 列表展示数据
      list: [],
      // 对话框的显示与隐藏
      dialogFormVisible: false,
      // 收集品牌信息
      tmForm: {
        logoUrl: '',
        tmName: ''
      },

      // 表单验证规则
      // require ；必须要校验的字段
      // trigger blur;失焦 change;文本发生变化
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          // 自定义校验规则
          { validator: validateTmName, trigger: 'change' }
          // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ],
        logoUrl: [
          { required: true, message: '请选择品牌logo', trigger: 'change' }
        ]
      }

    }
  },
  mounted() {
    this.getPageList()
  },
  methods: {
    // 获取品牌列表接口
    async getPageList(pager = 1) {
      this.page = pager
      const { page, limit } = this
      const result = await this.$API.trademark.reqTradeMark(page, limit)
      if (result.code === 200) {
        this.total = result.data.total
        this.list = result.data.records
      } else {
        console.log(result)
      }
    },

    // 当分页器每页展示数据的条数发生变化的时候触发
    handleSizeChange(limit) {
      // 整理参数 重新发送请求
      this.limit = limit
      this.getPageList()
    },

    // 点击添加品牌按钮 显示对话框
    showDialog() {
      this.dialogFormVisible = true
      // 清除数据
      this.tmForm = { tmName: '', logoUrl: '' }
    },

    // 修改品牌 当前用户选中的品牌信息
    updateTradeMark(row) {
      this.dialogFormVisible = true
      // 将服务器返回的信息直接赋值给tmForm
      // 浅拷贝
      this.tmForm = { ...row }
    },

    // 图片上传成功
    handleAvatarSuccess(res, file) {
      // res是上传成功后返回的地址
      // file是上传成功之后服务器返回的数据
      this.tmForm.logoUrl = res.data
    },

    // 图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传logo只能是 JPG或PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传logo大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },

    // 确定按钮
    addOrUpdateTradMark() {
      // 当表单验证全部通过后 再进行业务逻辑
      this.$refs.ruleform.validate(async(success) => {
        if (success) {
          this.dialogFormVisible = false
          // 发请求 添加或者修改
          const result = await this.$API.trademark.reqAddorUpdateTradeMark(this.tmForm)
          if (result.code === 200) {
            // 弹出信息 可能是添加 或者修改
            this.$message({ message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功', type: 'success' })
            // 如果是修改该品牌的话 应该留在当前页面
            this.getPageList(this.tmForm.id ? this.page : 1)
          }
        } else {
          console.log('表单信息不符合规则')
        }
      })
    },

    // 删除品牌
    deleteTradeMark(row) {
      // 弹框
      this.$confirm(`确定要删除 “${row.tmName}” ?,该操作不可撤回。`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 当用户点击确定按钮时会触发
        // 发送删除请求
        const result = await this.$API.trademark.reqDeleteTradeMark(row.id)
        if (result.code === 200) {
          this.getPageList(this.list.length > 1 ? this.page : this.page - 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        } else {
          console.log(result)
          this.$message({
            type: 'warning',
            message: '删除失败'
          })
        }
      }).catch(() => {
        // 用户点击取消按钮会触发
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }

  }
}
</script>

<style lang="scss" >
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
