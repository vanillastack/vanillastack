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
            <div class="card margin-2em">
                <div class="card-header" id="certKind">
                    <h5 class="mb-0">Let's Encrypt Certificate Kind</h5>
                </div>
                <div id="certKindData" class="show" aria-labelledby="certKind">
                    <div class="card-body">
                        <div class="form-group row">
                            <div class="col">
                                <select class="custom-select input-large"
                                    name="issuer" v-model="issuer" 
                                    v-on:blur="triggerValidation()"
                                    v-on:change="triggerValidation()">
                                    <option value="letsencrypt-staging">Staging (non production or test)</option>
                                    <option value="letsencrypt-prod">Production</option>
                                </select>
                            </div>
                        </div>
                        <div class="row" v-if="issuer == 'letsencrypt-prod'">
                            <div class="col">
                                <span class="red">Please ensure to only select this option when truly setting up a production cluster, since Let's Encrypt defines time-outs for production cluster, which would prevent new certificates to be re-requested in case of reinstalling a cluster.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card margin-2em">
                <div class="card-header" id="certMail">
                    <h5 class="mb-0">Issuer E-Mail</h5>
                </div>
                <div id="certMailData" class="show" aria-labelledby="certMail">
                    <div class="card-body">
                        <div class="form-group row">
                            <div class="col">
                                <input type="email" v-model="issuerEmail" v-on:input="triggerValidation()"
                                    placeholder="you@email"
                                    required="required" class="form-control input-large" />
                            </div>
                        </div>
                    </div>
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