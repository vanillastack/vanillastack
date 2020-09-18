<template>
    <form>
        <div class="container-fluid">
            <div class="row margin-2em">
                <div class="col">
                    <h3>Subscription-Key</h3>
                </div>
            </div>
            <div class="row margin-2em">
                <div class="col">
                    <p>Please enter your Subscription-Key here. If you don't have any, you can get one at <a href="https://vanillastack.io" target="_blank">https://vanillastack.io</a>, where you can also learn about our pricing model</p>
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
                            v-on:change="triggerValidation()" v-on:blur="triggerValidation()" 
                            required="required" />
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
        }
    },

    methods: {
        triggerValidation() {
            var isValid = false;

            // validates the data
            isValid = this.key !== undefined && this.key.length >= Constants.Validate_SubscriptionKeyLength && this.key != ''

            // Store the data
            this.$store.commit(Constants.Store_UpdateSubscriptionKey, this.key)

            // Notify about the change
            EventBus.$emit(Constants.Event_NewViewLoaded, {
                allowGoForward: isValid
            })
        }
    },

    beforeRouteLeave (to, from, next) {
        // Store the data
        this.$store.commit(Constants.Store_UpdateSubscriptionKey, this.key)

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