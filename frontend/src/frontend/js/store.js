import Vue from 'vue'
import Vuex from 'vuex'
import Constants from './constants'
import EventBus from './eventBus'

Vue.use(Vuex)

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

const letsencryptSettings = {
  state: () => ({
    issuer: 'letsencrypt-staging',
    issuerEmail: ''
  }),

  mutations: {
    [Constants.Store_UpdateLetsEncryptData](state, data) {
      for(var key in data) {
        if(state.hasOwnProperty(key) && data.hasOwnProperty(key))
          state[key] = data[key]
      }

      EventBus.$emit(Constants.Event_LetsEncryptDataUpdated, state);
    },
  }
}

const cloudfoundrySettings = {
  state: () => ({
    fqdn: 'cf',
    stratos: true,
    stratos_endpoint: 'stratos'
  }),

  mutations: {
    [Constants.Store_CloudFoundryUpdateData](state, data) {
      for(var key in data) {
        if(state.hasOwnProperty(key) && data.hasOwnProperty(key))
          state[key] = data[key]
      }

      EventBus.$emit(Constants.Event_CloudFoundryUpdatedData, state);
    },
  }
}

// OpenStack Module
const openstackSettings = {
  state: () => ({
    domain: '',
    release: 'stein',
    tls: true,
    mariadb: true,
    mariadb_size: 30,
    rabbitmq: true,
    rabbitmq_size: 30,
    barbican: true,
    barbican_endpoint: '',
    cinder_endpoint: '',
    cinder:  true,
    cinder_backend: 'ceph',
    cinder_backup: false,
    glance_endpoint: '',
    glance:  true,
    glance_backend: 'ceph',
    heat_endpoint: '',
    heat:  true,
    horizon_endpoint: '',
    horizon:  true,
    keystone_endpoint: '',
    keystone:  true,
    mistral_endpoint: '',
    mistral:  true,
    neutron: true,
    neutron_endpoint: '',
    neutron_interface_tunnel: 'eth1',
    neutron_interface_external: 'eth2',
    neutron_l3ha: false,
    neutron_overlayNetworkType: 'VXLAN',
    neutron_maxAgentsPerRouter: 2,
    neutron_dhcpAgents: 2,
    nova_cpuMode: 'host-model',
    nova_virtType: 'Kvm',
    nova_placement_endpoint: '',
    nova_novnc_endpoint: '',
    nova: true,
    nova_endpoint: '',
    senlin_endpoint: '',
    senlin:  false,
  }),

  mutations: {
    [Constants.Store_OpenStackUpdateData](state, data) {
      for(var key in data) {
        if(state.hasOwnProperty(key) && data.hasOwnProperty(key))
          state[key] = data[key]
      }

      EventBus.$emit(Constants.Event_OpenStackUpdatedData, state);
    },
  }
}

// Base-Data module
const baseSettings = {
  state: () => ({
    sshKey: '',
    uuid: '',
    mode: 'installer',
    key: '',
    password: ''
  }),

  mutations: {
    [Constants.Store_BaseDataUpdateData](state, data) {
      for(var key in data) {
        if(state.hasOwnProperty(key) && data.hasOwnProperty(key))
          state[key] = data[key]
      }

      EventBus.$emit(Constants.Event_BaseDataUpdated, state);
    },

    [Constants.Store_UpdateSubscriptionKey](state, subscriptionKey) {
      state.key = subscriptionKey
      var valid = subscriptionKey !== undefined && subscriptionKey.length >= Constants.Validate_SubscriptionKeyLength && subscriptionKey != ''

      EventBus.$emit(Constants.Event_SubscriptionKeyUpdated, {
        key: state.key,
        valid: valid
      })
    },

    [Constants.Store_UpdateSubscriptionPassword](state, password) {
      state.password = password
    }
  }
}

