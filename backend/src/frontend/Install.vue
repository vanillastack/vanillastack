<template>
    <div class="container-fluid">
        <div class="row margin-2em">
            <div class="col">
                <h3>VanillaStack is installing!</h3>
            </div>
        </div>
        <div class="row margin-2em">
            <div class="col">
                Here you can find all the output from the installation process.
            </div>
        </div>
        <div class="row margin-2em">
            <div class="col" id="list" v:model="display" style="overflow:auto" />
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
            display: 'Installation started...'
        }
    },

    mounted : function () {

        // Notify about being loaded
        EventBus.$emit(Constants.Event_NewViewLoaded, {
            allowGoForward: true
        })
    },

    created: function() {
        EventBus.$on(Constants.Network_InstallationInProgress, data => {
            this.transactionId = data.transactionId
        })

        EventBus.$on(Constants.Network_WS_Response, data => {
            // Process only data to be displayed for this transaction-id
            if(data.transactionId == this.transactionId) {
                if(data.event == 'EXECUTION' || data.event == 'EXEC') {
                    var message = '<pre>' + data.payload + '</pre>'

                    var list = document.getElementById('list')
                    list.innerHTML += message
                    list.scrollTo = list.scrollHeight
                }

                if(data.event == 'DONE') {
                    // Installation is done
                }
            }
        })
    }
}
</script>