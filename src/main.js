import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'

//配置请求根路径
/*
本机地址
axios.defaults.baseURL = 'http://127.0.0.0:8888/api/private/v1/'
*/

//远程后台地址
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.interceptors.request.use((config) => {
  //预处理
  config.headers.AUTHORIZATION = window.sessionStorage.getItem('token')
  console.log(config)
  //最后必须return config
  return config
})
Vue.prototype.$http = axios

import './assets/css/global.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
