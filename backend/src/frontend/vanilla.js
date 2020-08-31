import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './Main.vue'
import Home from './Home.vue'
import Terms from "./Terms.vue"
import Vuex from 'vuex'
import 'es6-promise/auto'
import Events from './js/events.js'
import EventBus from './js/eventBus.js'

// Call Vue.use(VueRouter)
Vue.use(VueRouter);
Vue.use(Vuex);

// Require all the CSS
require('bootstrap');
require('./css/bootstrap.min.css');
require('./css/vanilla-backend.css');

// Define the routes
const routes = [
    { path: '/', alias: '/start' , component: Home},
    { path: '/terms', component: Terms }
  ];

// Set up the router
const router = new VueRouter({
    routes // short for `routes: routes`
  })

// Define the store
const store = new Vuex.Store({
  state: {
    acceptedTerms: false
  },

  mutations: {
    updateTermsAccepted(state, message) {
      state.acceptedTerms = message;
      EventBus.$emit(Events.AcceptedTermsChanged, state.acceptedTerms);
      console.log(app);
    }
  }
})
  
// Start the app
var app = new Vue({
    router,
    store : store,
    created: function () {
      console.log('Vue is running');
    },
    render: h => h(App),
    
  })
  .$mount("#vanilla");

console.log("Started Vue");
  