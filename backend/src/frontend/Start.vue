<template>
  <span>
    <!-- Header area -->
    <header class="header">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <router-link to="/" class="navbar-brand"><h1>VanillaStack</h1></router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

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
      </nav>
    </header>

    <!-- Main area -->
    <main class="main h-100">
      <div class="container-fluid h-100">
        <div class="row h-100">
          <div class="col navigation h-100"><h3>Navigation</h3></div>
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