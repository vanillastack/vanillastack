<template>
    <div class="container-fluid">
        <div class="row margin-2em">
            <div class="col">
                <h3>Summary</h3>
            </div>
        </div>
        <div class="row margin-2em">
            <div class="col">
                <p>This is the summary of all the settings you have been selected, choosen and entered. Please check them
                carefully, and after you agreed with them, press the <em>Install VanillaStack!</em>-button, to start 
                the installation.</p>
                <p>Note: You can directly jump to the settings page for each section by hitting the <em>Edit</em>-button next to the secion's name.</p> 
            </div>
        </div>
        <div id="accordion" class="margin-2em form">
            <div class="card margin-1em">
                <div class="card-header" id="generalHeading">
                    <div class="row">
                        <div class="col">
                            <h5 class="mb-0">
                                <button class="btn btn-link accordion-link" data-toggle="collapse" data-target="#generalData" 
                                    aria-expanded="true" aria-controls="generalData">
                                    General Settings
                                </button>
                            </h5>
                        </div>
                        <div class="col-1">
                            <router-link to="/general" class="summaryLink">Edit</router-link>
                        </div>
                    </div>
                </div>

                <div id="generalData" class="collapse show" aria-labelledby="generalHeading" 
                    data-parent="#accordion">
                    <div class="card-body">
                        <div class="row margin-1em">
                            <div class="col-2 text-align-right padding-right-1em">HA</div>
                            <div class="col-2">
                                <i v-if="general.isHA" class="fas fa-check-circle green"></i>
                                <i v-if="!general.isHA" class="fas fa-times-circle red"></i>
                            </div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em">Rook</div>
                            <div class="col-2">
                                <i v-if="general.installRook" class="fas fa-check-circle green"></i>
                                <i v-if="!general.installRook" class="fas fa-times-circle red"></i>
                            </div>
                        </div>
                        <div class="row margin-1em">
                            <div class="col-2 text-align-right padding-right-1em">Masters</div>
                            <div class="col-2">
                                {{ general.masters }}
                            </div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em">OpenStack</div>
                            <div class="col-2">
                                <i v-if="general.installOpenStack" class="fas fa-check-circle green"></i>
                                <i v-if="!general.installOpenStack" class="fas fa-times-circle red"></i>
                            </div>
                        </div>
                        <div class="row margin-1em">
                            <div class="col-2 text-align-right padding-right-1em">Workers</div>
                            <div class="col-2">
                                {{ general.workers }}
                            </div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em">Cloud Foundry</div>
                            <div class="col-2">
                                <i v-if="general.installCF" class="fas fa-check-circle green"></i>
                                <i v-if="!general.installCF" class="fas fa-times-circle red"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Nodes -->
            <div class="card margin-1em">
                <div class="card-header" id="nodes">
                    <div class="row">
                        <div class="col">
                            <h5 class="mb-0">
                                <button class="btn btn-link accordion-link" data-toggle="collapse" data-target="#nodesData" 
                                    aria-expanded="true" aria-controls="nodesData">
                                    Nodes
                                </button>
                            </h5>
                        </div>
                        <div class="col-1">
                            <router-link to="/nodes" class="summaryLink">Edit</router-link>
                        </div>
                    </div>
                </div>

                <div id="nodesData" class="collapse" aria-labelledby="nodes" 
                    data-parent="#accordion">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-5">
                                <div class="row margin-1em"><div class="col"><strong>Masters</strong></div></div>
                                <div class="row margin-1em">
                                    <div class="col">Host</div>
                                    <div class="col-8">User</div>
                                </div>
                                <div class="row margin-1em" v-for="node in nodes.masters" :key="node.key">
                                    <div class="col">{{ node.host }}</div>
                                    <div class="col-8">{{ node.user }}</div>
                                </div>
                            </div>
                            <div class="col-6 offset-1-md">
                                <div class="row margin-1em">
                                    <div class="col"><strong>Workers</strong></div>
                                </div>
                                <div class="row margin-1em">
                                    <div class="col">Host</div>
                                    <div class="col-2">User</div>
                                    <div class="col-6">Workloads</div>
                                </div>
                                <div class="row margin-1em" v-for="node in nodes.workers" :key="node.key">
                                    <div class="col">{{ node.host }}</div>
                                    <div class="col-2">{{ node.user }}</div>
                                    <div class="col-6">{{ node.labels }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /Nodes -->
        </div>
    </div>
</template>
<script>
import Constants from './js/constants.js'
import EventBus from './js/eventBus.js'

export default {
    name: 'summaryView',

    data: function() {
        return {
            general: {},
            nodes: {},
            cluster: {},
            rook: {},
            openstack: {},
            cf: {},
            additional: {},
            key: ''
        }
    },

    methods: {

        // Adds a node to the list
        transformNode: function(list, item, isWorker, short) {
            var isShort = !(short === undefined || !short)

            var apps = []
            if(item.rook)
                apps[apps.length] = isShort ? "rook" : "Rook"
            if(item.openstack)
                apps[apps.length] = isShort ? "os" : "OpenStack"
            if(item.cf)
                apps[apps.length] = isShort ? "cf" : "Cloud Foundry"
            var labels = isShort ? apps : apps.length > 0 ? apps.join(', ') : ''
            var role = isWorker ? 'W' : 'M'
            var key = role + list.length

            var node = {
                host: item.ip,
                user: item.user,
                role: role,
                labels: labels
            }

            if(!isShort)
                node.key = key
             
            list[list.length] = node
        },

        generateCall: function() {
            var nodes = []

            this.$store.state.installer.general.mastersList.forEach(
                node => this.transformNode(nodes, node, false, true))
            this.$store.state.installer.general.workersList.forEach(
                node => this.transformNode(nodes, node, true, true))

            var data = {
                isHA: this.$store.state.installer.general.isHA,
                general: {
                    installRook: this.$store.state.installer.general.installRook,
                    installCF: this.$store.state.installer.general.installCF,
                    installOS: this.$store.state.installer.general.installOpenStack,
                    harborKey: this.$store.state.base.key
                },
                nodes: nodes,
                cluster: JSON.parse(JSON.stringify(this.$store.state.installer.cluster)),
                rook: JSON.parse(JSON.stringify(this.$store.state.installer.rook)),
                openstack: JSON.parse(JSON.stringify(this.$store.state.installer.openstack)),
                cf: JSON.parse(JSON.stringify(this.$store.state.installer.cloudfoundry)),
                additional: JSON.parse(JSON.stringify(this.$store.state.installer.additional))
            }

            return data
        },

    },

    mounted : function () {
        // Notify about being loaded
        EventBus.$emit(Constants.Event_NewViewLoaded, {
            allowGoForward: false
        })

        // Set up the general settings
        this.general = {
            isHA: this.$store.state.installer.general.isHA,
            workers: this.$store.state.installer.general.workersList.length,
            masters: this.$store.state.installer.general.mastersList.length,
            installRook: this.$store.state.installer.general.installRook,
            installCF: this.$store.state.installer.general.installCF,
            installOpenStack: this.$store.state.installer.general.installOpenStack,
        }

        this.nodes = {
            masters: [],
            workers: []
        }

        // Transform and store the nodes
        this.$store.state.installer.general.mastersList.forEach(
            node => this.transformNode(this.nodes.masters, node, false))
        this.$store.state.installer.general.workersList.forEach(
            node => this.transformNode(this.nodes.workers, node, true))

        // Add the cluster settings
        this.cluster = this.$store.state.installer.cluster

        // Add the Rook settings
        this.rook = this.$store.state.installer.rook

        // Add the OpenStack settings
        this.openstack = this.$store.state.installer.openstack

        // Add the CF-settings
        this.cf = this.$store.state.installer.cloudfoundry

        // Add the additionally to be installed applications
        this.additional = this.$store.state.installer.additional

        // Add the Harbor-Key
        this.key = this.$store.state.base.key

        console.log("DATA", this.generateCall())
        console.log("DATA-TXT", JSON.stringify(this.generateCall()))

    },

    created: function() {
    }
}
</script>