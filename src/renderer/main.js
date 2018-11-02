import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import {ipcRenderer} from 'electron'
import { mapState, mapActions } from "vuex";


Vue.use(ElementUI)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

ipcRenderer.on('scoket-connect', (d) => {
  store.dispatch('CONNECT')
})
ipcRenderer.on('dis-connect', (d) => {
  store.dispatch('DIS_CONNECT')
})
// echo-process
ipcRenderer.on('echo-process', (event, d) => {
  console.log('------------------++++++', d)
  store.dispatch('SET_PRINTERS', d.data)
})
