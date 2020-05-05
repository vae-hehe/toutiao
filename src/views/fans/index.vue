<template>
<div class="fans-container">
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="粉丝列表" name="first">
          <el-row :gutter="10">
            <el-col :lg="3" :md="5" :sm="6" :xs="8" v-for="(item, index) in fansList" :key="index">
              <div class="list">
                <img :src="item.photo" alt="">
                <p>{{ item.name }}</p>
              </div>
            </el-col>
          </el-row>
          <!-- 分页数据 -->
          <el-pagination
            style="margin:20px 0 0 -10px"
            background
            layout="prev, pager, next"
            :disabled="getDisabled"
            :page-size="pageSize"
            @current-change="loadFansList"
            :total="totalCount">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="粉丝头像" name="second">
          <!-- 1.为 ECharts 准备一个具备大小（宽高）的 DOM -->
          <div ref="main" style="width: 600px;height:400px;"></div>
        </el-tab-pane>
      </el-tabs>
  </el-card>
</div>
</template>

<script>
import { getFans } from '@/api/user'
import echarts from 'echarts'
export default {
  name: 'FansIndex',
  components: {},
  props: {},
  data () {
    return {
      activeName: 'first',
      fansList: [],
      getDisabled: false, // 页数加载时禁用
      pageSize: 20, // 每页显示的条数
      totalCount: 0 // 总条数
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadFansList()
  },
  mounted () {
    // 2.基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.$refs.main)
    // 3.指定图表的配置项和数据
    var option = {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    }
    // 4.使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    // 获取粉丝列表
    loadFansList (page = 1) {
      this.getDisabled = true
      getFans({
        page,
        per_page: this.pageSize
      }).then(res => {
        console.log(res)
        this.fansList = res.data.data.results
        this.totalCount = res.data.data.total_count

        // 关闭禁用
        this.getDisabled = false
      })
    }
    // 当页数改变的时候触发的函数 可以不写直接写loadFansList
    // onCurrentChange (page) {
    //   this.loadFansList(page)
    // }
  }
}
</script>

<style scoped lang="less">
.list {
    width: 150px;
    height: 200px;
    border: 1px solid #ccc;
    margin-top: 5px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
    }
}
</style>
