const express = require('express');
const router = express.Router();
const {getClient, setup, sleep, genTransactionId, randPassword} = require('../../websocket');

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
 *                         $ref: "#/components/schemas/Cluster"
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
    const dryRun = req.body.dry;
    const cluster = req.body.cluster;
    const nodes = req.body.nodes;
    const general = req.body.general;
    const rook = req.body.rook;
    const openstack = req.body.openstack;
    const cf = req.body.cf;
    const additional = req.body.additional;

    // Filtering Bad Request Codes; todo: more advance filtering
    if (!client) {
        res.status(400).json({
            message: 'uuid invalid'
        });
        return;
    } else if (req.body.isHA && nodes.length < 6) {
        res.status(400).json({
            message: 'not enough nodes for HA setup'
        });
        return;
    } else if (general.installRook && !rook) {
        res.status(400).json({
            message: 'Rook not defined'
        });
        return;
    } else if (general.installCF && !cf) {
        res.status(400).json({
            message: 'CF not defined'
        });
        return;
    } else if (general.installOS && !openstack) {
        res.status(400).json({
            message: 'OS not defined'
        });
        return;
    }

    try {
        // Building Inventory
        const hostsYaml = {
            all: {
                master: {},
                worker: {},
                storage: {
                    rook: ""
                },
                compute: {
                    os: ""
                },
                kube_cluster: {
                    children: {
                        master: {},
                        worker: {}
                    }
                },
                haproxy: {
                    children: {
                        master: {}
                    }
                },
                certmanager: {
                    enabled: true
                },
                global: {
                    registry: 'harbor.cloudical.net'
                },
                ingress: {
                    enabled: true
                },
                letsEncrypt: {
                    issuerName: "letsencrypt-staging",
                    issuerEmail: "testing@test.vanillastack.cloudical.net"
                },
                kubernetes: {
                    loadBalancer: {
                        virtualIP: '135.181.48.19',
                        fqdn: 'test.vanillastack.cloudical.net'
                    },
                    clusterName: 'kube'
                },
                cloudfoundry: {
                    enabled: false,
                    storageclass: 'rook-ceph-block'
                },
                stratos: {
                    enabled: true,
                    adminpassword: randPassword(4, 4, 8)
                },
                openstack: {
                    enabled: false,
                    publicDomain: 'test.vanillastack.cloudical.net',
                    publicProto: 'http',
                    region: 'RegionOne',
                    release: 'stein',
                    tls: {
                        enabled: true,
                        useCertManager: true,
                        letsEncrypt: {
                            enabled: true
                        }
                    },
                    mariadb: {
                        persistence: {
                            diskSize: '30Gi'
                        },
                        auth: {
                            admin: {
                                password: randPassword(4, 4, 8)
                            },
                            sst: {
                                password: randPassword(4, 4, 8)
                            },
                            audit: {
                                password: randPassword(4, 4, 8)
                            },
                            exporter: {
                                password: randPassword(4, 4, 8)
                            }
                        }
                    },
                    rabbitmq: {
                        persistence: {
                            diskSize: '20Gi'
                        },
                        auth: {
                            admin: {
                                password: randPassword(4, 4, 8)
                            }
                        }
                    },
                    barbican: {
                        enabled: true,
                        endpoints: {
                            publicURLPrefix: 'barbican'
                        },
                        auth: {
                            service: {
                                password: randPassword(4, 4, 8)
                            },
                            db: {
                                password: randPassword(4, 4, 8)
                            },
                            messaging: {
                                password: randPassword(4, 4, 8)
                            }
                        }
                    },
                    cinder: {
                        enabled: true,
                        endpoints: {
                            publicURLPrefix: "cinder"
                        },
                        auth: {
                            service: {
                                password: randPassword(4, 4, 8)
                            },
                            db: {
                                password: randPassword(4, 4, 8)
                            },
                            messaging: {
                                password: randPassword(4, 4, 8)
                            },
                            cinderTest: {
                                password: randPassword(4, 4, 8)
                            }
                        }
                    },
                    glance: {
                        enabled: true,
                        endpoints: {
                            publicURLPrefix: "glance"
                        },
                        auth: {
                            service: {
                                password: randPassword(4, 4, 8)
                            },
                            db: {
                                password: randPassword(4, 4, 8)
                            },
                            messaging: {
                                password: randPassword(4, 4, 8)
                            },
                            glanceTest: {
                                password: randPassword(4, 4, 8)
                            },
                            radosgw: {
                                password: randPassword(4, 4, 8)
                            }
                        }
                    },
                    heat: {
                        enabled: true,
                        endpoints: {
                            publicURLPrefix: "heat",
                            cfPublicURLPrefix: "heat-cfn"
                        },
                        auth: {
                            service: {
                                password: randPassword(4, 4, 8)
                            },
                            db: {
                                password: randPassword(4, 4, 8)
                            },
                            messaging: {
                                password: randPassword(4, 4, 8)
                            },
                            heatTest: {
                                password: randPassword(4, 4, 8)
                            },
                            heatDomain: {
                                password: randPassword(4, 4, 8)
                            },
                            serviceTrustee: {
                                password: randPassword(4, 4, 8)
                            }
                        }
                    },
                    horizon: {
                        enabled: true,
                        endpoints: {
                            useDirectPublicDomain: false,
                            publicURLPrefix: "horizon"
                        },
                        auth: {
                            db: {
                                password: randPassword(4, 4, 8)
                            }
                        }
                    },
                    keystone: {
                        enabled: true,
                        endpoints: {
                            publicURLPrefix: "keystone"
                        },
                        auth: {
                            admin: {
                                password: (randPassword(4, 4, 8) || pass) // todo: password from frontend
                            },
                            keystoneTest: {
                                password: randPassword(4, 4, 8)
                            },
                            db: {
                                password: randPassword(4, 4, 8)
                            },
                            messaging: {
                                password: randPassword(4, 4, 8)
                            }
                        }
                    },
                    mistral: {
                        enabled: true,
                        endpoints: {
                            publicURLPrefix: "mistral"
                        },
                        auth: {
                            service: {
                                password: randPassword(4, 4, 8)
                            },
                            mistralTest: {
                                password: randPassword(4, 4, 8)
                            },
                            db: {
                                password: randPassword(4, 4, 8)
                            },
                            messaging: {
                                password: randPassword(4, 4, 8)
                            }
                        }
                    },
                    neutron: {
                        enabled: true,
                        tunnelInterface: "enp2s0",
                        extInterface: "enp3s0",
                        l3: {
                            ha: false,
                            maxAgentsPerRouter: 1,
                            haNetworkType: "vxlan",
                            dhcpAgents: 2
                        },
                        endpoints: {
                            publicURLPrefix: "neutron"
                        },
                        auth: {
                            service: {
                                password: randPassword(4, 4, 8)
                            },
                            db: {
                                password: randPassword(4, 4, 8)
                            },
                            messaging: {
                                password: randPassword(4, 4, 8)
                            },
                            neutronTest: {
                                password: randPassword(4, 4, 8)
                            }
                        }
                    },
                    nova: {
                        enabled: true,
                        endpoints: {
                            publicURLPrefix: "nova",
                            novncURLPrefix: "novnc",
                            placementURLPrefix: "placement"
                        },
                        libvirt: {
                            virtType: "kvm",
                            cpuMode: "host-model"
                        },
                        auth: {
                            service: {
                                password: randPassword(4, 4, 8)
                            },
                            db: {
                                password: randPassword(4, 4, 8)
                            },
                            placement: {
                                password: randPassword(4, 4, 8)
                            },
                            messaging: {
                                password: randPassword(4, 4, 8)
                            },
                            novaTest: {
                                password: randPassword(4, 4, 8)
                            }
                        }
                    },
                    senlin: {
                        enabled: true,
                        endpoints: {
                            publicURLPrefix: "senlin"
                        },
                        auth: {
                            service: {
                                password: randPassword(4, 4, 8)
                            },
                            db: {
                                password: randPassword(4, 4, 8)
                            },
                            messaging: {
                                password: randPassword(4, 4, 8)
                            },
                            senlinTest: {
                                password: randPassword(4, 4, 8)
                            }
                        }

                    }
                },
                rook: {
                    enabled: true,
                    cluster: {
                        dashboard: {
                            enabled: false,
                            ssl: true
                        },
                        monitoring: {
                            enabled: false
                        },
                        storage: {
                            useAllNodes: true,
                            useAllDevices: true
                        }
                    },
                    storageclass: {
                        enabled: true
                    }
                }
            }
        };

        const transactionId = genTransactionId();
        sleep(500).then(() => {
            setup(transactionId, dryRun, client, hostsYaml);
        });
        res.status(200).json({
            transactionId: transactionId
        });

    } catch (e) {
        res.status(400).json({
            message: 'Something went wrong'
        });
    }


});

module.exports = router;