// AddtionalTools-Settings
const additionalToolsSettings = {

  state: () => ({
    harbor: true,
    prometheus: true,
    grafana: true,
    elastic: false,
    fluentd: false,
    kibana: false,
    dashboard: true,
    certmgr: true,
    nginx: true,
    jaeger: false
  }),

  mutations: {
    [Constants.Store_AdditionalToolsUpdateData](state, data) {
      for(var key in data) {
        if(state.hasOwnProperty(key) && data.hasOwnProperty(key))
          state[key] = data[key]
      }

      EventBus.$emit(Constants.Event_AdditionalToolsDataUpdated, state);
    }
  }

}

// ComplimentaryTools-Settings
const complimentaryToolsSettings = {

  state: () => ({
    polyverse: false,
    polyverseKey: ''
  }),

  mutations: {
    [Constants.Store_ComplimentaryToolsUpdateData](state, data) {
      for(var key in data) {
        if(state.hasOwnProperty(key) && data.hasOwnProperty(key))
          state[key] = data[key]
      }

      EventBus.$emit(Constants.Event_ComplimentaryToolsDataUpdated, state);
    }
  }

}

// Rook-Settings-Module
const rookSetting = {
  state: () => ({
    dashboard: false,
    monitoring: true,
    replicaLevel: 3
  }),


  mutations: {
    [Constants.Store_RookUpdateData](state, data) {
      for(var key in data) {
        if(state.hasOwnProperty(key) && data.hasOwnProperty(key))
          state[key] = data[key]
      }

      EventBus.$emit(Constants.Event_RookDataUpdated, state);
    }
  }
}

// Cluster-Settings Module
const clusterSettings = {
  state: () => ({
    ip: '',
    fqdn: '',
    pod_cidr: '10.0.0.0/8',
    service_cidr: '10.96.0.0/12',
    usefqdn: true,
    adminfqdn: 'admin',
    useadminfqdn: true,
    useExternalLb: true
  }),


  mutations: {
    [Constants.Store_ClusterUpdateData](state, data) {
      for(var key in data) {
        if(state.hasOwnProperty(key) && data.hasOwnProperty(key))
          state[key] = data[key]
      }

      EventBus.$emit(Constants.Event_ClusterDataUpdated, state);
    }
  }
}

const generalSettings = {

  state: () => ({
    masters: 3,
    workers: 3, // Default for VS+Rook
    isHA: true,
    installRook: true,
    installCF: false,
    installOpenStack: false,
    workersList: [],
    mastersList: [],
    nodesChecked: false,
  }),

  mutations: {
    [Constants.Store_UpdateGeneralSettings](state, data) {
      for(var key in data) {
        if(state.hasOwnProperty(key) && data.hasOwnProperty(key))
          state[key] = data[key]
      }

      EventBus.$emit(Constants.Event_GeneralSettingsChanged, state);
    },

    [Constants.Store_UpdateWorkers](state, data) {
      state.workersList = data
    },

    [Constants.Store_UpdateMasters](state, data) {
      state.mastersList = data
    },

    [Constants.Store_NodesChecked](state, data) {
      state.nodesChecked = data
    }
  }

}

// Installer Module
const installer = {

  modules: {
    openstack: openstackSettings,
    cloudfoundry: cloudfoundrySettings,
    additional: additionalToolsSettings,
    complimentary: complimentaryToolsSettings,
    rook: rookSetting,
    cluster: clusterSettings,
    general: generalSettings,
    letsencrypt: letsencryptSettings
  },

  state: () => ({
    copiedKeyToNodes: false,
    canGoBack: false,
    canGoForward: false,
    allowGoForward: false,
  }),

  mutations: {
    [Constants.Store_UpdateCopiedKeyToNodes](state, didCopy) {
      state.copiedKeyToNodes = didCopy
      EventBus.$emit(Constants.Event_CopiedKeyToNodes, state.copiedKeyToNodes);
    },

    [Constants.Store_LoadedSSHKey](state, sshKey) {
      state.sshKey = sshKey
      EventBus.$emit(Constants.Event_CopiedKeyToNodes, state.sshKey)
    },
  }
}

// Define the store
const Store = new Vuex.Store({
    modules: {
      navigation: navigation,
      installer: installer,
      base: baseSettings
    }
})

export default Store;