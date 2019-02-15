import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [{ path: '/welcome', component: Welcome }]
    }
  ]
})
// 路由导航卫士，检测token如果不存在，就跳到登陆页面
router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.
  // 访问/login 就让它继续执行
  if (to.path === '/login') {
    return next()
  }
  // 访问的不是/Login 检测是否存在token
  var token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next() // token存在  跳转到home页面
})

export default router
