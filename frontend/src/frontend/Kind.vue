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
        <div class="form-group">
            <div class="card margin-2em">
                <div class="card-header" id="haSettings">
                    <h5 class="mb-0">HA-Installation</h5>
                </div>
                <div id="haSettingsData" class="show" aria-labelledby="haSettings">
                    <div class="card-body">
                        <div class="row margin-1em">
                            <div class="col">
                                <p><i class="fas fa-info-circle gray"></i>
                                A HA-installation implies you will have a minimum of three master nodes for additional fail-over functionality. This kind of installation 
                                is strongly recommended for productive clusters. For development clusters, a non-HA-installation might be sufficient.</p>
                                <p>
                                    Master-Node Count: <strong>{{ masters }}</strong> 
                                </p>
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col">
                                <div class="custom-control custom-switch">
                                    <input class="custom-control-input" type="checkbox" name="installAsHA" id="installAsHA" value="HA" v-model="isHA" :checked="isHA" v-on:change="installationKindChanged()">
                                    <label class="custom-control-label" for="installAsHA">
                                        Install as HA-cluster for productive workloads
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <div class="card margin-2em">
                    <div class="card-header" id="masterNodes">
                        <h5 class="mb-0">Initial Workloads</h5>
                    </div>
                    <div id="masterNodesData" class="show" aria-labelledby="masterNodes">
                        <div class="card-body">
                            <div class="row margin-2em">
                                <div class="col">
                                    <p>Please check any additional workload you want to initially install and deploy on your environment.</p>
                                    <i class="fas fa-info-circle gray"></i> Depending on your workloads, the amount of nodes required to <em>properly</em> run these workloads might be higher than the displayed minimum values!
                                </div>
                            </div>
                            <div class="row margin-2em form-group">
                                <div class="col-1 center">
                                    <img src="./images/rook.png" class="lead-image" />
                                </div>
                                <div class="col-4 valign-center">
                                    <p>Rook is open-source, cloud-native storage for Kubernetes, it provides production ready management for File, Block and Object Storage. Rook abstracts underlying storage providers, such as Ceph, EdgeFS, CockroachDB, Cassandra, NFS or Yogabyte DB. With Rook, storage becomes as easy as deploying a config file onto Kubernetes. Cloudical is amongst the biggest Rook contributors.</p>  
                                    <a href="https://www.rook.io" class="black" target="_blank">https://www.rook.io</a> 
                               </div>
                                <div class="col">
                                     <div class="custom-control custom-switch">
                                        <input class="custom-control-input" type="checkbox" disabled="disabled" name="installRook" id="installRook" value="Rook" v-model="installRook" :checked="installRook">
                                        <label class="custom-control-label" for="installRook">
                                            Install Rook as persistent storage
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="row margin-2em form-group">
                                <div class="col-1" style="text-align:center !important">
                                    <a v-on:click="installOpenStack = !installOpenStack"><img src="./images/openstack.jpg" class="lead-image" /></a>
                                </div>
                                <div class="col-4 valign-center">
                                    <p>OpenStack provides a complete Infrastructure-as-a-Service-layer, providing you with the ability to provision virtual machines, databases and storage. It has its own management UIs and perfectly runs on top of Kubernetes.</p>
                                    <a href="https://www.openstack.org" class="black" target="_blank">https://www.openstack.org</a>    
                                </div>
                                <div class="col">
                                     <div class="custom-control custom-switch">
                                        <input class="custom-control-input" type="checkbox" name="installOpenStack" id="installOpenStack" v-model="installOpenStack" value="OpenStack" :checked="installOpenStack" v-on:change="installationOpenStackChanged">
                                        <label class="custom-control-label" for="installOpenStack">
                                            Install OpenStack as Infrastructure-as-a-Server (IaaS)-layer
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="row margin-2em form-group">
                                <div class="col-1" style="text-align:center !important">
                                    <a v-on:click="installCF = !installCF"><img src="./images/cloudfoundry.png" class="lead-image-hor" /></a>
                                </div>
                                <div class="col-4 valign-center">
                                    <p>Cloud Foundry is an amazing Platform-as-a-Service-layer, completely automating deployment and operations of your code. It supports programming languages such as Java, .NET, Node, Python and many more. It has its own management UIs and perfectly runs on top of Kubernetes.</p>   
                                    <a href="https://www.cloudfoundry.org" class="black" target="_blank">https://www.cloudfoundry.org</a> 
                                </div>
                                <div class="col">
                                     <div class="custom-control custom-switch">
                                        <input class="custom-control-input" type="checkbox" name="installCF" id="installCF" value="CF" v-model="installCF" :checked="installCF" v-on:change="installationCFChanged">
                                        <label class="custom-control-label" for="installCF">
                                            Install Cloud Foundry as Platform-as-a-Server (PaaS)-layer
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <div class="card margin-2em">
                    <div class="card-header" id="masterNodes">
                        <h5 class="mb-0">Worker Nodes</h5>
                    </div>
                    <div id="masterNodesData" class="show" aria-labelledby="masterNodes">
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <p>
                                        <i class="fas fa-info-circle gray"></i>
                                        The amount of worker nodes defines, how many workloads you might be able to run. As a rule of thumbs: More workers (with better specifications) imply more reliable performance and more workloads to be executed. The amount of workers defines how resilient your cluster will be. Again, as a rule of thumbs: More workers provide more resilience and more fail-over capabilities.</p>
                                    <p>Worker-Node Count: <strong>{{ workers }}</strong></p>
                                </div>
                            </div>
                            <div class="row margin-1em">
                                <div class="col-1">
                                    <input type="number" max="99" :min="minWorker" v-model="workers" size="3em" class="form-control" />
                                </div>
                                <div class="col-2">
                                    <input type="range" class="form-control-range" id="WorkerNodeCount" v-model="workers"  :min="minWorker" max="99">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
            this.masters = this.isHA ? 3 : 1

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
