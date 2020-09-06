import Vue from 'vue'
import Vuex from 'vuex'
import Constants from './constants'
import EventBus from './eventBus'

Vue.use(Vuex);

// Define the modules

// Navigation Module
const navigation = {
  state : () => ({
    acceptedTerms: false,
    canGoBack: false,
    canGoForward: false,
    allowGoForward: false
  }),

  mutations: {

    [Constants.Store_UpdateTermsAccepted](state, message) {
      state.acceptedTerms = message;
      EventBus.$emit(Constants.Event_AcceptedTermsChanged, state.acceptedTerms);

      EventBus.$emit(Constants.Event_NewViewLoaded, {
        allowGoForward: state.acceptedTerms
      })
    },

    [Constants.Store_UpdateNavigation](state, data) {
      state.canGoBack = data.canGoBack !== undefined ? data.canGoBack : state.canGoBack
      state.canGoForward = data.canGoForward !== undefined ? data.canGoForward : state.canGoForward
      state.allowGoForward = data.allowGoForward

      EventBus.$emit(Constants.Event_NavigationUpdated, {
        canGoBack : state.canGoBack,
        canGoForward: state.canGoForward,
        allowGoForward: state.allowGoForward
      })
    },

    [Constants.Store_UpdateGlobalNavigation](state, data) {
      state.canGoBack = data.canGoBack
      state.canGoForward = data.canGoForward

      EventBus.$emit(Constants.Event_NavigationUpdated, {
        canGoBack : state.canGoBack,
        canGoForward: state.canGoForward,
        allowGoForward: state.allowGoForward
      })
    }
  }
}

// OpenStack Module
const openstack = {
  state: () => ({
    domain: '',
    release: 'stein',
    tls: true,
    mariadb: true,
    mariadb_size: 30,
    rabbitmq: true,
    rabbitmq_size: 30,
    barbican: true,
    barbican_endpoint: ''
  }),

  mutations: {
    [Constants.Store_OpenStackUpdateData](state, data) {
      for(var key in data) {
        if(state.hasOwnProperty(key) && data.hasOwnProperty(key))
          state[key] = data[key]
      }

      EventBus.$emit(Constants.Event_OpenStackUpdatedData, state.data);
    },
  }
}

// Installer Module
const installer = {

  modules: {
    openstack: openstack
  },

  state: () => ({
    masters: 1,
    workers: 1,
    isHA: false,
    copiedKeyToNodes: false,
    sshKey: '',
    canGoBack: false,
    canGoForward: false,
    allowGoForward: false,
    installRook: false,
    installCF: false,
    installOpenStack: false,
    workersList: [],
    mastersList: [],
    clusterip: '',
    clusterfqdn: '',
    useclusterfqdn: true,
    adminfqdn: '',
    useadminfqdn: true
  }),

  mutations: {

    [Constants.Store_UpdateMasters](state, masters) {
      state.masters = masters
      EventBus.$emit(Constants.Event_MastersCountChanged, state.masters);
    },

    [Constants.Store_UpdateWorkers](state, workers) {
      state.workers = workers
      EventBus.$emit(Constants.Event_WorkersCountChanged, state.workers);
    },

    [Constants.Store_UpdateInstallationKind](state, isHA) {
      state.isHA = isHA
      EventBus.$emit(Constants.Event_InstallationKindChanged, state.isHA);
    },

    [Constants.Store_UpdateCopiedKeyToNodes](state, didCopy) {
      state.copiedKeyToNodes = didCopy
      EventBus.$emit(Constants.Event_CopiedKeyToNodes, state.copiedKeyToNodes);
    },

    [Constants.Store_LoadedSSHKey](state, sshKey) {
      state.sshKey = sshKey
      EventBus.$emit(Constants.Event_CopiedKeyToNodes, state.sshKey)
    },

    [Constants.Store_UpdateInstallationRook](state, install) {
      state.installRook = install
      EventBus.$emit(Constants.Event_InstallationRookUpdated, install)
    },

    [Constants.Store_UpdateInstallationCF](state, install) {
      state.installCF = install
      EventBus.$emit(Constants.Event_InstallationCFUpdated, install)
    },

    [Constants.Store_UpdateInstallationOpenStack](state, install) {
      state.installOpenStack = install
      EventBus.$emit(Constants.Event_InstallationOpenStackUpdated, install)
    },

    [Constants.Store_UpdateIPAddresses](state, data) {
      state.clusterip = data.clusterip,
      state.useadminfqdn = data.useadminfqdn,
      state.useclusterfqdn = data.useclusterfqdn,
      state.clusterfqdn = data.clusterfqdn,
      state.adminfqdn = data.adminfqdn,

      EventBus.$emit(Constants.Event_IpAddressesUpdated, data)
    }
  }
}

// Define the store
const Store = new Vuex.Store({
    modules: {
      navigation: navigation,
      installer: installer
    }
})

export default Store;