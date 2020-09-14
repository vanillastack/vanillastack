<template>
    <div class="container-fluid">
        <div class="row margin-2em">
            <div class="col">
                <h3>Rook</h3>
            </div>
        </div>
        <div class="row margin-2em">
            <div class="col">
                Here you can adjust the settings for the Rook object storage backend.
                To ease your work, we have prepopulated the settings with useful options.
            </div>
        </div>
        <div class="form-group">
            <div class="row margin-2em">
                <div class="col-2">
                    <p><strong>Rook Dashboard</strong></p>
                    <div class="custom-control custom-switch">
                        <input class="custom-control-input" id="dashboard" name="dashboard" type="checkbox" 
                            v-model="dashboard" 
                            v-on:click="triggerValidation()">
                        <label class="custom-control-label" for="dashboard">
                            Enable Rook Dashboard
                        </label>
                    </div>
                </div>
                <div class="col-3 offset-md-1">
                    <p><strong>Monitoring</strong></p>
                    <div class="custom-control custom-switch">
                        <input class="custom-control-input" id="monitoring" name="monitoring" type="checkbox" 
                            v-model="monitoring" 
                            v-on:click="triggerValidation()">
                        <label class="custom-control-label" for="monitoring">
                            Enable Rook Monitoring
                        </label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col"><strong>Replica Level</strong></div>
            </div>
            <div class="row">
                <div class="col-1">
                    <input type="number" min="2" max="5" v-model="replicaLevel" v-on:input="triggerValidation()"
                        required="required" size="3em" class="form-control padding-1em margin-top-1em" />
                </div>
            </div>
            <div class="row margin-2em" >
                <div class="col-2">
                    <input type="range" class="form-control-range padding-1em no-padding-left no-padding-right" 
                        id="replicaCount" v-model="replicaLevel" size="5em" v-on:change="triggerValidation()"
                        min="2" max="5">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Constants from './js/constants.js'
import EventBus from './js/eventBus.js'

export default {
    name: 'rook',

    data: function() {
        return {
            dashboard: false,
            monitoring: true,
            replicaLevel: 3
        }
    },

    methods: {
        triggerValidation: function() {
            // Store the data
            this.$store.commit(Constants.Store_RookUpdateData, this.$data)

            // Inform about changes
            EventBus.$emit(Constants.Event_NewViewLoaded,{
                allowGoForward: true
            })
        }
    },

    mounted : function () {
        this.dashboard = this.$store.state.installer.rook.dashboard
        this.monitoring = this.$store.state.installer.rook.monitoring
        this.replicaLevel = this.$store.state.installer.rook.replicaLevel

        this.triggerValidation()
    },

    created: function() {
    }
}
</script>