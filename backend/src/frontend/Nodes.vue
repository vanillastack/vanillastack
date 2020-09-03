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
            <div class="row margin-2em">
                <div class="col">
                    <p><strong>Master Nodes</strong></p>
                </div>
            </div>
            <div class="form-group" v-for="master in masters" v-bind:key="master.key">
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
                        <input class="form-control" placeholder="0.0.0.0" name="ip" v-model="master.ip" required="required" />
                    </div>
                    <div class="col">
                        <div class="inline-block margin-right-2em"><input class="form-control" placeholder="root" name="user" v-model="master.user" v-on:change="master.copyUserNameChanged($event.target.value, master)" :required="master.userNameRequired" :disabled="master.copyUser && master.isNotFirst" /></div>
                        <div class="custom-control custom-switch inline-block" v-if="master.isNotFirst">
                            <input class="custom-control-input" :id="master.key" :name="master.key" type="checkbox" v-model="master.copyUser" v-on:click="master.copyUserChanged(master)">
                            <label class="custom-control-label" :for="master.key">
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
            <div class="form-group" v-for="master in workers" :key="master.key">
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
                        <input class="form-control" placeholder="0.0.0.0" name="ip" v-model="master.ip" required="required" />
                    </div>
                    <div class="col-4">
                        <div class="inline-block margin-right-2em"><input class="form-control" placeholder="root" name="user" v-model="master.user" v-on:change="master.copyUserNameChanged($event.target.value, master)" :required="master.userNameRequired" :disabled="master.copyUser && master.isNotFirst" /></div>
                        <div class="custom-control custom-switch inline-block" v-if="master.isNotFirst">
                            <input class="custom-control-input" :id="master.key" :name="master.key" type="checkbox" v-model="master.copyUser" v-on:click="master.copyUserChanged(master)">
                            <label class="custom-control-label" :for="master.key">
                                Use first worker's value
                            </label>
                        </div>
                    </div>
                    <div class="col">
                        <div class="custom-control custom-switch" v-if="installRook">
                            <input :id="master.key_rook" class="custom-control-input" type="checkbox" v-model="master.rook">
                            <label :for="master.key_rook" class="custom-control-label">
                                Rook
                            </label>
                        </div>
                        <div class="custom-control custom-switch" v-if="installOpenStack">
                            <input :id="master.key_openstack" class="custom-control-input" type="checkbox" v-model="master.openstack">
                            <label :for="master.key_openstack" class="custom-control-label">
                                OpenStack
                            </label>
                        </div>
                        <div class="custom-control custom-switch" v-if="installCF">
                            <input :id="master.key_cf" class="custom-control-input" type="checkbox" v-model="master.cf">
                            <label :for="master.key_cf" class="custom-control-label">
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

export default {
    name: 'Home',

    data: function() {
        return {
            accepted: this.$store.state.navigation.acceptedTerms,
            workers: [],
            masters: [],
            installRook : this.$store.state.installer.installRook,
            installCF : this.$store.state.installer.installCF,
            installOpenStack : this.$store.state.installer.installOpenStack
    }},

    mounted : function () {
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
        })

        // Copy the data onto the store
        EventBus.$on(Constants.Event_PrepareNavigation, value => {
            this.$store.state.installer.workersList = this.workers
            this.$store.state.installer.mastersList = this.masters
        })

        // Define workers and masters
        var workers = this.$store.state.installer.workersList
        var masters = this.$store.state.installer.mastersList

        this.prepareList(workers, this.$store.state.installer.workers)
        this.prepareList(masters, this.$store.state.installer.masters)

        this.workers = this.fillList(workers, this.$store.state.installer.workersList, true)
        this.masters = this.fillList(masters, this.$store.state.installer.mastersList, false)
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

                        console.log(value, item)
                    }
                }

                list[i] = localItem
            }

            return list
        },

        copyUserChanged: function(e) {
                    console.log(e);
                }

    },

    created: function() {
        console.log("==> Created Home")

    }
}
</script>