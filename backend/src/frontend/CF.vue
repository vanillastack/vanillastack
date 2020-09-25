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
            <div class="card margin-2em">
                <div class="card-header" id="cf">
                    <h5 class="mb-0">Cloud Foundry Domain</h5>
                </div>
                <div id="cfData" class="show" aria-labelledby="cf">
                    <div class="card-body">
                        <div class="form-group row">
                            <div class="col">
                                <input class="form-control medium" placeholder="cf" name="fqdn" v-model="fqdn" v-on:change="triggerValidation()" v-on:blur="triggerValidation()" required="required" />
                                .{{ cluster }}
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card margin-2em">
                <div class="card-header" id="stratos">
                    <h5 class="mb-0">Stratos</h5>
                </div>
                <div id="stratosData" class="show" aria-labelledby="stratos">
                    <div class="card-body">
                        <div class="form-group row">
                            <div class="col">
                                <div class="custom-control custom-switch inline-block">
                                    <input class="custom-control-input" disabled="disabled" id="stratos" name="stratos" type="checkbox" v-model="stratos" v-on:click="triggerValidation()">
                                    <label class="custom-control-label" for="stratos">
                                        Stratos Dashboard
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col">
                                <input class="form-control medium" placeholder="stratos" name="stratos_endpoint" 
                                    v-model="stratos_endpoint" v-on:change="triggerValidation()" v-on:blur="triggerValidation()" 
                                    required="required" />
                                .{{ cluster }}
                            </div>
                        </div>
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
            stratos_endpoint: this.$store.state.installer.cloudfoundry.stratos_endpoint,
            cluster: this.$store.state.installer.cluster.fqdn
        }
    },

    methods: {
        triggerValidation: function() {
            var isValid = this.fqdn.length > 0 && this.stratos_endpoint.length > 0;

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
        this.stratos_endpoint = this.$store.state.installer.cloudfoundry.stratos_endpoint

        this.triggerValidation()
    },

    created: function() {
    }
}
</script>