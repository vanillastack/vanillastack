<template>
    <form>
        <div class="container-fluid">
            <div class="row margin-2em">
                <div class="col">
                    <h3>Subscription for VanillaStack (optional)</h3>
                </div>
            </div>
            <div class="row margin-2em">
                <div class="col">
                    <p>VanillaStack can be run <em>without</em> any subscription key. In this case, you are running VanillaStack as Community Version without Commercial Support.</p>
                    <p>The Commercial Version gives you the following advantages:</p>
                    <ul class="fa-ul">
                        <li><i class="fas fa-check"></i> A stable distribution</li>
                        <li><i class="fas fa-check"></i> All components are guaranteed to work with each other</li>
                        <li><i class="fas fa-check"></i> Commercial Support for either the whole platform (including <strong>all</strong> rolled out workloads) or just the platform components you choose (i.e. Kubernetes only, or Kubernetes and IaaS-components)</li>
                        <li><i class="fas fa-check"></i> All components are guaranteed to work with each other</li>
                        <li><i class="fas fa-check"></i> 9x5 or 24x7 support options available</li>
                        <li><i class="fas fa-check"></i> Peace of mind for your production workloads</li>
                    </ul>
                    <p>Learn more at <a class="red" href="https://vanillastack.io" target="_blank">https://vanillastack.io</a> about our commercial offerings.</p>
                </div>
            </div>
            <div class="form-group">
                <div class="card margin-2em">
                    <div class="card-header" id="dashboardArea">
                        <h5 class="mb-0">Username</h5>
                    </div>
                    <div id="dashboardAreaData" class="show" aria-labelledby="dashboardArea">
                        <div class="card-body">
                            <div class="form-group row">
                                <div class="col">
                                    <div class="custom-control custom-switch">
                                        <input class="form-control" placeholder="Your Key" name="key" v-model="key" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <div class="card margin-2em">
                    <div class="card-header" id="dashboardArea">
                        <h5 class="mb-0">Password</h5>
                    </div>
                    <div id="dashboardAreaData" class="show" aria-labelledby="dashboardArea">
                        <div class="card-body">
                            <div class="form-group row">
                                <div class="col">
                                    <div class="custom-control custom-switch">
                                        <input class="form-control" type="password" placeholder="Your Password" name="password" v-model="password" />
                                    </div>
                                </div>
                            </div>
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

export default {
    name: 'ip',

    data: function()  {
        return {
            key: this.$store.state.base.key,
            password: this.$store.state.base.password
        }
    },

    methods: {
    },

    beforeRouteLeave (to, from, next) {
        // Store the data
        this.$store.commit(Constants.Store_UpdateSubscriptionKey, this.key)
        this.$store.commit(Constants.Store_UpdateSubscriptionPassword, this.password)

        next()
    },

    created: function() {
    },

    mounted : function () {
    // Notify about being loaded
    EventBus.$emit(Constants.Event_NewViewLoaded, {
        allowGoForward: true
        })
    }
}
</script>