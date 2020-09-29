import Vue from 'vue'
import VueResource from 'vue-resource'
import Constants from './constants'
import EventBus from './eventBus'

Vue.use(VueResource)

const LocalEvent_LoadedInfoData = "Network_LocalEvent_LoadedInfoData"
var ___vue 

const Network = {

    install: function(Vue, options) {
        Vue.prototype.$network = {

            data: function() {
                return {
                    host,
                    port,
                    protocol,
                    addressPrefix,
                    dryRun,
                    __vue,
                    __ws
                }
            },

            getInfo : function() {
                const path = this.data.addressPrefix + "/info"
                console.log("INFO CALL", path)
        
                this.data.__vue.http.get(path).then(response => {
                    var loadedData = {
                        sshKey : response.body.sshPublicKey,
                        mode : response.body.mode,
                        uuid : response.body.uuid
                    }

                    EventBus.$emit(Constants.Network_LoadedInfo, loadedData)
                })
            },

            validateNodes: function(nodes, uuid) {
                const path = this.data.addressPrefix + "/connection"
                var payload = {
                    uuid: uuid,
                    dry: this.data.dryRun,
                    nodes: nodes
                }

                this.data.__vue.http.post(path, payload).then(response => {
                    EventBus.$emit(Constants.Network_CheckingNodes, {
                        transactionId: response.body.transactionId
                    })
                })
            },

            setup: function(data) {
                // Indicate, whether a dry-run takes place
                data.dry = this.data.dryRun

                // Do the call
                const path = this.data.addressPrefix + "/setup"
                this.data.__vue.http.post(path, data).then(response => {
                    // console.log("SETUP", response.body)

                    EventBus.$emit(Constants.Network_InstallationInProgress, {
                        state: Constants.Network_State_Progress,
                        keystonePass: response.body.keyStonePass,
                        stratosPass: response.body.stratosPass,
                        transactionId: response.body.transactionId
                    }, error => {
                        EventBus.$emit(Constants.Network.Network_InstallationInProgress, {
                            state: Constants.Network_State_Error,
                            message: error.message
                        })
                    })
                })
            },

            downloadConfig: function(uuid) {
                const path = this.data.addressPrefix + "/config/" + uuid
                this.data.__vue.http.get(path).then(response => {

                    EventBus.$emit(Constants.Network_KubeConfigLoaded, response.body)
                })
            },

            construct: function(Vue) {
                this.data.__vue = Vue

                this.data.host = window.location.hostname
                this.data.protocol = window.location.protocol
                this.data.port = this.getPort() 
                this.data.dryRun = window.location.search.indexOf("local=true") > 0 || window.location.search.indexOf("dry=true") > 0
                this.data.addressPrefix = this.data.protocol + "//" + this.data.host + ":" + this.data.port + "/api/v1" 
            },

            getPort: function() {
                var port = window.location.port

                if(window.location.search.indexOf("local=true") > 0) 
                     port = 3000

                if(window.location.search.indexOf("port=") > 0) {
                    var params = new URLSearchParams(window.location.search)
                    port = parseInt(params.get('port'))
                }

                return port
            },

            openWebSocket : function(instance, uuid) {
                // Create the websocket client
                var url = "ws://" + this.data.host + ':' + this.data.port + "?uuid=" + uuid
                const ws = new WebSocket(url)

                // Add the listeners
                ws.addEventListener('open', function(event) {
                    // Do something
                    console.log("WS OPEN", event)
                })

                ws.addEventListener('message', function(message) {
                    // Propagate the message to the frontend
                    EventBus.$emit(Constants.Network_WS_Response, message.data)
                })

                ws.addEventListener('error', function(error) {
                    // Do something
                    console.log("WS ERROR", error)
                })

                ws.addEventListener('close', function(event) {
                    // Do something
                    console.log("WS CLOSE", event)
                })

                this.__ws = ws 
            },

            closeWebSocket : function() {
                // Close the Websocket-Client
                if(this.__ws !== undefined && this.__ws !== null)
                    try {
                        console.log("CLOSING WEBSOCKET")
                        this.__ws.close()
                        this.__ws = null
                    } catch (e) {
                        console.log("ERROR CLOSING WEBSOCKET", e)
                    }
            }
        }
        
        Vue.prototype.$network.construct(Vue)
    },

}

export default Network