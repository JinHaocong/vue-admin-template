<!--
 * @Author: Jin Haocong
 * @Date: 2022-08-25 14:50:29
 * @LastEditTime: 2022-08-25 16:29:47
-->
<template>
  <div>
    <el-card style="height:420px">
      <div slot="header" class="header">
        <div class="category-header">
          <span>销售额类别占比</span>
          <el-radio-group v-model="value">
            <el-radio-button label="全部渠道"></el-radio-button>
            <el-radio-button label="线上"></el-radio-button>
            <el-radio-button label="门店"></el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div>
        <div ref="charts" class="charts"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'Category',
  data() {
    return {
      value: '全部渠道'
    }
  },
  mounted() {
    const mycharts = echarts.init(this.$refs.charts)
    mycharts.setOption(
      {
        title: {
          text: '',
          subtext: '',
          left: 'center',
          top: '35%'
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            center: ['50%', '38%'],
            radius: ['30%', '60%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              position: 'outsizes'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: true
            },
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' }
            ]
          }
        ]
      })
    // 绑定事件
    mycharts.on('mouseover', (params) => {
      // 可以获取鼠标以上的那条数据
      const { name, value } = params.data
      // 重新设置标题
      mycharts.setOption({
        title: {
          text: name,
          subtext: value
        }
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.category-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header{
  border-bottom: 1px solid #d9d9d9;
}
.charts{
  width: 100%;
  height: 400px;
}
</style>

