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
            <div class="card margin-2em">
                <div class="card-header" id="dashboardArea">
                    <h5 class="mb-0">Rook Dashboard</h5>
                </div>
                <div id="dashboardAreaData" class="show" aria-labelledby="dashboardArea">
                    <div class="card-body">
                        <div class="form-group row">
                            <div class="col">
                                <div class="custom-control custom-switch">
                                    <input class="custom-control-input" id="dashboard" name="dashboard" type="checkbox" 
                                        v-model="dashboard" 
                                        v-on:click="toggleDashboard()">
                                    <label class="custom-control-label" for="dashboard">
                                        Enable Rook Dashboard
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card margin-2em">
                <div class="card-header" id="monitoringArea">
                    <h5 class="mb-0">Monitoring</h5>
                </div>
                <div id="monitoringAreaData" class="show" aria-labelledby="monitoringArea">
                    <div class="card-body">
                        <div class="form-group row">
                            <div class="col">
                                <div class="custom-control custom-switch">
                                    <input class="custom-control-input" id="monitoring" name="monitoring" type="checkbox" 
                                        v-model="monitoring" 
                                        v-on:click="toggleMonitoring()">
                                    <label class="custom-control-label" for="monitoring">
                                        Enable Rook Monitoring
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card margin-2em">
                <div class="card-header" id="replicaLevel">
                    <h5 class="mb-0">Replica Level</h5>
                </div>
                <div id="replicaLevelData" class="show" aria-labelledby="replicaLevel">
                    <div class="card-body">
                        <div class="row margin-1em">
                            <div class="col">
                                <i class="fas fa-info-circle gray"></i>
                                Indicates, how often data is replicated within Rook worker nodes. Default value is <em>3</em>, higher values imply more load and less performance, lower values might cause data losses.
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col">
                                <input type="number" min="2" max="5" v-model="replicaLevel" v-on:input="triggerValidation()"
                                    required="required" size="3em" class="form-control small" />
                            </div>
                        </div>
                        <div class="row" >
                            <div class="col-2">
                                <input type="range" class="form-control-range padding-1em no-padding-left no-padding-right" 
                                    id="replicaCount" v-model="replicaLevel" size="5em" v-on:change="triggerValidation()"
                                    min="2" max="5">
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
    name: 'rook',

    data: function() {
        return {
            dashboard: this.$store.state.installer.rook.dashboard,
            monitoring: this.$store.state.installer.rook.monitoring,
            replicaLevel: this.$store.state.installer.rook.replicaLevel
        }
    },

    methods: {
        toggleDashboard: function() {
            this.dashboard = !this.dashboard
            this.triggerValidation()
        },

        toggleMonitoring: function() {
            this.monitoring = !this.monitoring
            this.triggerValidation()
        },

        triggerValidation: function() {
            // Store the data
            this.$store.commit(Constants.Store_RookUpdateData, this.$data)

            // Inform about changes
            EventBus.$emit(Constants.Event_NewViewLoaded,{
                allowGoForward: true
            })
        },
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