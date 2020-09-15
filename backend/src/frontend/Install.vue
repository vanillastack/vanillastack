<template>
    <div class="container-fluid">
        <div class="row margin-2em ">
            <div class="col">
                <h3 v-if="!installed">VanillaStack is installing!</h3>
                <h3 v-if="installed">VanillaStack is installed!</h3>
            </div>
        </div>
        <div class="row margin-2em" v-if="installed">
            <div class="col">
                <h5>Congratulations!</h5>
                <p>You may now use your newly installed VanillaStack Cluster!</p>
                <p>To access your installed components via their Web-UIs, you can use their respective DNS-Names</p>
                <p>Enjoy your VanillaStack!</p>
            </div>
        </div>
        <div class="row margin-2em" v-if="installed">
            <div class="col-1" v-if="isDryRun"><a class="btn btn-small btn-success" v-on:click="startInstallation()">Restart</a></div>
        </div>
        <div class="row" v-if="installed">
            <div class="col"><pre style="width: 100%; overflow: hidden !important" class="pre-install" id="logs">{{ display }}</pre></div>
        </div>
        <div class="row margin-2em" v-if="installing">
            <div class="col">
                Here you can find all the output from the installation process.
            </div>
        </div>
        <div class="row margin-2em" style="width; 80%; position: absolute; top: 5em; left: 2em; height: 30em; margin-top:2em; padding-bottom: 5em; overflow: auto !important" v-if="installing">
            <div class="col" style="width: 100%;"><pre style="width: 100%; overflow: hidden !important" class="pre-install" id="list">{{ display }}</pre></div>
        </div>
    </div>
</template>
<script>
import Constants from './js/constants.js'
import EventBus from './js/eventBus.js'

export default {
    name: 'install',

    data: function() {
        return {
            transactionId: '',
            display: 'Installation started...',
            installing: false,
            installed: false,
            kubeconfig: '',
            isDryRun: window.location.search.indexOf('dry=true') > 0,
        }
    },

    methods: {

        startInstallation: function() {
            this.display = ''
            this.showLog = false

            var payload = this.generateCall()
            payload.uuid = this.$store.state.base.uuid

            console.log("DATA", this.generateCall())
            console.log("DATA-TXT", JSON.stringify(this.generateCall()))

            this.$network.setup(payload)
        },

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

        generateCall: function() {
            var nodes = []

            this.$store.state.installer.general.mastersList.forEach(
                node => this.transformNode(nodes, node, false, true))
            this.$store.state.installer.general.workersList.forEach(
                node => this.transformNode(nodes, node, true, true))

            var data = {
                isHA: this.$store.state.installer.general.isHA,
                general: {
                    installRook: this.$store.state.installer.general.installRook,
                    installCF: this.$store.state.installer.general.installCF,
                    installOS: this.$store.state.installer.general.installOpenStack,
                    harborKey: this.$store.state.base.key
                },
                nodes: nodes,
                cluster: JSON.parse(JSON.stringify(this.$store.state.installer.cluster)),
                rook: JSON.parse(JSON.stringify(this.$store.state.installer.rook)),
                openstack: JSON.parse(JSON.stringify(this.$store.state.installer.openstack)),
                cf: JSON.parse(JSON.stringify(this.$store.state.installer.cloudfoundry)),
                additional: JSON.parse(JSON.stringify(this.$store.state.installer.additional)),
                letsencrypt: JSON.parse(JSON.stringify(this.$store.state.installer.letsencrypt))
            }

            return data
        },

    },

    mounted : function () {

        // Notify about being loaded
        EventBus.$emit(Constants.Event_NewViewLoaded, {
            allowGoForward: true
        })

        // Start the installation
        this.startInstallation()
    },

    created: function() {
        EventBus.$on(Constants.Network_InstallationInProgress, data => {
            console.log("RECEIVED TRANSACTION-ID", data.transactionId)
            this.installing = true
            this.installed = false
            this.transactionId = data.transactionId
        })

        EventBus.$on(Constants.Network_WS_Response, message => {
            var data = JSON.parse(message)

            // Process only data to be displayed for this transaction-id
            // console.log(this.transactionId, data.transactionId, data)

            if(data.transactionId == this.transactionId) {
                if(data.event == 'EXECUTION' || data.event == 'EXEC') {
                    this.installing = true
                    this.installed = false

                    var message = data.payload

                    var list = document.getElementById('list')
                    this.display += message
                    //list.body.innerHTML += message
                    list.scrollIntoView(false)
                }

                if(data.event == 'DONE') {
                    // Installation is done
                    this.installing = false
                    this.installed = true
                }
            }
        })
    }
}
</script>