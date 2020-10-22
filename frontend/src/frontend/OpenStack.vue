<template>
    <div class="container-fluid">
        <div class="row margin-2em">
            <div class="col">
                <h3>OpenStack</h3>
            </div>
        </div>
        <div class="row margin-2em">
            <div class="col">
                Here you can set the settings for your OpenStack installation. 
                To ease your work, we have prepopulated the settings with useful options.
            </div>
        </div>
        <div id="accordion" class="margin-2em form">
            <div class="card margin-1em">
                <div class="card-header" id="generalHeading">
                    <h5 class="mb-0">
                        <button class="btn btn-link accordion-link" data-toggle="collapse" data-target="#generalData" 
                            aria-expanded="true" aria-controls="generalData">
                            General Settings
                        </button>
                    </h5>
                </div>

                <div id="generalData" class="collapse show" aria-labelledby="generalHeading" 
                    data-parent="#accordion">
                    <div class="card-body">
                        <div class="row margin-2em">
                            <div class="col-4">
                                <p><strong>Endpoint</strong></p>
                                <input class="form-control small width-10em" placeholder="openstack" style="display:inline-block"
                                    name="domain" v-model="domain" v-on:blur="triggerValidation()" 
                                        required="required"  />.{{ fqdn }}
                            </div>
                        </div>
                        <div class="row margin-2em">
                            <div class="col-4">
                                <p><strong>Release</strong></p>
                                <select class="custom-select"
                                    name="release" v-model="release" v-on:blur="triggerValidation()">
                                    <option value="stein">Stein</option>
                                    <option value="train">Train</option>
                                    <option value="ussuri">Ussuri</option>
                                </select>
                            </div>
                        </div>
                        <div class="row margin-2em">
                            <div class="col-4">
                                <p><strong>TLS public endpoint</strong></p>
                                <div class="custom-control custom-switch inline-block">
                                    <input class="custom-control-input" id="tls" name="tls" type="checkbox" 
                                        v-model="tls" 
                                        v-on:click="triggerValidation()" />
                                    <label class="custom-control-label">
                                        TLS public endpoint enabled
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card margin-1em">
                <div class="card-header" id="compHeading">
                    <h5 class="mb-0">
                        <button class="btn btn-link accordion-link" data-toggle="collapse" data-target="#compData" 
                            aria-expanded="false" aria-controls="compData">
                            Components
                        </button>
                    </h5>
                </div>

                <div id="compData" class="collapse" aria-labelledby="compHeading" data-parent="#accordion">
                    <div class="card-body">                       
                         <!-- MariaDB -->
                        <div class="row">
                            <div class="col-3">
                                <p><strong>MariaDB database</strong></p>
                            </div>
                        </div>
                        <div class="row margin-2em">
                            <div class="col-4">
                                <label for="mariadb_size">Size in GiB</label>
                                <input class="form-control" placeholder="20" 
                                    name="mariadb_size" v-model="mariadb_size" v-on:blur="triggerValidation()" 
                                    type="number" min="10"
                                    required="required"  />
                            </div>
                            <div class="col">
                                <div class="custom-control custom-switch padding-top-2_5em">
                                    <input class="custom-control-input" id="mariadb" name="mariadb" disabled="disabled" type="checkbox" 
                                        v-model="mariadb" 
                                        v-on:click="triggerValidation()">
                                    <label class="custom-control-label">
                                        MariaDB database
                                    </label>
                                </div>
                            </div>
                        </div>
                        <!-- /MariaDB -->
                        <!-- RabbitMQ -->
                        <div class="row">
                            <div class="col-3">
                                <p><strong>RabbitMQ</strong></p>
                            </div>
                        </div>
                        <div class="row margin-2em">
                            <div class="col-4">
                                <label for="rabbitmq_size">Size in GiB</label>
                                <input class="form-control" placeholder="20" 
                                    name="rabbitmq_size" v-model="rabbitmq_size" v-on:blur="triggerValidation()" 
                                    type="number" min="10"
                                    required="required"  />
                            </div>
                            <div class="col">
                                <div class="custom-control custom-switch padding-top-2_5em" style="padding-top: 2.5em">
                                    <input class="custom-control-input" id="rabbitmq" name="rabbitmq" disabled="disabled" type="checkbox" 
                                        v-model="rabbitmq" 
                                        v-on:click="triggerValidation()">
                                    <label class="custom-control-label">
                                        RabbitMQ
                                    </label>
                                </div>
                            </div>
                        </div>
                        <!-- /RabbitMQ -->
                        <!-- Barbican -->
                        <div class="row">
                            <div class="col">
                                <p><strong>Barbican Key Management Service</strong></p>
                            </div>
                        </div>
                        <div class="row margin-2em">
                            <div class="col-4">
                                <label for="barbican_endpoint">Endpoint Address</label><br />
                                <input class="form-control small" placeholder="barbican" style="display:inline-block"
                                    name="barbican_endpoint" v-model="barbican_endpoint" 
                                    v-on:blur="triggerValidation()" 
                                    type="text"
                                    :disabled="!barbican"
                                    :required="barbican"  /><span>.{{ domain }}.{{ fqdn }}</span>
                            </div>
                            <div class="col">
                                <div class="custom-control custom-switch padding-top-2_5em" style="padding-top: 2.5em">
                                    <input class="custom-control-input" id="barbican" name="barbican" type="checkbox" 
                                        v-model="barbican" v-on:change="triggerValidation()">
                                    <label class="custom-control-label" for="barbican">
                                        Barbican Key Management Service
                                    </label>
                                </div>
                            </div>
                        </div>
                        <!-- /RabbitMQ -->
                    </div>
                </div>
            </div>

            <!-- Cinder -->
            <div class="card margin-1em">
                <div class="card-header" id="cinderHeading">
                    <h5 class="mb-0">
                        <button class="btn btn-link accordion-link" data-toggle="collapse" data-target="#cinderData" 
                            aria-expanded="false" aria-controls="cinderData">
                            Cinder
                        </button>
                    </h5>
                </div>

                <!-- Cinder-Data -->
                <div id="cinderData" class="collapse" aria-labelledby="cinderHeading" 
                    data-parent="#accordion">
                    <div class="card-body">
                        <div class="row margin-2em">
                            <div class="col-4">
                                <p><strong>Cinder Endpoint</strong></p>
                                <input class="form-control small" placeholder="cinder" 
                                    name="cinder_endpoint" v-model="cinder_endpoint" 
                                        v-on:blur="triggerValidation()" 
                                        required="required"  /><span>.{{ domain }}.{{ fqdn }}</span>
                            </div>
                            <div class="col">
                                <div class="custom-control custom-switch padding-top-3em">
                                    <input class="custom-control-input" id="cinder" name="cinder" disabled="disabled" type="checkbox" 
                                        v-model="cinder" 
                                        v-on:click="triggerValidation()">
                                    <label class="custom-control-label" for="cinder">
                                        Cinder Block Storage
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="row margin-2em">
                            <div class="col-4">
                                <p><strong>Cinder Backend</strong></p>
                                <select class="custom-select"
                                    name="cinder_backend" v-model="cinder_backend" v-on:blur="triggerValidation()">
                                    <option value="ceph">Ceph</option>
                                </select>
                            </div>
                            <div class="col">
                                <p><strong>Cinder Backup</strong></p>
                                <div class="custom-control custom-switch inline-block padding-top-0_5em">
                                    <input class="custom-control-input" id="cinder_backup" name="cinder_backup" type="checkbox" 
                                        v-model="cinder_backup" 
                                        v-on:click="triggerValidation()">
                                    <label class="custom-control-label" for="cinder_backup">
                                        Enable Cinder Backup
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /Cinder -->

            <!-- Glance -->
            <div class="card margin-1em">
                <div class="card-header" id="glanceHeading">
                    <h5 class="mb-0">
                        <button class="btn btn-link accordion-link" data-toggle="collapse" data-target="#glanceData" 
                            aria-expanded="false" aria-controls="glanceData">
                            Glance
                        </button>
                    </h5>
                </div>

                <!-- Glance-Data -->
                <div id="glanceData" class="collapse" aria-labelledby="glanceHeading" 
                    data-parent="#accordion">
                    <div class="card-body">
                        <div class="row margin-2em">
                            <div class="col-4">
                                <p><strong>Glance Endpoint</strong></p>
                                <input class="form-control small" placeholder="glance" 
                                    name="glance_endpoint" v-model="glance_endpoint" 
                                        v-on:blur="triggerValidation()" 
                                        required="required"  /><span>.{{ domain }}.{{ fqdn }}</span>
                            </div>
                            <div class="col">
                                <div class="custom-control custom-switch padding-top-3em">
                                    <input class="custom-control-input" id="glance" name="glance" disabled="disabled" type="checkbox" 
                                        v-model="glance" 
                                        v-on:click="triggerValidation()">
                                    <label class="custom-control-label" for="glance">
                                        Glance Image Service
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="row margin-2em">
                            <div class="col-4">
                                <p><strong>Glance Backend</strong></p>
                                <select class="custom-select"
                                    name="glance_backend" v-model="glance_backend" v-on:blur="triggerValidation()">
                                    <option value="ceph">Ceph</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /Glance -->

            <!-- Heat -->
            <div class="card margin-1em">
                <div class="card-header" id="heatHeading">
                    <h5 class="mb-0">
                        <button class="btn btn-link accordion-link" data-toggle="collapse" data-target="#heatData" 
                            aria-expanded="false" aria-controls="heatData">
                            Heat
                        </button>
                    </h5>
                </div>

                <!-- Heat-Data -->
                <div id="heatData" class="collapse" aria-labelledby="heatHeading" 
                    data-parent="#accordion">
                    <div class="card-body">
                        <div class="row margin-2em">
                            <div class="col-4">
                                <p><strong>Heat Endpoint</strong></p>
                                <input class="form-control small" placeholder="heat" 
                                    name="heat_endpoint" v-model="heat_endpoint" 
                                        v-on:blur="triggerValidation()" 
                                        required="required"  /><span>.{{ domain }}.{{ fqdn }}</span>
                            </div>
                            <div class="col">
                                <div class="custom-control custom-switch padding-top-3em">
                                    <input class="custom-control-input" id="heat" name="heat" 
                                        type="checkbox" 
                                        v-model="heat" 
                                        v-on:click="triggerValidation()">
                                    <label class="custom-control-label" for="heat">
                                        Heat Orchestration Service
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /Heat -->

            <!-- horizon -->
            <div class="card margin-1em">
                <div class="card-header" id="horizonHeading">
                    <h5 class="mb-0">
                        <button class="btn btn-link accordion-link" data-toggle="collapse" data-target="#horizonData" 
                            aria-expanded="false" aria-controls="horizonData">
                            Horizon
                        </button>
                    </h5>
                </div>

                <!-- horizon-Data -->
                <div id="horizonData" class="collapse" aria-labelledby="horizonHeading" 
                    data-parent="#accordion">
                    <div class="card-body">
                        <div class="row margin-2em">
                            <div class="col-4">
                                <p><strong>Horizon Endpoint</strong></p>
                                <input class="form-control small" placeholder="horizon" 
                                    name="horizon_endpoint" v-model="horizon_endpoint" 
                                        v-on:blur="triggerValidation()" 
                                        required="required"  /><span>.{{ domain }}.{{ fqdn }}</span>
                            </div>
                            <div class="col">
                                <div class="custom-control custom-switch padding-top-3em">
                                    <input class="custom-control-input" id="horizon" name="horizon" 
                                        type="checkbox" 
                                        v-model="horizon" 
                                        v-on:click="triggerValidation()">
                                    <label class="custom-control-label" for="horizon">
                                        Horizon Dashboard
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /Horizon -->

            <!-- keystone -->
            <div class="card margin-1em">
                <div class="card-header" id="keystoneHeading">
                    <h5 class="mb-0">
                        <button class="btn btn-link accordion-link" data-toggle="collapse" data-target="#keystoneData" 
                            aria-expanded="false" aria-controls="keystoneData">
                            Keystone
                        </button>
                    </h5>
                </div>

                <!-- keystone-Data -->
                <div id="keystoneData" class="collapse" aria-labelledby="keystoneHeading" 
                    data-parent="#accordion">
                    <div class="card-body">
                        <div class="row margin-2em">
                            <div class="col-4">
                                <p><strong>Keystone Endpoint</strong></p>
                                <input class="form-control small" placeholder="keystone" 
                                    name="keystone_endpoint" v-model="keystone_endpoint" 
                                        v-on:blur="triggerValidation()" 
                                        required="required"  /><span>.{{ domain }}.{{ fqdn }}</span>
                            </div>
                            <div class="col">
                                <div class="custom-control custom-switch padding-top-3em">
                                    <input class="custom-control-input" id="keystone" name="keystone" 
                                        type="checkbox" 
                                        v-model="keystone" 
                                        v-on:click="triggerValidation()">
                                    <label class="custom-control-label" for="keystone">
                                        Keystone Authentication Service
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /Keystone -->

            <!-- Mistral -->
            <div class="card margin-1em">
                <div class="card-header" id="mistralHeading">
                    <h5 class="mb-0">
                        <button class="btn btn-link accordion-link" data-toggle="collapse" data-target="#mistralData" 
                            aria-expanded="false" aria-controls="mistralData">
                            Mistral
                        </button>
                    </h5>
                </div>

                <!-- Mistral-Data -->
                <div id="mistralData" class="collapse" aria-labelledby="mistralHeading" 
                    data-parent="#accordion">
                    <div class="card-body">
                        <div class="row margin-2em">
                            <div class="col-4">
                                <p><strong>mistral Endpoint</strong></p>
                                <input class="form-control small" placeholder="mistral" 
                                    name="mistral_endpoint" v-model="mistral_endpoint" 
                                        v-on:blur="triggerValidation()" 
                                        required="required"  /><span>.{{ domain }}.{{ fqdn }}</span>
                            </div>
                            <div class="col">
                                <div class="custom-control custom-switch padding-top-3em">
                                    <input class="custom-control-input" id="mistral" name="mistral" 
                                        type="checkbox" 
                                        v-model="mistral" 
                                        v-on:click="triggerValidation()">
                                    <label class="custom-control-label" for="mistral">
                                        Mistral Workflow Service
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /mistral -->

            <!-- Neutron -->
            <div class="card margin-1em">
                <div class="card-header" id="neutronHeading">
                    <h5 class="mb-0">
                        <button class="btn btn-link accordion-link" data-toggle="collapse" data-target="#neutronData" 
                            aria-expanded="false" aria-controls="neutronData">
                            Neutron
                        </button>
                    </h5>
                </div>

                <!-- neutron-Data -->
                <div id="neutronData" class="collapse" aria-labelledby="neutronHeading" 
                    data-parent="#accordion">
                    <div class="card-body">
                        <div class="row margin-2em">
                            <div class="col-4">
                                <p><strong>Neutron Endpoint</strong></p>
                                <input class="form-control small" placeholder="neutron" 
                                    name="neutron_endpoint" v-model="neutron_endpoint" 
                                        v-on:blur="triggerValidation()" 
                                        required="required"  /><span>.{{ domain }}.{{ fqdn }}</span>
                            </div>
                            <div class="col">
                                <div class="custom-control custom-switch padding-top-3em">
                                    <input class="custom-control-input" id="neutron" name="neutron" disabled="disabled" type="checkbox" 
                                        v-model="neutron" 
                                        v-on:click="triggerValidation()">
                                    <label class="custom-control-label" for="neutron">
                                        Neutron Networking
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="row margin-2em">
                            <div class="col-4">
                                <p><strong>Interface Name (Tunnel / Overlay)</strong></p>
                                <input class="form-control small" placeholder="eth1" 
                                    name="neutron_interface_tunnel" v-model="neutron_interface_tunnel" 
                                        v-on:blur="triggerValidation()" 
                                        required="required"  />
                            </div>
                            <div class="col-4">
                                <p><strong>Interface Name (External)</strong></p>
                                <input class="form-control small" placeholder="eth2" 
                                    name="neutron_interface_external" v-model="neutron_interface_external" 
                                        v-on:blur="triggerValidation()" 
                                        required="required"  />
                            </div>
                        </div>
                        <div class="row margin-2em">
                            <div class="col-4">
                                <p><strong>Layer3 HA</strong></p>
                                <div class="custom-control custom-switch">
                                    <input class="custom-control-input" id="neutron_l3ha" name="neutron_l3ha" type="checkbox" 
                                        v-model="neutron_l3ha" 
                                        v-on:click="triggerValidation()">
                                    <label class="custom-control-label" for="neutron_l3ha">
                                        Enable Layer3 HA
                                    </label>
                                </div>
                            </div>
                            <div class="col-4">
                                <p><strong>Overlay Network Type</strong></p>
                                <select class="custom-select"
                                    name="neutron_overlayNetworkType" v-model="neutron_overlayNetworkType" v-on:blur="triggerValidation()">
                                    <option value="VXLAN">VXLAN</option>
                                    <option value="GRE">GRE</option>
                                </select>
                            </div>
                        </div>
                        <div class="row margin-2em">
                            <div class="col-4">
                                <p><strong>Max Agents per Router</strong></p>
                                <select class="custom-select"
                                    name="neutron_maxAgentsPerRouter" v-model="neutron_maxAgentsPerRouter" v-on:blur="triggerValidation()">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </div>
                            <div class="col-4">
                                <p><strong>DHCP Agents</strong></p>
                                <select class="custom-select"
                                    name="neutron_dhcpAgents" v-model="neutron_dhcpAgents" v-on:blur="triggerValidation()">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /Neutron -->

            <!-- Nova -->
            <div class="card margin-1em">
                <div class="card-header" id="novaHeading">
                    <h5 class="mb-0">
                        <button class="btn btn-link accordion-link" data-toggle="collapse" data-target="#novaData" 
                            aria-expanded="false" aria-controls="novaData">
                            Nova
                        </button>
                    </h5>
                </div>

                <!-- Nova-Data -->
                <div id="novaData" class="collapse" aria-labelledby="novaHeading" 
                    data-parent="#accordion">
                    <div class="card-body">
                        <div class="row margin-2em">
                            <div class="col-4">
                                <p><strong>Public Endpoint API</strong></p>
                                <input class="form-control small" placeholder="nova" 
                                    name="nova_endpoint" v-model="nova_endpoint" 
                                        v-on:blur="triggerValidation()" 
                                        required="required"  /><span>.{{ domain }}.{{ fqdn }}</span>
                            </div>
                            <div class="col">
                                <div class="custom-control custom-switch padding-top-3em">
                                    <input class="custom-control-input" id="nova" name="nova" disabled="disabled" type="checkbox" 
                                        v-model="nova" 
                                        v-on:click="triggerValidation()">
                                    <label class="custom-control-label" for="nova">
                                        Nova Computing
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="row margin-2em">
                            <div class="col-4">
                                <p><strong>Public Endpoint NoVNC</strong></p>
                                <input class="form-control small" placeholder="novnc" 
                                    name="nova_novnc_endpoint" v-model="nova_novnc_endpoint" 
                                        v-on:blur="triggerValidation()" 
                                        required="required"  /><span>.{{ domain }}.{{ fqdn }}</span>
                            </div>
                            <div class="col-4">
                                <p><strong>Public Endpoint Placement API</strong></p>
                                <input class="form-control small" placeholder="placement" 
                                    name="nova_placement_endpoint" v-model="nova_placement_endpoint" 
                                        v-on:blur="triggerValidation()" 
                                        required="required"  /><span>.{{ domain }}.{{ fqdn }}</span>
                            </div>
                        </div>
                        <div class="row margin-2em">
                            <div class="col-4">
                                <p><strong>Virtualization Type</strong></p>
                                
                                <select class="custom-select"
                                    name="nova_virtType" v-model="nova_virtType" 
                                    v-on:blur="triggerValidation()"
                                    v-on:change="triggerValidation()">
                                    <option value="Kvm">KVM (for bare metal)</option>
                                    <option value="Qemu">QEMU (for virtual machines)</option>
                                </select>
                            </div>
                            <div class="col-4">
                                <p><strong>CPU Mode</strong></p>
                                <select class="custom-select"
                                    name="nova_cpuMode" v-model="nova_cpuMode" 
                                        v-on:blur="triggerValidation()"
                                        v-on:change="triggerValidation()"
                                        :disabled="nova_virtType == 'Qemu'">
                                    <option value="host-passthrough">host-passthrough</option>
                                    <option value="host-model">host-model</option>
                                    <option value="none">none</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /nova -->

            <!-- Senlin -->
            <div class="card margin-1em" v-if="this.release === 'stein'">
                <div class="card-header" id="senlinHeading">
                    <h5 class="mb-0">
                        <button class="btn btn-link accordion-link" data-toggle="collapse" data-target="#senlinData" 
                            aria-expanded="false" aria-controls="senlinData">
                            Senlin
                        </button>
                    </h5>
                </div>

                <!-- Senlin-Data -->
                <div id="senlinData" class="collapse" aria-labelledby="senlinHeading" 
                    data-parent="#accordion">
                    <div class="card-body">
                        <div class="row margin-2em">
                            <div class="col-4">
                                <p><strong>senlin Endpoint</strong></p>
                                <input class="form-control small" placeholder="senlin" 
                                    name="senlin_endpoint" v-model="senlin_endpoint" 
                                        v-on:blur="triggerValidation()" 
                                        required="required"  /><span>.{{ domain }}.{{ fqdn }}</span>
                            </div>
                            <div class="col">
                                <div class="custom-control custom-switch padding-top-3em">
                                    <input class="custom-control-input" id="senlin" name="senlin" 
                                        type="checkbox" 
                                        v-model="senlin" 
                                        v-on:click="triggerValidation()">
                                    <label class="custom-control-label" for="senlin">
                                        Senlin Clustering
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /Senlin -->
            
        </div>
    </div>
