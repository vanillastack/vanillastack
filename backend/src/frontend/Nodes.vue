<template>
    <div class="container-fluid">
        <div class="row margin-2em">
            <div class="col">
                <h3>Nodes</h3>
            </div>
        </div>
        <div class="row margin-2em">
            <div class="col">
                Please collect the IP-addresses, the SSH-username and the designation of your cluster nodes here.
            </div>
        </div>
        <div class="row margin-2em">
            <div class="col">
                <p><strong>Master Nodes</strong></p>
            </div>
        </div>
        <div class="row" v-for="master in masters" :key="master.number">
            <div class="col-2">

            </div>
        </div>
    </div>
</template>
<script>
import Constants from './js/constants.js'
import EventBus from './js/eventBus.js'

export default {
    name: 'Home',

    mounted : function () {
        console.log("==> Loaded Home")

        // Notify about being loaded
        EventBus.$emit(Constants.Event_NewViewLoaded, {
            allowGoForward: true
        })
    },

    created: function() {
        console.log("==> Created Home")

    }
}
</script>