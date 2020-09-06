<template>
    <div class="container-fluid">
        <div class="row margin-2em">
            <div class="col">
                <h3>Installation Kind</h3>
            </div>
        </div>
        <div class="row margin-2em">
            <div class="col">
                Please select the kind of installation you want to execute. Based on this information, the required amount of master and worker nodes will be defined.
            </div>
        </div>
        <form>
            <div class="custom-control custom-switch">
                <input class="custom-control-input" type="checkbox" name="installAsHA" id="installAsHA" value="HA" :checked="isHA" v-on:change="installationKindChanged">
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
                    <input type="number" max="99" :min="minMaster" v-on:change="mastersCountChanged" v-model="masters" size="3em" class="form-control padding-1em margin-top-1em" />
                </div>
            </div>
            <div class="row margin-2em" >
                <div class="col-2">
                    <input type="range" class="form-control-range padding-1em no-padding-left no-padding-right" id="MasterNodeCount" v-model="masters" v-on:change="mastersCountChanged" :min="minMaster" max="99">
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
                <input class="custom-control-input" type="checkbox" name="installRook" id="installRook" value="Rook" :checked="installRook" v-on:change="installationRookChanged">
                <label class="custom-control-label" for="installRook">
                    Install Rook as Kubernetes-based object store
                </label>
            </div>
            <div class="custom-control custom-switch">
                <input class="custom-control-input" type="checkbox" name="installOpenStack" id="installOpenStack" value="OpenStack" :checked="installOpenStack" v-on:change="installationOpenStackChanged">
                <label class="custom-control-label" for="installOpenStack">
                    Install OpenStack as Infrastructure-as-a-Server (IaaS)-layer
                </label>
            </div>
            <div class="custom-control custom-switch">
                <input class="custom-control-input" type="checkbox" name="installCF" id="installCF" value="CF" :checked="installCF" v-on:change="installationCFChanged">
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
                    <input type="range" class="form-control-range padding-1em no-padding-left no-padding-right" id="WorkerNodeCount" v-model="workers"  v-on:change="workersCountChanged" :min="minWorker" max="99">
                </div>
            </div>
        </form>
    </div>
</template>
<script>
import Constants from './js/constants'
import EventBus from './js/eventBus'
import Store from './js/store'

export default {

    name: '/kind',
    
    data: function() {
        return {
            minMaster: 1,
            minWorker: 1,
            isHA: this.$store.state.installer.isHA,
            masters: this.$store.state.installer.masters,
            workers: this.$store.state.installer.workers,
            installRook: this.$store.state.installer.installRook,
            installOpenStack: this.$store.state.installer.installOpenStack,
            installCF: this.$store.state.installer.installCF
        }
    },

    methods: {
        installationKindChanged (e) {
            this.$store.commit(Constants.Store_UpdateInstallationKind, e.target.checked)
        },
        
        installationRookChanged (e) {
            this.$store.commit(Constants.Store_UpdateInstallationRook, e.target.checked)
        },
        
        installationCFChanged (e) {
            this.$store.commit(Constants.Store_UpdateInstallationCF, e.target.checked)
        },
        
        installationOpenStackChanged (e) {
            this.$store.commit(Constants.Store_UpdateInstallationOpenStack, e.target.checked)
        },

        mastersCountChanged (e) { 
            this.updateMasterCount(parseInt(e.target.value))
        },

        workersCountChanged (e) { 
            this.updateWorkerCount(parseInt(e.target.value)) 
        },

        validate: function() {
            var requiredMinimumMasters = this.isHA ? 3 : 1
            var requiredMinimumWorkers = 1
            if(this.isHA || this.installRook || this.installCF) requiredMinimumWorkers = 3
            if(this.installOpenStack) requiredMinimumWorkers = 4;

            this.minMaster = requiredMinimumMasters;
            this.minWorker = requiredMinimumWorkers;


            if(this.masters < this.minMaster) this.$store.commit(Constants.Store_UpdateMasters, this.minMaster);
            if(this.workers < this.minWorker) this.$store.commit(Constants.Store_UpdateWorkers, this.minWorker);
        },

        updateMasterCount: function(value) { 
            this.masters = value
            this.$store.commit(Constants.Store_UpdateMasters, value)},

        updateWorkerCount: function(value) { 
            this.workers = value
            this.$store.commit(Constants.Store_UpdateWorkers, value)},
            
    },

    mounted : function () {
        // Signal loading of this component
        // Notify about being loaded
        EventBus.$emit(Constants.Event_NewViewLoaded, {
            allowGoForward: true
        })

        // Update the installation kind when signalled
        EventBus.$on(Constants.Event_InstallationKindChanged, value => {
            this.isHA = this.$store.state.installer.isHA

            this.validate()
        })

        // Update the installation kind when signalled
        EventBus.$on(Constants.Event_InstallationRookUpdated, value => {
            this.installRook = this.$store.state.installer.installRook

            this.validate()
        })

        // Update the installation kind when signalled
        EventBus.$on(Constants.Event_InstallationCFUpdated, value => {
            this.installCF = this.$store.state.installer.installCF

            this.validate()
        })

        // Update the installation kind when signalled
        EventBus.$on(Constants.Event_InstallationOpenStackUpdated, value => {
            this.installOpenStack = this.$store.state.installer.installOpenStack

            this.validate()
        })

        // Handle the amount of masters being changed
        EventBus.$on(Constants.Event_MastersCountChanged, value => this.masters = value)

        // Handle the amount of workers being changed
        EventBus.$on(Constants.Event_WorkersCountChanged, value => this.workers = value)
    },
}
</script>