<template>
    <form>
        <div class="container-fluid">
            <div class="row margin-2em">
                <div class="col">
                    <h3>Cluster-Settings</h3>
                </div>
            </div>
            <div class="row margin-2em">
                <div class="col">
                    Here you define the IP-addresses of your cluster and the associated Domain names.<br />
                    The IP-address is required for making the cluster available on your network - and it is not equal to one of the nodes IP-addresses.<br />
                    Domain names are optional. They allow separating access to the cluster workloads from access to the VanillaStack AppStore.
                    <p><em>Note: It is highly recommended to define a separate Domain name for AppStore, e.g. admin.&lt;your-cluster&gt;, otherwise access is restricted to a kubctl-Tunnel!</em></p>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <p><strong>LoadBalancer</strong></p>
                </div>
            </div>
            <div class="form-group row margin-2em">
                <div class="col">
                    <p v-if="useExternalLb">LoadBalancer-Address / IP</p>
                    <p v-if="!useExternalLb">IP-address of the cluster</p>
                    <div class="inline-block margin-right-2em">
                        <input class="form-control" placeholder="0.0.0.0" name="externalLbIp" v-model="externalLbIp" 
                            v-on:change="triggerValidation()" v-on:blur="triggerValidation()" v-if="useExternalLb"
                            :disabled="!useExternalLb"
                            required="required" />
                        <input class="form-control" placeholder="0.0.0.0" name="clusterip" v-model="clusterip" 
                            v-on:change="triggerValidation()" v-on:blur="triggerValidation()" 
                            required="required" v-if="!useExternalLb" />
                    </div>
                    <div class="custom-control custom-switch inline-block">
                    <input class="custom-control-input" id="useExternalLb" name="useExternalLb" type="checkbox" v-model="useExternalLb" v-on:change="triggerValidation()">
                    <label class="custom-control-label" for="useExternalLb">
                        Use External LoadBalancer
                    </label>
                </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <p><strong>Cluster Domain-Name</strong></p>
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
            clusterip: this.$store.state.installer.cluster.ip,
            useclusterfqdn: this.$store.state.installer.cluster.usefqdn,
            clusterfqdn: this.$store.state.installer.cluster.fqdn,
            useadminfqdn: this.$store.state.installer.cluster.useadminfqdn,
            adminfqdn: this.$store.state.installer.cluster.adminfqdn,
            externalLbIp: this.$store.state.installer.cluster.externalLbIp,
            useExternalLb: this.$store.state.installer.cluster.useExternalLb
        }
    },

    methods: {
        triggerValidation() {
            var isValid = false;

            if(this.clusterfqdn.length > 0 && this.adminfqdn.length == 0) 
                this.adminfqdn = "admin." + this.clusterfqdn

            // validates the data
            isValid =  
                (this.useadminfqdn ? this.adminfqdn.length > 0 : true) &&
                (this.useclusterfqdn ? this.clusterfqdn.length > 0 : true) &&
                (this.useExternalLb ? this.externalLbIp.length > 0 : Constants.Validate_IpAddress.test(this.clusterip))

            // Store the data
            this.$store.commit(Constants.Store_ClusterUpdateData, {
                ip: this.clusterip,
                usefqdn: this.useclusterfqdn,
                fqdn: this.clusterfqdn,
                useadminfqdn: this.useadminfqdn,
                adminfqdn: this.adminfqdn,
                useExternalLb: this.useExternalLb,
                externalLbIp: this.useExternalLb
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