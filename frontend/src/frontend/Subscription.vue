<template>
    <form>
        <div class="container-fluid">
            <div class="row margin-2em">
                <div class="col">
                    <h3>Subscription-Credentials</h3>
                </div>
            </div>
            <div class="row margin-2em">
                <div class="col">
                    <p>Please enter your Subscription-Key and your Subscription-Password here. If you don't have any, you can get one at <a href="https://vanillastack.io" target="_blank">https://vanillastack.io</a>, where you can also learn about our pricing model</p>
                    <p><em>Hint: You can run VanillaStack for free.</em></p>
                    <p>The Subscription-Key grants you access to updates and security fixes. 
                        Without it, your VanillaStack won't be unable to receive updates or security fixes, you won't be able to install additional components from the AppStore, and we won't be able to support you.</p>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <p><strong>Subscription-Key</strong></p>
                </div>
            </div>
            <div class="form-group row margin-2em">
                <div class="col">
                    <div class="inline-block margin-right-2em">
                        <input class="form-control" placeholder="Your Key" name="key" v-model="key" 
                            v-on:change="triggerValidation()" v-on:blur="triggerValidation()" />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <p><strong>Subscription-Password</strong></p>
                </div>
            </div>
            <div class="form-group row margin-2em">
                <div class="col">
                    <div class="inline-block margin-right-2em">
                        <input class="form-control" type="password" placeholder="Your Password" name="pwd" v-model="password" 
                            v-on:change="triggerValidation()" v-on:blur="triggerValidation()"  />
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
        triggerValidation() {
            // Store the data
            this.$store.commit(Constants.Store_UpdateSubscriptionKey, this.key)
            this.$store.commit(Constants.Store_UpdateSubscriptionPassword, this.password)

            // Notify about the change
            EventBus.$emit(Constants.Event_NewViewLoaded, {
                allowGoForward: true
            })
        }
    },

    beforeRouteLeave (to, from, next) {
        // Store the data
        this.$store.commit(Constants.Store_UpdateSubscriptionKey, this.key)
        this.$store.commit(Constants.Store_UpdateSubscriptionPassword, this.password)

        next()
    },

    mounted : function () {
        // Notify about being loaded
        this.triggerValidation()
    },

    created: function() {
    }
}
</script>