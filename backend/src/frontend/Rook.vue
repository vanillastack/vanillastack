<template>
    <form>
        <div class="container-fluid">
            <div class="row margin-2em">
                <div class="col">
                    <h3>Rook</h3>
                </div>
            </div>
            <div class="row margin-2em">
                <div class="col">
                    Please ensure the following requirements are fulfilled for each of the nodes where Rook is to be deployed to.
                </div>
            </div>
            <div class="row margin-2em">
                <div class="col">
                    <p><strong>Requirements for every node</strong></p>
                    <ul>
                        <li>A raw device exists (<strong>no</strong> filesystem), or</li>
                        <li>A raw partition exists (<strong>no</strong> filesystem), or</li>
                        <li>Persistent Volumes (PVs) are available from a storage class in <strong>block</strong> mode on Kubernetes</li>
                    </ul>
                </div>
            </div>
            <div class="row margin-2em">
                <div class="col">
                    <p>You can use the <pre>lsblk -f</pre> command to verify the filesystem-information on your machines:</p>
                    <p><img src="/images/rook-prerequisites.png" style="max-width: 800px" /></p>
                    <p>In the given image, volume <strong>sdb</strong> is in a raw state, and can therefore be used for Rook.</p>
                </div>
            </div>
            <div class="form-group" v-for="item in nodes" :key="item.key">
                <div class="row">
                    <div class="col-1">{{ item.ip }}</div>
                </div>
                <div class="col">
                    <div class="custom-control custom-switch inline-block">
                        <input class="custom-control-input" :id="item.key" :name="item.key" type="checkbox" 
                            v-model="item.rookChecked" 
                            v-on:click="handleRookChecked($event.target.checked, item)">
                        <label class="custom-control-label" :for="item.key">
                            Fulfills Rook requirements
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>
<script>
import Constants from './js/constants.js'
import EventBus from './js/eventBus.js'

const LocalEvent_ValidateRook = "LocalEvent_ValidateRook"

export default {
    name: 'Home',

    data: function() {
        return {
            nodes: []
        }
    },

    methods: {

        validateRook: function() {
            var isValid = true;

            for(var i=0; i<this.nodes.length; i++) {
                if(!this.nodes[i].rookChecked) {
                    isValid = false;
                }
            }

            EventBus.$emit(Constants.Event_NewViewLoaded, {
                allowGoForward: isValid
            })
        },

        handleRookChecked: function(isChecked, item) {
            item.rookChecked = isChecked;
            this.validateRook();
        }
    },

    mounted : function () {
        
        // Load the workers with Rook
        var nodes = [];
        for(var i=0; i < this.$store.state.installer.workers.length; i++) {
            var node = this.$store.state.installer.workers[i];

            nodes[nodes.length] = node;
        }
        this.nodes = nodes;

        EventBus.$on(LocalEvent_ValidateRook, () => {
            this.validateRook();
        })
        
        this.validateRook()
    },

    created: function() {
        console.log("==> Created Home")

    }
}
</script>