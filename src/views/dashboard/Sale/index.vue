<!--
 * @Author: Jin Haocong
 * @Date: 2022-08-25 13:22:28
 * @LastEditTime: 2022-08-25 17:43:22
-->
<template>
  <div>
    <el-card class="box-card" style="margin:10px 0">
      <div slot="header" class="clearfix">
        <!--  @tab-click="handleClick" -->
        <el-tabs v-model="activeName" class="tab">
          <el-tab-pane label="销售额" name="sale"></el-tab-pane>
          <el-tab-pane label="访问量" name="visit"></el-tab-pane>
        </el-tabs>
        <div class="right">
          <span @click="setDay">今日</span>
          <span @click="setWeek">本周</span>
          <span @click="setMonth">本月</span>
          <span @click="setYear">本年</span>
          <!--             v-model="value1" -->
          <el-date-picker
            v-model="date"
            class="date"
            type="daterange"
            range-separator="——"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="18">
            <div ref="charts" class="charts"></div>
          </el-col>
          <el-col :span="6">
            <div class="content-right">
              <h3>门店{{ title }}排名</h3>
              <ul>
                <li>
                  <span class="rindex">1</span>
                  <span>肯德基</span>
                  <span class="rvalue">327,234</span>
                </li>
                <li>
                  <span class="rindex">2</span>
                  <span>麦当劳</span>
                  <span class="rvalue">299,123</span>
                </li>
                <li>
                  <span class="rindex">3</span>
                  <span>华莱士</span>
                  <span class="rvalue">283,998</span>
                </li>
                <li>
                  <span class="rindex">4</span>
                  <span>海底捞</span>
                  <span class="rvalue">266,156</span>
                </li>
                <li>
                  <span class="rindex">5</span>
                  <span>汉堡王</span>
                  <span class="rvalue">219,663</span>
                </li>
                <li>
                  <span class="rindex">6</span>
                  <span>蜜雪冰城</span>
                  <span class="rvalue">363,455</span>
                </li>
                <li>
                  <span class="rindex">7</span>
                  <span>真功夫</span>
                  <span class="rvalue">203,266</span>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>
<script>
// 引入
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import { mapState } from 'vuex'
export default {
  name: 'Sale',
  data() {
    return {
      activeName: 'sale',
      mycharts: null,
      // 收集日历的数据
      date: []
    }
  },
  computed: {
    title() {
      // 标题
      return this.activeName === 'sale' ? '销售额' : '访问量'
    },
    ...mapState({
      list: state => state.home.list
    })
  },
  watch: {
    title() {
      // 重新修改图表的配置
      this.mycharts.setOption({
        title: {
          text: this.title + '趋势'
        },
        xAxis: {
          data: this.title === '销售额' ? this.list.orderFullYearAxis : this.list.userFullYearAxis
        },
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: this.title === '销售额' ? this.list.orderFullYear : this.list.userFullYear

          }
        ]

      })
    },
    list() {
      this.mycharts.setOption({
        title: {
          text: this.title + '趋势'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.list.orderFullYearAxis,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: this.list.orderFullYear,
            color: '#84331f'
          }
        ]
      })
    }
  },
  mounted() {
    // 初始化echarts
    this.mycharts = echarts.init(this.$refs.charts)
    this.mycharts.setOption({
      title: {
        text: '销售额趋势'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: this.list.orderFullYearAxis,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: this.list.orderFullYear,
          color: '#84331f'
        }
      ]
    })
  },
  methods: {
    setDay() {
      const day = dayjs().format('YYYY-MM-DD')
      this.date = [day, day]
    },
    setWeek() {
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.date = [start, end]
    },
    setMonth() {
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.date = [start, end]
    },
    setYear() {
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.date = [start, end]
    }
  }
}
</script>

<style lang="scss" scoped>
.clearfix{
    display: flex;
    justify-content: space-between;
    position: relative;
}
.tab{
    width: 100%;
}
.right{
    position: absolute;
    right: 0;
}
.date{
    width: 300px;
    margin: 0 20px;
}
.right{
    span{
        margin: 10px;
    }
}
.charts{
    width: 100%;
    height: 400px;
}
ul{
    padding: 0;
    list-style: none;
    width: 100%;
    height: 400px;
    font-size: 20px;
    li{
        height: 50px;
        line-height: 50px;
    }
}
.rindex{
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
    background-color: black;
    color: white;
    margin-right: 30px;
}
.rvalue{
    float: right;
}
</style>
