import Vue from 'vue'
import Vuex from 'vuex'
import Constants from './constants'
import EventBus from './eventBus'

Vue.use(Vuex);

// Define the store
const Store = new Vuex.Store({
    state: {
      acceptedTerms: false,
      masters: 1,
      workers: 1,
      isHA: false,
      copiedKeyToNodes: false,
      sshKey: ''
    },

    mutations: {
        updateTermsAccepted(state, message) {
          state.acceptedTerms = message;
          EventBus.$emit(Constants.Event_AcceptedTermsChanged, state.acceptedTerms);
        },
    
        updateMasters(state, masters) {
          state.masters = masters
          EventBus.$emit(Constants.Event_MastersCountChanged, state.masters);
        },
    
        updateWorkers(state, workers) {
          state.workers = workers
          EventBus.$emit(Constants.Event_WorkersCountChanged, state.workers);
        },
    
        updateInstallationKind(state, isHA) {
          state.isHA = isHA
          EventBus.$emit(Constants.Event_InstallationKindChanged, state.isHA);
        },
    
        updateCopiedKeyToNodes(state, didCopy) {
          state.copiedKeyToNodes = didCopy
          EventBus.$emit(Constants.Event_CopiedKeyToNodes, state.copiedKeyToNodes);
        },

        loadedSSHKey(state, sshKey) {
          state.sshKey = sshKey
          EventBus.$emit(Constants.Store_LoadedSSHKey, state.sshKey)
        }
      }
})

export default Store;