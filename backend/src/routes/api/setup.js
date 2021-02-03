const express = require('express');
const router = express.Router();
const { getClient } = require('../../services/users');
const { sleep, genTransactionId } = require('../../services/helper');
const { setup } = require('../../services/setup');

/**
 * Post Setup
 * @swagger
 * /setup:
 *     post:
 *         summary: Setup Kubernetes
 *         requestBody:
 *             description: Node object which connection needs to be tested
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/testing"
 *             required: true
 *         responses:
 *             200:
 *                 description: OK
 *                 content:
 *                     text/plain:
 *                         schema:
 *                             type: string
 *                             example: Successfully created clusterName
 *             400:
 *                 description: Bad Request
 *                 content: {}
 *             401:
 *                 description: Unauthorized
 *                 content: {}
 *             408:
 *                 description: Request Timeout
 *                 content: {}
 */
router.post('/', function (req, res) {
  const client = getClient(req.body.uuid);
  const dryRun = req.body.dry || false;
  const fail = req.body.fail || false;
  const isHA = req.body.isHA || false;
  const cluster = req.body.cluster;
  const nodes = req.body.nodes;
  const general = req.body.general;
  const rook = req.body.rook;
  const openstack = req.body.openstack;
  const cf = req.body.cf;
  const additional = req.body.additional;
  const letsencrypt = req.body.letsencrypt;

  if (req.app.locals.config.debug) {
    console.log(req.body);
  }

  // Filtering Bad Request Codes; todo: more advance filtering and changing to switch case
  if (!client) {
    res.status(400).json({
      message: 'uuid invalid',
    });
    return;
  } else if (!client.verifiedNodes && !dryRun) {
    res.status(400).json({
      message: 'connection check has not been executed yet',
    });
    return;
  } else if (req.body.isHA && nodes.length < 6) {
    res.status(400).json({
      message: 'not enough nodes for HA setup',
    });
    return;
  } else if (general.installRook && !rook) {
    res.status(400).json({
      message: 'Rook not defined',
    });
    return;
  } else if (general.installCF && !cf) {
    res.status(400).json({
      message: 'CF not defined',
    });
    return;
  } else if (general.installOS && !openstack) {
    res.status(400).json({
      message: 'OS not defined',
    });
    return;
  }
  // console.log(wsClient.verifiedNodes);

  const basePath = req.app.locals.config.ansibleBasePath;
  // Building
  const extraVars = {
    commercial: {
      enabled: !!(general.harborUser && general.harborKey),
      username: `${general.harborUser ? general.harborUser : ''}`,
      key: `${general.harborKey ? general.harborKey : ''}`,
    },
    make_ha: isHA,
    create_extLB: cluster.useExternalLb,
    cluster_uuid: client.uuid,
    cluster_pod_cidr: `${
      cluster.pod_cidr && cluster.pod_cidr.length > 0
        ? cluster.pod_cidr
        : '10.0.0.0/8'
    }`, // "10.0.0.0/8",
    cluster_service_cidr: `${
      cluster.service_cidr && cluster.service_cidr.length > 0
        ? cluster.service_cidr
        : '10.96.0.0/12'
    }`, // "10.96.0.0/12",
    repo: {
      registry: cluster.registry_endpoint,
    },
    staging_tag: 'testing', // todo: needs to be clarified
    LE_issuer_name: letsencrypt.issuer,
    LE_issuer_mail: letsencrypt.issuerEmail,
    loadbalancerIP: cluster.ip,
    clusterTLDomain: cluster.fqdn,
    reset_environment: false, // todo: not yet implemented
    vanillaservices: {
      dashboard_enabled: additional.dashboard,
      cloudfoundry_enabled: general.installCF,
      stratos_enabled: general.installCF ? cf.stratos : true,
      guacamole_enabled: true, // todo: mapping required; to be implemented
      pgOperator_enabled: true, // todo: not yet implemented
      redis_enabled: true, // todo: not yet implemented
      harbor_enabled: additional.harbor,
      loggingStack_enabled: additional.elastic,
      monitoring_enabled: additional.prometheus, // todo: not yet implemented
      kubevirt_enabled: true, // todo: not yet implemented
      moodle_enabled: false, // todo: not yet implemented
      keycloak_enabled: true, // todo: not yet implemented
      openstack_enabled: general.installOS,
    },
    vanillastorageprovider: 'rook', //todo: more types yet to come; needs to be implemented in frontend, currently bool for rook is provided
    polyverse: {
      enabled: additional.polyverse ? additional.polyverse.enable : false, // (!!(additional.polyverse && additional.polyverse.enabled))
      key: `${
        additional.polyverse && additional.polyverse.key
          ? additional.polyverse.key
          : ''
      }`,
    },
  };

  /*
  const extraVarsOld = {
    
    certmanager: {
      enabled: additional.certmgr,
    },
    ingress: {
      enabled: additional.nginx,
    },
    //default active, not required from frontend 
    cloudfoundry: {
      coreDomain: cf.fqdn, // todo: needs to be discussed with Team-Frontend
      storageclass: 'rook-ceph-block', //  todo: not defined
    },
    stratos: {
      coreDomain: cf.stratos_endpoint,
      adminpassword: randPassword(4, 4, 8),
    },
    openstack: {
      publicDomain: openstack.domain,
      publicProto: 'http', // todo: unclear (openstack.tls ? 'https' : 'http')
      region: 'RegionOne',
      release: openstack.release,
      tls: {
        enabled: openstack.tls,
        useCertManager: additional.certmgr,
        letsEncrypt: {
          enabled: true, // todo: not defined
        },
      },
      mariadb: {
        enabled: openstack.mariadb,
        persistence: {
          diskSize: `${openstack.mariadb_size}Gi`,
        },
        auth: {
          admin: {
            password: randPassword(4, 4, 8),
          },
          sst: {
            password: randPassword(4, 4, 8),
          },
          audit: {
            password: randPassword(4, 4, 8),
          },
          exporter: {
            password: randPassword(4, 4, 8),
          },
        },
      },
      rabbitmq: {
        enabled: openstack.rabbitmq,
        persistence: {
          diskSize: `${openstack.rabbitmq_size}Gi`,
        },
        auth: {
          admin: {
            password: randPassword(4, 4, 8),
          },
        },
      },
      barbican: {
        enabled: openstack.barbican,
        endpoints: {
          publicURLPrefix: openstack.barbican_endpoint,
        },
        auth: {
          service: {
            password: randPassword(4, 4, 8),
          },
          db: {
            password: randPassword(4, 4, 8),
          },
          messaging: {
            password: randPassword(4, 4, 8),
          },
        },
      },
      cinder: {
        enabled: openstack.cinder,
        endpoints: {
          publicURLPrefix: openstack.cinder_endpoint,
        },
        auth: {
          service: {
            password: randPassword(4, 4, 8),
          },
          db: {
            password: randPassword(4, 4, 8),
          },
          messaging: {
            password: randPassword(4, 4, 8),
          },
          cinderTest: {
            password: randPassword(4, 4, 8),
          },
        },
      },
      glance: {
        enabled: openstack.glance,
        endpoints: {
          publicURLPrefix: openstack.heat_endpoint,
        },
        auth: {
          service: {
            password: randPassword(4, 4, 8),
          },
          db: {
            password: randPassword(4, 4, 8),
          },
          messaging: {
            password: randPassword(4, 4, 8),
          },
          glanceTest: {
            password: randPassword(4, 4, 8),
          },
          radosgw: {
            password: randPassword(4, 4, 8),
          },
        },
      },
      heat: {
        enabled: openstack.heat,
        endpoints: {
          publicURLPrefix: openstack.heat_endpoint,
          cfnPublicURLPrefix: openstack.cfnPublicURLPrefix,
        },
        auth: {
          service: {
            password: randPassword(4, 4, 8),
          },
          db: {
            password: randPassword(4, 4, 8),
          },
          messaging: {
            password: randPassword(4, 4, 8),
          },
          heatTest: {
            password: randPassword(4, 4, 8),
          },
          heatDomain: {
            password: randPassword(4, 4, 8),
          },
          serviceTrustee: {
            password: randPassword(4, 4, 8),
          },
        },
      },
      horizon: {
        enabled: openstack.horizon,
        endpoints: {
          useDirectPublicDomain: false, //todo: not defined
          publicURLPrefix: openstack.horizon_endpoint,
        },
        auth: {
          db: {
            password: randPassword(4, 4, 8),
          },
        },
      },
      keystone: {
        enabled: openstack.keystone,
        endpoints: {
          publicURLPrefix: openstack.keystone_endpoint,
        },
        auth: {
          admin: {
            password: randPassword(4, 4, 8),
          },
          keystoneTest: {
            password: randPassword(4, 4, 8),
          },
          db: {
            password: randPassword(4, 4, 8),
          },
          messaging: {
            password: randPassword(4, 4, 8),
          },
        },
      },
      mistral: {
        enabled: openstack.mistral,
        endpoints: {
          publicURLPrefix: openstack.mistral_endpoint,
        },
        auth: {
          service: {
            password: randPassword(4, 4, 8),
          },
          mistralTest: {
            password: randPassword(4, 4, 8),
          },
          db: {
            password: randPassword(4, 4, 8),
          },
          messaging: {
            password: randPassword(4, 4, 8),
          },
        },
      },
      neutron: {
        enabled: openstack.neutron,
        tunnelInterface: openstack.neutron_interface_tunnel,
        extInterface: openstack.neutron_interface_external,
        l3: {
          ha: openstack.neutron_l3ha,
          maxAgentsPerRouter: openstack.neutron_maxAgentsPerRouter,
          haNetworkType: openstack.neutron_overlayNetworkType.toLowerCase(),
          dhcpAgents: openstack.neutron_dhcpAgents,
        },
        endpoints: {
          publicURLPrefix: openstack.neutron_endpoint,
        },
        auth: {
          service: {
            password: randPassword(4, 4, 8),
          },
          db: {
            password: randPassword(4, 4, 8),
          },
          messaging: {
            password: randPassword(4, 4, 8),
          },
          neutronTest: {
            password: randPassword(4, 4, 8),
          },
        },
      },
      nova: {
        enabled: openstack.nova,
        endpoints: {
          publicURLPrefix: openstack.nova_endpoint,
          novncURLPrefix: openstack.nova_novnc_endpoint,
          placementURLPrefix: openstack.nova_placement_endpoint,
        },
        libvirt: {
          virtType: openstack.nova_virtType.toLowerCase(),
          cpuMode: openstack.nova_cpuMode,
        },
        auth: {
          service: {
            password: randPassword(4, 4, 8),
          },
          db: {
            password: randPassword(4, 4, 8),
          },
          placement: {
            password: randPassword(4, 4, 8),
          },
          messaging: {
            password: randPassword(4, 4, 8),
          },
          novaTest: {
            password: randPassword(4, 4, 8),
          },
        },
      },
      senlin: {
        enabled: !!openstack.senlin,
        endpoints: {
          publicURLPrefix: openstack.senlin_endpoint,
        },
        auth: {
          service: {
            password: randPassword(4, 4, 8),
          },
          db: {
            password: randPassword(4, 4, 8),
          },
          messaging: {
            password: randPassword(4, 4, 8),
          },
          senlinTest: {
            password: randPassword(4, 4, 8),
          },
        },
      },
    },
    rook: {
      enabled: general.installRook,
      cluster: {
        dashboard: {
          enabled: rook.dashboard, // is true per default, frontend var is ignored
          ssl: true, // todo: not defined
        },
        monitoring: {
          enabled: rook.monitoring, // is true per default, frontend var is ignored
        },
        storage: {
          //todo: unclear
          useAllDevices: true,
        },
      },
      storageClassRBD: {
        enabled: true,
        name: 'rook-ceph-block',
        failureDomain: 'host',
        poolName: 'replicapool',
        replicaLevel: rook.replicaLevel,
      },
    },
    
  };
  */

  // Building Inventory
  const hostsJson = {
    all: {
      children: {
        master: {
          hosts: {},
        },
        worker: {
          hosts: {},
        },
        storage: {
          hosts: {},
        },
        compute: {
          hosts: {},
        },
        cf: {
          hosts: {},
        },
        kube_cluster: {
          children: {
            master: null,
            worker: null,
          },
        },
        haproxy: {
          children: {
            master: null,
          },
        },
      },
    },
  };

  const masterNodes = {};
  const workerNodes = {};
  const storageNodes = {};
  const computeNodes = {};
  const cfNodes = {};
  let masterCount = 1;
  let workerCount = 1;

  // filling nodes
  let status = {
    failed: false,
    msg: '',
  };
  nodes.forEach((node) => {
    if (!client.dryRun && !dryRun) {
      if (client.verifiedNodes[node.host]) {
        if (node.role.toUpperCase() === 'M') {
          masterNodes[client.verifiedNodes[node.host]] = {
            ansible_host: node.host,
            ansible_user: node.user,
            ansible_ssh_private_key_file: `${basePath}/${client.uuid}/key.pem`,
          };
          masterCount += 1;
        } else {
          const currentNode = client.verifiedNodes[node.host];
          workerNodes[currentNode] = {
            ansible_host: node.host,
            ansible_user: node.user,
            ansible_ssh_private_key_file: `${basePath}/${client.uuid}/key.pem`,
          };
          node.labels.forEach((label) => {
            if (label.toUpperCase() === 'ROOK') {
              storageNodes[currentNode] = null;
            } else if (label.toUpperCase() === 'OS') {
              computeNodes[currentNode] = null;
            } else if (label.toUpperCase() === 'CF') {
              cfNodes[currentNode] = null;
            }
          });
          workerCount += 1;
        }
      } else {
        status.failed = true;
        status.msg = `Connection check on Node: ${node.host} not successfully performed yet`;
      }
    }
  });

  if (!status.failed) {
    hostsJson.all.children.master.hosts = masterNodes;
    hostsJson.all.children.worker.hosts = workerNodes;
    hostsJson.all.children.storage.hosts = storageNodes;
    hostsJson.all.children.compute.hosts = computeNodes;
    hostsJson.all.children.cf.hosts = cfNodes;
    const transactionId = genTransactionId();
    sleep(500).then(() => {
      setup(
        transactionId,
        basePath,
        dryRun,
        client,
        hostsJson,
        extraVars,
        fail,
        req.app.locals.config.debug
      );
    });
    res.status(200).json({
      transactionId: transactionId,
      // keyStonePass: extraVars.openstack.keystone.auth.admin.password,
      // stratosPass: extraVars.stratos.adminpassword,
    });
  } else {
    res.status(400).json({
      message: status.msg,
    });
  }
});

module.exports = router;
