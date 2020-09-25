<template>
    <div class="container-fluid">
        <div class="row margin-2em">
            <div class="col">
                <h3>Terms and Conditions</h3>
            </div>
        </div>
        <div class="row margin-2em">
            <div class="col">
                Please read these terms carefully and accept them, otherwise the installation can not be performed.
            </div>
        </div>
        <div class="row margin-2em">
            <div class="col cite">
                <p>
                    <h5 style="color: #dd402d">+++ PREVIEW VERSION +++</h5>
                    <p>
                        <p>By using this installer, you agree to understand and fully comply with these terms:</p>
                        <ul class="fa-ul">
                            <li><i class="fas fa-check"></i> This is Prerelease Software</li>
                            <li><i class="fas fa-check"></i> For this Prerelease Software, no commercial support will be available</li>
                            <li><i class="fas fa-check"></i> You take the risk for any damage caused by this Prerelease Software</li>
                            <li><i class="fas fa-check"></i> You take the risk for running infrastructure set up by this Prerelease Software</li>
                            <li><i class="fas fa-check"></i> You take the risk for running workloads on clusters rolled out by this Prerelease Software</li>
                            <li><i class="fas fa-check"></i> You use this Prerelease Software entirely on your own risk</li>
                        </ul> 
                    </p>
                </p>
            </div>
        </div>
        <form>
            <div class="form-check margin-2em">
                <input class="form-check-input" type="checkbox" v-model="accepted" id="acceptTerms" name="acceptTerms" @input="updateTermsAccepted" />
                <label class="form-check-label" for="acceptTerms">
                    I accept the Terms and Conditions
                </label>
            </div>
        </form>
    </div>
</template>
<script>
import Constants from './js/constants'
import EventBus from './js/eventBus'

export default {

    name: 'terms',

    data: function() {
        return {
            accepted: this.$store.state.navigation.acceptedTerms
        }
    },

    methods: {
        updateTermsAccepted (e) {
            this.$store.commit(Constants.Store_UpdateTermsAccepted, e.target.checked)
        }
    },

    mounted : function () {
        // Notify about being loaded
        EventBus.$emit(Constants.Event_NewViewLoaded, {
            allowGoForward: this.accepted
        })

        // Update the links when the terms were accepted
        EventBus.$on(Constants.Event_AcceptedTermsChanged, value => this.accepted = value)

        // Have the ToC's been accepted?
        this.accepted = this.$store.state.navigation.acceptedTerms
    }
}
</script>