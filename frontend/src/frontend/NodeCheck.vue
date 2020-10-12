<template>
    <form>
        <div class="container-fluid">
            <div class="row margin-2em">
                <div class="col">
                    <h3>Node-Check</h3>
                </div>
            </div>
            <div class="row margin-2em">
                <div class="col">
                    Here we are validating all nodes for being reachable and whether the ones selected for Rook fulfil the basic requirements.
                </div>
            </div>
            <div class="card margin-2em">
                <div class="card-header" id="nodesArea">
                    <h5 class="mb-0">Node-Check</h5>
                </div>
                <div id="nodesAreaData" class="show" aria-labelledby="ndesArea">
                    <div class="card-body">
                        <div class="row margin-2em">
                            <div class="col">
                                <a class="btn btn-success min-width-100" v-on:click="triggerValidation()" :class="{disabled: isRunning}" role="button">Validate Nodes</a>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-2"><strong>IP</strong></div>
                            <div class="col-2"><strong>User</strong></div>
                            <div class="col-2"><strong>Role</strong></div>
                            <div class="col-3"><strong>Workloads</strong></div>
                            <div class="col"><strong>State</strong></div>
                        </div>
                        <div class="form-group" v-for="item in nodes" :key="item.ip">
                            <div class="row">
                                <div class="col-2">{{ item.ip }}</div>
                                <div class="col-2">{{ item.user }}</div>
                                <div class="col-2">{{ item.role }}</div>
                                <div class="col-3">{{ item.apps }}</div>
                                <div class="col">
                                    <div v-if="item.checking" class="spinner-border spinner-border-sm" role="status">
                                        <span class="sr-only">Loading...</span>
                                    </div>                  
                                    <div v-if="nodesChecked || (item.checked && item.success)">
                                        <i class="fas fa-check-circle" style="color:green"></i>
                                    </div>
                                    <div v-if="item.checked && !item.success">
                                        <ul class="fa-ul inline" v-for="error in item.errors" :key="error">
                                            <li><i class="fas fa-times-circle" style="color:red"></i>{{error}}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card margin-2em">
                <div class="card-header" id="nodesArea">
                    <h5 class="mb-0">Satisfying Rook Dependencies</h5>
                </div>
                <div id="nodesAreaData" class="show" aria-labelledby="ndesArea">
                    <div class="card-body">
                        <div class="row margin-1em">
                            <div class="col">
                                Please ensure the following requirement is met for each of the nodes where Rook is to be deployed to.
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <ul class="fa-ul">
                                    <li><i class="fas fa-check"></i> A raw device exists (<strong>no</strong> filesystem)</li>
                                </ul>
                            </div>
                        </div>
                        <div class="row margin-2em">
                            <div class="col">
                                <p>You can use the <pre style="display: inline">lsblk -f</pre> command to verify the filesystem-information on your machines:</p>
                                <p><img src="./images/rook-prerequisites.png" style="max-width: 800px" /></p>
                                <p>In the given image, volume <strong>vdb</strong> is in a raw state, and can therefore be used for Rook.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>
<script>
import Constants from './js/constants.js'
import EventBus from './js/eventBus.js'
import Globals from './js/globals'

export default {
    name: 'nodecheck',

    data: function() {
        return {
            nodes: [],
            isRunning: false,
            nodeCheckTransactionId: '',
            nodesChecked: this.$store.state.installer.general.nodesChecked
        }
    },

    methods: {

        triggerValidation: function() {
            // Create the list of nodes to be checked
            var toBeChecked = []
            this.nodes.forEach(node => {
                toBeChecked[toBeChecked.length] = {
                    host: node.ip,
                    user: node.user
                }

                node.checking = true
                node.checked = false
            })

            // Start the validation
            this.$network.validateNodes(toBeChecked, Globals.UUID)

            // Set the internal state
            this.isRunning = true
        },

        validate: function() {
            var isValid = this.nodesChecked

            if(!isValid) {
                isValid = !this.nodes.some(node => !node.success);
                if(this.isRunning) {
                    this.finishedSuccess = isValid
                    this.finishedError = !isValid

                    this.isRunning = false
                }

                this.nodesChecked = isValid

                // Commit the result
                this.$store.commit(Constants.Store_NodesChecked, this.nodesChecked)

                EventBus.$emit(Constants.Event_NodesChecked, isValid)
            }


            EventBus.$emit(Constants.Event_NewViewLoaded, {
                allowGoForward: isValid
            })
        },

        getApps: function(node) {
            var apps = []
            
            if(node.rook)
                apps[apps.length] = "Rook"

            if(node.openstack)
                apps[apps.length] = "OpenStack"

            if(node.cf)
                apps[apps.length] = "Cloud Foundry"

            var result = apps.join(', ')
            if(result.length == 0) 
                result = '-'

            return result
        },

        getNode: function(ip) {
            return this.nodes.find(node => node.ip == ip)
        }
    },

    mounted : function () {
        
        // Load the masters 
        var nodes = [];
        this.$store.state.installer.general.mastersList.forEach(node => {
            nodes[nodes.length] = {
                ip: node.ip,
                user: node.user,
                role: 'Master',
                apps: '',
                rook: false,
                success: false,
                errors: [],
                checking: false,
                checked: false
            }
        })

        // Load the workers
        this.$store.state.installer.general.workersList.forEach(node => {
            nodes[nodes.length] = {
                ip: node.ip,
                user: node.user,
                role: 'Worker',
                apps: this.getApps(node),
                rook: node.rook,
                success: false,
                errors: [],
                checking: false,
                checked: false
            }
        })

        this.nodes = nodes;

        // Associating a transaction-id to a node-check
        EventBus.$on(Constants.Network_CheckingNodes, data => {
            this.nodeCheckTransactionId = data.transactionId
            console.log("RECEIVED TRANSACTION-ID", data)
        })

        // Handle the WS-call
        EventBus.$on(Constants.Network_WS_Response, message => {
            var data = JSON.parse(message)
            var transactionId = data.transactionId

            if(transactionId == this.nodeCheckTransactionId) {
                // Handle the different types of responses
                if(data.event == 'DONE') {
                    // Validate all nodes, continue only if they are reachable
                    this.validate()
                }

                if(data.event == 'EXECUTION' || data.event == 'EXEC') {
                    var payload = JSON.parse(data.payload)
                    var node = this.getNode(payload.host)

                    console.log("PAYLOAD", payload)
                    console.log("NODE", node)

                    if(node === undefined || node == null) {
                        console.log("NODE NOT FOUND", payload.host, this.nodes)
                        return
                    }

                    // Just for testing
                    if(node.ip == "1.1.1.99")
                        payload.avail = false
                    if(node.ip == "1.1.1.199") {
                        payload.memory = 0.25
                        payload.freeDiskSpace = 12
                        payload.raw = false
                    }

                    var errors = []
                    if(!payload.avail) {
                        errors[errors.length] = "Node not accessible"
                    }
                    else {
                        if(parseInt(payload.memory) < 1)
                            errors[errors.length] = "Not enough RAM available"

                        if(parseInt(payload.freeDiskSpace) < 20)
                            errors[errors.length] = "Not enough free disk space available"

                        if(node.rook && !payload.raw) 
                            errors[errors.length] = "No RAW-device detected"

                        if(payload.cpus !== undefined && parseInt(payload.cpus) < 2) 
                            errors[errors.length] = "Minimum required (v)CPUs is 2"
                    }

                    node.success = errors.length == 0
                    node.errors = errors
                    node.checking = false
                    node.checked = true
                }
            }
        })

        this.validate()
    },

    created: function() {
    }
}
</script>
