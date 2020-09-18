<template>
    <div class="container-fluid">
        <div class="row margin-2em">
            <div class="col">
                <h3>General Settings</h3>
            </div>
        </div>
        <div class="row margin-2em">
            <div class="col">
                Please select the kind of installation you want to execute. Based on this information, the required amount of master and worker nodes will be defined.
            </div>
        </div>
        <form>
            <div class="custom-control custom-switch">
                <input class="custom-control-input" type="checkbox" name="installAsHA" id="installAsHA" value="HA" v-model="isHA" :checked="isHA" v-on:change="installationKindChanged">
                <label class="custom-control-label" for="installAsHA">
                    Install as HA-cluster for productive workloads
                </label>
            </div>
            <div class="row margin-2em"></div>
            <div class="row">
                <div class="col"><strong>Master Nodes</strong></div>
            </div>
            <div class="row">
                <div class="col-1">
                    <input type="number" max="99" :min="minMaster" v-model="masters" size="3em" class="form-control padding-1em margin-top-1em" />
                </div>
            </div>
            <div class="row margin-2em" >
                <div class="col-2">
                    <input type="range" class="form-control-range padding-1em no-padding-left no-padding-right" id="MasterNodeCount" v-model="masters" :min="minMaster" max="99">
                </div>
            </div>
            <div class="row margin-1em" >
                <div class="col"><strong>Additional Workloads</strong></div>
            </div>
            <div class="row margin-1em">
                <div class="col">
                    <p>Please check any additional workload you want to initially install and deploy on your environment. 
                    This might impact the number of required worker nodes.<br />
                        <em>Note: Depending on your workloads, the amount of nodes required to run these workloads might be higher than the displayed minimum values!</em>
                    </p>
                </div>
            </div>
            <div class="custom-control custom-switch">
                <input class="custom-control-input" type="checkbox" disabled="disabled" name="installRook" id="installRook" value="Rook" v-model="installRook" :checked="installRook">
                <label class="custom-control-label" for="installRook">
                    Install Rook as persistent storage
                </label>
            </div>
            <div class="custom-control custom-switch">
                <input class="custom-control-input" type="checkbox" name="installOpenStack" id="installOpenStack" v-model="installOpenStack" value="OpenStack" :checked="installOpenStack" v-on:change="installationOpenStackChanged">
                <label class="custom-control-label" for="installOpenStack">
                    Install OpenStack as Infrastructure-as-a-Server (IaaS)-layer
                </label>
            </div>
            <div class="custom-control custom-switch">
                <input class="custom-control-input" type="checkbox" name="installCF" id="installCF" value="CF" v-model="installCF" :checked="installCF" v-on:change="installationCFChanged">
                <label class="custom-control-label" for="installCF">
                    Install Cloud Foundry as Platform-as-a-Server (PaaS)-layer
                </label>
            </div>
            <div class="row margin-2em"></div>
            <div class="row" >
                <div class="col"><strong>Worker Nodes</strong></div>
            </div>
            <div class="row">
                <div class="col-1">
                    <input type="number" max="99" :min="minWorker" v-model="workers" size="3em" class="form-control padding-1em margin-top-1em" />
                </div>
            </div>
            <div class="row margin-2em" >
                <div class="col-2">
                    <input type="range" class="form-control-range padding-1em no-padding-left no-padding-right" id="WorkerNodeCount" v-model="workers"  :min="minWorker" max="99">
                </div>
            </div>
        </form>
    </div>
</template>
<script>
import Constants from './js/constants'
import EventBus from './js/eventBus'
import Store from './js/store'

var initialState = {}

export default {

    name: 'kind',
    
    data: function() {
        return {
            minMaster: 1,
            minWorker: 1,
            isHA: true,
            masters: 3,
            workers: 3,
            installRook: true,
            installOpenStack: false,
            installCF: false
        }
    },

    methods: {
        
        installationKindChanged (e) {
            EventBus.$emit(Constants.Event_InstallationCFUpdated)
        },
        
        installationCFChanged (e) {
            EventBus.$emit(Constants.Event_InstallationCFUpdated, e.target.checked)
        },
        
        installationOpenStackChanged (e) {
            EventBus.$emit(Constants.Event_InstallationOpenStackUpdated, e.target.checked)
        },

        validate: function() {
            this.calculateMinimums()
            this.validateState()
        },

        calculateMinimums: function() {
            this.masters = parseInt('' + this.masters)
            this.workers = parseInt('' + this.workers)

            var requiredMinimumMasters = this.isHA ? 3 : 1
            var requiredMinimumWorkers = 1
            if(this.isHA || this.installRook || this.installCF) requiredMinimumWorkers = 3
            if(this.installOpenStack) requiredMinimumWorkers = 3;

            this.minMaster = requiredMinimumMasters;
            this.minWorker = requiredMinimumWorkers;

            if(this.masters < this.minMaster)
                this.masters = this.minMaster

            if(this.workers < this.minWorker)
                this.workers = this.minWorker
        },

        storeInitialState: function() {
            this.initialState = JSON.parse(JSON.stringify(this.$data))
        },

        validateState: function() {
            var currentState = this.$data
            var initialState = this.initialState 
            var isDirty = false

            for(var key in currentState) {
                if(key !== 'initialState' && currentState.hasOwnProperty(key)) {
                    var currentValue = currentState[key]
                    var initialValue = initialState[key]

                    isDirty = currentValue != initialValue
                    if(isDirty) 
                        break;
                }
            }

            if(isDirty) {
                // State is dirty
                EventBus.$emit(Constants.Event_GeneralSettingsChanged)
            }
        }   
    },

    // Commit the data
    beforeRouteLeave (to, from, next) {
        var data = {}
        var state = this.$data

        state.masters = parseInt(state.masters)
        state.workers = parseInt(state.workers)

        for(var key in state) {
            if(key !== 'initialState' && state.hasOwnProperty(key)) 
                data[key] = state[key]
        }

        this.$store.commit(Constants.Store_UpdateGeneralSettings, data)
        next()
    },

    mounted : function () {

        // Load data
        this.isHA = this.$store.state.installer.general.isHA,
        this.masters = this.$store.state.installer.general.masters,
        this.workers = this.$store.state.installer.general.workers,
        this.installRook = this.$store.state.installer.general.installRook,
        this.installOpenStack = this.$store.state.installer.general.installOpenStack,
        this.installCF = this.$store.state.installer.general.installCF

        // Calculate the minimum values
        this.calculateMinimums();

        // Store the initial state
        this.storeInitialState();

        // Signal loading of this component
        // Notify about being loaded
        EventBus.$emit(Constants.Event_NewViewLoaded, {
            allowGoForward: true
        })

        // Update the installation kind when signalled
        EventBus.$on(Constants.Event_InstallationKindChanged, () => {
            this.validate()
        })

        // Update the installation kind when signalled
        EventBus.$on(Constants.Event_InstallationCFUpdated, value => {
            this.validate()
        })

        // Update the installation kind when signalled
        EventBus.$on(Constants.Event_InstallationOpenStackUpdated, value => {
            this.validate()
        })

        this.validate()
    },
}
</script>