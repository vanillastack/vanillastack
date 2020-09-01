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
      sshKey: '',
      canGoBack: false,
      canGoForward: false,
      allowGoForward: false
    },

    mutations: {
        updateTermsAccepted(state, message) {
          state.acceptedTerms = message;
          EventBus.$emit(Constants.Event_AcceptedTermsChanged, state.acceptedTerms);

          EventBus.$emit(Constants.Event_NewViewLoaded, {
            allowGoForward: state.acceptedTerms
          })
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
        },

        updateNavigation(state, data) {
          state.canGoBack = data.canGoBack !== undefined ? data.canGoBack : state.canGoBack
          state.canGoForward = data.canGoForward !== undefined ? data.canGoForward : state.canGoForward
          state.allowGoForward = data.allowGoForward

          EventBus.$emit(Constants.Event_NavigationUpdated, {
            canGoBack : state.canGoBack,
            canGoForward: state.canGoForward,
            allowGoForward: state.allowGoForward
          })
        },

        updateGlobalNavigation(state, data) {
          state.canGoBack = data.canGoBack
          state.canGoForward = data.canGoForward

          EventBus.$emit(Constants.Event_NavigationUpdated, {
            canGoBack : state.canGoBack,
            canGoForward: state.canGoForward,
            allowGoForward: state.allowGoForward
          })
        }
      }
})

export default Store;