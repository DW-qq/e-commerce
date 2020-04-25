import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('../views/Login')

const Home = () => import('../views/Home')

Vue.use(VueRouter)

  const routes = [
    {
      //路由重定向
      path: '',
      redirect:'/login'
    },
    {
      path:'/login',
      component:Login
    },
    {
      path:'/home',
      component:Home
    }
]

const router = new VueRouter({
  routes

})

//挂载路由导航守卫
router.beforeEach((to,from, next) => {
  //如果用户访问的登入首页，直接放行
  if(to.path === '/login') return next();

  //从 sessionStorage中获取到保存token值
  const tokenStr = window.sessionStorage.getItem('token')

  //判断是否存在token值，如果没有直接跳转login
  if(!tokenStr) return next('/login')

  next()
})
export default router
