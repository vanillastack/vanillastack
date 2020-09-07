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
                            <div class="col-3">
                                <p><strong>Domain</strong></p>
                                <input class="form-control" placeholder="openstack.my.cluster" 
                                    name="domain" v-model="domain" v-on:blur="triggerValidation()" 
                                        required="required"  />
                            </div>
                        </div>
                        <div class="row margin-2em">
                            <div class="col-3">
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
                            <div class="col-3">
                                <p><strong>TLS public endpoint</strong></p>
                                <div class="custom-control custom-switch inline-block">
                                    <input class="custom-control-input" id="tls" name="tls" type="checkbox" 
                                        v-model="tls" 
                                        v-on:click="triggerValidation()">
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
                            <div class="col-3">
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
                            <div class="col-3">
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
                            <div class="col-3">
                                <label for="barbican_endpoint">Endpoint Address</label>
                                <input class="form-control" placeholder="barbican.openstack.my.cluster" 
                                    name="barbican_endpoint" v-model="barbican_endpoint" 
                                    v-on:blur="triggerValidation()" 
                                    type="text"
                                    :disabled="!barbican"
                                    :required="barbican"  />
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
                            <div class="col-3">
                                <p><strong>Cinder Endpoint</strong></p>
                                <input class="form-control" placeholder="cinder.openstack.my.cluster" 
                                    name="cinder_endpoint" v-model="cinder_endpoint" 
                                        v-on:blur="triggerValidation()" 
                                        required="required"  />
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
                            <div class="col-3">
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
                            <div class="col-3">
                                <p><strong>Glance Endpoint</strong></p>
                                <input class="form-control" placeholder="glance.openstack.my.cluster" 
                                    name="glance_endpoint" v-model="glance_endpoint" 
                                        v-on:blur="triggerValidation()" 
                                        required="required"  />
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
                            <div class="col-3">
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
                            <div class="col-3">
                                <p><strong>Heat Endpoint</strong></p>
                                <input class="form-control" placeholder="heat.openstack.my.cluster" 
                                    name="heat_endpoint" v-model="heat_endpoint" 
                                        v-on:blur="triggerValidation()" 
                                        required="required"  />
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
                            <div class="col-3">
                                <p><strong>Horizon Endpoint</strong></p>
                                <input class="form-control" placeholder="horizon.openstack.my.cluster" 
                                    name="horizon_endpoint" v-model="horizon_endpoint" 
                                        v-on:blur="triggerValidation()" 
                                        required="required"  />
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
            <!-- /horizon -->
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
        }
    },

    methods: {
        triggerValidation: function() {
            var isValid = this.domain != '' && this.mariadb_size >= 10 && this.rabbitmq_size >= 10 &&
                            ((this.barbican && this.barbican_endpoint.length > 0) || !this.barbican) &&
                            ((this.heat && this.heat_endpoint.length > 0) || !this.heat) &&
                            ((this.horizon && this.horizon_endpoint.length > 0) || !this.horizon) &&
                            ((this.keystone && this.keystone_endpoint.length > 0) || !this.keystone) &&
                            ((this.mistral && this.mistral_endpoint.length > 0) || !this.mistral) &&
                            ((this.senlin && this.senlin_endpoint.length > 0) || !this.senlin) &&
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
        // Set the OpenStack-Domain
        if(this.$store.state.installer.clusterfqdn.length > 0 && this.$store.state.installer.useclusterfqdn &&
            this.$store.state.installer.openstack.domain.length == 0)
            this.domain = 'openstack.' + this.$store.state.installer.clusterfqdn

        
        // Set the Barbican-Domain
        if(this.$store.state.installer.clusterfqdn.length > 0 && this.$store.state.installer.useclusterfqdn &&
            this.$store.state.installer.openstack.barbican_endpoint.length == 0)
            this.barbican_endpoint = 'barbican.' + this.domain
        
        // Set the Cinder-Domain
        if(this.$store.state.installer.clusterfqdn.length > 0 && this.$store.state.installer.useclusterfqdn &&
            this.$store.state.installer.openstack.cinder_endpoint.length == 0)
            this.cinder_endpoint = 'cinder.' + this.domain
        
        // Set the Glance-Domain
        if(this.$store.state.installer.clusterfqdn.length > 0 && this.$store.state.installer.useclusterfqdn &&
            this.$store.state.installer.openstack.glance_endpoint.length == 0)
            this.glance_endpoint = 'glance.' + this.domain
        
        // Set the Heat-Domain
        if(this.$store.state.installer.clusterfqdn.length > 0 && this.$store.state.installer.useclusterfqdn &&
            this.$store.state.installer.openstack.heat_endpoint.length == 0)
            this.heat_endpoint = 'heat.' + this.domain
        
        // Set the Horizon-Domain
        if(this.$store.state.installer.clusterfqdn.length > 0 && this.$store.state.installer.useclusterfqdn &&
            this.$store.state.installer.openstack.horizon_endpoint.length == 0)
            this.horizon_endpoint = 'horizon.' + this.domain
        
        // Set the Senlin-Domain
        if(this.$store.state.installer.clusterfqdn.length > 0 && this.$store.state.installer.useclusterfqdn &&
            this.$store.state.installer.openstack.senlin_endpoint.length == 0)
            this.senlin_endpoint = 'senlin.' + this.domain
        
        // Set the Mistral-Domain
        if(this.$store.state.installer.clusterfqdn.length > 0 && this.$store.state.installer.useclusterfqdn &&
            this.$store.state.installer.openstack.mistral_endpoint.length == 0)
            this.mistral_endpoint = 'mistral.' + this.domain
        
        // Set the Keystone-Domain
        if(this.$store.state.installer.clusterfqdn.length > 0 && this.$store.state.installer.useclusterfqdn &&
            this.$store.state.installer.openstack.keystone_endpoint.length == 0)
            this.keystone_endpoint = 'keystone.' + this.domain

        // Notify about being loaded
        this.triggerValidation()
    },

    created: function() {
    }
}
</script>