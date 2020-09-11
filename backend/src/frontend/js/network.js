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

            validateNode: function(ip, user, uuid) {
                const path = this.data.addressPrefix + "/connection"

                this.data.__vue.http.post(path, {
                    uuid: uuid,
                    dry: this.data.dryRun,
                    nodes: [
                        {
                            host: ip,
                            user: user
                        }
                    ]
                }).then(response => {
                    EventBus.$emit(Constants.Network_CheckingNode, {
                        ip: ip,
                        transactionId: response.body.transactionId
                    })

                    console.log(response)
                })
            },

            construct: function(Vue) {
                this.data.__vue = Vue

                this.data.host = window.location.hostname
                this.data.protocol = window.location.protocol
                this.data.port = window.location.search.indexOf("local=true") > 0 ? 3000 : window.location.port
                this.data.dryRun = window.location.search.indexOf("local=true") > 0
                this.data.addressPrefix = this.data.protocol + "//" + this.data.host + ":" + this.data.port + "/api/v1" 
            },

            openWebSocket : function(instance, uuid) {
                // Create the websocket client
                var url = "ws://" + this.data.host + ':' + this.data.port + "?uuid=" + uuid
                const ws = new WebSocket(url)
                console.log("Websocket Call: " + url)

                // Add the listeners
                ws.addEventListener('open', function(event) {
                    // Do something
                    console.log("WS OPEN", event)
                })

                ws.addEventListener('message', function(message) {
                    // Do something
                    console.log("WS MESSAGE", message)
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
            }
        }
        
        Vue.prototype.$network.construct(Vue)
    },

}

export default Network