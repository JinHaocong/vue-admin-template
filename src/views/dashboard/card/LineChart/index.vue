<!--
 * @Author: Jin Haocong
 * @Date: 2022-08-25 10:57:09
 * @LastEditTime: 2022-08-25 11:31:22
-->
<template>
  <div ref="charts" class="charts"></div>
</template>

<script>
// 引入echarts
import * as echarts from 'echarts'
export default {
  name: 'LineChart',
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
          type: 'line',
          data: [29, 37, 32, 48, 59, 20, 33, 30, 60, 50, 30, 44, 38, 55, 43],
          smooth: true,
          // 拐点样式
          itemStyle: {
            opacity: 0
          },
          // 线条样式
          lineStyle: {
            color: 'purple'
          },
          // 填充颜色
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'purple' // 0% 处的颜色
              }, {
                offset: 1, color: 'skyblue' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
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
      tooltip: { }
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
