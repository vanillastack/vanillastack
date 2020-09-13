<template>
    <div class="container-fluid">
        <div class="row margin-2em">
            <div class="col">
                <h3>Summary</h3>
            </div>
        </div>
        <div class="row margin-2em">
            <div class="col">
                <p>This is the summary of all the settings you have been selected, choosen and entered. Please check them
                carefully, and after you agreed with them, press the <em>Install VanillaStack!</em>-button, to start 
                the installation.</p>
                <p>Note: You can directly jump to the settings page for each section by hitting the <em>Edit</em>-button next to the secion's name.</p> 
            </div>
        </div>
        <div id="accordion" class="margin-2em form">
            <div class="card margin-1em">
                <div class="card-header" id="generalHeading">
                    <div class="row">
                        <div class="col">
                            <h5 class="mb-0">
                                <button class="btn btn-link accordion-link" data-toggle="collapse" data-target="#generalData" 
                                    aria-expanded="true" aria-controls="generalData">
                                    General Settings
                                </button>
                            </h5>
                        </div>
                        <div class="col-1">
                            <router-link to="/general" class="summaryLink">Edit</router-link>
                        </div>
                    </div>
                </div>

                <div id="generalData" class="collapse show" aria-labelledby="generalHeading" 
                    data-parent="#accordion">
                    <div class="card-body">
                        <div class="row margin-2em">
                            
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
    name: 'summary',

    mounted : function () {
        // Notify about being loaded
        EventBus.$emit(Constants.Event_NewViewLoaded, {
            allowGoForward: false
        })
    },

    created: function() {
    }
}
</script>