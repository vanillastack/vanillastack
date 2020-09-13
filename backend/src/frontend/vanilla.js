import EventBus from './js/eventBus'
import Constants from './js/constants'
import Globals from './js/globals'
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import Store from './js/store'
import App from './Main.vue'
import Home from './Home.vue'
import Terms from "./Terms.vue"
import Kind from "./Kind.vue"
import Key from './Key.vue'
import Nodes from './Nodes.vue'
import Cluster from './Cluster.vue'
import Tools from './AdditionalTools.vue'
import NodeCheck from './NodeCheck.vue'
import OpenStack from './OpenStack.vue'
import CF from './CF.vue'
import 'es6-promise/auto'
import Network from './js/network'
import Subscription from './Subscription.vue'
import Rook from './Rook.vue'

// Call Vue.use(VueRouter)
Vue.use(VueRouter)

// Add the resources-plugin
Vue.use(VueResource)

// Add the Network-Componten
Vue.use(Network)

// Require all the CSS
require('bootstrap');
require('./css/bootstrap.min.css');
require('./css/vanilla-backend.css');
require('./css/all.min.css')

// Define the routes
const routes = [
    { path: '/', alias: '/start', component: Home},
    { path: '/terms', component: Terms },
    { path: '/kind', component: Kind },
    { path: '/key', component: Key},
    { path: '/nodes', component: Nodes},
    { path: '/nodecheck', component: NodeCheck},
    { path: '/cluster', component: Cluster},
    { path: '/rook', component: Rook},
    { path: '/openstack', component: OpenStack},
    { path: '/cf', component: CF},
    { path: '/tools', component: Tools},
    { path: '/subscription', component: Subscription},
    { path: '/summary', component: Key}
  ];

var currentRoute = 0;

// Set up the router
const router = new VueRouter({
    routes: routes,
    scrollBehavior() {
        return {x: 0, y: 0}
    }
  })

// Handle the forward / backward-events
EventBus.$on(Constants.Event_GoBack, e => {
  var current = currentRoute
  currentRoute -= 1
  app.handleNavigation(current, currentRoute, false)
})

// Handle the forward / backward-events
EventBus.$on(Constants.Event_GoNext, e => {
  var current = currentRoute
  currentRoute += 1
  app.handleNavigation(current, currentRoute, true)
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
      // Configure the router
      this.$router.afterEach((to, from) => {
        // Get the new index
        var index = 0;
        for(var i=0; i<routes.length; i++) {
          var route = routes[i].path
          if(route == to.path) {
            index = i
            break;
          }
        }

        currentRoute = index
        console.log("Current Route Index", currentRoute)
      })

      // Handle the NewViewLoaded-event
      EventBus.$on(Constants.Event_NewViewLoaded, data => {
        // Store the data
        this.$store.commit(Constants.Store_UpdateNavigation, data);
      }) 

      // Handle the loading of the base info data
      EventBus.$on(Constants.Network_LoadedInfo, data => {
        // Store the data
        this.$store.commit(Constants.Store_BaseDataUpdateData, data)

        // Store the UUID globally
        Globals.UUID = data.uuid

        // Open the websocket connection
        this.$network.openWebSocket(this.$network, data.uuid)
      })

      // Execute the info-call to the backend
      this.$network.getInfo()
    },
    
    methods: {
      getRoute: function(index, forward) {
        var route = routes[index];

        // Check, whether it is one of the dynamic routes (which might not be visible)
        if(route.path == '/rook' && !this.$store.state.installer.installRook)
          return this.getRoute(forward ? index + 1 : index - 1, forward)

        if(route.path == '/cf' && !this.$store.state.installer.installCF)
          return this.getRoute(forward ? index + 1 : index - 1, forward)

        if(route.path == '/openstack' && !this.$store.state.installer.installOpenStack)
          return this.getRoute(forward ? index + 1 : index - 1, forward)

        return route
      },

      // Handles the navigation
      handleNavigation: function(current, index, forward) {
        
        // Get the route
        var route = this.getRoute(index, forward)
        var previousRoute = routes[current]

        // Inform about the navigational change
        EventBus.$emit(Constants.Event_PrepareNavigation, {
          currentRoute: previousRoute.path.length > 0 ? previousRoute.path.substring(1) : 'start'
        })

        // Make it visible
        if(this.$route === null || this.$route.path !== route.path) 
          router.push(route)

        // Store the current position
        currentRoute = routes.indexOf(route);
      
        // Set whether forward or backward navigation was possible
        this.$store.commit(Constants.Store_UpdateGlobalNavigation, {
          canGoForward: index < routes.length -1,
          canGoBack: index > 0
        })
      }
    }
  })
  .$mount("#vanilla")

app.handleNavigation(0, 0, true)

// Store the globals
Globals.router = router
Globals.vue = app
Globals.store = Store
Globals.routes = routes

console.log("Started Vue");
  