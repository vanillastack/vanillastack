<template>
    <div class="container-fluid">
        <div class="row margin-2em">
            <div class="col">
                <h3>SSH-Key</h3>
            </div>
        </div>
        <div class="row margin-2em">
            <div class="col">
                VanillaStack is installed using a public SSH key which has to be copied onto each of the nodes. 
                Please copy this SSH-key and save it in the <i>.ssh</i>-directory of a user having <i><strong>root</strong></i>-privileges.
            </div>
        </div>
        <div class="row margin-2em">
            <div class="col">
                <p><strong>Please Note</strong></p>
                <p>
                    This key is deleted from your system at the end of the installation process. VanillaStack will not be able
                    to perform any changes on your nodes other than installing containers. If something goes wrong, you can always
                    delete this public key on your own. 
                </p>
                <p>
                    This public key is not known outside this installer. VanillaStack does not store it outside this installer.
                </p>
            </div>
        </div>
        <div class="row margin-2em">
            <div class="col">
                <p><strong>SSH-Key</strong></p>
                <p>
                    <textarea class="form-control" cols="30" rows="5" ref="key">{{ key }}</textarea>
                </p>
                <p>
                    <button @click="copyKey" class="btn btn-primary min-width-100" role="button">Copy</button>
                </p>
            </div>
        </div>
        <form>
            <div class="form-check margin-2em">
                <input class="form-check-input" type="checkbox" v-model="didCopy" id="copiedKey" name="copiedKey" @input="updateCopiedKeys" />
                <label class="form-check-label" for="acceptTerms">
                    I copied the SSH-key to <em>all</em> nodes
                </label>
            </div>
        </form>
        <div class="row margin-2em">
            <div class="col">
                <router-link class="btn btn-primary min-width-100 margin-right-2em" role="button" to="/kind">Back</router-link>
                <router-link tag="button" :disabled="!didCopy" class="btn btn-success min-width-100" role="button" to="/kind">Next</router-link>
            </div>
        </div>
    </div>
</template>
<script>
import Constants from './js/constants'
import EventBus from './js/eventBus'

export default {

    name: 'Key',

    data: function() {
        return {
            didCopy: this.$store.state.copiedKeyToNodes,
            key: this.$store.state.sshKey
        }
    },

    methods: {
        updateCopiedKeys (e) {
            this.$store.commit(Constants.Store_UpdateCopiedKeyToNodes, e.target.checked)
        },

        copyKey(e) {
            var component = this.$refs.key
            component.select()
            document.execCommand('copy')
            component.selectionStart = component.selectionEnd
        }
    },

    mounted: function() {
        // Update the links when the keys were copied
        EventBus.$on(Constants.Event_CopiedKeyToNodes, value => this.didCopy = value),

        // Display the SSH-key when it got loaded
        EventBus.$on(Constants.Store_LoadedSSHKey, value => this.key = value)
    }
}
</script>