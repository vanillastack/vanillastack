<template>
    <form>
        <div class="container-fluid">
            <div class="row margin-2em">
                <div class="col">
                    <h3>IP-addresses and Domains</h3>
                </div>
            </div>
            <div class="row margin-2em">
                <div class="col">
                    Here you define the IP-addresses of your cluster and the associated Domain names.<br />
                    The IP-address is required for making the cluster available on your network - and it is not equal to one of the nodes IP-addresses.<br />
                    Domain names are optional. They allow separating access to the cluster workloads from access to the VanillaStack AppStore.</p>
                    <p><em>Note: It is highly recommended to define a separate Domain name for AppStore, e.g. admin.&lt;your-cluster&gt;, otherwise access is restricted to a kubctl-Tunnel!</em></p>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <p><strong>IP-address of the cluster</strong></p>
                </div>
            </div>
            <div class="form-group row margin-2em">
                <div class="col-2">
                    <input class="form-control" placeholder="0.0.0.0" name="clusterip" v-model="clusterip" 
                        v-on:change="triggerValidation()" v-on:blur="triggerValidation()" 
                        required="required" />
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <p><strong>Domain of the cluster</strong></p>
                </div>
            </div>
            <div class="form-group row margin-2em">
                <div class="col">
                    <div class="inline-block margin-right-2em">
                        <input class="form-control" placeholder="my.cluster" name="clusterfqdn" v-model="clusterfqdn" 
                            v-on:change="triggerValidation()" v-on:blur="triggerValidation()" 
                            :required="useclusterfqdn" :disabled="!useclusterfqdn" />
                    </div>
                    <div class="custom-control custom-switch inline-block">
                        <input class="custom-control-input" id="clusterfqdntrigger" name="clusterfqdntrigger" type="checkbox" v-model="useclusterfqdn" v-on:click="triggerValidation()">
                        <label class="custom-control-label" for="clusterfqdntrigger">
                            Assign domain name to cluster
                        </label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <p><strong>Domain of the AppStore</strong></p>
                </div>
            </div>
            <div class="form-group row margin-2em">
                <div class="col">
                    <div class="inline-block margin-right-2em">
                        <input class="form-control" placeholder="admin.my.cluster" name="adminfqdn" v-model="adminfqdn" 
                            v-on:change="triggerValidation()" v-on:blur="triggerValidation()" 
                            :required="useadminfqdn" :disabled="!useadminfqdn" />
                    </div>
                    <div class="custom-control custom-switch inline-block">
                        <input class="custom-control-input" id="adminfqdntrigger" name="adminfqdntrigger" type="checkbox" v-model="useadminfqdn" v-on:click="triggerValidation()">
                        <label class="custom-control-label" for="adminfqdntrigger">
                            Use domain name for AppStore access
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>
<script>
import Constants from './js/constants.js'
import EventBus from './js/eventBus.js'

export default {
    name: 'ip',

    data: function()  {
        return {
            clusterip: this.$store.state.installer.clusterip,
            useclusterfqdn: this.$store.state.installer.useclusterfqdn,
            clusterfqdn: this.$store.state.installer.clusterfqdn,
            useadminfqdn: this.$store.state.installer.useadminfqdn,
            adminfqdn: this.$store.state.installer.adminfqdn
        }
    },

    methods: {
        triggerValidation() {
            var isValid = false;

            // validates the data
            isValid = Constants.Validate_IpAddress.test(this.clusterip) &&
                this.useadminfqdn ? this.adminfqdn.length > 0 : true &&
                this.useclusterfqdn ? this.clusterfqdn.length > 0 : true

            // Store the data
            this.$store.commit(Constants.Store_UpdateIPAddresses, {
                clusterip: this.clusterip,
                useclusterfqdn: this.useclusterfqdn,
                clusterfqdn: this.clusterfqdn,
                useadminfqdn: this.useadminfqdn,
                adminfqdn: this.adminfqdn
            })

            // Notify about the change
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