import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入组件
import Login from '@/views/login/'

// 注册路由
Vue.use(VueRouter)

// 路由规则
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]

// 初始化
const router = new VueRouter({
  routes
})

// 导出
export default router
