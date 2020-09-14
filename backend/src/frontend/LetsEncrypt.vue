<template>
    <div class="container-fluid">
        <div class="row margin-2em">
            <div class="col">
                <h3>Let's Encrypt</h3>
            </div>
        </div>
        <div class="row margin-2em">
            <div class="col">
                Let's Encrypt is used for creating certificates for your cluster.
                Please select the kind of Let's Encrypt-certificates you want to use, and the E-Mail-Address of the issuer.
            </div>
        </div>
        <div class="form-group">
            <div class="row margin-1em">
                <div class="col-3">
                    <p><strong>Let's Encrypt Certificate Kind</strong></p>
                    <select class="custom-select"
                        name="issuer" v-model="issuer" 
                        v-on:blur="triggerValidation()"
                        v-on:change="triggerValidation()">
                        <option value="letsencrypt-staging">Staging (non production or test)</option>
                        <option value="letsencrypt-prod">Production</option>
                    </select>
                </div>
                <div class="col" v-if="issuer == 'letsencrypt-prod'">
                    <p class="margin-2em"><strong>&#160;</strong></p>
                    <span class="red">Please ensure to only select this option when truly setting up a production cluster, since Let's Encrypt defines time-outs for production cluster, which would prevent new certificates to be re-requested in case of reinstalling a cluster.</span>
                </div>
            </div>
            <div class="row margin-1em">
                <div class="col-3">
                    <p><strong>Issuer E-Mail</strong></p>
                    <input type="email" v-model="issuerEmail" v-on:input="triggerValidation()"
                        placeholder="you@email"
                        required="required" class="form-control padding-1em margin-top-1em" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Constants from './js/constants.js'
import EventBus from './js/eventBus.js'

export default {
    name: 'letsencrypt',

    data: function() {
        return {
            issuer: '',
            issuerEmail: '',
        }
    },

    methods: {
        triggerValidation: function() {
            // Validate the data
            var isValid = Constants.Validate_Email.test(this.issuerEmail)

            // Store the data
            this.$store.commit(Constants.Store_UpdateLetsEncryptData, this.$data)

            // Inform about changes
            EventBus.$emit(Constants.Event_NewViewLoaded,{
                allowGoForward: isValid
            })
        }
    },

    mounted : function () {
        this.issuer = this.$store.state.installer.letsencrypt.issuer
        this.issuerEmail = this.$store.state.installer.letsencrypt.issuerEmail

        this.triggerValidation()
    },

    created: function() {
    }
}
</script>