import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase'
import './registerServiceWorker'
import ArgonDashboard from './plugins/argon-dashboard'

Vue.config.productionTip = false

let app = '';

var firebaseConfig = {
  apiKey: "AIzaSyAObzF1g96rO1Z8sSZAkXihDdSGQ_51qN4",
  authDomain: "jithub.firebaseapp.com",
  databaseURL: "https://jithub.firebaseio.com",
  projectId: "jithub",
  storageBucket: "jithub.appspot.com",
  messagingSenderId: "373189356168",
  appId: "1:373189356168:web:fd0f0619654e33c7"
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
