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
            <div class="card margin-2em">
                <div class="card-header" id="masterNodesArea">
                    <h5 class="mb-0">Master Nodes</h5>
                </div>
                <div id="masterNodesAreaData" class="show" aria-labelledby="masterNodesArea">
                    <div class="card-body">
                        <span v-for="item in masters" v-bind:key="item.key">
                            <div class="row margin-1em">
                                <div class="col-1"><strong>Master {{ item.index + 1 }}</strong></div>   
                            </div>
                            <div class="row margin-2em form-group" >
                                <div class="col-2">
                                    <label for="ip">IP-address</label>
                                    <input class="form-control" v-bind:class="{ ' is-invalid' : item.ipFocused && (!item.isValidIp() || item.hasDuplicateIpAddress)}" placeholder="0.0.0.0" name="ip" v-model="item.ip" 
                                        v-on:change="item.triggerValidation('ip')" 
                                        v-on:focus="item.triggerValidation('ip')"
                                        v-on:blur="item.triggerValidation('ip')" required="required" />
                                </div>
                                <div class="col-2">
                                    <label for="user">Username</label>
                                    <div class="inline-block margin-right-2em"><input class="form-control" v-bind:class="{ ' is-invalid' : item.userFocused && !item.isValidUser()}" 
                                        placeholder="root" name="user" v-model="item.user" 
                                        v-on:blur="item.triggerValidation('user')" v-on:change="item.copyUserNameChanged($event.target.value, item)" 
                                        v-on:focus="item.triggerValidation('user')"
                                        :required="item.userNameRequired" :disabled="item.copyUser && item.isNotFirst" /></div>
                                    <div class="custom-control margin-top-0_5em custom-switch" v-if="item.isNotFirst">
                                        <input class="custom-control-input" :id="item.key" :name="item.key" type="checkbox" v-model="item.copyUser" v-on:click="item.copyUserChanged(item)">
                                        <label class="custom-control-label" :for="item.key">
                                            Same as Master 1
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </span>
                    </div>
                </div>
            </div>
            <div class="card margin-2em">
                <div class="card-header" id="workerNodesArea">
                    <h5 class="mb-0">Worker Nodes</h5>
                </div>
                <div id="workerNodesAreaData" class="show" aria-labelledby="workerNodesArea">
                    <div class="card-body">
                        <span v-for="item in workers" :key="item.key">
                            <div class="row margin-1em">
                                <div class="col-1"><strong>Worker {{ item.index + 1 }}</strong></div>   
                            </div>
                            <div class="row margin-2em form-group">
                                <div class="col-2">
                                    <label for="ip">IP-address</label>
                                    <input class="form-control" v-bind:class="{ ' is-invalid' : item.ipFocused && (!item.isValidIp() || item.hasDuplicateIpAddress) }" placeholder="0.0.0.0" name="ip" 
                                        v-on:change="item.triggerValidation('ip')" 
                                        v-on:blur="item.triggerValidation('ip')" 
                                        v-on:focus="item.triggerValidation('ip')"
                                        v-model="item.ip" required="required" />
                                </div>
                                <div class="col-2">
                                    <label for="user">Username</label>
                                    <div class="margin-right-2em"><input class="form-control" v-bind:class="{ ' is-invalid' : item.userFocused && !item.isValidUser()}" placeholder="root" name="user" 
                                        v-model="item.user" v-on:blur="item.triggerValidation('user')" 
                                        v-on:focus="item.triggerValidation('user')"
                                        v-on:change="item.copyUserNameChanged($event.target.value, item)" 
                                        :required="item.userNameRequired" :disabled="(item.copyUser && item.isNotFirst) || (item.copyMaster && item.isFirst)" /></div>
                                    <div class="margin-top-0_5em custom-control custom-switch" v-if="item.isNotFirst">
                                        <input class="custom-control-input" :id="item.key" :name="item.key" type="checkbox" v-model="item.copyUser" v-on:click="item.copyUserChanged(item)">
                                        <label class="custom-control-label" :for="item.key">
                                            Same as Worker 1
                                        </label>
                                    </div>
                                    <div class="margin-top-0_5em custom-control custom-switch" v-if="item.isFirst">
                                        <input class="custom-control-input" :id="item.key" :name="item.key" type="checkbox" v-model="item.copyMaster" v-on:click="item.copyUserChanged(item)">
                                        <label class="custom-control-label" :for="item.key">
                                            Same as Master 1
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </span>
                    </div>
                </div>
            </div>
            <div class="card margin-2em" v-if="hasApplications">
                <div class="card-header" id="workloadsArea">
                    <h5 class="mb-0">Workloads</h5>
                </div>
                <div id="workloadsAreaData" class="show" aria-labelledby="workloadsArea">
                    <div class="card-body">
                        <div class="row margin-2em" v-if="hasMultipleApplications">
                            <div class="col">
                                <i class="fas fa-info-circle gray"></i>
                                You can assign multiple applications to a worker node.
                            </div>
                        </div>
                        <div v-if="hasApplications" class="row margin-1em">
                            <div class="col">
                                <p>The following conditions must be met:</p>
                            </div>
                        </div>
                        <div v-if="hasApplications && installRook" class="row margin-1em">
                            <div class="col-3" v-bind:class="{ ' red' : !rookValid, ' green': rookValid }"><i class="fas fa-check small"></i> 3 worker nodes for Rook</div>
                        </div>
                        <div v-if="hasApplications && installOpenStack" class="row margin-1em">
                            <div class="col-3" v-bind:class="{ ' red' : !osValid, ' green': osValid }"><i class="fas fa-check small"></i> 3 worker nodes for OpenStack</div>
                        </div>
                        <div v-if="hasApplications && installCF" class="row margin-1em">
                            <div class="col-3" v-bind:class="{ ' red' : !cfValid, ' green' : cfValid }"><i class="fas fa-check small"></i> 3 worker nodes for Cloud Foundry</div>
                        </div>
                        <div class="row margin-1em"></div>
                        <div class="row margin-2em">
                            <div class="col" >
                                <a class="btn btn-primary margin-right-1em" v-if="installRook" role="button" v-on:click="setRook()">Assign <strong>Rook</strong> to all workers</a>
                                <a class="btn btn-primary margin-right-1em" v-if="installOpenStack" role="button" v-on:click="setOS()">Assign <strong>OpenStack</strong> to all workers</a>
                                <a class="btn btn-primary margin-right-1em" v-if="installCF" role="button" v-on:click="setCF()">Assign <strong>Cloud Foundry</strong> to all workers</a>
                            </div>
                        </div>
                        <div class="row margin-1em"></div>
                        <span v-for="item in workers" :key="item.key">
                            <div class="row margin-2em form-group">
                                <div class="col-2">
                                    <label for="ip">Worker {{ item.index + 1 }}</label>
                                </div>
                                <div class="col">
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
                        </span>
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
            rookValid: true,
            cfValid: true,
            osValid: true
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

        let validator = {
            set: function(obj, prop, value) {
                if((prop === 'ip' || prop === 'user' || prop === 'rook' || prop === 'cf' || prop === 'openstack') && obj[prop] !== value) {
                    Object.defineProperty(obj, "_isDirty", {value: true}); // Flag
                }

                return Reflect.set(...arguments); // Forward trapped args to ob
            }
        }

        var workers = this.fillList(workers, this.$store.state.installer.general.workersList, true)
        this.workers = workers.map(worker => new Proxy(worker, validator));

        var masters = this.fillList(masters, this.$store.state.installer.general.mastersList, false)
        this.masters = masters.map(master => new Proxy(master, validator));

        // Validate the data
        this.validate();
    },

    beforeRouteLeave (to, from, next) {
        // Store the state of the data
        this.$store.commit(Constants.Store_UpdateWorkers, this.workers)
        this.$store.commit(Constants.Store_UpdateMasters, this.masters)

        // Check, whether some data has been changed
        if(this.workers.some(item => item._isDirty !== undefined && item._isDirty === true) || this.masters.some(item => item._isDirty !== undefined && item._isDirty === true)) {
            console.log("+++ LIST IS DIRTY +++")
            this.$store.commit(Constants.Store_NodesChecked, false)
        }

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
                    ipFocused: false,
                    userFocused: false,
                    hasDuplicateIpAddress: false,

                    isValid: function() {
                        return this.isValidUser() && this.isValidIp()
                    },

                    isValidUser: function() {
                        return this.user.length > 0
                    },

                    isValidIp: function() {
                        return Constants.Validate_IpAddress.test(this.ip) 
                    },

                    triggerValidation: function(field) {
                        if(field == 'ip')
                            this.ipFocused = true 
                        if(field == 'user')
                            this.userFocused = true

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

                master.hasDuplicateIpAddress = master.ip.length > 0 && ipAddresses.some(ip => master.ip === ip);
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

                worker.hasDuplicateIpAddress = worker.ip.length > 0 && ipAddresses.some(ip => worker.ip === ip);
                ipAddresses[ipAddresses.length] = worker.ip

            })

            // Check for the number of assigned nodes
            this.rookValid = rookNodes >= 3
            this.cfValid = cfNodes >= 3
            this.osValid = openStackNodes >= 3

            if(this.installRook) isValid = isValid && this.rookValid;
            if(this.installCF) isValid = isValid && this.cfValid;
            if(this.installOpenStack) isValid = isValid && this.osValid;

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

            this.validate()
        },

        setCF: function() {
            // Activate Rook on all Workers
            this.workers.forEach(worker => worker.cf = true)

            this.validate()
        },

        setOS: function() {
            // Activate Rook on all Workers
            this.workers.forEach(worker => worker.openstack = true)

            this.validate()
        }

    },

    created: function() {
    }
}
</script>