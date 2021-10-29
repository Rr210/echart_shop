import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import echarts from 'echarts'
import './assets/css/global.css'
import '../public/js//theme/chalk.js'
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api'
Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$echarts = echarts
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
