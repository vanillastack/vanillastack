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
                <h5>Copyright 2020 Cloudical Deutschland GmbH</h5>
                <p>Licensed under the Apache License, Version 2.0 (the "License"); you may not use this product except in compliance with the License.</p>
                <p>You may obtain a copy of the License at</p>
                <p><a href="http://www.apache.org/licenses/LICENSE-2.0" target="_blank">http://www.apache.org/licenses/LICENSE-2.0</a></p>
                <p>Unless required by applicable law or agreed to in writing, software
                distributed under the License is distributed on an "AS IS" BASIS,
                WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                See the License for the specific language governing permissions and
                limitations under the License.</p>
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