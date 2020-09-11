const express = require('express');
const router = express.Router();

const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

// Swagger API Documentation
const port = process.env.PORT;
const ip = process.env.IP || 'localhost';

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.3",
        info: {
            title: "VanillaStack API",
            description: "This is a sample API for the communication between Front- and Backend for the VanillaStack",
            termsOfService: "https://cloudcial.io/terms/",
            contact: {
                email: "apiteam@cloudical.io"
            },
            license: {
                name: "Apache 2.0",
                url: "https://www.apache.org/licenses/LICENSE-2.0.html"
            },
            version: "1.0.0"
        },
        servers: [{
            url: `http://${ip}:{port}/{basePath}`,
            variables: {
                port: {
                    default: port
                },
                basePath: {
                    default: "api/v1/"
                }
            }
        }],

        components: {
            schemas: {
                loadBalancerVirtualIp: {},
                loadBalancerFqdn: {},
                reset: {},
                service_cidr: {},
                podNetCidr: {},
                Node: {
                    required: [
                        "host",
                        "user"
                    ],
                    type: "object",
                    properties: {
                        host: {
                            type: "string",
                            example: "domain.io"
                        },
                        user: {
                            type: "string",
                            example: "root"
                        }
                    }
                },
                Nodes: {
                    type: "array",
                    items: {
                        $ref: "#/components/schemas/Node",
                    }
                },
                Role: {
                    type: "object",
                    properties: {
                        role: {
                            type: "string",
                            example: "m"
                        }
                    }
                },
                NodeWithRole: {
                    type: "object",
                    allOf: [
                        {
                            $ref: '#/components/schemas/Node'
                        },
                        {
                            $ref: '#/components/schemas/Role'
                        }
                    ]
                },
                NodesWithRole: {
                    type: "array",
                    items: {
                        $ref: '#/components/schemas/NodeWithRole'
                    }
                },
                InternalLB: {
                    type: "object",
                    required: [
                        "enabled"
                    ],
                    properties: {
                        enabled: {
                            type: "boolean"
                        },
                        ip: {
                            type: "string"
                        },
                        fqdn: {
                            type: "string"
                        }
                    }
                },
                ExternalLB: {
                    type: "object",
                    required: [
                        "enabled"
                    ],
                    properties: {
                        enabled: {
                            type: "boolean"
                        },
                        ip_fqdn: {
                            type: "string"
                        },
                        metalLB: {
                            type: "boolean"
                        }
                    }
                },
                Tag: {
                    type: "object",
                    properties: {
                        key: {
                            type: "string"
                        },
                        value: {
                            type: "string"
                        }
                    }
                },
                Tags: {
                    type: "array",
                    items: {
                        $ref: "#/components/schemas/Tag"
                    }
                },
                wsClient: {
                    type: "object",
                    required: [],
                    properties: {
                        uuid: {
                            $ref: "#/components/schemas/uuid"
                        }
                    }
                },
                execResponse: {
                    type: "object",
                    properties: {
                        transactionId: {
                            $ref: "#/components/schemas/transactionId"
                        }
                    }
                },
                transactionId: {
                    type: "string",
                    example: "0000000000"
                },
                info: {
                    type: "object",
                    properties: {
                        uuid: {
                            type: "string",
                            example: "00000000-0000-0000-0000-0000000000000"
                        },
                        mode: {
                            type: "string",
                            example: "installer"
                        },
                        sshPublicKey: {
                            type: "string",
                            example: "ssh-rsa KATAKANAAgQCq/3j+skZ6UtW+5u09lHNsj6tQ51s1SPrCBakedNf0Tp0GbMJDyR4e9T04ZZw=="
                        }
                    }
                },
                uuid: {
                    type: "object",
                    properties: {
                        uuid: {
                            type: "string",
                            example: "00000000-0000-0000-0000-0000000000000"
                        }
                    }
                },
                Connection: {
                    type: "object",
                    required: [
                        "uuid",
                        "nodes"
                    ],
                    properties: {
                        uuid: {
                            type: "string",
                            example: "00000000-0000-0000-0000-0000000000000"
                        },
                        dry: {
                            type: "boolean",
                            example: "true"
                        },
                        nodes: {
                            $ref: "#/components/schemas/Nodes"
                        }
                    }
                },
                Cluster: {
                    type: "object",
                    required: [
                        "nodes",
                        "clusterName",
                        "internalLB",
                        "externalLB"
                    ],
                    properties: {
                        client: {
                            $ref: "#/components/schemas/uuid"
                        },
                        nodes: {
                            $ref: "#/components/schemas/NodesWithRole"
                        },
                        clusterName: {
                            type: "string",
                            example: "default"
                        },
                        internalLB: {
                            $ref: "#/components/schemas/InternalLB"
                        },
                        externalLB: {
                            $ref: "#/components/schemas/ExternalLB"
                        },
                        tags: {
                            $ref: "#/components/schemas/Tags"
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.js', './src/routes/api/*.js']

}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


/* OpenAPI Docu. */
// router.get('/', function (req, res, next) {
//     res.send('Hello World');
// });

module.exports = router;
