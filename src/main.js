import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase'
import './registerServiceWorker'
import ArgonDashboard from './plugins/argon-dashboard'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vuetify/dist/vuetify.min.css'
import Vuetify from 'vuetify'

Vue.use(Vuetify)

Vue.config.productionTip = false
Vue.use(BootstrapVue)

let app = '';

var firebaseConfig = {
  apiKey: "AIzaSyAObzF1g96rO1Z8sSZAkXihDdSGQ_51qN4",
  authDomain: "jithub.firebaseapp.com",
  databaseURL: "https://jithub.firebaseio.com",
  projectId: "jithub",
  storageBucket: "jithub.appspot.com",
  messagingSenderId: "373189356168",
  appId: "1:373189356168:web:ad39131d86a8af6e"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(() => {
  if(!app){
    Vue.use(ArgonDashboard)
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
});
