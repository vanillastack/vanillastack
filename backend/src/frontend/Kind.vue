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
            <div class="form-check">
                <input class="form-check-input" type="radio" name="installAsHA" id="installAsHA" value="HA" v-model="installationKind" @input="installationKindChanged">
                <label class="form-check-label" for="installAsHA">
                    Install as HA-cluster for productive workloads
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="installAsHA" id="installAsDefault" value="Default" v-model="installationKind" @input="installationKindChanged">
                <label class="form-check-label" for="installAsDefault">
                    Install as Non-HA-cluster for development workloads
                </label>
            </div>
            <div class="row margin-2em"></div>
            <div class="row margin-2em">
                <div class="col">
                    Please select the amount of master and worker-nodes for your desired installation kind.
                </div>
            </div>
            <div class="row">
                <div class="col-3"><strong>Master Nodes</strong></div>
                <div class="col-2"><strong>Worker Nodes</strong></div>
            </div>
            <div class="row">
                <div class="col-1">
                    <input type="number" :disabled="installationKind == ''" max="99" :min="minMaster" v-model="masters" size="3em" class="form-control padding-1em margin-top-1em" />
                </div>
                <div class="col-2"></div>
                <div class="col-1">
                    <input type="number" :disabled="installationKind == ''" max="99" :min="minWorker" v-model="workers" size="3em" class="form-control padding-1em margin-top-1em" />
                </div>
            </div>
            <div class="row margin-2em" >
                <div class="col-2">
                    <input type="range" :disabled="installationKind == ''" class="form-control-range padding-1em no-padding-left no-padding-right" id="MasterNodeCount" v-model="masters" @input="mastersCountChanged" :min="minMaster" max="99">
                </div>
                <div class="col-1"></div>
                <div class="col-2">
                    <input type="range" :disabled="installationKind == ''" class="form-control-range padding-1em no-padding-left no-padding-right" id="WorkerNodeCount" v-model="workers" @input="workersCountChanged" :min="minWorker" max="99">
                </div>
            </div>
            <div class="row margin-2em">
                <div class="col">
                    <router-link class="btn btn-primary min-width-100 margin-right-2em" role="button" to="/terms">Back</router-link>
                    <router-link tag="button" class="btn btn-success min-width-100" role="button" to="/key">Next</router-link>
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

    name: 'Kind',
    data: function() {
        return {
            minMaster: 1,
            minWorker: 1,
            isHA: this.$store.state.isHA,
            masters: this.$store.state.masters,
            workers: this.$store.state.workers,
            installationKind: this.$store.state.isHA ? 'HA' : 'Default'
        }
    },

    methods: {
        installationKindChanged (e) {
            this.$store.commit(Constants.Store_UpdateInstallationKind, e.target.value == 'HA')
        },

        mastersCountChanged (e) { 
            this.updateMasterCount(parseInt(e.target.value))
        },

        workersCountChanged (e) { 
            this.updateWorkerCount(parseInt(e.target.value)) 
        },

        validate: function() {
            if(this.masters < this.minMaster) this.$store.commit(Constants.Store_UpdateMasters, this.minMaster);
            if(this.workers < this.minWorker) this.$store.commit(Constants.Store_UpdateWorkers, this.minWorker);
        },

        updateMasterCount: function(value) { this.$store.commit(Constants.Store_UpdateMasters, value)},
        updateWorkerCount: function(value) { this.$store.commit(Constants.Store_UpdateWorkers, value)},
            
    },

    mounted : function () {
        // Update the installation kind when signalled
        EventBus.$on(Constants.Event_InstallationKindChanged, value => {
            this.isHA = this.$store.state.isHA
            this.minMaster = this.isHA ? 3 : 1;
            this.minWorker = this.isHA ? 3 : 1;
            this.validate()
        })

        // Handle the amount of masters being changed
        EventBus.$on(Constants.Event_MastersCountChanged, value => this.masters = value)

        // Handle the amount of workers being changed
        EventBus.$on(Constants.Event_WorkersCountChanged, value => this.workers = value)
    },
}
</script>