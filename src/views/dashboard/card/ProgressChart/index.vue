<!--
 * @Author: Jin Haocong
 * @Date: 2022-08-25 10:57:09
 * @LastEditTime: 2022-08-25 11:53:08
-->
<template>
  <div ref="charts" class="charts"></div>
</template>

<script>
// 引入echarts
import * as echarts from 'echarts'
export default {
  name: 'ProgressChart',
  mounted() {
    // 初始化echarts实例
    const linechart = echarts.init(this.$refs.charts)
    linechart.setOption({
      xAxis: {
        show: false,
        // 设置最大值最小值
        min: 0,
        max: 100
      },
      yAxis: {
        show: false,
        type: 'category'
      },
      series: [
        {
          type: 'bar',
          data: [68],
          barWidth: '30px',
          color: 'yellowgreen',
          showBackground: true,
          backgroundStyle: {
            color: '#eee'
          },
          // 文本设置
          label: {
            show: true,
            formatter: '|',
            position: 'right',
            color: 'yellowgreen'
          }
        }
      ],
      // 布局
      grid: {
        left: 10,
        top: 10,
        right: 10,
        bottom: 10
      },
      tooltip: {}
    })
  }
}
</script>

<style lang="scss" scoped>
.charts{
    width: 100%;
    height: 100%;
}
</style>
