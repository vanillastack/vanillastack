<template>
    <form>
        <div class="container-fluid">
            <div class="row margin-2em">
                <div class="col">
                    <h3>Nodes</h3>
                </div>
            </div>
            <div class="row margin-2em">
                <div class="col">
                    Please collect the IP-addresses, the SSH-username and the designation of your cluster nodes here.
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <p><strong>Master Nodes</strong></p>
                </div>
            </div>
            <div class="form-group" v-for="item in masters" v-bind:key="item.key">
                <div class="row">
                    <div class="col-2">
                        <label for="ip">IP-address of node</label>
                    </div>
                    <div class="col">
                        <label for="user">Username on node</label>
                    </div>
                </div>
                <div class="row">
                    <div class="col-2">
                        <input class="form-control" placeholder="0.0.0.0" name="ip" v-model="item.ip" v-on:change="item.triggerValidation()" v-on:blur="item.triggerValidation()" required="required" />
                    </div>
                    <div class="col">
                        <div class="inline-block margin-right-2em"><input class="form-control" placeholder="root" name="user" v-model="item.user" v-on:blur="item.triggerValidation()" v-on:change="item.copyUserNameChanged($event.target.value, item)" :required="item.userNameRequired" :disabled="item.copyUser && item.isNotFirst" /></div>
                        <div class="custom-control custom-switch inline-block" v-if="item.isNotFirst">
                            <input class="custom-control-input" :id="item.key" :name="item.key" type="checkbox" v-model="item.copyUser" v-on:click="item.copyUserChanged(item)">
                            <label class="custom-control-label" :for="item.key">
                                Use master value
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row margin-2em"></div>
            <div class="row">
                <div class="col">
                    <p><strong>Worker Nodes</strong></p>
                </div>
            </div>
            <div v-if="hasApplications" class="row">
                <div class="col">
                    <p>Please assign applications to worker nodes. The following conditions must be met:</p>
                    <ul>
                        <li v-if="installRook">3 worker nodes for Rook</li>
                        <li v-if="installOpenStack">4 worker nodes for OpenStack</li>
                        <li v-if="installCF">3 worker nodes for Cloud Foundry</li>
                    </ul>
                    <p v-if="hasMultipleApplications"><em>Note: You can assign multiple applications to a worker node.</em></p>
                </div>
            </div>
            <div class="form-group" v-for="item in workers" :key="item.key">
                <div class="row">
                    <div class="col-2">
                        <label for="ip">IP-address of node</label>
                    </div>
                    <div class="col">
                        <label for="user">Username on node</label>
                    </div>
                    <div class="col">
                        <label for="user" v-if="hasApplications">Application usage on node</label>
                    </div>
                </div>
                <div class="row">
                    <div class="col-2">
                        <input class="form-control" placeholder="0.0.0.0" name="ip" v-on:change="item.triggerValidation()" v-on:blur="item.triggerValidation()" v-model="item.ip" required="required" />
                    </div>
                    <div class="col">
                        <div class="inline-block margin-right-2em"><input class="form-control" placeholder="root" name="user" v-model="item.user" v-on:blur="item.triggerValidation()" v-on:change="item.copyUserNameChanged($event.target.value, item)" :required="item.userNameRequired" :disabled="item.copyUser && item.isNotFirst" /></div>
                        <div class="custom-control custom-switch inline-block" v-if="item.isNotFirst">
                            <input class="custom-control-input" :id="item.key" :name="item.key" type="checkbox" v-model="item.copyUser" v-on:click="item.copyUserChanged(item)">
                            <label class="custom-control-label" :for="item.key">
                                Use first worker's value
                            </label>
                        </div>
                    </div>
                    <div class="col" style="vertical-align:center;margin-top:.45em">
                        <div class="custom-control custom-switch" v-if="installRook">
                            <input :id="item.key_rook" class="custom-control-input" type="checkbox" v-model="item.rook" v-on:change="item.triggerValidation()">
                            <label :for="item.key_rook" class="custom-control-label">
                                Rook
                            </label>
                        </div>
                        <div class="custom-control custom-switch" v-if="installOpenStack">
                            <input :id="item.key_openstack" class="custom-control-input" type="checkbox" v-model="item.openstack" v-on:change="item.triggerValidation()">
                            <label :for="item.key_openstack" class="custom-control-label">
                                OpenStack
                            </label>
                        </div>
                        <div class="custom-control custom-switch" v-if="installCF">
                            <input :id="item.key_cf" class="custom-control-input" type="checkbox" v-model="item.cf" v-on:change="item.triggerValidation()">
                            <label :for="item.key_cf" class="custom-control-label">
                                Cloud Foundry
                            </label>
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

const LocalEvent_CopyUser = "CopyUser"
const LocalEvent_RefreshItem = "RefreshItem"
const LocalEvent_UpdateUser = "UpdateUser"
const LocalEvent_Validate = "Validate"

