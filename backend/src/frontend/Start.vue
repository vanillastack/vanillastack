<template>
  <span>
    <!-- Header area -->
    <header class="header">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <router-link to="/" class="navbar-brand"><img src="/images/vanilla-logo.png" class="logo" /></router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!--
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <router-link to="/foo" class="nav-link">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/bar" class="nav-link">Bar</router-link>
            </li>
          </ul>
        </div>
        -->
      </nav>
    </header>

    <!-- Main area -->
    <main class="main h-100">
      <div class="container-fluid h-100">
        <div class="row h-100">
          <div class="col navigation h-100">
            <!-- Local navigation for the installer -->
            <ul class="secondary-nav">
              <li><router-link to="/start">Start</router-link></li>
              <li><router-link to="/terms">Terms</router-link></li>
              <li><router-link to="/kind">Installation Kind</router-link></li>
              <li><router-link to="/key">Public Key</router-link></li>
              <li><router-link to="/nodes">Nodes</router-link></li>
              <li><router-link to="/summary">Summary</router-link></li>
            </ul>
          </div>
          <div class="col-11"><router-view></router-view></div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container-fluid">
        <h3>Footer</h3>
      </div>
    </footer>
  </span>
</template>
<script>
export default {
  name: 'app',
  data() {
    return {
      message: "Hello!"
    }
  }
}
</script>