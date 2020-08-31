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
                <p><strong>Requirements</strong></p>
                <p>Please ensure to match the following requirements:</p>
                <ul>
                    <li>A minimum of two (2) nodes (VMs, Bare-Metal-machines)</li>
                    <li>A minimum of 1 GB RAM and 20 GB of HDD / SSD storage for each node</li>
                    <li>Root access to these nodes</li>
                    <li>IP-address for the cluster / Hostname for the cluser</li>
                    <li>A small cup of coffee or tea</li>
                </ul>
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
                <router-link tag="button" :disabled="!didCopy" class="btn btn-success min-width-100" role="button" to="/kind">Installation Kind</router-link>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Home'
}
</script>