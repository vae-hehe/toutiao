<template>
<div class="comment-container">
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>评论管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 表格 -->
    <el-table
      :data="comments"
      stripe
      style="width: 100%">
      <el-table-column
        prop="title"
        label="标题">
      </el-table-column>
      <el-table-column
        prop="total_comment_count"
        label="总评论数">
      </el-table-column>
      <el-table-column
        prop="fans_comment_count"
        label="粉丝评论数">
      </el-table-column>
      <el-table-column
        prop="comment_status"
        label="评论状态">
        <!-- 自定义属性 -->
        <template slot-scope="scope">
          {{ scope.row.comment_status ? '正常' : '关闭' }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <!-- 操作使用开关,交互更好一些 -->
          <el-switch
            v-model="scope.row.comment_status"
            @change="onChangeStatus(scope.row)"
            :disabled="onDisabledStatus"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 100]"
      :page-size="pageSize"
      :disabled="onDisabledChange"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount">
    </el-pagination>
  </el-card>
</div>
</template>

<script>
import { getArticles, updateCommentStatus } from '@/api/article'
export default {
  name: 'CommentIndex',
  components: {},
  props: {},
  data () {
    return {
      comments: [],
      onDisabledStatus: false, // 禁用开关
      currentPage: 1, // 当前的页码
      pageSize: 20, // 每页显示的内容条数
      totalCount: 0,
      onDisabledChange: false // 页码加载时显示禁用状态
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadComments(1)
  },
  mounted () {},
  methods: {
    loadComments (page = 1) {
      this.onDisabledChange = true
      // 改变筛选之后,页码高亮显示的状态
      this.currentPage = page
      getArticles({
        response_type: 'comment',
        page,
        per_page: this.pageSize
      }).then(res => {
        console.log(res)
        this.comments = res.data.data.results
        this.totalCount = res.data.data.total_count
        this.onDisabledChange = false
      })
    },
    // 开关打开关闭事件
    onChangeStatus (comments) {
      // 开启禁用状态
      this.onDisabledStatus = true
      updateCommentStatus(comments.id.toString(), comments.comment_status).then(res => {
        this.$message({
          type: 'success',
          message: comments.comment_status ? '开启文章评论状态' : '关闭文章评论状态'
        })
        // 关闭禁用状态
        this.onDisabledStatus = false
      })
    },
    // 分页相关功能
    // 每页条数改变是触发,改变总页数
    handleSizeChange (page) {
      this.loadComments(page)
    },
    // 点击页码切换页面的功能
    handleCurrentChange (page) {
      this.loadComments(page)
    }
  }
}
</script>

<style scoped lang="less"></style>
