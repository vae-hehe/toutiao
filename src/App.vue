<template>
  <div id="app">
    <div class="container">
      <!-- 主页面 -->
      <!-- 顶部导航 -->
      <app-header></app-header>
      <!-- 侧边栏 -->
      <app-aside></app-aside>
      <!-- 内容 -->
      <!-- 路由出口 -->
      <router-view/>
    </div>
  </div>
</template>

<script>
import AppHeader from '@/views/header'
import AppAside from '@/views/aside'
export default {
  components: {
    AppAside,
    AppHeader
  }
}
</script>

<style lang="less"></style>
