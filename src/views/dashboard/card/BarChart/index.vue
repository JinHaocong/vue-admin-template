<!--
 * @Author: Jin Haocong
 * @Date: 2022-08-25 11:25:42
 * @LastEditTime: 2022-08-25 11:33:19
-->
<!--
 * @Author: Jin Haocong
 * @Date: 2022-08-25 10:57:09
 * @LastEditTime: 2022-08-25 11:30:42
-->
<template>
  <div ref="charts" class="charts"></div>
</template>

<script>
// 引入echarts
import * as echarts from 'echarts'
export default {
  name: 'BarChart',
  mounted() {
    // 初始化echarts实例
    const linechart = echarts.init(this.$refs.charts)
    linechart.setOption({
      xAxis: {
        show: false,
        type: 'category'
      },
      yAxis: {
        show: false
      },
      series: [
        {
          type: 'bar',
          data: [29, 37, 32, 48, 59, 20, 33, 30, 60, 50, 30, 44, 38, 55, 43],
          color: 'skyblue'
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
