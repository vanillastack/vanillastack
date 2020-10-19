<template>
    <div class="container-fluid">
        <div class="row margin-2em ">
            <div class="col">
                <h3 v-if="!installed">VanillaStack is installing!</h3>
                <h3 v-if="installed">VanillaStack is installed!</h3>
            </div>
        </div>
        <div class="row margin-2em" v-if="installed && !installationError">
            <div class="col">
                <h5>Congratulations!</h5>
                You may now use your newly installed VanillaStack Cluster!<br />
                To access your installed components via their Web-UIs, you can use their respective DNS-Names
            </div>
        </div>
        <div class="row margin-1em" v-if="installed && isOpenStack && !installationError">
            <div class="col-5">
                <p><strong>OpenStack Password</strong></p>
                To access your OpenStack-installation, please use the default password</div>
            <div class="col"><pre>{{ keystonePass }}</pre></div>
        </div>
        <div class="row margin-1em" v-if="installed && isCloudFoundry && !installationError">
            <div class="col-5">
                <p><strong>Cloud Foundry Password</strong></p>
                To access your CloudFoundry-installation, please use the default password</div>
            <div class="col"><pre>{{ stratosPass }}</pre></div>
        </div>
        <div class="row margin-1em" v-if="installed && !installationError">
            <div class="col">
                <p><strong>kubectl Config</strong></p>
                To access your Kubernetes-Cluster via the <em>kubectl</em> command line tool, please press the button <em>Download Config</em> to download the config.
            </div>
        </div>
        <div class="row margin-2em" v-if="installed && !installationError">
            <div class="col">
                <a class="btn btn-primary margin-right-1em" role="button" 
                    v-on:click="downloadConfig()">Download Config</a></div>
        </div>
         <div class="row margin-2em" v-if="installed && !installationError">
            <div class="col">
                <p><strong>Enjoy your VanillaStack!</strong></p>
                For your reference, the full log output is available after you pressed the button <em>Show Logs</em>
            </div>
        </div>
        <div class="row margin-2em" v-if="installed && !installationError">
            <div class="col"><a v-if="isDryRun" class="btn btn-small btn-primary margin-right-1em" v-on:click="startInstallation()">Restart</a>
                <a class="btn btn-small btn-primary margin-right-1em" v-on:click="showLog = !showLog">Show Logs</a>
                <a class="btn btn-small btn-primary margin-right-1em" v-on:click="downloadLogs()">Download Logs</a></div>
        </div>
        <div class="row" v-if="installed && showLog && !installationError">
            <div class="col"><pre style="width: 100%; overflow: hidden !important" class="pre-install" id="logs">{{ display }}</pre></div>
        </div>
        <div class="row margin-2em" v-if="installing">
            <div class="col">
                Here you can find all the output from the installation process. Now is a good time to enjoy your coffee or tea!
            </div>
        </div>
        <div class="row margin-2em" v-if="installed  && installationError">
            <div class="col">
                <p><strong class="red">VanillaStack installation failed</strong></p>
                Your installation failed. For your reference, the full log output is available below. Please correct the errors depicted and try again.
            </div>
        </div>
        <div class="row margin-2em" v-if="installed && installationError">
            <div class="col">
                <a class="btn btn-small btn-primary margin-right-1em" v-on:click="startInstallation()">Retry</a>
                <a class="btn btn-small btn-primary margin-right-1em" v-on:click="downloadLogs()">Download Logs</a></div>
        </div>
        <div class="row margin-2em">
            <div class="col" v-if="installing">
                <textarea class="form-control" id="output" style="width:100%; border: 0 !important; font-family: Courier, monospace !important" v-model="display" />
            </div>
        </div>
    </div>
