<template>
    <div class="container-fluid">
        <div class="row margin-2em">
            <div class="col">
                <h3>Welcome to VanillaStack!</h3>
            </div>
        </div>
        <div class="row margin-2em">
            <div class="col">
                This is the VanillaStack installer. We will be collecting some basic information and then we will be setting up your basic VanillaStack environment for you.
            </div>
        </div>
        <div class="row margin-2em">
            <div class="col">
                Please press the <i>Next</i>-button to continue.
            </div>
        </div>
        <div class="row margin-2em">
            <div class="col">
                <router-link class="btn btn-success min-width-100" role="button" to="/terms">Next</router-link>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Home'
}
</script>