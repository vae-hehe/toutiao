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
        <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核成功</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
        </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
            <el-select v-model="channelId" placeholder="请选择频道">
            <!-- 默认显示全部 -->
            <el-option label="全部" :value="null"></el-option>
            <el-option v-for="(channel, index) in channels" :key="index" :label="channel.name" :value="channel.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="日期">
            <div class="block">
                <!-- 绑定数据查询 -->
                <el-date-picker
                v-model="rangeDate"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :default-time="['12:00:00']">
            </el-date-picker>
            </div>
        </el-form-item>
        <el-form-item>
            <!-- 查询数据,就是渲染表格,直接调用loadArticles -->
            <el-button :disabled="loading" type="primary" @click="loadArticles(1)">查询</el-button>
        </el-form-item>
    </el-form>
  </el-card>
  <!-- /卡片 -->

  <!-- 卡片 -->
  <el-card class="box-card card1">
    <div slot="header" class="clearfix">
        <span>根据筛选条件共查询到{{ totalCount }}条</span>
    </div>
    <el-table
      class="list-table"
      size="mini"
      :data="articles"
      v-loading="loading"
      style="width: 100%">
      <el-table-column
        label="封面">
        <template slot-scope="scope">
          <!-- 方法一 -->
          <!-- <img v-if="scope.row.cover.images[0]" :src="scope.row.cover.images[0]" alt="" class="image">
          <img v-else src="./1.jpeg" alt="" class="image"> -->
          <!-- 方法二 -->
          <el-image
            style="width: 60px; height: 60px"
            :src="scope.row.cover.images[0]"
            fit="fit">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题">
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          <el-tag :type="articleStatus[scope.row.status].type">{{articleStatus[scope.row.status].item}}</el-tag>
          <!-- 优化状态栏 -->
          <!-- <el-tag v-else-if="scope.row.status === 1" type="info">待审核</el-tag>
          <el-tag v-else-if="scope.row.status === 2" type="success">审核通过</el-tag>
          <el-tag v-else-if="scope.row.status === 3" type="danger">审核失败</el-tag>
          <el-tag v-else-if="scope.row.status === 4" type="warning">已删除</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column
        prop="pubdate"
        label="发表时间">
      </el-table-column>
      <el-table-column
        label="操作">
        <!-- 将自定义属性放到template中,prop删掉 -->
        <template slot-scope="scope">
          <!-- 跳转的时候,直接使用$router.push,注意使用拼接字符串,id太长需要转换 -->
          <el-button
            icon="el-icon-edit"
            circle
            type="primary"
            @click="$router.push('/publish?id='+scope.row.id.toString())"
            size="mini"></el-button>
          <!-- 将 page 绑定到分页组件上用来同步当前页码 -->
          <el-button
            size="mini"
            circle
            icon="el-icon-delete"
            :current-page.sync="page"
            @click="ondeleteArticle(scope.row.id)"
            type="danger"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 数据分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :disabled="loading"
      @current-change="onCurrentChange"
      :page-size="pageSize"
      :total="totalCount">
    </el-pagination>
  </el-card>
  <!-- /卡片 -->
</div>
</template>

<script>
import { getArticles, getArticleChannels, deleteArticle } from '@/api/article'
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
      articles: [],
      articleStatus: [
        { status: 0, item: '草稿', type: '' },
        { status: 1, item: '待审核', type: 'info' },
        { status: 2, item: '审核通过', type: 'success' },
        { status: 3, item: '审核失败', type: 'danger' },
        { status: 4, item: '已删除', type: 'warning' }
      ],
      pageSize: 20, // 每页多少数据
      totalCount: 0,
      status: null,
      loading: true,
      channels: [],
      channelId: null,
      rangeDate: null,
      page: 1
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticles(1)
    this.loadChannels()
  },
  mounted () {},
  methods: {
    loadArticles (page = 1) {
      // 加载页面的时候开启
      this.loading = true
      getArticles({
        page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null
      }).then(res => {
        console.log(res)
        const { results, total_count: totalCount } = res.data.data
        this.articles = results
        this.totalCount = totalCount

        // 关闭
        this.loading = false
      })
    },
    // 根据当前点击的页码,切换页面
    onCurrentChange (page) {
      this.loadArticles(page)
    },
    // 获取频道
    loadChannels () {
      getArticleChannels().then(res => {
        console.log(res)
        this.channels = res.data.data.channels
      })
    },
    // 删除文章
    ondeleteArticle (articleId) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle(articleId.toString()).then(res => {
          this.loadArticles(this.page)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      })
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
.image{
  width: 60px;
}
</style>
