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

            <!-- Cluster -->
            <div class="card margin-1em">
                <div class="card-header" id="cluster">
                    <div class="row">
                        <div class="col">
                            <h5 class="mb-0">
                                <button class="btn btn-link accordion-link" data-toggle="collapse" data-target="#clusterData" 
                                    aria-expanded="false" aria-controls="clusterData">
                                    Cluster-Settings
                                </button>
                            </h5>
                        </div>
                        <div class="col-1">
                            <router-link to="/cluster" class="summaryLink">Edit</router-link>
                        </div>
                    </div>
                </div>

                <div id="clusterData" class="collapse" aria-labelledby="cluster" 
                    data-parent="#accordion">
                    <div class="card-body">
                        <div class="row margin-1em">
                            <div class="col-2 text-align-right padding-right-1em">Use external LoadBalancer</div>
                            <div class="col-2">
                                <i v-if="cluster.useExternalLb" class="fas fa-check-circle green"></i>
                                <i v-if="!cluster.useExternalLb" class="fas fa-times-circle red"></i>
                            </div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em">
                                <span v-if="cluster.useExternalLb">Hostname / IP of the external LoadBalancer</span>
                                <span v-if="!cluster.useExternalLb">IP of the clusterCluster</span>
                            </div>
                            <div class="col-2">
                                <span v-if="cluster.useExternalLb">{{ cluster.externalLbIp }}</span>
                                <span v-if="!cluster.useExternalLb">{{ cluster.ip }}</span>
                            </div>
                        </div>
                        <div class="row margin-1em">
                            <div class="col-2 text-align-right padding-right-1em">Use Cluster Domain-Name</div>
                            <div class="col-2">
                                <i v-if="cluster.usefqdn" class="fas fa-check-circle green"></i>
                                <i v-if="!cluster.usefqdn" class="fas fa-times-circle red"></i>
                            </div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em">
                                <span v-if="cluster.usefqdn">Cluster Domain-Name</span>
                                <span v-if="!cluster.usefqdn"></span>
                            </div>
                            <div class="col-2">
                                <span v-if="cluster.usefqdn">{{ cluster.fqdn }}</span>
                                <span v-if="!cluster.usefqdn">{{ cluster.fqdn }}</span>
                            </div>
                        </div>
                        <div class="row margin-1em">
                            <div class="col-2 text-align-right padding-right-1em">Use Domain for VanillaStore</div>
                            <div class="col-2">
                                <i v-if="cluster.useadminfqdn" class="fas fa-check-circle green"></i>
                                <i v-if="!cluster.useadminfqdn" class="fas fa-times-circle red"></i>
                            </div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em">
                                <span v-if="cluster.useadminfqdn">VanillaStore Domain-Name</span>
                                <span v-if="!cluster.useadminfqdn"></span>
                            </div>
                            <div class="col-2">
                                <span v-if="cluster.useadminfqdn">{{ cluster.adminfqdn }}</span>
                                <span v-if="!cluster.useadminfqdn">{{ cluster.adminfqdn }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /cluster -->

            <!-- Nodes -->
            <div class="card margin-1em">
                <div class="card-header" id="nodes">
                    <div class="row">
                        <div class="col">
                            <h5 class="mb-0">
                                <button class="btn btn-link accordion-link" data-toggle="collapse" data-target="#nodesData" 
                                    aria-expanded="false" aria-controls="nodesData">
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

            <!-- Rook -->
            <div class="card margin-1em">
                <div class="card-header" id="rook">
                    <div class="row">
                        <div class="col">
                            <h5 class="mb-0">
                                <button class="btn btn-link accordion-link" data-toggle="collapse" data-target="#rookData" 
                                    aria-expanded="false" aria-controls="rookData">
                                    Rook
                                </button>
                            </h5>
                        </div>
                        <div class="col-1">
                            <router-link to="/rook" class="summaryLink">Edit</router-link>
                        </div>
                    </div>
                </div>

                <div id="rookData" class="collapse" aria-labelledby="rook" 
                    data-parent="#accordion">
                    <div class="card-body">
                        <div class="row margin-1em">
                            <div class="col-2 text-align-right padding-right-1em">Rook Dashboard</div>
                            <div class="col-2">
                                <i v-if="rook.dashboard" class="fas fa-check-circle green"></i>
                                <i v-if="!rook.dashboard" class="fas fa-times-circle red"></i>
                            </div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em">Replica Level</div>
                            <div class="col-2">{{ rook.replicaLevel }}</div>
                        </div>
                        <div class="row margin-1em">
                            <div class="col-2 text-align-right padding-right-1em">Rook Monitoring</div>
                            <div class="col-2">
                                <i v-if="rook.monitoring" class="fas fa-check-circle green"></i>
                                <i v-if="!rook.monitoring" class="fas fa-times-circle red"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /rook -->

            <!-- Openstack -->
            <div class="card margin-1em" v-if="general.installOpenStack">
                <div class="card-header" id="openstack">
                    <div class="row">
                        <div class="col">
                            <h5 class="mb-0">
                                <button class="btn btn-link accordion-link" data-toggle="collapse" data-target="#openstackData" 
                                    aria-expanded="false" aria-controls="openstackData">
                                    OpenStack
                                </button>
                            </h5>
                        </div>
                        <div class="col-1">
                            <router-link to="/openstack" class="summaryLink">Edit</router-link>
                        </div>
                    </div>
                </div>

                <div id="openstackData" class="collapse" aria-labelledby="openstack" 
                    data-parent="#accordion">
                    <div class="card-body">
                        <div class="row margin-1em"><div class="col"><strong>General Settings</strong></div></div>
                        <div class="row margin-1em">
                            <div class="col-2 text-align-right padding-right-1em">Endpoint</div>
                            <div class="col-2">
                                {{ openstack.domain }}
                            </div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em">TLS Public Endpoint</div>
                            <div class="col-2">
                                <i v-if="openstack.tls" class="fas fa-check-circle green"></i>
                                <i v-if="!openstack.tls" class="fas fa-times-circle red"></i>
                            </div>
                        </div>
                        <div class="row margin-2em">
                            <div class="col-2 text-align-right padding-right-1em">Release</div>
                            <div class="col-2">
                                {{ getOpenStackReleaseName() }}
                            </div>
                        </div>

                        <div class="row margin-1em"><div class="col"><strong>Components</strong></div></div>
                        <div class="row margin-1em">
                            <div class="col-2 text-align-right padding-right-1em">MariaDB</div>
                            <div class="col-2">
                                <i v-if="openstack.mariadb" class="fas fa-check-circle green"></i>
                                <i v-if="!openstack.mariadb" class="fas fa-times-circle red"></i>
                            </div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em" v-if="openstack.mariadb">Size</div>
                            <div class="col-2" v-if="openstack.mariadb">
                                {{ openstack.mariadb_size}} GiB
                            </div>
                        </div>
                        <div class="row margin-1em">
                            <div class="col-2 text-align-right padding-right-1em">RabbitMQ</div>
                            <div class="col-2">
                                <i v-if="openstack.rabbitmq" class="fas fa-check-circle green"></i>
                                <i v-if="!openstack.rabbitmq" class="fas fa-times-circle red"></i>
                            </div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em" v-if="openstack.rabbitmq">Size</div>
                            <div class="col-2" v-if="openstack.rabbitmq">
                                {{ openstack.rabbitmq_size}} GiB
                            </div>
                        </div>
                        <div class="row margin-2em">
                            <div class="col-2 text-align-right padding-right-1em">Barbican</div>
                            <div class="col-2">
                                <i v-if="openstack.barbican" class="fas fa-check-circle green"></i>
                                <i v-if="!openstack.barbican" class="fas fa-times-circle red"></i>
                            </div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em" v-if="openstack.barbican">Endpoint</div>
                            <div class="col-2" v-if="openstack.barbican">
                                {{ openstack.barbican_endpoint }}
                            </div>
                        </div>

                        <div class="row margin-1em"><div class="col"><strong>Cinder</strong></div></div>
                        <div class="row margin-1em">
                            <div class="col-2 text-align-right padding-right-1em">Cinder Block Storage</div>
                            <div class="col-2">
                                <i v-if="openstack.cinder" class="fas fa-check-circle green"></i>
                                <i v-if="!openstack.cinder" class="fas fa-times-circle red"></i>
                            </div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em" v-if="openstack.cinder">Endpoint</div>
                            <div class="col-2" v-if="openstack.cinder">
                                {{ openstack.cinder_endpoint}} 
                            </div>
                        </div>
                        <div class="row margin-2em">
                            <div class="col-2 text-align-right padding-right-1em">Cinder Backup</div>
                            <div class="col-2">
                                <i v-if="openstack.cinder_backup" class="fas fa-check-circle green"></i>
                                <i v-if="!openstack.cinder_backup" class="fas fa-times-circle red"></i>
                            </div>
                        </div>

                        <div class="row margin-1em"><div class="col"><strong>Glance</strong></div></div>
                        <div class="row margin-1em">
                            <div class="col-2 text-align-right padding-right-1em">Glance Image Service</div>
                            <div class="col-2">
                                <i v-if="openstack.glance" class="fas fa-check-circle green"></i>
                                <i v-if="!openstack.glance" class="fas fa-times-circle red"></i>
                            </div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em" v-if="openstack.glance">Endpoint</div>
                            <div class="col-2" v-if="openstack.glance">
                                {{ openstack.glance_endpoint}} 
                            </div>
                        </div>
                        <div class="row margin-2em">
                            <div class="col-2 text-align-right padding-right-1em">Glance Backend</div>
                            <div class="col-2">
                                Ceph
                            </div>
                        </div>

                        <div class="row margin-1em"><div class="col"><strong>Heat</strong></div></div>
                        <div class="row margin-2em">
                            <div class="col-2 text-align-right padding-right-1em">Heat Orchestration Service</div>
                            <div class="col-2">
                                <i v-if="openstack.heat" class="fas fa-check-circle green"></i>
                                <i v-if="!openstack.heat" class="fas fa-times-circle red"></i>
                            </div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em" v-if="openstack.heat">Endpoint</div>
                            <div class="col-2" v-if="openstack.heat">
                                {{ openstack.heat_endpoint}} 
                            </div>
                        </div>

                        <div class="row margin-1em"><div class="col"><strong>Horizon</strong></div></div>
                        <div class="row margin-2em">
                            <div class="col-2 text-align-right padding-right-1em">Horizon Dashboard</div>
                            <div class="col-2">
                                <i v-if="openstack.horizon" class="fas fa-check-circle green"></i>
                                <i v-if="!openstack.horizon" class="fas fa-times-circle red"></i>
                            </div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em" v-if="openstack.horizon">Endpoint</div>
                            <div class="col-2" v-if="openstack.horizon">
                                {{ openstack.horizon_endpoint}} 
                            </div>
                        </div>

                        <div class="row margin-1em"><div class="col"><strong>Keystone</strong></div></div>
                        <div class="row margin-2em">
                            <div class="col-2 text-align-right padding-right-1em">Keystone Auth Service</div>
                            <div class="col-2">
                                <i v-if="openstack.keystone" class="fas fa-check-circle green"></i>
                                <i v-if="!openstack.keystone" class="fas fa-times-circle red"></i>
                            </div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em" v-if="openstack.keystone">Endpoint</div>
                            <div class="col-2" v-if="openstack.keystone">
                                {{ openstack.keystone_endpoint}} 
                            </div>
                        </div>

                        <div class="row margin-1em"><div class="col"><strong>Mistral</strong></div></div>
                        <div class="row margin-2em">
                            <div class="col-2 text-align-right padding-right-1em">Mistral Workflow Service</div>
                            <div class="col-2">
                                <i v-if="openstack.mistral" class="fas fa-check-circle green"></i>
                                <i v-if="!openstack.mistral" class="fas fa-times-circle red"></i>
                            </div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em" v-if="openstack.mistral">Endpoint</div>
                            <div class="col-2" v-if="openstack.mistral">
                                {{ openstack.mistral_endpoint}} 
                            </div>
                        </div>

                        <div class="row margin-1em"><div class="col"><strong>Neutron</strong></div></div>
                        <div class="row margin-1em">
                            <div class="col-2 text-align-right padding-right-1em">Neutron Networking</div>
                            <div class="col-2">
                                <i class="fas fa-check-circle green"></i>
                                                            </div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em">Endpoint</div>
                            <div class="col-2">
                                {{ openstack.neutron_endpoint}} 
                            </div>
                        </div>
                        <div class="row margin-1em">
                            <div class="col-2 text-align-right padding-right-1em">Interface (Tunnel / Overlay)</div>
                            <div class="col-2">
                                {{ openstack.neutron_interface_tunnel }}
                            </div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em">Interface (External)</div>
                            <div class="col-2">
                                {{ openstack.neutron_interface_external }}
                            </div>
                        </div>
                        <div class="row margin-1em">
                            <div class="col-2 text-align-right padding-right-1em">Layer3 HA</div>
                            <div class="col-2">
                                <i v-if="openstack.neutron_l3ha" class="fas fa-check-circle green"></i>
                                <i v-if="!openstack.neutron_l3ha" class="fas fa-times-circle red"></i>
                            </div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em">Overlay Network Type</div>
                            <div class="col-2">
                                {{ openstack.neutron_overlayNetworkType }} 
                            </div>
                        </div>
                        <div class="row margin-2em">
                            <div class="col-2 text-align-right padding-right-1em">Max Agents per Router</div>
                            <div class="col-2">
                                {{ openstack.neutron_maxAgentsPerRouter }}
                            </div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em">DHCP Agents</div>
                            <div class="col-2">
                                {{ openstack.neutron_dhcpAgents }} 
                            </div>
                        </div>

                        <div class="row margin-1em"><div class="col"><strong>Senlin</strong></div></div>
                        <div class="row margin-2em">
                            <div class="col-2 text-align-right padding-right-1em">Senlin Clustering</div>
                            <div class="col-2">
                                <i v-if="openstack.senlin" class="fas fa-check-circle green"></i>
                                <i v-if="!openstack.senlin" class="fas fa-times-circle red"></i>
                            </div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em" v-if="openstack.senlin">Endpoint</div>
                            <div class="col-2" v-if="openstack.senlin">
                                {{ openstack.senlin_endpoint}} 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /Openstack -->

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

        getOpenStackReleaseName: function() {
            if(this.openstack === undefined || this.openstack.release === undefined || this.openstack.release.length <2)
                return ''

            return this.openstack.release.charAt(0).toUpperCase() + this.openstack.release.slice(1)
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