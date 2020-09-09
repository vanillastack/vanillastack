<template>
    <div class="container-fluid">
        <div class="row margin-2em">
            <div class="col">
                <h3>Cloud Foundry</h3>
            </div>
        </div>
        <div class="row margin-2em">
            <div class="col">
                Here you can set the settings for your Cloud Foundry installation. 
                To ease your work, we have prepopulated the settings with useful options.
            </div>
        </div>
        <div class="row margin-2em">
            <div class="col">
                <p><strong>Requirements</strong></p>
                <p>Please ensure to match the following requirements:</p>
                <ul>
                    <li>A minimum of two (2) nodes (VMs, Bare-Metal-machines)</li>
                    <li>A minimum of 1 GB RAM and 20 GB of HDD / SSD storage for each node</li>
                    <li>Root access to these nodes</li>
                    <li>IP-address for the cluster / Hostname for the cluser</li>
                    <li>A small cup of coffee or tea</li>
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
    name: 'cf',

    data: function() {
        return {
            stratos : this.$store.state.cloudfoundry.stratos,
            domainName : this.$store.state.cloudfoundry.domainName,
        }
    },

    methods: {
        triggerValidation: function() {}
    },

    mounted : function () {
        // Notify about being loaded
        EventBus.$emit(Constants.Event_NewViewLoaded, {
            allowGoForward: true
        })
    },

    created: function() {
    }
}
</script>