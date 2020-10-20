<template>
    <div class="container-fluid">
        <div class="row margin-2em">
            <div class="col">
                <h3>Welcome to VanillaStack 20.10!</h3>
            </div>
        </div>
        <div class="row margin-2em">
            <div class="col">
                This is the VanillaStack installer. We will be collecting some basic information and then we will be setting up your basic VanillaStack environment for you.
            </div>
        </div>
        <div class="row margin-2em">
            <div class="col">
                <p><strong>Requirements</strong></p>
                <p>Please ensure to match the following requirements:</p>
                <ul class="fa-ul">
                    <li><i class="fas fa-check"></i> A minimum of four (4) nodes (VMs, Bare-Metal-machines)</li>
                    <li><i class="fas fa-check"></i> A minimum of 2 GB RAM and 20 GB of HDD / SSD storage for each node</li>
                    <li><i class="fas fa-check"></i> A minimum of 2 vCPUs for each node</li>
                    <li><i class="fas fa-check"></i> Root access to these nodes</li>
                    <li><i class="fas fa-check"></i> IP-address for the cluster / Hostname for the cluser</li>
                    <li><i class="fas fa-check"></i> A wildcard domain (*.my.cluster) for making components accessible</li>
                    <li><i class="fas fa-check"></i> A small cup of coffee or tea</li>
                </ul>
            </div>
        </div>
        <div class="row margin-2em">
            <div class="col">
                Please press the <i>Next</i>-button to continue.
            </div>
        </div>
    </div>
</template>
<script>
import Constants from './js/constants.js'
import EventBus from './js/eventBus.js'

export default {
    name: 'start',

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