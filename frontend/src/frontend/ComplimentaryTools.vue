<template>
    <div class="container-fluid">
        <div class="row margin-2em">
            <div class="col">
                <h3>Complementary Tools</h3>
            </div>
        </div>
        <div class="row margin-2em">
            <div class="col">
                Here you can select additional tools for your VanillaStack installation, that are provided by commercial entities. Please understand, that you might be required to provide additional licensing information and/or purchase the licenses outside VanillaStack.
            </div>
        </div>
        <div class="row margin-2em form-group">
            <div class="col-1">
                <img src="./images/polyverse.png" class="lead-image" />
            </div>
            <div class="col-4 valign-center">
                <p>Polyverse provides polymorphing to the underlying Linux distribution. This technology builds diversity and uniqueness across multiple system dimensions, increasing the complexity and cost for attackers and stopping cybersecurity attacks before they start. Polyverse's technology is used directly by Defense and Enterprise customers, embedded into devices and hardware, and sold as part of security solutions.</p>
                <p>Polyverse is available for CentOS-, Debian-, Ubuntu-, openSUSE-, SLES- and RHEL-platforms</p>
                <p><a href="https://polyverse.com" class="red" target="_blank">https://polyverse.com</a></p>
            </div>
            <div class="col">
                <div class="custom-control custom-switch inline-block margin-2em">
                    <input class="custom-control-input" id="polyverse" name="polyverse" type="checkbox" v-model="polyverse">
                    <label class="custom-control-label" for="polyverse">
                        Roll out Polyverse polymorphing
                    </label>
                </div>
                <div v-if="polyverse" class="form-group">
                    <label for="polyverseKey" style="display:block">Polyverse Key</label>
                    <input class="form-control small width-20em" placeholder="Polyverse Key" style="display:inline-block"
                            name="polyverseKey" v-model="polyverseKey" v-on:keydown="triggerValidation()" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Constants from './js/constants.js'
import EventBus from './js/eventBus.js'

export default {
    name: 'tools',

    data: function() {
        return {
            polyverse: this.$store.state.installer.complimentary.polyverse,
            polyverseKey: this.$store.state.installer.complimentary.polyverseKey
        }
    },

    methods: {
        triggerValidation: function() {

            var isValid = (this.polyverse && this.polyverseKey !== '') || !this.polyverse

            // Store the data
            this.$store.commit(Constants.Store_ComplimentaryToolsUpdateData, this.$data)

            // Control, whether the next step is enabled 
            EventBus.$emit(Constants.Event_NewViewLoaded, {
                allowGoForward: isValid
            })
        }
    },

    mounted : function () {
        this.triggerValidation()
    },

    beforeRouteLeave (to, from, next) {
        // Store the data
        this.$store.commit(Constants.Store_ComplimentaryToolsUpdateData, this.$data)

        next()
    }
}
</script>
