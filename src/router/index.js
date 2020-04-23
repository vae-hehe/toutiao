import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入组件
import Login from '@/views/login/'
import Home from '@/views/home/'
import Layout from '@/views/layout'

// 注册路由
Vue.use(VueRouter)

// 路由规则
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    // name: 'layout', // 有默认子组件,不用写name了
    component: Layout,
    children: [
      {
        path: '', // 和父组件的地址一样时,地址为空
        name: 'home',
        component: Home
      }
    ]
  }
]

// 初始化
const router = new VueRouter({
  routes
})

// 导出
export default router
