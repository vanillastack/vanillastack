<template>
  <span>
    <!-- Header area -->
    <header class="header">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <router-link to="/" class="navbar-brand"><img src="/images/vanilla-logo.png" class="logo" /></router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
      </nav>
    </header>

    <!-- Main area -->
    <main class="main h-100 margin-bottom-4em">
      <div class="container-fluid h-100">
        <div class="row h-100">
          <div class="col-2 navigation">
            <!-- Local navigation for the installer -->
            <ul class="secondary-nav">
              <li><router-link to="/start" class="nav-item">Start</router-link></li>
              <li><router-link to="/terms" class="nav-item">Terms</router-link></li>
              <li><router-link tag="button" :disabled="!acceptedTerms" to="/kind" class="nav-item button-as-link">Installation Kind</router-link></li>
              <li><router-link tag="button" :disabled="!acceptedTerms" to="/key" class="nav-item button-as-link">Public Key</router-link></li>
              <li><router-link tag="button" :disabled="!seededKey" to="/nodes" class="nav-item button-as-link">Nodes</router-link></li>
              <li><router-link tag="button" :disabled="!seededKey" to="/ip" class="nav-item button-as-link">IP Addresses</router-link></li>
              <li v-if="hasRook"><router-link tag="button" :disabled="!seededKey" to="/rook" class="nav-item button-as-link">Rook</router-link></li>
              <li v-if="hasOpenStack"><router-link tag="button" :disabled="!seededKey" to="/openstack" class="nav-item button-as-link">OpenStack</router-link></li>
              <li v-if="hasCF"><router-link tag="button" :disabled="!seededKey" to="/cf" class="nav-item button-as-link">Cloud Foundry</router-link></li>
              <li><router-link tag="button" :disabled="!seededKey" to="/additional" class="nav-item button-as-link">Additional Tools</router-link></li>
              <li><router-link tag="button" :disabled="!seededKey" to="/subscription" class="nav-item button-as-link">Subscription Key</router-link></li>
              <li><router-link tag="button" :disabled="!seededKey" to="/summary" class="nav-item button-as-link">Summary</router-link></li>
            </ul>
          </div>
          <div class="col h-100">
            <div class="content h-100">
              <div class="row h-100">
                <div class="col scroll-area"><router-view></router-view></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 align-center">
              <span v-if="!canGoBack" class="block-width-100 margin-right-2em"></span>
              <a v-if="canGoBack" class="btn btn-primary min-width-100 margin-right-2em" role="button" v-on:click="goBack">Back</a>
              <a v-if="canGoForward" class="btn btn-success min-width-100" :class="{disabled: !allowGoForward}" role="button" v-on:click="goNext">Next</a>
          </div>
        </div>
      </div>
    </footer>
  </span>
</template>
<script>
import Constants from './js/constants.js'
import EventBus from './js/eventBus.js'

export default {
  name: 'app',
  data: 
    function() {
        return {
          canGoBack: this.$store.state.navigation.canGoBack,
          canGoForward: this.$store.state.navigation.canGoForward,
          allowGoForward: this.$store.state.navigation.allowGoForward,
          acceptedTerms: this.$store.state.navigation.acceptedTerms,
          seededKey: this.$store.state.installer.copiedKeyToNodes && this.$store.state.navigation.acceptedTerms,
          hasRook: this.$store.state.installer.installRook,
          hasOpenStack: this.$store.state.installer.installOpenStack,
          hasCF: this.$store.state.installer.installCF
        }
  },

  methods: {
    goBack : function(e) {
      EventBus.$emit(Constants.Event_PrepareNavigation)
      EventBus.$emit(Constants.Event_GoBack)
    },

    goNext : function(e) {
      EventBus.$emit(Constants.Event_PrepareNavigation)
      EventBus.$emit(Constants.Event_GoNext)
    },

    validateLinks: function() {
      this.acceptedTerms = this.$store.state.navigation.acceptedTerms
      this.seededKey = this.$store.state.installer.copiedKeyToNodes && this.acceptedTerms
    }
  },

  created : function () {
    // Update the links when the terms were accepted
    EventBus.$on(Constants.Event_AcceptedTermsChanged, value => {
      this.acceptedTerms = value
      this.validateLinks()
      })

    // Update the links when the SSH-key was seeded
    EventBus.$on(Constants.Event_CopiedKeyToNodes, value => {
      this.validateLinks()
      })

    EventBus.$on(Constants.Event_InstallationRookUpdated, value => {
      this.hasRook = value
    })

    EventBus.$on(Constants.Event_InstallationOpenStackUpdated, value => {
      this.hasOpenStack = value
    })

    EventBus.$on(Constants.Event_InstallationCFUpdated, value => {
      this.hasCF = value
    })

    // Handle an update of the navigation options
    EventBus.$on(Constants.Event_NavigationUpdated, value => {
        this.canGoBack = value.canGoBack
        this.canGoForward = value.canGoForward
        this.allowGoForward = value.allowGoForward
    })
  },

  mounted: function() {
    this.acceptedTerms = this.$store.state.navigation.acceptedTerms;
    this.allowGoForward = this.$store.state.navigation.allowGoForward;
  }
}
</script>