</template>
<script>
import Constants from './js/constants.js'
import EventBus from './js/eventBus.js'

export default {
    name: 'openstack',

    data: function() {
        return {
            domain: this.$store.state.installer.openstack.domain,
            fqdn: this.$store.state.installer.cluster.fqdn,
            release: this.$store.state.installer.openstack.release,
            tls: this.$store.state.installer.openstack.tls,
            mariadb: this.$store.state.installer.openstack.mariadb,
            mariadb_size: this.$store.state.installer.openstack.mariadb_size,
            rabbitmq: this.$store.state.installer.openstack.rabbitmq,
            rabbitmq_size: this.$store.state.installer.openstack.rabbitmq_size,
            barbican: this.$store.state.installer.openstack.barbican,
            barbican_endpoint: this.$store.state.installer.openstack.barbican_endpoint,
            cinder_endpoint:  this.$store.state.installer.openstack.cinder_endpoint,
            cinder:  this.$store.state.installer.openstack.cinder,
            cinder_backend:  this.$store.state.installer.openstack.cinder_backend,
            cinder_backup:  this.$store.state.installer.openstack.cinder_backup,
            glance:  this.$store.state.installer.openstack.glance,
            glance_backend:  this.$store.state.installer.openstack.glance_backend,
            glance_endpoint:  this.$store.state.installer.openstack.glance_endpoint,
            heat_endpoint:  this.$store.state.installer.openstack.heat_endpoint,
            heat:  this.$store.state.installer.openstack.heat,
            horizon_endpoint:  this.$store.state.installer.openstack.horizon_endpoint,
            horizon:  this.$store.state.installer.openstack.horizon,
            keystone_endpoint:  this.$store.state.installer.openstack.keystone_endpoint,
            keystone:  this.$store.state.installer.openstack.keystone,
            mistral_endpoint:  this.$store.state.installer.openstack.mistral_endpoint,
            mistral:  this.$store.state.installer.openstack.mistral,
            senlin_endpoint:  this.$store.state.installer.openstack.senlin_endpoint,
            senlin:  this.$store.state.installer.openstack.senlin,
            neutron: this.$store.state.installer.openstack.neutron,
            neutron_endpoint: this.$store.state.installer.openstack.neutron_endpoint,
            neutron_interface_tunnel: this.$store.state.installer.openstack.neutron_interface_tunnel,
            neutron_interface_external: this.$store.state.installer.openstack.neutron_interface_external,
            neutron_l3ha: this.$store.state.installer.openstack.neutron_l3ha,
            neutron_overlayNetworkType: this.$store.state.installer.openstack.neutron_overlayNetworkType,
            neutron_maxAgentsPerRouter: this.$store.state.installer.openstack.neutron_maxAgentsPerRouter,
            neutron_dhcpAgents: this.$store.state.installer.openstack.neutron_dhcpAgents,
            nova_cpuMode: this.$store.state.installer.openstack.nova_cpuMode,
            nova_virtType: this.$store.state.installer.openstack.nova_virtType,
            nova_placement_endpoint: this.$store.state.installer.openstack.nova_placement_endpoint,
            nova_novnc_endpoint: this.$store.state.installer.openstack.nova_novnc_endpoint,
            nova: this.$store.state.installer.openstack.nova,
            nova_endpoint: this.$store.state.installer.openstack.nova_endpoint,
            prev_cpuMode: ''
        }
    },

    methods: {
        triggerValidation: function() {

            if(this.release !== 'stein') {
                this.senlin = false
            }

            // Check whether VirtType quemu is selected and adjust the CPU-modes accordingly
            if(this.nova_virtType == 'Qemu') {
                this.prev_cpuMode = this.nova_cpuMode
                this.nova_cpuMode = 'none'
            } else if(this.nova_cpuMode == 'none') {
                this.nova_cpuMode = this.prev_cpuMode == '' ? 'host-model' : this.prev_cpuMode
            }

            var isValid = this.domain != '' && this.mariadb_size >= 10 && this.rabbitmq_size >= 10 &&
                            ((this.barbican && this.barbican_endpoint.length > 0) || !this.barbican) &&
                            ((this.heat && this.heat_endpoint.length > 0) || !this.heat) &&
                            ((this.horizon && this.horizon_endpoint.length > 0) || !this.horizon) &&
                            ((this.keystone && this.keystone_endpoint.length > 0) || !this.keystone) &&
                            ((this.mistral && this.mistral_endpoint.length > 0) || !this.mistral) &&
                            ((this.senlin && this.senlin_endpoint.length > 0) || !this.senlin) &&
                            this.nova_placement_endpoint.length > 0 && this.nova_novnc_endpoint.length > 0 && this.nova_endpoint.length > 0 &&
                            this.neutron_endpoint.length > 0 && this.neutron_interface_tunnel.length > 0 && this.neutron_interface_external.length > 0 &&
                            this.glance_endpoint != '' 

            // Store the data
            this.$store.commit(Constants.Store_OpenStackUpdateData, this.$data)

            // Control, whether the next step is enabled 
            EventBus.$emit(Constants.Event_NewViewLoaded, {
                allowGoForward: isValid
            })
        }
    },

    mounted : function () {
        // Set the OpenStack-Endpoint
        if(this.$store.state.installer.cluster.fqdn.length > 0 && this.$store.state.installer.cluster.usefqdn &&
            this.$store.state.installer.openstack.domain.length == 0)
            this.domain = 'openstack'
        
        // Set the Barbican-Endpoint
        if(this.$store.state.installer.cluster.fqdn.length > 0 && this.$store.state.installer.cluster.usefqdn &&
            this.$store.state.installer.openstack.barbican_endpoint.length == 0)
            this.barbican_endpoint = 'barbican'
        
        // Set the Cinder-Endpoint
        if(this.$store.state.installer.openstack.cinder_endpoint.length == 0)
            this.cinder_endpoint = 'cinder'
        
        // Set the Glance-Endpoint
        if(this.$store.state.installer.openstack.glance_endpoint.length == 0)
            this.glance_endpoint = 'glance'
        
        // Set the Heat-Endpoint
        if(this.$store.state.installer.openstack.heat_endpoint.length == 0)
            this.heat_endpoint = 'heat'
        
        // Set the Horizon-Endpoint
        if(this.$store.state.installer.openstack.horizon_endpoint.length == 0)
            this.horizon_endpoint = 'horizon'
        
        // Set the Senlin-Endpoint
        if(this.$store.state.installer.openstack.senlin_endpoint.length == 0)
            this.senlin_endpoint = 'senlin'
        
        // Set the Mistral-Endpoint
        if(this.$store.state.installer.openstack.mistral_endpoint.length == 0)
            this.mistral_endpoint = 'mistral'
        
        // Set the Keystone-Endpoint
        if(this.$store.state.installer.openstack.keystone_endpoint.length == 0)
            this.keystone_endpoint = 'keystone'
        
        // Set the Neutron-Endpoint
        if(this.$store.state.installer.openstack.keystone_endpoint.length == 0)
            this.neutron_endpoint = 'neutron'
        
        // Set the Nova-Endpoint
        if(this.$store.state.installer.openstack.nova_endpoint.length == 0)
            this.nova_endpoint = 'nova'
        
        // Set the NoVNC-Endpoint
        if(this.$store.state.installer.openstack.nova_novnc_endpoint.length == 0)
            this.nova_novnc_endpoint = 'novnc'
        
        // Set the PlacementAPI-Endpoint
        if(this.$store.state.installer.openstack.nova_placement_endpoint.length == 0)
            this.nova_placement_endpoint = 'placement'

        // Notify about being loaded
        this.triggerValidation()
    },

    created: function() {
    }
}
</script>