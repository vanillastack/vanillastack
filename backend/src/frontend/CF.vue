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
        <div class="form-group">
                <div class="row">
                    <div class="col-2">
                        <label for="ip">Domain</label>
                    </div>
                    <div class="col">
                        <label for="user">Stratos</label>
                    </div>
                </div>
                <div class="row">
                    <div class="col-2">
                        <input class="form-control" placeholder="cloudfoundry.my.cluster" name="fqdn" v-model="fqdn" v-on:change="triggerValidation()" v-on:blur="triggerValidation()" required="required" />
                    </div>
                    <div class="col">
                        <div class="custom-control custom-switch inline-block">
                            <input class="custom-control-input" disabled="disabled" id="stratos" name="stratos" type="checkbox" v-model="stratos" v-on:click="triggerValidation()">
                            <label class="custom-control-label" for="stratos">
                                Stratos Dashboard
                            </label>
                        </div>
                    </div>
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
            stratos : this.$store.state.installer.cloudfoundry.stratos,
            fqdn : this.$store.state.installer.cloudfoundry.fqdn,
        }
    },

    methods: {
        triggerValidation: function() {
            var isValid = this.fqdn.length > 0;

            // Store the data
            this.$store.commit(Constants.Store_CloudFoundryUpdateData, this.$data)

            // Inform about changes
            EventBus.$emit(Constants.Event_NewViewLoaded,{
                allowGoForward: isValid
            })
        }
    },

    mounted : function () {
        this.stratos = this.$store.state.installer.cloudfoundry.stratos
        this.fqdn = this.$store.state.installer.cloudfoundry.fqdn

        if(this.$store.state.installer.cluster.fqdn.length > 0 && this.$store.state.installer.cluster.usefqdn &&
            this.$store.state.installer.cloudfoundry.fqdn.length == 0)
            this.fqdn = 'cloudfoundry.' + this.$store.state.installer.cluster.fqdn

        this.triggerValidation()
    },

    created: function() {
    }
}
</script>