</template>
<script>
import Constants from './js/constants.js'
import EventBus from './js/eventBus.js'
import Globals from './js/globals'

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
            keystonePass: '',
            stratosPass: '',
            isOpenStack: false,
            isCloudFoundry: false,
            showLog: false,
            installationError: false,
            log: []
        }
    },

    methods: {

        startInstallation: function() {
            this.display = ''
            this.showLog = false
            this.installationError = false
            this.log = []

            var payload = this.generateCall()
            payload.uuid = this.$store.state.base.uuid

            console.log("UUID", payload.uuid)
            console.log("PAYLOAD", payload)

            this.$network.setup(payload)
        },

        downloadLogs: function() {
            // Define the ID
            var uuid = 'logs_' + this.$store.state.base.uuid

            // Create the element
            var download = this.createDownloadElement(uuid, 'text/plain', this.transactionId + '.log', 
                this.log.join(''))
            
            // Execute the download
            download.click()

            // Remove the element
            document.body.removeChild(download)

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

        downloadConfig: function() {
            this.$network.downloadConfig(this.$store.state.base.uuid)
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
                    harborUser: this.$store.state.base.key,
                    harborKey: this.$store.state.base.password
                    },
                nodes: nodes,
                cluster: JSON.parse(JSON.stringify(this.$store.state.installer.cluster)),
                rook: JSON.parse(JSON.stringify(this.$store.state.installer.rook)),
                openstack: JSON.parse(JSON.stringify(this.$store.state.installer.openstack)),
                cf: JSON.parse(JSON.stringify(this.$store.state.installer.cloudfoundry)),
                additional: JSON.parse(JSON.stringify(this.$store.state.installer.additional)),
                letsencrypt: JSON.parse(JSON.stringify(this.$store.state.installer.letsencrypt)),
                //key: this.$store.state.base.key
            }

            // Handle the stratos installation properly 
            if(!data.general.installCF)
                data.cf.stratos = false

            // Complimentary data
            var complimentary = this.$store.state.installer.complimentary;
            data.additional.polyverse = {}
            data.additional.polyverse.enable = complimentary.polyverse
            data.additional.polyverse.key = complimentary.polyverseKey

            // Special handling for OpenStack Domain
            data.openstack.domain += '.' + this.$store.state.installer.cluster.fqdn

            this.isOpenStack = data.general.installOS
            this.isCloudFoundry = data.general.installCF

            if(Globals.verbose) {
                console.log('+++ Data +++', data)
            }
            
            return data
        },

        getOffset: function( el ) {
            var _x = 0;
            var _y = 0;
            while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
                _x += el.offsetLeft - el.scrollLeft;
                _y += el.offsetTop - el.scrollTop;
                el = el.offsetParent;
            }
            return { top: _y, left: _x };
        },

        htmlEncode: function(str) {
        return str
            .replace(/&/g, '&')
            .replace(/'/g, "'")
            .replace(/"/g, '"')
            .replace(/>/g, '>')   
            .replace(/</g, '<');    
        },

        showNetworkError: function(message) {
            this.installing = false
            this.installed = false 
            this.installationError = true
            this.display += message
        },

        createDownloadElement: function(id, contentType, fileName, content) {
            // Create a virtual download-element
            var uuid = id

            // Check, whether the element already exists
            var download = document.getElementById(uuid)
            if(download != null) {
                document.body.removeChild(download)
            }

            download = document.createElement('a')
            download.setAttribute('id', uuid)
            download.style.display = 'none'
            document.body.appendChild(download)

            // Set the data
            download.setAttribute('href', 'data:' + contentType + ';charset=utf-8,' + encodeURIComponent(content))
            download.setAttribute('download', fileName)

            return download
        },

        showLogMessage: function(data) {
            if(!this.setListAttributes) {
                var output = document.getElementById('output')

                if(null != output) {
                    // Get the position of the output window
                    var offset = this.getOffset(output)

                    // Get the visible width and height of the browser window
                    var width = window.innerWidth
                    var height = window.innerHeight

                    var outputWidth = width - 30 - offset.left
                    var outputHeight = height - 50 - offset.top

                    output.setAttribute("style","height:" + outputHeight + "px")

                    this.setListAttributes = true
                }
            }

            this.log[this.log.length] = data.payload

            var message = this.htmlEncode(data.payload)
            this.display += message
            
            //list.body.innerHTML += messagevar 
            var list = document.getElementById('output')

            if(null != list)
                list.scrollTop = list.scrollHeight;
        }

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
            if(Globals.verbose) {
                console.log('+++ InstallationInProgress +++', data)
            }

            if(data.state == Constants.Network_State_Progress) {
                this.installing = true
                this.installed = false
                this.transactionId = data.transactionId
                this.keystonePass = data.keystonePass
                this.stratosPass = data.stratosPass
                this.setListAttributes = false
            } else if(data.state == Constants.Network_State_Error) {

                console.log("ERROR", data.message)
                this.showNetworkError(data.message)
                this.installationError = true
            }
        })

        EventBus.$on(Constants.Network_WS_Response, message => {
            if(Globals.verbose) {
                console.log('+++ WS +++', message)
            }

            var data = JSON.parse(message)

            // Process only data to be displayed for this transaction-id
            // console.log(this.transactionId, data.transactionId, data)

            if(data.transactionId == this.transactionId) {
                if(data.event == 'EXECUTION' || data.event == 'EXEC') {
                    this.installing = true
                    this.installed = false

                    this.showLogMessage(data)
                }

                if(data.event == 'ERROR') {
                    this.installationError = true
                    this.installing = false
                    this.installed = true

                    this.showLogMessage(data)
                }

                if(data.event == 'DONE') {
                    // Installation is done
                    this.installing = false
                    this.installed = true
                }
            }
        })

        // Kubeconfig was loaded, we allow to download it
        EventBus.$on(Constants.Network_KubeConfigLoaded, data => {
            // Define the ID
            var uuid = 'download_' + this.$store.state.base.uuid

            // Create the element
            var download = this.createDownloadElement(
                uuid, 'text/plain', this.$store.state.installer.cluster.fqdn.replace('.', '_') + '.config', data)
            
            // Execute the download
            download.click()

            // Remove the element
            document.body.removeChild(download)
        })
    }
}
</script>