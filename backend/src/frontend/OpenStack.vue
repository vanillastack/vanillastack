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

                <div class="card-body">
                    <div id="compData" class="collapse" aria-labelledby="compHeading" data-parent="#accordion">
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
        }
    },

    methods: {
        triggerValidation: function() {
            var isValid = this.domain != '' && this.mariadb_size >= 10 && this.rabbitmq_size >= 10

            // A value is required for barbican
            if(isValid)
                isValid = (this.barbican && this.barbican_endpoint.length > 0) || !this.barbican

            // Store the data
            this.$store.commit(Constants.Store_OpenStackUpdateData, this.$data)

            // Control, whether the next step is enabled 
            EventBus.$emit(Constants.Event_NewViewLoaded, {
                allowGoForward: isValid
            })
        }
    },

    mounted : function () {
        // Notify about being loaded
        this.triggerValidation()
    },

    created: function() {
    }
}
</script>