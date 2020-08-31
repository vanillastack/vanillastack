import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './Main.vue'
import Home from './Home.vue'
import Terms from "./Terms.vue"

// Call Vue.use(VueRouter)
Vue.use(VueRouter);

// Require all the CSS
require('bootstrap');
require('./css/bootstrap.min.css');
require('./css/vanilla-backend.css');
// 1. Define route components.
// These can be imported from other files
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

const routes = [
    { path: '/', alias: '/start' , component: Home},
    { path: '/terms', component: Terms },
    { path: '/bar', component: Bar }
  ];

const router = new VueRouter({
    routes // short for `routes: routes`
  })
  

var app = new Vue({
    router,
    created: function () {
      console.log('Vue is running');
    },
    render: h => h(App)
  }).$mount("#vanilla");

console.log("Started Vue");
  