export default {
    name: 'Home',

    data: function() {
        return {
            accepted: this.$store.state.navigation.acceptedTerms,
            workers: [],
            masters: [],
            installRook : this.$store.state.installer.installRook,
            installCF : this.$store.state.installer.installCF,
            installOpenStack : this.$store.state.installer.installOpenStack,
            hasApplications: false,
            hasMultipleApplications: false
    }},

    mounted : function () {
        this.hasApplications = this.installRook || this.installOpenStack || this.installCF
        var appCount = 0;
        if(this.hasApplications) {
            appCount += this.installRook ? 1 : 0
            appCount += this.installOpenStack ? 1 : 0
            appCount += this.installCF ? 1 : 0
        }
        this.hasMultipleApplications = appCount > 1

        // Notify about being loaded
        EventBus.$emit(Constants.Event_NewViewLoaded, {
            allowGoForward: false
        })

        // Copy a user to a worker or master entry
        EventBus.$on(LocalEvent_CopyUser, value => {
            var list = value.isWorker ? this.workers : this.masters
            value.user = list[0].user
            value.copyUser = true

            // Force refresh
            EventBus.$emit(LocalEvent_RefreshItem, value)
        })

        EventBus.$on(LocalEvent_UpdateUser, item => {
            // Update all elements with copyUser == true
            var list = item.isWorker ? this.workers : this.masters;

            if(list.length > 1) {
                for(var i=1; i<list.length; i++) {
                    if(list[i].copyUser) {
                        list[i].user = item.user

                        EventBus.$emit(LocalEvent_RefreshItem, list[i])
                    }
                }
            }
        })

        EventBus.$on(LocalEvent_RefreshItem, item => {
            // Force refresh
            this.$set(item.isWorker ? this.workers : this.masters, item.index, item)

            // Validate data
            this.validate();
        })

        // Copy the data onto the store
        EventBus.$on(Constants.Event_PrepareNavigation, value => {
            this.$store.state.installer.workersList = this.workers
            this.$store.state.installer.mastersList = this.masters
        })

        // Trigger the validation
        EventBus.$on(LocalEvent_Validate, () => this.validate())

        // Define workers and masters
        var workers = this.$store.state.installer.workersList
        var masters = this.$store.state.installer.mastersList

        this.prepareList(workers, this.$store.state.installer.workers)
        this.prepareList(masters, this.$store.state.installer.masters)

        this.workers = this.fillList(workers, this.$store.state.installer.workersList, true)
        this.masters = this.fillList(masters, this.$store.state.installer.mastersList, false)

        // Validate the data
        this.validate();
    },

    methods: {

        prepareList: function(list, expectedSize) {
            while(list.length < expectedSize) {
                list[list.length] = {
                    index: list.length,
                    ip: '',
                    user: '',
                    rook: false,
                    cf: false,
                    openstack: false,
                    copyUser: list.length > 0
                }
            } 
        },

        fillList: function(list, listInStore, isWorkersList) {
            for(var i=0; i<listInStore.length; i++) {
                var item = listInStore[i];

                var localItem = {
                    key: (isWorkersList ? "w" : "m") + i,
                    key_cf: "cf_m_" + i,
                    key_openstack: "openstack_m_" + i,
                    key_rook: "rook_m_" + i,
                    index: i,
                    ip: item.ip,
                    user: item.user,
                    copyUser: item.copyUser,
                    isNotFirst: i > 0,
                    rook: item.rook,
                    cf: item.cf,
                    openstack: item.openstack,
                    isWorker: isWorkersList,

                    isValid: function() {
                        return this.user.length > 0 &&
                               Constants.Validate_IpAddress.test(this.ip)
                    },

                    triggerValidation: function() {
                        EventBus.$emit(LocalEvent_Validate)
                    },
                    
                    userNameRequired: function() {
                        return this.index == 0 || !copyUser
                    },

                    copyUserChanged: function(item) {
                        item.copyUser = !item.copyUser

                        if(item.copyUser) {
                            EventBus.$emit(LocalEvent_CopyUser, item)
                        } else {
                            EventBus.$emit(LocalEvent_RefreshItem, item)
                        }

                    },

                    copyUserNameChanged: function(value, item) {
                        if(item.index == 0) {
                            EventBus.$emit(LocalEvent_UpdateUser, item)
                        }
                    }
                }

                list[i] = localItem
            }

            return list
        },

        validate: function() {
            // Validate the data
            var isValid = true;
            var ipAddresses = []

            // Validate the masters
            for(var i=0; i<this.masters.length; i++) {
                var masterIsValid = this.masters[i].isValid()

                if(isValid && !masterIsValid)
                    isValid = false;

                ipAddresses[ipAddresses.length] = this.masters[i].ip
            }

            // Validate the workers
            var rookNodes = 0;
            var cfNodes = 0;
            var openStackNodes = 0;

            for(var i=0; i<this.workers.length; i++) {
                var worker = this.workers[i]
                isValid = isValid && worker.isValid();

                rookNodes += worker.rook ? 1 : 0;
                cfNodes += worker.cf ? 1 : 0;
                openStackNodes += worker.openstack ? 1 : 0;

                ipAddresses[ipAddresses.length] = worker.ip
            }

            // Check for the number of assigned nodes
            if(this.installRook) isValid = isValid && rookNodes >= 3;
            if(this.installCF) isValid = isValid && cfNodes >= 3;
            if(this.installOpenStack) isValid = isValid && openStackNodes >= 4;

            // Check for duplicate IP-addresses
            let duplicates = ipAddresses.reduce((acc,currentValue,index, array) => {
                if(array.indexOf(currentValue) != index && !acc.includes(currentValue)) 
                    acc.push(currentValue);
                return acc;
            }, []);
            isValid = isValid && duplicates.length == 0

            // Inform about the validation
            EventBus.$emit(Constants.Event_NewViewLoaded, {
                allowGoForward: isValid
            })
        }

    },

    created: function() {
        console.log("==> Created Home")

    }
}
</script>