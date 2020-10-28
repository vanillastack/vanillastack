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
                            <div class="col-2 text-align-right padding-right-1em">Pod CIDR</div>
                            <div class="col-2">{{ cluster.pod_cidr }}</div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em">Service CIDR</div>
                            <div class="col-2">{{ cluster.service_cidr }}</div>
                        </div>
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
                            </div>
                        </div>
                        <div class="row margin-1em">
                            <div class="col-2 text-align-right padding-right-1em">Use Domain for VanillaStore</div>
                            <div class="col-2">
                                <i v-if="cluster.useadminfqdn" class="fas fa-check-circle green"></i>
                                <i v-if="!cluster.useadminfqdn" class="fas fa-times-circle red"></i>
                            </div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em">
                                <span v-if="cluster.useadminfqdn">VanillaStore Endpoint</span>
                                <span v-if="!cluster.useadminfqdn"></span>
                            </div>
                            <div class="col-2">
                                <span v-if="cluster.useadminfqdn">{{ cluster.adminfqdn }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /cluster -->

            <!-- letsencrypt -->
            <div class="card margin-1em">
                <div class="card-header" id="letsencrypt">
                    <div class="row">
                        <div class="col">
                            <h5 class="mb-0">
                                <button class="btn btn-link accordion-link" data-toggle="collapse" data-target="#letsencryptData" 
                                    aria-expanded="false" aria-controls="letsencryptData">
                                    Let's Encrypt
                                </button>
                            </h5>
                        </div>
                        <div class="col-1">
                            <router-link to="/letsencrypt" class="summaryLink">Edit</router-link>
                        </div>
                    </div>
                </div>

                <div id="letsencryptData" class="collapse" aria-labelledby="letsencrypt" 
                    data-parent="#accordion">
                    <div class="card-body">
                        <div class="row margin-1em">
                            <div class="col-2 text-align-right padding-right-1em">Certificate Kind</div>
                            <div class="col-2">
                                {{ getLetsEncryptCertificateKind() }}
                            </div>
                        </div>
                        <div class="row margin-2em">
                            <div class="col-2 text-align-right padding-right-1em">Issuer E-Mail</div>
                            <div class="col-4">
                                {{ letsencrypt.issuerEmail }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /letsencrypt -->

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
                            <div class="col-2">{{ openstack.domain }}.{{ cluster.fqdn }}</div>
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
                            <div class="col-3" v-if="openstack.barbican">
                                {{ openstack.barbican_endpoint }}.{{ openstack.domain }}.{{ cluster.fqdn }}
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
                            <div class="col-3" v-if="openstack.cinder">
                                {{ openstack.cinder_endpoint}}.{{ openstack.domain }}.{{ cluster.fqdn }}
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
                            <div class="col-3" v-if="openstack.glance">
                                {{ openstack.glance_endpoint}}.{{ openstack.domain }}.{{ cluster.fqdn }}
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
                            <div class="col-3" v-if="openstack.heat">
                                {{ openstack.heat_endpoint}}.{{ openstack.domain }}.{{ cluster.fqdn }}
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
                            <div class="col-3" v-if="openstack.horizon">
                                {{ openstack.horizon_endpoint}}.{{ openstack.domain }}.{{ cluster.fqdn }}
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
                            <div class="col-3" v-if="openstack.keystone">
                                {{ openstack.keystone_endpoint}}.{{ openstack.domain }}.{{ cluster.fqdn }}
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
                            <div class="col-3" v-if="openstack.mistral">
                                {{ openstack.mistral_endpoint}}.{{ openstack.domain }}.{{ cluster.fqdn }}
                            </div>
                        </div>

                        <div class="row margin-1em"><div class="col"><strong>Neutron</strong></div></div>
                        <div class="row margin-1em">
                            <div class="col-2 text-align-right padding-right-1em">Neutron Networking</div>
                            <div class="col-3"><i class="fas fa-check-circle green"></i></div>
                            <div class="col-2 offset-md-1 text-align-right padding-right-1em">Endpoint</div>
                            <div class="col-3">
                                {{ openstack.neutron_endpoint}}.{{ openstack.domain }}.{{ cluster.fqdn }}
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

                        <div class="row margin-1em"><div class="col"><strong>Nova</strong></div></div>
                        <div class="row margin-1em">
                            <div class="col-2 text-align-right padding-right-1em">Nova Computing</div>
                            <div class="col-3">
                                <i v-if="openstack.nova" class="fas fa-check-circle green"></i>
                                <i v-if="!openstack.nova" class="fas fa-times-circle red"></i>
                            </div>
                            <div class="col-2 offset-md-1 text-align-right padding-right-1em" v-if="openstack.nova">Endpoint</div>
                            <div class="col-3" v-if="openstack.nova">
                                {{ openstack.nova_endpoint}}.{{ openstack.domain }}.{{ cluster.fqdn }}
                            </div>
                        </div>
                        <div class="row margin-1em">
                            <div class="col-2 text-align-right padding-right-1em">Public Endpoint NoVNC</div>
                            <div class="col-3">
                                {{ openstack.nova_novnc_endpoint }}.{{ openstack.domain }}.{{ cluster.fqdn }}
                            </div>
                            <div class="col-2 offset-md-1 text-align-right padding-right-1em">Endpoint Placement API</div>
                            <div class="col-3">
                                {{ openstack.nova_placement_endpoint}}.{{ openstack.domain }}.{{ cluster.fqdn }}
                            </div>
                        </div>
                        <div class="row margin-2em">
                            <div class="col-2 text-align-right padding-right-1em">Virtualization Type</div>
                            <div class="col-2">
                                {{ openstack.nova_virtType.toUpperCase() }}
                            </div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em">CPU Mode</div>
                            <div class="col">
                                {{ openstack.nova_cpuMode}} 
                            </div>
                        </div>

                        <div class="row margin-1em" v-if="openstack.release === 'stein'"><div class="col"><strong>Senlin</strong></div></div>
                        <div class="row margin-2em" v-if="openstack.release === 'stein'">
                            <div class="col-2 text-align-right padding-right-1em">Senlin Clustering</div>
                            <div class="col-2">
                                <i v-if="openstack.senlin" class="fas fa-check-circle green"></i>
                                <i v-if="!openstack.senlin" class="fas fa-times-circle red"></i>
                            </div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em" v-if="openstack.senlin">Endpoint</div>
                            <div class="col-3" v-if="openstack.senlin">
                                {{ openstack.senlin_endpoint}}.{{ openstack.domain }}.{{ cluster.fqdn }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /Openstack -->

            <!-- CF -->
            <div class="card margin-1em" v-if="general.installCF">
                <div class="card-header" id="cf">
                    <div class="row">
                        <div class="col">
                            <h5 class="mb-0">
                                <button class="btn btn-link accordion-link" data-toggle="collapse" data-target="#cfData" 
                                    aria-expanded="false" aria-controls="cfData">
                                    Cloud Foundry
                                </button>
                            </h5>
                        </div>
                        <div class="col-1">
                            <router-link to="/cf" class="summaryLink">Edit</router-link>
                        </div>
                    </div>
                </div>

                <div id="cfData" class="collapse" aria-labelledby="cf" 
                    data-parent="#accordion">
                    <div class="card-body">
                        <div class="row margin-1em">
                            <div class="col-2 text-align-right padding-right-1em">Base URL</div>
                            <div class="col-2">
                                *.{{ cf.fqdn }}
                            </div>
                        </div>
                        <div class="row margin-1em">
                            <div class="col-2 text-align-right padding-right-1em">Stratos Dashboard</div>
                            <div class="col-2">
                                <i v-if="cf.stratos" class="fas fa-check-circle green"></i>
                                <i v-if="!cf.stratos" class="fas fa-times-circle red"></i>
                            </div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em" 
                                v-if="cf.stratos">Stratos Endpoint</div>
                            <div class="col-2" v-if="cf.stratos">
                                {{ cf.stratos_endpoint}} 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /cf -->

            <!-- Additional -->
            <div class="card margin-1em">
                <div class="card-header" id="additional">
                    <div class="row">
                        <div class="col">
                            <h5 class="mb-0">
                                <button class="btn btn-link accordion-link" data-toggle="collapse" data-target="#additionalData" 
                                    aria-expanded="false" aria-controls="additionalData">
                                    Additional Tools
                                </button>
                            </h5>
                        </div>
                        <div class="col-1">
                            <router-link to="/tools" class="summaryLink">Edit</router-link>
                        </div>
                    </div>
                </div>

                <div id="additionalData" class="collapse" aria-labelledby="additional" 
                    data-parent="#accordion">
                    <div class="card-body">
                        <div class="row margin-1em">
                            <div class="col-2 text-align-right padding-right-1em">Harbor</div>
                            <div class="col-2">
                                <i v-if="additional.harbor" class="fas fa-check-circle green"></i>
                                <i v-if="!additional.harbor" class="fas fa-times-circle red"></i>
                            </div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em">Prometheus</div>
                            <div class="col-2">
                                <i v-if="additional.prometheus" class="fas fa-check-circle green"></i>
                                <i v-if="!additional.prometheus" class="fas fa-times-circle red"></i>
                            </div>
                        </div>
                        <div class="row margin-1em">
                            <div class="col-2 text-align-right padding-right-1em">Grafana</div>
                            <div class="col-2">
                                <i v-if="additional.grafana" class="fas fa-check-circle green"></i>
                                <i v-if="!additional.grafana" class="fas fa-times-circle red"></i>
                            </div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em">Elasticsearch</div>
                            <div class="col-2">
                                <i v-if="additional.elastic" class="fas fa-check-circle green"></i>
                                <i v-if="!additional.elastic" class="fas fa-times-circle red"></i>
                            </div>
                        </div>
                        <div class="row margin-1em">
                            <div class="col-2 text-align-right padding-right-1em">Kibana</div>
                            <div class="col-2">
                                <i v-if="additional.kibana" class="fas fa-check-circle green"></i>
                                <i v-if="!additional.kibana" class="fas fa-times-circle red"></i>
                            </div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em">Fluentd</div>
                            <div class="col-2">
                                <i v-if="additional.fluentd" class="fas fa-check-circle green"></i>
                                <i v-if="!additional.fluentd" class="fas fa-times-circle red"></i>
                            </div>
                        </div>
                        <div class="row margin-1em">
                            <div class="col-2 text-align-right padding-right-1em">Jaeger</div>
                            <div class="col-2">
                                <i v-if="additional.jaeger" class="fas fa-check-circle green"></i>
                                <i v-if="!additional.jaeger" class="fas fa-times-circle red"></i>
                            </div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em">Nginx</div>
                            <div class="col-2">
                                <i v-if="additional.nginx" class="fas fa-check-circle green"></i>
                                <i v-if="!additional.nginx" class="fas fa-times-circle red"></i>
                            </div>
                        </div>
                        <div class="row margin-1em">
                            <div class="col-2 text-align-right padding-right-1em">Cert-Manager</div>
                            <div class="col-2">
                                <i v-if="additional.certmgr" class="fas fa-check-circle green"></i>
                                <i v-if="!additional.certmgr" class="fas fa-times-circle red"></i>
                            </div>
                            <div class="col-2 offset-md-2 text-align-right padding-right-1em">Kubernetes Dashboard</div>
                            <div class="col-2">
                                <i v-if="additional.dashboard" class="fas fa-check-circle green"></i>
                                <i v-if="!additional.dashboard" class="fas fa-times-circle red"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /additional -->

            <!-- Complimentary -->
            <div class="card margin-1em">
                <div class="card-header" id="complimentary">
                    <div class="row">
                        <div class="col">
                            <h5 class="mb-0">
                                <button class="btn btn-link accordion-link" data-toggle="collapse" data-target="#complimentaryData" 
                                    aria-expanded="false" aria-controls="complimentaryData">
                                    Complimentary Tools
                                </button>
                            </h5>
                        </div>
                        <div class="col-1">
                            <router-link to="/complimentary" class="summaryLink">Edit</router-link>
                        </div>
                    </div>
                </div>


                <div id="complimentaryData" class="collapse" aria-labelledby="complimentary" 
                    data-parent="#accordion">
                    <div class="card-body">
                        <div class="row margin-1em">
                            <div class="col-2 text-align-right padding-right-1em">Polyverse</div>
                            <div class="col-2">
                                <i v-if="complimentary.polyverse" class="fas fa-check-circle green"></i>
                                <i v-if="!complimentary.polyverse" class="fas fa-times-circle red"></i>
                            </div>
                            <div v-if="complimentary.polyverse" class="col-2 offset-md-2 text-align-right padding-right-1em">Polyverse Key</div>
                            <div v-if="complimentary.polyverse" class="col-2">
                                {{ complimentary.polyverseKey }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Subscription -->
            <div class="card margin-1em">
                <div class="card-header" id="subscription">
                    <div class="row">
                        <div class="col">
                            <h5 class="mb-0">
                                <button class="btn btn-link accordion-link" data-toggle="collapse" data-target="#subscriptionData" 
                                    aria-expanded="false" aria-controls="subscriptionData">
                                    Subscription
                                </button>
                            </h5>
                        </div>
                        <div class="col-1">
                            <router-link to="/subscription" class="summaryLink">Edit</router-link>
                        </div>
                    </div>
                </div>
                <div id="subscriptionData" class="collapse" aria-labelledby="subscription" 
                    data-parent="#accordion">
                    <div class="card-body">
                        <div class="row margin-1em">
                            <div class="col-2 text-align-right padding-right-1em">Username</div>
                            <div class="col-2">
                                <span v-if="key !== ''">{{ key }} </span>
                                <span v-if="key == ''"><em>No Username entered</em></span>
                            </div>
                        </div>
                        <div class="row margin-1em">
                            <div class="col-2 text-align-right padding-right-1em">Password</div>
                            <div class="col-2">
                                <span v-if="password !== ''">*****</span>
                                <span v-if="password == ''"><em>No Password entered</em></span>
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
import Globals from './js/globals'

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
            key: '',
            password: '',
            letsencrypt: {},
            complimentary: {}
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

        getLetsEncryptCertificateKind: function() {
            if(this.letsencrypt.issuer == 'letsencrypt-staging')
                return "Staging"

            return "Production"
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
            installOpenStack: this.$store.state.installer.general.installOpenStack
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
        this.password = this.$store.state.base.password

        // Complimentary
        this.complimentary = this.$store.state.installer.complimentary

        // Add the Let's Encrypt Data
        this.letsencrypt = this.$store.state.installer.letsencrypt
    },

    created: function() {
    }
}
</script>