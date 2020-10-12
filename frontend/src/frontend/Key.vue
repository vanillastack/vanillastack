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
        <div class="card margin-2em">
            <div class="card-header" id="sshKeySettings">
                <h5 class="mb-0">SSH-Key</h5>
            </div>
            <div id="sshKeySettingsData" class="show" aria-labelledby="sshKeySettings">
                <div class="card-body">
                    <div class="row margin-1em">
                        <div class="col">
                            <p>
                                <i class="fas fa-info-circle gray"></i>
                                This public key is not known outside this installer. VanillaStack does not store this key anywhere. The corresponding private key will be stored secretly within the installed Kubernetes cluster, allowing
                                VanillaStack to update your Kubernetes-installation, if required.
                            </p>
                        </div>
                    </div>
                    <div class="row margin-1em">
                        <div class="col">
                            <p>
                                <textarea class="form-control" cols="30" rows="5" ref="key" v-model="key"></textarea>
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
                </div>
            </div>
        </div>
        <div class="card margin-2em">
            <div class="card-header" id="sshKeyInstruction">
                <h5 class="mb-0">How to install the SSH-key</h5>
            </div>
            <div id="sshKeyInstructionData" class="show" aria-labelledby="sshKeyInstruction">
                <div class="card-body">
                    <div class="row margin-1em">
                        <div class="col">
                            <p>To install the SSH-key, please follow these instructions:</p>
                            <ul class="fa-ul">
                                <li><i class="fas fa-check"></i> Copy the key</li>
                                <li><i class="fas fa-check"></i> Store the key in a file called <em>key.pub</em></li>
                                <li><i class="fas fa-check"></i> Copy the key to the target computer using <em>ssh-copy-id</em>: 
                                    <pre style="margin-top:1em">ssh-copy-id -f -i key.pub &lt;username&gt;@&lt;ip-address-of-node&gt;</pre>
                                </li>
                                <li><i class="fas fa-check"></i> Repeat this with all nodes</li>
                            </ul>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <i class="fas fa-info-circle gray"></i>
                            For Windows, please follow the instructions in this blog-posting: <a href="https://www.chrisjhart.com/Windows-10-ssh-copy-id/" target="_blank">https://www.chrisjhart.com/Windows-10-ssh-copy-id/</a>, starting with <em>Copy SSH Key to Remote Linux Device</em>.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Constants from './js/constants'
import EventBus from './js/eventBus'

export default {

    name: 'key',

    data: function() {
        return {
            didCopy: this.$store.state.installer.copiedKeyToNodes,
            key: this.$store.state.base.sshKey
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
        },

        checkGoForward() {
          EventBus.$emit(Constants.Event_NewViewLoaded, {
            allowGoForward: this.didCopy,
            canGoForward: true})
        }
    },

    mounted: function() {
        // Notify about being loaded
        this.checkGoForward()

        // Update the links when the keys were copied
        EventBus.$on(Constants.Event_CopiedKeyToNodes, value => {
            this.didCopy = value
            this.checkGoForward()
        }),

        // Display the SSH-key when it got loaded
        EventBus.$on(Constants.Store_LoadedSSHKey, value => this.key = value)
    }
}
</script>