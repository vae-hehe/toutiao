import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由懒加载
// webpack 就会把所有通过 () => import('资源路径') 记载成一个一个独立的代码文件块 chunk
const Login = () => import('@/views/login/')
const Home = () => import('@/views/home/')
const Layout = () => import('@/views/layout/')
const Article = () => import('@/views/article/')
const Publish = () => import(/* webpackChunkName: "group-foo" */'@/views/publish/')
const Image = () => import('@/views/image/')
const Comment = () => import('@/views/comment/')
const Fans = () => import(/* webpackChunkName: "group-foo" */'@/views/fans/')
const Settings = () => import('@/views/settings/')

// 导入组件
// import Login from '@/views/login/'
// import Home from '@/views/home/'
// import Layout from '@/views/layout'
// import Article from '@/views/article'
// import Publish from '@/views/publish'
// import Image from '@/views/image/'
// import Comment from '@/views/comment'
// import Fans from '@/views/fans'
// import Settings from '@/views/settings'

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
      },
      {
        path: '/article',
        name: 'article',
        component: Article
      },
      {
        path: '/publish',
        name: 'publish',
        component: Publish
      },
      {
        path: '/image',
        name: 'image',
        component: Image
      },
      {
        path: '/comment',
        name: 'comment',
        component: Comment
      },
      {
        path: '/fans',
        name: 'fans',
        component: Fans
      },
      {
        path: '/settings',
        name: 'settings',
        component: Settings
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
