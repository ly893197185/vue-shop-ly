// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 引入css样式全局
import './assets/css/global.css'
// 引入element-ui
import ElementUI from 'element-ui'
// 引入图标库css样式文件
import './assets/fonts/iconfont.css'
// 引入axios
import axios from 'axios'
// 给axios配置（访问根地址，vue之$http成员）
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
// 给axios配置拦截器，在其中绑定token
axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    const token = window.sessionStorage.getItem('token')
    config.headers.Authorization = token
    return config
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  }
)
Vue.prototype.$http = axios

// 给vue注册全部的element-ui的标签组件和事件方法组件
Vue.use(ElementUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
