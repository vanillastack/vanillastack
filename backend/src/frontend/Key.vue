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
                    <textarea class="form-control" cols="30" rows="5" ref="key">ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDR3FpSe9EyW96fgIv69fi3XnbKkcSi1w/HrhWOlzDJ+tpwEsIQtAcXFkhcs1hpHjGsZepJPzwFEP4JzdfvErHpL/j2Kvfo62IWNTf3Rouf1rG1IXUJEkl+a7cI5FHolbYiGEGPXe2+MuhSTtxX5iYLdyk3o+Tf4qTZxrpexoVzFxEKUKzfVoongZkECdr81bXv9IN6KRD05w9/AwS96mrv7tspBk9ypUETvB3DiLW3X9oxpMFL6IUNvTO1AZubti3Da9ES0xBiIH63rn8AE4stiNv6awnhUaP3SZa10RVn3WjQ/adboxtnOO2MAo+HACP8Jqhy2b1AzpZZa+9OIfptUqyGWcEE+E8iqoVMQfqxJNoAvaKsAg3UqRawuAOSU+UEYbUSxQ8yMZ7l075hA0c1ULzHt6WRaRid99I6/okg3zOTOv1rOuAuVjN4YbHQM/qzZ8+O+ixvTh+KVjaKgmZmzKH1LkPxH5zB09WbEtnVXuCQac+/l0dQwI+b61yT+XM= ksamaschke@opensuse</textarea>
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
</template>
<script>
import Constants from './js/constants'
import EventBus from './js/eventBus'

export default {

    name: 'Key',

    data: function() {
        return {
            didCopy: this.$store.state.installer.copiedKeyToNodes,
            key: this.$store.state.installer.sshKey
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