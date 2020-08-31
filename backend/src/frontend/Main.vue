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
    <main class="main h-100">
      <div class="container-fluid h-100">
        <div class="row h-100">
          <div class="col navigation">
            <!-- Local navigation for the installer -->
            <ul class="secondary-nav">
              <li><router-link to="/start" class="nav-item">Start</router-link></li>
              <li><router-link to="/terms" class="nav-item">Terms</router-link></li>
              <li><router-link tag="button" :disabled="!acceptedTerms" to="/kind" class="nav-item button-as-link">Installation Kind</router-link></li>
              <li><router-link tag="button" :disabled="!acceptedTerms" to="/key" class="nav-item button-as-link">Public Key</router-link></li>
              <li><router-link tag="button" :disabled="!acceptedTerms" to="/nodes" class="nav-item button-as-link">Nodes</router-link></li>
              <li><router-link tag="button" :disabled="!acceptedTerms" to="/additional" class="nav-item button-as-link">Additional Settings</router-link></li>
              <li><router-link tag="button" :disabled="!acceptedTerms" to="/summary" class="nav-item button-as-link">Summary</router-link></li>
            </ul>
          </div>
          <div class="col-11"><router-view></router-view></div>
        </div>
        <div class="row">&#160;</div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container-fluid">
      </div>
    </footer>
  </span>
</template>
<script>
import Constants from './js/constants.js'
import EventBus from './js/eventBus'

export default {
  name: 'app',
  data: 
    function() {
        return {
            acceptedTerms: this.$store.state.acceptedTerms
        }
  },
  mounted : function () {
    // Update the links when the terms were accepted
    EventBus.$on(Constants.Event_AcceptedTermsChanged, value => this.acceptedTerms = this.$store.state.acceptedTerms)
  }
}
</script>