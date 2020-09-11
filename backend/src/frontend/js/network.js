import Vue from 'vue'
import VueResource from 'vue-resource'
import Constants from './constants'
import EventBus from './eventBus'

Vue.use(VueResource)

const Network = {

    install: function(Vue, options) {
        Vue.prototype.$network = {

            data: function() {
                return {
                    host,
                    port,
                    protocol,
                    addressPrefix,
                    __vue,
                    __ws
                }
            },

            getInfo : function() {
                const path = this.data.addressPrefix + "/info"
        
                this.data.__vue.http.get(path).then(response => {
                    EventBus.$emit(Constants.Network_LoadedInfo, response)
                })
            },


            construct: function(Vue) {
                this.data.__vue = Vue

                this.data.host = window.location.hostname
                this.data.protocol = window.location.protocol
                this.data.port = window.location.search.indexOf("local=true") > 0 ? 3000 : window.location.port
                this.data.addressPrefix = this.data.protocol + "//" + this.data.host + ":" + this.data.port + "/api/v1" 

                // Create the websocket client
                const ws = new WebSocket("ws://" + this.data.host + ":" + this.data.port)

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
                
            },
        }
        
        Vue.prototype.$network.construct(Vue)
    },

}

export default Network