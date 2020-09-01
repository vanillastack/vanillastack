import EventBus from './js/eventBus'
import Constants from './js/constants'
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
    { path: '/', alias: '/start', component: Home},
    { path: '/terms', component: Terms },
    { path: '/kind', component: Kind },
    { path: '/key', component: Key}
  ];

var currentRoute = 0;

// Set up the router
const router = new VueRouter({
    routes // short for `routes: routes`
  })

// Handle the forward / backward-events
EventBus.$on(Constants.Event_GoBack, e => {
  currentRoute -= 1
  app.handleNavigation(currentRoute)
})

// Handle the forward / backward-events
EventBus.$on(Constants.Event_GoNext, e => {
  currentRoute += 1
  app.handleNavigation(currentRoute)
})

// Start the app
var app = new Vue({
    router,
    store : Store,
    created: function () {
      console.log('Vue is running');
    },
    render: h => h(App),
    
    mounted: function() {
      console.log("==> Loaded Vanilla")
    },

    created: function() {
      
      EventBus.$on(Constants.Event_NewViewLoaded, data => {
        // Store the data
        this.$store.commit(Constants.Store_UpdateNavigation, data);
      }) 
    },
    
    methods: {
      // Handles the navigation
      handleNavigation: function(index, navigate) {
        
        // Get the route
        var route = routes[index]

        // Make it visible
        if(this.$route === null || this.$route.path !== route.path) 
          router.push(route)
      
        // Set whether forward or backward navigation was possible
        this.$store.commit(Constants.Store_UpdateGlobalNavigation, {
          canGoForward: index < routes.length -1,
          canGoBack: index > 0
        })
      }
    }
  })
  .$mount("#vanilla")

app.handleNavigation(0, false)

console.log("Started Vue");
  