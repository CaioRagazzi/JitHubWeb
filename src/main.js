import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import ArgonDashboard from './plugins/argon-dashboard'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'izitoast/dist/css/iziToast.min.css';

Vue.config.productionTip = false
Vue.use(BootstrapVue)

Vue.use(ArgonDashboard)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
