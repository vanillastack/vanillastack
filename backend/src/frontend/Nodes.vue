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
                                Use first master's value
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
            <div v-if="hasApplications" class="row margin-1em">
                <div class="col">
                    <p>Please assign applications to worker nodes. The following conditions must be met:</p>
                </div>
            </div>
            <div v-if="hasApplications && installRook" class="row margin-1em">
                <div class="col-3"><i class="fas fa-check small"></i> 3 worker nodes for Rook</div>
                <div class="col-3"><a class="btn btn-sm btn-primary margin-left-3em" role="button" v-on:click="setRook()">Assign to all workers</a></div>
            </div>
            <div v-if="hasApplications && installOpenStack" class="row margin-1em">
                <div class="col-3"><i class="fas fa-check small"></i> 4 worker nodes for OpenStack</div>
                <div class="col-3"><a class="btn btn-sm btn-primary margin-left-3em" role="button" v-on:click="setOS()">Assign to all workers</a></div>
            </div>
            <div v-if="hasApplications && installCF" class="row margin-1em">
                <div class="col-3"><i class="fas fa-check small"></i> 3 worker nodes for Cloud Foundry</div>
                <div class="col-3"><a class="btn btn-sm btn-primary margin-left-3em" role="button" v-on:click="setCF()">Assign to all workers</a></div>
            </div>
            <div class="row margin-2em" v-if="hasMultipleApplications">
                <div class="col">
                    <em>Note: You can assign multiple applications to a worker node.</em>
                </div>
            </div>
            <div class="form-group" v-for="item in workers" :key="item.key">
                <div class="row">
                    <div class="col-2">
                        <label for="ip">IP-address of node</label>
                    </div>
                    <div class="col-6">
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
                    <div class="col-6">
                        <div class="inline-block margin-right-2em"><input class="form-control" placeholder="root" name="user" v-model="item.user" v-on:blur="item.triggerValidation()" v-on:change="item.copyUserNameChanged($event.target.value, item)" :required="item.userNameRequired" :disabled="(item.copyUser && item.isNotFirst) || (item.copyMaster && item.isFirst)" /></div>
                        <div class="custom-control custom-switch inline-block" v-if="item.isNotFirst">
                            <input class="custom-control-input" :id="item.key" :name="item.key" type="checkbox" v-model="item.copyUser" v-on:click="item.copyUserChanged(item)">
                            <label class="custom-control-label" :for="item.key">
                                Use first worker's value
                            </label>
                        </div>
                        <div class="custom-control custom-switch inline-block" v-if="item.isFirst">
                            <input class="custom-control-input" :id="item.key" :name="item.key" type="checkbox" v-model="item.copyMaster" v-on:click="item.copyUserChanged(item)">
                            <label class="custom-control-label" :for="item.key">
                                Use first master's value
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
import Globals from './js/globals'

const LocalEvent_CopyUser = "CopyUser"
const LocalEvent_RefreshItem = "RefreshItem"
const LocalEvent_UpdateUser = "UpdateUser"
const LocalEvent_Validate = "Validate"
const LocalEvent_ValidateNode = "ValidateNode"

