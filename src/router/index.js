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

// 导航守卫
router.beforeEach((to, from, next) => {
  // 查看token
  const user = JSON.parse(window.localStorage.getItem('user'))
  // 判断是不是在登录界面
  if (to.path !== '/login') {
    // 不在登录界面,看是否有token,有继续,没有跳转到login
    if (user) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

// 导出
export default router
