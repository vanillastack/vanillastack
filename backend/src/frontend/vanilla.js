import Vue from 'vue'
import VueRouter from 'vue-router'
import Store from './js/store'
import App from './Main.vue'
import Home from './Home.vue'
import Terms from "./Terms.vue"
import Kind from "./Kind.vue"
import Key from './Key.vue'
import 'es6-promise/auto'

// Call Vue.use(VueRouter)
Vue.use(VueRouter);

// Require all the CSS
require('bootstrap');
require('./css/bootstrap.min.css');
require('./css/vanilla-backend.css');

// Define the routes
const routes = [
    { path: '/', alias: '/start' , component: Home},
    { path: '/terms', component: Terms },
    { path: '/kind', component: Kind },
    { path: '/key', component: Key}
  ];

// Set up the router
const router = new VueRouter({
    routes // short for `routes: routes`
  })

  
// Start the app
var app = new Vue({
    router,
    store : Store,
    created: function () {
      console.log('Vue is running');
    },
    render: h => h(App),
    
  })
  .$mount("#vanilla");

console.log("Started Vue");
  