export default {
    name: 'nodes',

    data: function() {
        return {
            accepted: this.$store.state.navigation.acceptedTerms,
            workers: [],
            masters: [],
            installRook : this.$store.state.installer.general.installRook,
            installCF : this.$store.state.installer.general.installCF,
            installOpenStack : this.$store.state.installer.general.installOpenStack,
            hasApplications: false,
            hasMultipleApplications: false,
    }},

    mounted : function () {
        this.hasApplications = this.installRook || this.installOpenStack || this.installCF

        this.validate()

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
            if(value.isWorker && value.isFirst) {
                list = this.masters
            }

            value.user = list[0].user
            value.copyUser = true

            if(value.isWorker && value.isFirst) {
                value.copyMaster = true
            }

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

            // Special check for the workers
            if(!item.isWorker && item.isFirst) {
                if(this.workers[0].copyMaster) {
                    this.workers.forEach(worker => {
                        if((worker.isNotFirst && worker.copyUser) || (worker.isFirst && worker.copyMaster))
                            worker.user = item.user
                    })
                }
            }
        })

        EventBus.$on(LocalEvent_RefreshItem, item => {
            // Store the data
            this.$store.commit(Constants.Store_UpdateWorkers, this.workers)
            this.$store.commit(Constants.Store_UpdateMasters, this.masters)

            // Validate data
            this.validate()
        })

        // Trigger the validation
        EventBus.$on(LocalEvent_Validate, () => this.validate())

        // Define workers and masters
        var workers = new Array(this.$store.state.installer.general.workers)
        var masters = new Array(this.$store.state.installer.general.masters)

        this.prepareList(workers)
        this.prepareList(masters)

        this.workers = this.fillList(workers, this.$store.state.installer.general.workersList, true)
        this.masters = this.fillList(masters, this.$store.state.installer.general.mastersList, false)

        // Validate the data
        this.validate();
    },

    beforeRouteLeave (to, from, next) {
        // Store the state of the data
        this.$store.commit(Constants.Store_UpdateWorkers, this.workers)
        this.$store.commit(Constants.Store_UpdateMasters, this.masters)

        next()
    },

    methods: {

        prepareList: function(list) {
            for(var i=0; i<list.length; i++) {
                list[i] = {
                    index: i,
                    ip: '',
                    user: '',
                    rook: false,
                    cf: false,
                    openstack: false,
                    copyUser: i > 0,
                    copyMaster: i == 0,
                    rookChecked: false
                }
            } 
        },

        fillList: function(list, listInStore, isWorkersList) {
            for(var i=0; i<list.length; i++) {
                var item = listInStore.length > i ? listInStore[i] : list[i];
                item = JSON.parse(JSON.stringify(item))

                var localItem = {
                    key: (isWorkersList ? "w" : "m") + i,
                    key_cf: "cf_m_" + i,
                    key_openstack: "openstack_m_" + i,
                    key_rook: "rook_m_" + i,
                    index: i,
                    ip: item.ip,
                    user: item.user,
                    copyUser: item.copyUser,
                    copyMaster: item.copyMaster,
                    isNotFirst: i > 0,
                    isFirst: i == 0,
                    rook: item.rook,
                    cf: item.cf,
                    openstack: item.openstack,
                    isWorker: isWorkersList,
                    rookChecked: item.rookChecked,

                    isValid: function() {
                        var isValidLocally =
                            this.user.length > 0 &&
                               Constants.Validate_IpAddress.test(this.ip)

                        return isValidLocally
                    },

                    triggerValidation: function() {
                        EventBus.$emit(LocalEvent_Validate)
                    },
                    
                    userNameRequired: function() {
                        return this.index == 0 || !copyUser
                    },

                    copyUserChanged: function(item) {
                        if(item.isNotFirst) {
                            item.copyUser = !item.copyUser
                        } else {
                            item.copyMaster = !item.copyMaster
                        }

                        if(item.copyUser || item.copyMaster) {
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
            this.masters.forEach(master =>  {
                // Ensure, a name is set
                this.ensureNameIsSet(master)

                var masterIsValid = master.isValid()

                if(!masterIsValid)
                    isValid = false

                ipAddresses[ipAddresses.length] = master.ip
            })

            // Validate the workers
            var rookNodes = 0;
            var cfNodes = 0;
            var openStackNodes = 0;

            this.workers.forEach(worker => {
                // Ensure, a name is set
                this.ensureNameIsSet(worker)

                var workerIsValid = worker.isValid();

                if(!workerIsValid)
                    isValid = false 

                rookNodes += worker.rook ? 1 : 0;
                cfNodes += worker.cf ? 1 : 0;
                openStackNodes += worker.openstack ? 1 : 0;

                ipAddresses[ipAddresses.length] = worker.ip
            })

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

            // Inform about the state
            EventBus.$emit(Constants.Event_NodesValidated, isValid)

            // Inform about the validation
            EventBus.$emit(Constants.Event_NewViewLoaded, {
                allowGoForward: isValid
            })
        },

        ensureNameIsSet: function(item) {
            // Check, if it is an item who is supposed to copy his name from the first item
            if(item.index > 0 && item.copyUser) {
                // Reference the first worker
                var firstItem = item.isWorker ? this.workers[0] : this.masters[0]

                // Ensure the name is set
                this.ensureNameIsSet(firstItem)

                // Set the name
                item.user = firstItem.user
            }

            // Handle the first worker
            if(item.index == 0 && item.isWorker && item.copyMaster) {
                // Get the first item
                var firstItem = this.masters[0]

                // Ensure the name is set
                this.ensureNameIsSet(firstItem)

                // Set the name
                item.user = firstItem.user
            }
        },

        setRook: function() {
            // Activate Rook on all Workers
            this.workers.forEach(worker => worker.rook = true)
        },

        setCF: function() {
            // Activate Rook on all Workers
            this.workers.forEach(worker => worker.cf = true)
        },

        setOS: function() {
            // Activate Rook on all Workers
            this.workers.forEach(worker => worker.openstack = true)
        }

    },

    created: function() {
    }
}
</script>