<!--
 * @Author: Jin Haocong
 * @Date: 2022-08-25 14:50:55
 * @LastEditTime: 2022-08-25 15:57:27
-->
<template>
  <el-card style="height:420px">
    <div slot="header" class="header">
      <div class="search-header">
        <span>线上热门搜索</span>
        <el-dropdown>
          <span class="el-dropdown-link">
            <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="12">
          <LineCharts></LineCharts>
        </el-col>
        <el-col :span="12">
          <LineCharts></LineCharts>
        </el-col>
      </el-row>
      <!-- table表格 -->
      <el-table
        :data="tableData"
        style="width: 100%"
        border
      >
        <el-table-column
          type="index"
          label="排名"
          width="80"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="搜索关键字"
          width="180"
        >
        </el-table-column>
        <el-table-column
          label="用户数"
          sortable
        >
        </el-table-column>
        <el-table-column
          label="周涨幅"
          sortable
        >
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        layout="prev, pager, next"
        :total="1000"
        style="float:right;margin-top:6px"
      >
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import LineCharts from './LineChartc'
export default {
  name: 'Search',
  components: {
    LineCharts
  },
  data() {
    return {
      tableData: []
    }
  }
}
</script>

<style lang="scss" scoped>
.search-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header{
  border-bottom: 1px solid #d9d9d9;
  padding:10px 0 ;
}
</style>
