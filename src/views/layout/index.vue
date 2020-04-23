<template>
<el-container class="layout-container">
  <el-aside width="auto" class="aside">
      <!-- 绑定自定义属性给侧边栏子组件 -->
      <app-aside class="aside-item" :isCollapse='isCollapse'></app-aside>
  </el-aside>
  <el-container>
    <el-header class="header">
      <div>
        <!-- 实现图标的点击互换 -->
        <i :class="{'el-icon-s-fold':isCollapse,'el-icon-s-unfold':!isCollapse}" @click="isCollapse = !isCollapse"></i>
        <span>江苏传智播客教育有限公司</span>
      </div>
      <el-dropdown>
        <span class="el-dropdown-link">
          <img class="image" :src="user.photo"/>
          {{user.name}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item @click.native="onLayout()">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      </el-header>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from './aside'
import { getUserProfile } from '@/api/user'
// import AppHeader from './header'
export default {
  name: 'LayoutIndex',
  components: {
    // AppHeader,
    AppAside
  },
  props: {},
  data () {
    return {
      user: {},
      isCollapse: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.LoadUserProfile()
  },
  mounted () {},
  methods: {
    LoadUserProfile () {
      getUserProfile().then(res => {
        console.log(res)
        this.user = res.data.data
      })
    },
    onLayout () {
      this.$confirm('确认退出吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除token,退出
        window.localStorage.removeItem('user')
        // 跳转
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.layout-container{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}
.aside{
    background-color: #002033;
    .aside-item{
        height: 100%;
    }
}
.header{
    height: 60px;
    line-height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    .image{
        height: 40px;
        width: 40px;
        border-radius: 50%;
        vertical-align: middle;
    }
}
</style>
