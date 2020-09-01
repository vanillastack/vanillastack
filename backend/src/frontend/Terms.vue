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
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   
                </p>
                <p>
                    Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.   
                </p>
                <p>
                    Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.   
                </p>
                <p>
                    Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.   
                </p>
                <p>
                    Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis.   
                </p>
                <p>
                    At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, At accusam aliquyam diam diam dolore dolores duo eirmod eos erat, et nonumy sed tempor et et invidunt justo labore Stet clita ea et gubergren, kasd magna no rebum. sanctus sea sed takimata ut vero voluptua. est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.   
                </p>
                <p>
                    Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita
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
        <div class="row margin-2em">
            <div class="col">
                <router-link class="btn btn-primary min-width-100 margin-right-2em" role="button" to="/start">Back</router-link>
                <router-link tag="button" :disabled="!accepted" class="btn btn-success min-width-100" role="button" to="/kind">Next</router-link>
            </div>
        </div>
    </div>
</template>
<script>
import Constants from './js/constants'
import EventBus from './js/eventBus'

export default {

    name: 'Terms',

    data: function() {
        return {
            accepted: this.$store.state.acceptedTerms
        }
    },

    methods: {
        updateTermsAccepted (e) {
            this.$store.commit(Constants.Store_UpdateTermsAccepted, e.target.checked)
        }
    },

    mounted : function () {
        // Update the links when the terms were accepted
        EventBus.$on(Constants.Event_AcceptedTermsChanged, value => this.accepted = this.$store.state.acceptedTerms)
    }
}
</script>