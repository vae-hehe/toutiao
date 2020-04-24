<template>
<div class="article-container">
  <!-- 卡片 -->
  <el-card class="box-card">
  <div slot="header" class="clearfix">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>内容管理</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <!-- 数据刷选 -->
    <el-form class="form" ref="form" :model="form" label-width="40px" size="mini">
        <el-form-item label="状态">
        <el-radio-group v-model="form.resource">
            <el-radio label="全部"></el-radio>
            <el-radio label="草稿"></el-radio>
            <el-radio label="待审核"></el-radio>
            <el-radio label="审核通过"></el-radio>
            <el-radio label="审核失败"></el-radio>
            <el-radio label="已删除"></el-radio>
        </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
            <el-select v-model="form.region" placeholder="请选择频道">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="日期">
            <div class="block">
                <el-date-picker
                v-model="form.data1"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['12:00:00']">
            </el-date-picker>
            </div>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
    </el-form>
  </el-card>
  <!-- /卡片 -->

  <!-- 卡片 -->
  <el-card class="box-card card1">
    <div slot="header" class="clearfix">
        <span>根据筛选条件共查询到46147条</span>
    </div>
    <el-table
      class="list-table"
      size="mini"
      :data="articles"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="封面">
        <template>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题">
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0">草稿</el-tag>
          <el-tag v-else-if="scope.row.status === 1" type="info">待审核</el-tag>
          <el-tag v-else-if="scope.row.status === 2" type="success">审核通过</el-tag>
          <el-tag v-else-if="scope.row.status === 3" type="danger">审核失败</el-tag>
          <el-tag v-else-if="scope.row.status === 4" type="warning">已删除</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="pubdate"
        label="发表时间">
      </el-table-column>
      <el-table-column
        label="操作">
        <!-- 将自定义属性放到template中,prop删掉 -->
        <template>
          <el-button
            icon="el-icon-edit"
            circle
            type="primary"
            size="mini"></el-button>
          <el-button
            size="mini"
            circle
            icon="el-icon-delete"
            type="danger"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 数据分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="1000">
    </el-pagination>
  </el-card>
  <!-- /卡片 -->
</div>
</template>

<script>
import { getArticles } from '@/api/article'
export default {
  name: 'ArticleIndex',
  components: {},
  props: {},
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      articles: []
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticles()
  },
  mounted () {},
  methods: {
    loadArticles () {
      getArticles().then(res => {
        console.log(res)
        this.articles = res.data.data.results
      })
    },
    onSubmit () {
      console.log('submit!')
    }
  }
}
</script>

<style scoped lang="less">
.card1{
    margin-top: 30px;
}
.list-table{
    margin-bottom: 20px;
}
</style>
